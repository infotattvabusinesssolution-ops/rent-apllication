const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure temporary uploads directory exists
const tempUploadDir = path.join(__dirname, '../../uploads/temp');
if (!fs.existsSync(tempUploadDir)) {
  fs.mkdirSync(tempUploadDir, { recursive: true });
}

// In-Memory Storage for direct image uploads
const memoryStorage = multer.memoryStorage();

// Disk Storage for media/video uploads to prevent RAM heap overflow
const mediaDiskStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, tempUploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const uniqueName = `media_${Date.now()}_${Math.random().toString(36).substring(2, 9)}${ext}`;
    cb(null, uniqueName);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files (jpeg, jpg, png, gif, webp) are allowed!'));
  }
};

const mediaFileFilter = (req, file, cb) => {
  const allowedExts = /jpeg|jpg|png|gif|webp|mp4|webm|mov|avi|mkv/;
  const extname = allowedExts.test(path.extname(file.originalname).toLowerCase());
  const isAllowedMime =
    file.mimetype.startsWith('image/') ||
    file.mimetype.startsWith('video/') ||
    file.mimetype === 'application/octet-stream';

  if (extname && isAllowedMime) {
    return cb(null, true);
  } else {
    cb(new Error('Only image or video files (jpeg, png, mp4, webm, mov, etc.) are allowed!'));
  }
};

const upload = multer({
  storage: memoryStorage,
  limits: { fileSize: parseInt(process.env.MAX_FILE_SIZE || '5242880', 10) }, // Default 5MB
  fileFilter,
});

const uploadMedia = multer({
  storage: mediaDiskStorage,
  limits: { fileSize: parseInt(process.env.MAX_VIDEO_SIZE || '524288000', 10) }, // Default 500MB
  fileFilter: mediaFileFilter,
});

module.exports = upload;
module.exports.uploadMedia = uploadMedia;

