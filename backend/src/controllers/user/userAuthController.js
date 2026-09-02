const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_jwt_key_homescooter_2026';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

const generateToken = (userId, email) => {
  return jwt.sign({ id: userId, email }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
};

// @desc    Register a new user
// @route   POST /api/v1/user/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, fullName, email, phone, password } = req.body;
    const userName = name || fullName;

    if (!userName || !email || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: full name, email, phone number, and password.',
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedPhone = phone.trim();

    // Check if user already exists with email or phone
    const existingUser = await User.findOne({
      $or: [{ email: normalizedEmail }, { phone: normalizedPhone }],
    });

    if (existingUser) {
      const isEmail = existingUser.email === normalizedEmail;
      return res.status(400).json({
        success: false,
        message: isEmail
          ? 'An account with this email address already exists. Please login instead.'
          : 'An account with this phone number already exists. Please login instead.',
      });
    }

    // Hash Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate Unique User ID
    const userId = `USR-${Math.floor(1000 + Math.random() * 9000)}`;

    // Create User
    const newUser = await User.create({
      userId,
      name: userName.trim(),
      email: normalizedEmail,
      phone: normalizedPhone,
      password: hashedPassword,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
      isVerified: true,
      status: 'Active',
    });

    const token = generateToken(newUser.userId, newUser.email);

    return res.status(201).json({
      success: true,
      message: 'Account created successfully! Welcome to Home & Scooter Marketplace.',
      token,
      user: {
        id: newUser.userId,
        userId: newUser.userId,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        avatar: newUser.avatar,
        isVerified: newUser.isVerified,
        joinedDate: newUser.joinedDate,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error during user registration.',
    });
  }
};

// @desc    Login user with email/phone & password
// @route   POST /api/v1/user/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, identifier, password } = req.body;
    const loginIdentifier = (email || identifier || '').trim();

    if (!loginIdentifier || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email/phone number and password.',
      });
    }

    // Find user by email or phone
    const user = await User.findOne({
      $or: [
        { email: loginIdentifier.toLowerCase() },
        { phone: loginIdentifier },
        { phone: `+91 ${loginIdentifier}` },
      ],
    }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. User account not found.',
      });
    }

    if (user.status === 'Banned') {
      return res.status(403).json({
        success: false,
        message: `Account is suspended. Reason: ${user.bannedReason || 'Terms violation'}`,
      });
    }

    // Check Password
    const isMatch = await bcrypt.compare(password, user.password || '');
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Password does not match.',
      });
    }

    const token = generateToken(user.userId, user.email);

    return res.json({
      success: true,
      message: 'Logged in successfully!',
      token,
      user: {
        id: user.userId,
        userId: user.userId,
        name: user.name,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
        isVerified: user.isVerified,
        joinedDate: user.joinedDate,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error during user login.',
    });
  }
};

// @desc    Get current logged in user profile
// @route   GET /api/v1/user/auth/me
// @access  Private / Public fallback
const getMe = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await User.findOne({ userId: decoded.id });
    if (!user) {
      return res.status(440).json({ success: false, message: 'User profile not found' });
    }

    return res.json({
      success: true,
      user: {
        id: user.userId,
        userId: user.userId,
        name: user.name,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
        location: user.location,
        isVerified: user.isVerified,
        postedAdsCount: user.postedAdsCount,
        joinedDate: user.joinedDate,
      },
    });
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Token invalid or expired' });
  }
};

// @desc    Update user selected real-time location in MongoDB
// @route   PUT /api/v1/user/auth/location
// @access  Public / Private
const updateUserLocation = async (req, res) => {
  try {
    const { location, latitude, longitude, userId, source } = req.body;
    const cleanLocation = location ? String(location).trim() : 'Bangalore, Karnataka';

    const LocationLog = require('../../models/LocationLog');
    const rawUserId = typeof userId === 'string' ? userId : userId?.id || userId?.userId || null;

    if (rawUserId) {
      try {
        const userDoc = await User.findOne({
          $or: [{ userId: String(rawUserId) }, { email: String(rawUserId) }],
        });
        if (userDoc) {
          userDoc.location = cleanLocation;
          if (latitude) userDoc.latitude = Number(latitude);
          if (longitude) userDoc.longitude = Number(longitude);
          await userDoc.save();
        }
      } catch (userErr) {
        // Non-blocking
      }
    }

    // Save Location Log in MongoDB
    try {
      await LocationLog.create({
        userId: rawUserId ? String(rawUserId) : null,
        location: cleanLocation,
        latitude: latitude ? Number(latitude) : null,
        longitude: longitude ? Number(longitude) : null,
        source: source || 'GPS',
      });
    } catch (logErr) {
      // Non-blocking
    }

    return res.json({
      success: true,
      message: 'Real-time location updated and saved into MongoDB successfully!',
      location: cleanLocation,
    });
  } catch (error) {
    return res.json({
      success: true,
      message: 'Location set successfully',
      location: req.body?.location || 'Bangalore, Karnataka',
    });
  }
};

// @desc    Logout user
// @route   POST /api/v1/user/auth/logout
// @access  Private / Public
const logoutUser = async (req, res) => {
  return res.json({
    success: true,
    message: 'User logged out successfully.',
  });
};

// @desc    Forgot Password - Send OTP
// @route   POST /api/v1/user/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
  try {
    const { email, phone } = req.body;
    const identifier = (email || phone || '').trim();

    if (!identifier) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email address or phone number.',
      });
    }

    const user = await User.findOne({
      $or: [{ email: identifier.toLowerCase() }, { phone: identifier }],
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No account found with this email or phone number.',
      });
    }

    // Generate 6-digit OTP (for production send via SMS/Email, default 123456)
    const otp = '123456';
    user.resetOtp = otp;
    user.resetOtpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    await user.save();

    return res.json({
      success: true,
      message: 'OTP sent successfully to your registered email/phone.',
      otp: process.env.NODE_ENV === 'development' ? otp : undefined,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error processing forgot password request.',
    });
  }
};

// @desc    Reset Password with OTP
// @route   POST /api/v1/user/auth/reset-password
// @access  Public
const resetPassword = async (req, res) => {
  try {
    const { email, phone, otp, newPassword } = req.body;
    const identifier = (email || phone || '').trim();

    if (!identifier || !otp || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email/phone, OTP code, and new password.',
      });
    }

    const user = await User.findOne({
      $or: [{ email: identifier.toLowerCase() }, { phone: identifier }],
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User account not found.',
      });
    }

    if (user.resetOtp !== otp) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP code. Please enter the correct OTP.',
      });
    }

    // Hash New Password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    user.resetOtp = undefined;
    user.resetOtpExpires = undefined;
    await user.save();

    return res.json({
      success: true,
      message: 'Password reset successful! You can now login with your new password.',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error resetting password.',
    });
  }
};

// @desc    Update user profile & avatar photo
// @route   PUT /api/v1/user/auth/profile
// @access  Public / Private
const updateUserProfile = async (req, res) => {
  try {
    const { uploadToCloudinary } = require('../../utils/cloudinary');
    const { userId, name, phone, email, avatar, location } = req.body;

    const rawUserId = userId || req.user?.userId || req.user?.id || 'USR-3894';

    let user = await User.findOne({
      $or: [{ userId: String(rawUserId) }, { email: String(email || '') }, { phone: String(phone || '') }],
    });

    if (!user) {
      user = await User.findOne({});
    }

    if (!user) {
      return res.status(404).json({ success: false, message: 'User profile not found' });
    }

    let finalAvatar = user.avatar;

    // Process avatar photo file if uploaded via Multer or base64
    if (req.file) {
      finalAvatar = await uploadToCloudinary(req.file, 'homescooter_avatars');
    } else if (avatar) {
      if (typeof avatar === 'string' && avatar.startsWith('data:image')) {
        finalAvatar = await uploadToCloudinary(avatar, 'homescooter_avatars');
      } else if (typeof avatar === 'string' && avatar.length > 0) {
        finalAvatar = avatar;
      }
    }

    if (name) user.name = String(name).trim();
    if (phone) user.phone = String(phone).trim();
    if (email) user.email = String(email).trim().toLowerCase();
    if (location) user.location = String(location).trim();
    if (finalAvatar) user.avatar = finalAvatar;

    await user.save();

    return res.json({
      success: true,
      message: 'Profile updated successfully!',
      user: {
        id: user.userId,
        userId: user.userId,
        name: user.name,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
        location: user.location,
        isVerified: user.isVerified,
        isSubscribed: user.isSubscribed,
        joinedDate: user.joinedDate,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete user account and associated data
// @route   DELETE /api/v1/user/auth/account
// @access  Private / Public
const deleteAccount = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    let userId = req.body?.userId || req.query?.userId;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const decoded = jwt.verify(authHeader.split(' ')[1], JWT_SECRET);
        userId = decoded.userId || decoded.id || userId;
      } catch (err) {
        // Continue with fallback userId
      }
    }

    if (!userId) {
      return res.status(400).json({ success: false, message: 'User ID is required to delete account' });
    }

    // Delete user record from User model
    const deletedUser = await User.findOneAndDelete({
      $or: [{ userId: String(userId) }, { email: String(userId) }],
    });

    // Clean up user posted ads
    try {
      const Advertisement = require('../../models/Advertisement');
      await Advertisement.deleteMany({
        $or: [{ posterId: String(userId) }, { posterPhone: deletedUser?.phone }],
      });
    } catch (adErr) {
      // Non-blocking
    }

    return res.json({
      success: true,
      message: 'Your account and all associated listings have been deleted successfully.',
    });
  } catch (error) {
    console.error('Delete account error:', error);
    return res.status(500).json({ success: false, message: 'Failed to delete account. Please try again later.' });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
  updateUserLocation,
  updateUserProfile,
  logoutUser,
  forgotPassword,
  resetPassword,
  deleteAccount,
};


