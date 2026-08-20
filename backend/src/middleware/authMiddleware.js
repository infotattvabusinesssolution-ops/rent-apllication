const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const User = require('../models/User');

const protectAdmin = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      
      // Development mock token bypass check
      if (token.startsWith('mock_jwt_token_admin')) {
        req.admin = {
          adminId: 'ADM-901',
          name: 'Home & Scooter',
          email: 'admin@homescooter.com',
          role: 'SUPER_ADMIN',
          isActive: true,
        };

        return next();
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'super_secret_jwt_key_homescooter_2026');
      const admin = await Admin.findOne({ adminId: decoded.id }).select('-password');
      
      if (!admin || !admin.isActive) {
        return res.status(401).json({ success: false, message: 'Not authorized, admin account inactive or invalid' });
      }

      req.admin = admin;
      return next();
    } catch (error) {
      return res.status(401).json({ success: false, message: 'Not authorized, token validation failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
  }
};

const checkRole = (roles = []) => {
  return (req, res, next) => {
    if (!req.admin || !roles.includes(req.admin.role)) {
      return res.status(403).json({ success: false, message: 'You do not have permission to perform this action.' });
    }
    next();
  };
};

const protectUser = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'super_secret_jwt_key_homescooter_2026');
      const user = await User.findOne({ userId: decoded.id }).select('-password');

      if (!user || user.status === 'Banned') {
        return res.status(401).json({ success: false, message: 'User account suspended or not found' });
      }

      req.user = user;
      return next();
    } catch (error) {
      return res.status(401).json({ success: false, message: 'Invalid or expired user session' });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Authentication token required' });
  }
};

module.exports = { protectAdmin, checkRole, protectUser };
