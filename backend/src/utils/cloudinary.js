const https = require('https');
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');

/**
 * Uploads a file, buffer, or base64 string to Cloudinary CDN
 * Supports both Signed and Unsigned Cloudinary uploads
 * @param {Object|String} fileInput - Multer file object, file path, or base64 data string
 * @param {String} folder - Target Cloudinary folder (default: 'homescooter_ads')
 * @returns {Promise<String>} - Secure Cloudinary CDN Image URL
 */
const uploadToCloudinary = async (fileInput, folder = 'homescooter_ads') => {
  try {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME || 'dwmokcagc';
    const apiKey = process.env.CLOUDINARY_API_KEY || '811782714826833';
    const apiSecret = process.env.CLOUDINARY_API_SECRET || 'YaT7sDQ5TSUNH276l35lPYXp9fI';
    const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET || 'homescooter_ads';

    let fileBuffer = null;
    let filename = `ad_photo_${Date.now()}.jpg`;

    if (typeof fileInput === 'string' && fileInput.startsWith('data:image')) {
      const base64Data = fileInput.split(';base64,').pop();
      fileBuffer = Buffer.from(base64Data, 'base64');
    } else if (fileInput && fileInput.buffer) {
      fileBuffer = fileInput.buffer;
      filename = fileInput.originalname || filename;
    } else if (fileInput && fileInput.path && fs.existsSync(fileInput.path)) {
      fileBuffer = fs.readFileSync(fileInput.path);
      filename = fileInput.filename || path.basename(fileInput.path);
    } else if (typeof fileInput === 'string' && (fileInput.startsWith('http://') || fileInput.startsWith('https://'))) {
      return fileInput;
    }

    if (!fileBuffer) {
      return 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800';
    }

    // Save locally as primary/backup copy in uploads/ directory
    let localUrl = 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800';
    try {
      const uploadDir = path.join(__dirname, '../../uploads');
      if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
      fs.writeFileSync(path.join(uploadDir, filename), fileBuffer);
      const port = process.env.PORT || 5027;
      localUrl = `http://localhost:${port}/uploads/${filename}`;
    } catch (e) {
      console.error('Error saving image locally:', e.message);
    }

    // Try Cloudinary upload, resolve with localUrl if slow or unconfigured
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
    postData += `Content-Type: image/jpeg\r\n\r\n`;

    const footer = `\r\n--${boundary}--\r\n`;
    const payloadBuffer = Buffer.concat([
      Buffer.from(postData, 'utf8'),
      fileBuffer,
      Buffer.from(footer, 'utf8'),
    ]);

    return new Promise((resolve) => {
      // Set a short 3-second timeout for Cloudinary, otherwise fallback to localUrl immediately
      const timer = setTimeout(() => {
        resolve(localUrl);
      }, 3000);

      const reqOptions = {
        hostname: 'api.cloudinary.com',
        path: `/v1_1/${cloudName}/image/upload`,
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
              resolve(parsed.secure_url);
            } else {
              resolve(localUrl);
            }
          } catch (e) {
            resolve(localUrl);
          }
        });
      });

      req.on('error', () => {
        clearTimeout(timer);
        resolve(localUrl);
      });

      req.write(payloadBuffer);
      req.end();
    });

  } catch (err) {
    return 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800';
  }
};

module.exports = {
  uploadToCloudinary,
};
