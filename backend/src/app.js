const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const path = require('path');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const app = express();

// Security Middlewares
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, postman) or matching frontend origins
      callback(null, true);
    },
    credentials: true,
  })
);

// Request Parsers & Logging
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());
app.use(morgan('dev'));

// Static uploads route
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Root & Health Check Endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Home Scooter Express API Server is running',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'UP', message: 'Healthy' });
});

// Admin REST Routes Mount
app.use('/api/v1/admin/auth', require('./routes/api/v1/admin/auth.routes'));
app.use('/api/v1/admin/analytics', require('./routes/api/v1/admin/analytics.routes'));
app.use('/api/v1/admin/ads', require('./routes/api/v1/admin/ads.routes'));
app.use('/api/v1/admin/categories', require('./routes/api/v1/admin/categories.routes'));
app.use('/api/v1/admin/banners', require('./routes/api/v1/admin/banners.routes'));
app.use('/api/v1/admin/subscriptions', require('./routes/api/v1/admin/subscriptions.routes'));
app.use('/api/v1/admin/users', require('./routes/api/v1/admin/users.routes'));
app.use('/api/v1/admin/leads', require('./routes/api/v1/admin/leads.routes'));
app.use('/api/v1/admin/reports', require('./routes/api/v1/admin/reports.routes'));
app.use('/api/v1/admin/visitor-win', require('./routes/api/v1/admin/visitorWin.routes'));
app.use('/api/v1/admin/settings', require('./routes/api/v1/admin/settings.routes'));

// User Marketplace REST Routes Mount
app.use('/api/v1/user/categories', require('./routes/api/v1/admin/categories.routes'));
app.use('/api/v1/user', require('./routes/api/v1/user/user.routes'));

// Error Middlewares
app.use(notFound);
app.use(errorHandler);

module.exports = app;
