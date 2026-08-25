const cloudinary = require('cloudinary').v2;
const path = require('path');
const fs = require('fs');

// Configure Cloudinary SDK using Environment Variables with fallbacks
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dwmokcagc',
  api_key: process.env.CLOUDINARY_API_KEY || '811782714826833',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'YaT7sDQ5TSUNH276l35lPYXp9fI',
  secure: true,
});

/**
 * Uploads a file, buffer, or file path directly to Cloudinary CDN using Cloudinary SDK
 * @param {Object|String} fileInput - Multer file object, file path, or base64 data string
 * @param {String} folder - Target Cloudinary folder (default: 'homescooter_ads')
 * @param {String} customResourceType - Optional resource type ('image', 'video', or 'auto')
 * @param {Object} options - Additional options ({ isPremium: boolean })
 * @returns {Promise<String>} - Secure Cloudinary CDN URL
 */
const uploadToCloudinary = async (fileInput, folder = 'homescooter_ads', customResourceType = null, options = {}) => {
  let tempFilePath = null;
  const startTime = Date.now();

  try {
    // 1. Direct URL string check
    if (typeof fileInput === 'string' && (fileInput.startsWith('http://') || fileInput.startsWith('https://'))) {
      return fileInput;
    }

    let fileBuffer = null;
    let filename = `media_${Date.now()}`;
    let fileSize = 0;
    let mimeType = '';

    // 2. Resolve input (Multer disk file, Multer memory buffer, or local path)
    if (fileInput && fileInput.path && fs.existsSync(fileInput.path)) {
      tempFilePath = fileInput.path;
      filename = fileInput.filename || fileInput.originalname || path.basename(fileInput.path);
      mimeType = fileInput.mimetype || '';
      try {
        const stats = fs.statSync(tempFilePath);
        fileSize = stats.size;
      } catch (e) {}
    } else if (fileInput && fileInput.buffer) {
      fileBuffer = fileInput.buffer;
      filename = fileInput.originalname || filename;
      mimeType = fileInput.mimetype || '';
      fileSize = fileBuffer.length;
    } else if (typeof fileInput === 'string' && fs.existsSync(fileInput)) {
      tempFilePath = fileInput;
      filename = path.basename(fileInput);
      try {
        const stats = fs.statSync(fileInput);
        fileSize = stats.size;
      } catch (e) {}
    }

    // 3. Determine resource type (video vs image)
    const ext = path.extname(filename).toLowerCase();
    const isVideo = customResourceType === 'video' || /mp4|webm|mov|avi|mkv|3gp|m4v/.test(ext);
    const resourceType = customResourceType || (isVideo ? 'video' : 'image');
    const sizeMb = (fileSize / (1024 * 1024)).toFixed(2);

    console.log(`[Cloudinary Upload] Starting ${resourceType.toUpperCase()} upload | File: ${filename} | Size: ${sizeMb} MB | Mime: ${mimeType}`);

    const uploadOptions = {
      folder,
      resource_type: resourceType,
      use_filename: true,
      unique_filename: true,
      overwrite: false,
    };

    if (isVideo) {
      uploadOptions.chunk_size = 6000000;
      uploadOptions.timeout = 600000;
    }

    // 4. Execute upload_stream with explicit callback signature
    const secureUrl = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        uploadOptions,
        (error, result) => {
          const durationMs = Date.now() - startTime;
          if (error) {
            console.error('[Cloudinary Upload Error]', {
              filename,
              mimetype: mimeType,
              size: `${sizeMb} MB`,
              duration: `${durationMs}ms`,
              message: error.message,
              http_code: error.http_code,
            });
            return reject(error);
          }

          if (!result || !result.secure_url) {
            console.error('[Cloudinary Upload Error]', {
              filename,
              mimetype: mimeType,
              size: `${sizeMb} MB`,
              duration: `${durationMs}ms`,
              message: 'Cloudinary upload did not return secure_url',
            });
            return reject(new Error('Cloudinary upload did not return secure_url'));
          }

          console.log(`[Cloudinary Upload] Success | ${resourceType.toUpperCase()} | URL: ${result.secure_url} | Duration: ${durationMs}ms`);
          resolve(result.secure_url);
        }
      );

      if (tempFilePath && fs.existsSync(tempFilePath)) {
        const readStream = fs.createReadStream(tempFilePath);
        readStream.on('error', (readErr) => reject(readErr));
        readStream.pipe(uploadStream);
      } else if (fileBuffer) {
        uploadStream.end(fileBuffer);
      } else {
        reject(new Error('No valid buffer or file stream available for Cloudinary upload.'));
      }
    });

    return secureUrl;
  } catch (err) {
    if (folder === 'homescooter_premium' || options.isPremium) {
      throw new Error(`Cloudinary upload failed: ${err.message}`);
    }
    throw err;
  } finally {
    if (tempFilePath && fs.existsSync(tempFilePath)) {
      try {
        fs.unlinkSync(tempFilePath);
      } catch (unlinkErr) {}
    }
  }
};

/**
 * Uploads a video directly to Cloudinary CDN in 'homescooter_premium' folder
 */
const uploadVideoToCloudinary = async (fileInput, folder = 'homescooter_premium') => {
  return uploadToCloudinary(fileInput, folder, 'video', { isPremium: true });
};

module.exports = {
  uploadToCloudinary,
  uploadVideoToCloudinary,
};

