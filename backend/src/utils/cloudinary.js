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
  let isCreatedTempFile = false;
  const startTime = Date.now();

  try {
    // 1. Check if direct URL string is provided
    if (typeof fileInput === 'string' && (fileInput.startsWith('http://') || fileInput.startsWith('https://'))) {
      return fileInput;
    }

    let uploadSource = null;
    let filename = `media_${Date.now()}`;
    let fileSize = 0;

    // 2. Resolve upload source from Multer file object or raw input
    if (fileInput && fileInput.path && fs.existsSync(fileInput.path)) {
      tempFilePath = fileInput.path;
      uploadSource = tempFilePath;
      filename = fileInput.filename || fileInput.originalname || path.basename(fileInput.path);
      try {
        const stats = fs.statSync(tempFilePath);
        fileSize = stats.size;
      } catch (e) {}
    } else if (fileInput && fileInput.buffer) {
      // Memory buffer input: write to temp file for chunked SDK upload
      filename = fileInput.originalname || `media_${Date.now()}.jpg`;
      const tempDir = path.join(__dirname, '../../uploads/temp');
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
      }
      tempFilePath = path.join(tempDir, `temp_buf_${Date.now()}_${Math.random().toString(36).substring(2, 7)}${path.extname(filename)}`);
      fs.writeFileSync(tempFilePath, fileInput.buffer);
      uploadSource = tempFilePath;
      isCreatedTempFile = true;
      fileSize = fileInput.buffer.length;
    } else if (typeof fileInput === 'string' && (fileInput.startsWith('data:') || fs.existsSync(fileInput))) {
      uploadSource = fileInput;
      if (fs.existsSync(fileInput)) {
        tempFilePath = fileInput;
        try {
          const stats = fs.statSync(fileInput);
          fileSize = stats.size;
        } catch (e) {}
      }
    }

    if (!uploadSource) {
      if (folder === 'homescooter_premium' || options.isPremium) {
        throw new Error('No valid file or data payload provided for Cloudinary upload.');
      }
      return 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800';
    }

    // 3. Determine resource type (video vs image)
    const ext = path.extname(filename).toLowerCase();
    const isVideo = customResourceType === 'video' || /mp4|webm|mov|avi|mkv/.test(ext);
    const resourceType = customResourceType || (isVideo ? 'video' : 'image');
    const sizeMb = (fileSize / (1024 * 1024)).toFixed(2);

    console.log(`[Cloudinary Upload] Starting ${resourceType.toUpperCase()} upload | File: ${filename} | Size: ${sizeMb} MB | Folder: ${folder}`);

    // 4. Configure SDK Upload Options (Chunked upload for large video files)
    const uploadOptions = {
      folder,
      resource_type: resourceType,
      use_filename: true,
      unique_filename: true,
      overwrite: false,
    };

    if (isVideo) {
      uploadOptions.chunk_size = 6000000; // 6MB chunk size for video upload
      uploadOptions.timeout = 600000; // 10 minute timeout for large videos
    }

    // 5. Execute Cloudinary SDK Upload (upload_large for videos, upload for images)
    let result = null;
    if (isVideo) {
      result = await cloudinary.uploader.upload_large(uploadSource, uploadOptions);
    } else {
      result = await cloudinary.uploader.upload(uploadSource, uploadOptions);
    }

    const durationMs = Date.now() - startTime;
    if (result && result.secure_url) {
      console.log(`[Cloudinary Upload] Success | ${resourceType.toUpperCase()} | URL: ${result.secure_url} | Duration: ${durationMs}ms`);
      return result.secure_url;
    }

    throw new Error('Cloudinary response did not contain a secure URL.');
  } catch (err) {
    const durationMs = Date.now() - startTime;
    console.error(`[Cloudinary Upload Error] Duration: ${durationMs}ms | Error: ${err.message}`);

    // For Premium content, throw explicit error rather than silently fallback
    if (folder === 'homescooter_premium' || options.isPremium) {
      throw new Error(`Cloudinary upload failed: ${err.message}`);
    }

    return 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800';
  } finally {
    // Clean up temporary disk file if created or supplied via Multer diskStorage
    if (tempFilePath && fs.existsSync(tempFilePath)) {
      try {
        fs.unlinkSync(tempFilePath);
      } catch (unlinkErr) {
        console.warn(`[Cloudinary Cleanup Warning] Failed to delete temp file ${tempFilePath}: ${unlinkErr.message}`);
      }
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

