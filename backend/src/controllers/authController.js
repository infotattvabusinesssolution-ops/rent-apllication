const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'super_secret_jwt_key_homescooter_2026', {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

// @desc    Admin login
// @route   POST /api/v1/admin/auth/login
// @access  Public
const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Please provide email and password' });
  }

  // Development fallback for seed admin
  if (email === 'admin@homescooter.com' && password === 'admin123') {
    const adminUser = {
      id: 'ADM-901',
      name: 'Rahul Sharma',
      email: 'admin@homescooter.com',
      role: 'SUPER_ADMIN',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
      lastLogin: new Date().toISOString(),
    };
    const token = generateToken(adminUser.id);
    return res.json({ success: true, token, user: adminUser });
  }

  try {
    const admin = await Admin.findOne({ email }).select('+password');
    if (!admin || !admin.isActive) {
      return res.status(401).json({ success: false, message: 'Invalid credentials or inactive account' });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    admin.lastLogin = new Date();
    await admin.save();

    const token = generateToken(admin.adminId);
    return res.json({
      success: true,
      token,
      user: {
        id: admin.adminId,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        avatar: admin.avatar,
        lastLogin: admin.lastLogin,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get current admin profile
// @route   GET /api/v1/admin/auth/me
// @access  Private (Admin)
const getCurrentAdmin = async (req, res) => {
  res.json({
    success: true,
    user: {
      id: req.admin.adminId || 'ADM-901',
      name: req.admin.name || 'Rahul Sharma',
      email: req.admin.email || 'admin@homescooter.com',
      role: req.admin.role || 'SUPER_ADMIN',
      avatar: req.admin.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
      lastLogin: req.admin.lastLogin,
    },
  });
};

// @desc    Admin logout
// @route   POST /api/v1/admin/auth/logout
// @access  Private (Admin)
const logoutAdmin = async (req, res) => {
  res.json({ success: true, message: 'Logged out successfully' });
};

module.exports = {
  loginAdmin,
  getCurrentAdmin,
  logoutAdmin,
};
