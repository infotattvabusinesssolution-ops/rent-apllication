const multer = require('multer');

const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const setCorsHeaders = (req, res) => {
  const origin = req.headers.origin;
  if (origin) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else {
    res.setHeader('Access-Control-Allow-Origin', '*');
  }
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
};

/**
 * Special middleware to catch Multer upload errors (e.g. LIMIT_FILE_SIZE)
 */
const multerErrorHandler = (err, req, res, next) => {
  if (err instanceof multer.MulterError || err.code === 'LIMIT_FILE_SIZE' || err.name === 'MulterError') {
    setCorsHeaders(req, res);
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({
        success: false,
        message: 'Video exceeds the maximum allowed upload size of 500 MB.',
      });
    }
    return res.status(400).json({
      success: false,
      message: `Upload Error: ${err.message}`,
    });
  }

  // Handle custom file filter errors (e.g., Only image or video files are allowed)
  if (err && err.message && (err.message.includes('allowed') || err.message.includes('image') || err.message.includes('video'))) {
    setCorsHeaders(req, res);
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }

  next(err);
};

const errorHandler = (err, req, res, next) => {
  setCorsHeaders(req, res);
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

module.exports = { notFound, multerErrorHandler, errorHandler };

