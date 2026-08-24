const https = require('https');
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');

/**
 * Uploads a file, buffer, or base64 string directly to Cloudinary CDN without storing locally
 * Supports both Image and Video uploads (auto-detects extension/resource_type)
 * @param {Object|String} fileInput - Multer file object, file path, or base64 data string
 * @param {String} folder - Target Cloudinary folder (default: 'homescooter_ads')
 * @param {String} customResourceType - Optional resource type ('image' or 'video')
 * @returns {Promise<String>} - Secure Cloudinary CDN URL
 */
const uploadToCloudinary = async (fileInput, folder = 'homescooter_ads', customResourceType = null) => {
  let tempFilePath = null;
  try {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME || 'dwmokcagc';
    const apiKey = process.env.CLOUDINARY_API_KEY || '811782714826833';
    const apiSecret = process.env.CLOUDINARY_API_SECRET || 'YaT7sDQ5TSUNH276l35lPYXp9fI';

    let fileBuffer = null;
    let filename = `media_${Date.now()}.jpg`;

    if (typeof fileInput === 'string' && fileInput.startsWith('data:')) {
      const base64Data = fileInput.split(';base64,').pop();
      fileBuffer = Buffer.from(base64Data, 'base64');
    } else if (fileInput && fileInput.buffer) {
      fileBuffer = fileInput.buffer;
      filename = fileInput.originalname || filename;
    } else if (fileInput && fileInput.path && fs.existsSync(fileInput.path)) {
      tempFilePath = fileInput.path;
      fileBuffer = fs.readFileSync(fileInput.path);
      filename = fileInput.filename || path.basename(fileInput.path);
    } else if (typeof fileInput === 'string' && (fileInput.startsWith('http://') || fileInput.startsWith('https://'))) {
      return fileInput;
    }

    if (!fileBuffer) {
      return 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800';
    }

    // Determine resource type: 'video' or 'image'
    const ext = path.extname(filename).toLowerCase();
    const isVideo = customResourceType === 'video' || /mp4|webm|mov|avi|mkv/.test(ext);
    const resourceType = isVideo ? 'video' : 'image';
    const mimeType = isVideo ? 'video/mp4' : 'image/jpeg';
    const uploadTimeoutMs = isVideo ? 120000 : 15000; // 120s for video, 15s for image

    const timestamp = Math.floor(Date.now() / 1000);
    const signatureStr = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;
    const signature = crypto.createHash('sha1').update(signatureStr).digest('hex');
    const boundary = '----CloudinaryFormBoundary' + Math.random().toString(16).substring(2);

    let postData = '';
    postData += `--${boundary}\r\n`;
    postData += `Content-Disposition: form-data; name="api_key"\r\n\r\n${apiKey}\r\n`;
    postData += `--${boundary}\r\n`;
    postData += `Content-Disposition: form-data; name="timestamp"\r\n\r\n${timestamp}\r\n`;
    postData += `--${boundary}\r\n`;
    postData += `Content-Disposition: form-data; name="signature"\r\n\r\n${signature}\r\n`;
    postData += `--${boundary}\r\n`;
    postData += `Content-Disposition: form-data; name="folder"\r\n\r\n${folder}\r\n`;
    postData += `--${boundary}\r\n`;
    postData += `Content-Disposition: form-data; name="file"; filename="${filename}"\r\n`;
    postData += `Content-Type: ${mimeType}\r\n\r\n`;

    const footer = `\r\n--${boundary}--\r\n`;
    const payloadBuffer = Buffer.concat([
      Buffer.from(postData, 'utf8'),
      fileBuffer,
      Buffer.from(footer, 'utf8'),
    ]);

    const result = await new Promise((resolve) => {
      const timer = setTimeout(() => {
        console.warn(`Cloudinary ${resourceType} upload timed out after ${uploadTimeoutMs}ms.`);
        resolve(null);
      }, uploadTimeoutMs);

      const reqOptions = {
        hostname: 'api.cloudinary.com',
        path: `/v1_1/${cloudName}/${resourceType}/upload`,
        method: 'POST',
        headers: {
          'Content-Type': `multipart/form-data; boundary=${boundary}`,
          'Content-Length': payloadBuffer.length,
        },
      };

      const req = https.request(reqOptions, (res) => {
        let body = '';
        res.on('data', (chunk) => (body += chunk));
        res.on('end', () => {
          clearTimeout(timer);
          try {
            const parsed = JSON.parse(body);
            if (parsed && parsed.secure_url) {
              console.log(`Cloudinary ${resourceType} upload successful: ${parsed.secure_url}`);
              resolve(parsed.secure_url);
            } else {
              console.warn('Cloudinary upload response:', parsed.error?.message || body);
              resolve(null);
            }
          } catch (e) {
            resolve(null);
          }
        });
      });

      req.on('error', (err) => {
        clearTimeout(timer);
        console.error(`Cloudinary request error: ${err.message}`);
        resolve(null);
      });

      req.write(payloadBuffer);
      req.end();
    });

    // Clean up temporary disk file if one was used
    if (tempFilePath) {
      try {
        fs.unlinkSync(tempFilePath);
      } catch (e) {}
    }

    return result || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800';
  } catch (err) {
    if (tempFilePath) {
      try {
        fs.unlinkSync(tempFilePath);
      } catch (e) {}
    }
    console.error('Error in uploadToCloudinary:', err.message);
    return 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800';
  }
};

/**
 * Uploads a video directly to Cloudinary CDN in 'homescooter_premium' folder
 */
const uploadVideoToCloudinary = async (fileInput, folder = 'homescooter_premium') => {
  return uploadToCloudinary(fileInput, folder, 'video');
};

module.exports = {
  uploadToCloudinary,
  uploadVideoToCloudinary,
};
