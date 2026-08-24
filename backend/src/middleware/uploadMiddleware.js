const multer = require('multer');
const path = require('path');

// In-Memory Storage for direct Cloudinary uploads (no local disk storage)
const storage = multer.memoryStorage();

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
  const allowedTypes = /jpeg|jpg|png|gif|webp|mp4|webm|mov|avi|mkv/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());

  if (extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only image or video files (jpeg, png, mp4, webm, mov, etc.) are allowed!'));
  }
};

const upload = multer({
  storage,
  limits: { fileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760', 10) }, // 10MB
  fileFilter,
});

const uploadMedia = multer({
  storage,
  limits: { fileSize: parseInt(process.env.MAX_VIDEO_SIZE || '104857600', 10) }, // 100MB
  fileFilter: mediaFileFilter,
});

module.exports = upload;
module.exports.uploadMedia = uploadMedia;
