const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'super_secret_jwt_key_homescooter_2026', {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

// Helper: Auto seed initial admin in DB if database has no admin records
const seedDefaultAdmin = async () => {
  const count = await Admin.countDocuments();
  if (count === 0) {
    const email = (process.env.DEFAULT_ADMIN_EMAIL || 'admin@homescooter.com').toLowerCase();
    const rawPassword = process.env.DEFAULT_ADMIN_PASSWORD || 'admin123';
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(rawPassword, salt);
    await Admin.create({
      adminId: 'ADM-901',
      name: 'Rahul Sharma',
      email,
      password: hashedPassword,
      role: 'SUPER_ADMIN',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    });
  }
};


// @desc    Admin login
// @route   POST /api/v1/admin/auth/login
// @access  Public
const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Please provide email and password' });
  }

  try {
    // Ensure default admin exists in MongoDB
    await seedDefaultAdmin();

    const admin = await Admin.findOne({ email: email.toLowerCase() }).select('+password');
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
  try {
    const adminId = req.admin?.adminId || req.admin?.id || 'ADM-901';
    const admin = await Admin.findOne({ adminId });

    if (!admin) {
      return res.json({
        success: true,
        user: {
          id: 'ADM-901',
          name: 'Rahul Sharma',
          email: 'admin@homescooter.com',
          role: 'SUPER_ADMIN',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
        },
      });
    }

    return res.json({
      success: true,
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
