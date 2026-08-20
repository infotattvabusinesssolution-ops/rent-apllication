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

module.exports = {
  registerUser,
  loginUser,
  getMe,
  updateUserLocation,
};
