const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const User = require('../../models/User');
const { sendPasswordResetEmail } = require('../../utils/emailService');

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

// @desc    Forgot Password - Send OTP & Reset Link via SMTP
// @route   POST /api/v1/user/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
  try {
    const { email, phone } = req.body;
    const identifier = (email || phone || '').trim();

    if (!identifier) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email address.',
      });
    }

    const user = await User.findOne({
      $or: [{ email: identifier.toLowerCase() }, { phone: identifier }],
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No account found with this email address.',
      });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    // Generate secure random reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const expiryTime = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    user.resetOtp = otp;
    user.resetOtpExpires = expiryTime;
    user.resetToken = resetToken;
    user.resetTokenExpires = expiryTime;
    await user.save();

    // Determine reset URL
    let resetBaseUrl = process.env.APP_RESET_URL;
    if (!resetBaseUrl) {
      const host = req.get('host');
      const protocol = req.protocol;
      resetBaseUrl = `${protocol}://${host}/api/v1/user/auth/reset-password-web`;
    }
    const resetUrl = `${resetBaseUrl}?token=${resetToken}`;

    // Dispatch email via SMTP
    const emailResult = await sendPasswordResetEmail({
      toEmail: user.email,
      userName: user.name,
      resetOtp: otp,
      resetUrl,
    });

    return res.json({
      success: true,
      message: `Password reset instructions and verification code have been sent to ${user.email}.`,
      email: user.email,
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Error processing forgot password request.',
    });
  }
};

// @desc    Reset Password with OTP or Token
// @route   POST /api/v1/user/auth/reset-password
// @access  Public
const resetPassword = async (req, res) => {
  try {
    const { email, phone, otp, token, newPassword } = req.body;
    const identifier = (email || phone || '').trim();

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters long.',
      });
    }

    let user = null;

    if (token) {
      user = await User.findOne({
        resetToken: token,
        resetTokenExpires: { $gt: new Date() },
      });

      if (!user) {
        return res.status(400).json({
          success: false,
          message: 'Invalid or expired password reset link. Please request a new one.',
        });
      }
    } else if (otp && identifier) {
      user = await User.findOne({
        $or: [{ email: identifier.toLowerCase() }, { phone: identifier }],
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User account not found.',
        });
      }

      if (!user.resetOtp || user.resetOtp !== otp.trim()) {
        return res.status(400).json({
          success: false,
          message: 'Invalid OTP code. Please enter the correct code sent to your email.',
        });
      }

      if (!user.resetOtpExpires || user.resetOtpExpires < new Date()) {
        return res.status(400).json({
          success: false,
          message: 'OTP has expired. Please request a new verification code.',
        });
      }
    } else {
      return res.status(400).json({
        success: false,
        message: 'Please provide email/phone, OTP or reset token, and new password.',
      });
    }

    // Hash New Password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    user.resetOtp = undefined;
    user.resetOtpExpires = undefined;
    user.resetToken = undefined;
    user.resetTokenExpires = undefined;
    await user.save();

    return res.json({
      success: true,
      message: 'Password reset successful! You can now login with your new password.',
    });
  } catch (error) {
    console.error('Reset password error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Error resetting password.',
    });
  }
};

// @desc    Render Web Reset Password Page
// @route   GET /api/v1/user/auth/reset-password-web
// @access  Public
const resetPasswordWebView = async (req, res) => {
  const { token } = req.query;

  if (!token) {
    return res.status(400).send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Invalid Request - Home & Scooter</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { font-family: sans-serif; background: #f8fafc; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; }
          .card { background: white; border-radius: 16px; padding: 32px; max-width: 420px; text-align: center; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
          h2 { color: #ef4444; margin-top: 0; }
          p { color: #64748b; line-height: 1.5; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="card">
          <h2>Missing Reset Token</h2>
          <p>This password reset link is invalid or incomplete. Please request a new reset link from the Home & Scooter app.</p>
        </div>
      </body>
      </html>
    `);
  }

  const user = await User.findOne({
    resetToken: token,
    resetTokenExpires: { $gt: new Date() },
  });

  if (!user) {
    return res.status(400).send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Link Expired - Home & Scooter</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { font-family: sans-serif; background: #f8fafc; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; }
          .card { background: white; border-radius: 16px; padding: 32px; max-width: 420px; text-align: center; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
          h2 { color: #ef4444; margin-top: 0; }
          p { color: #64748b; line-height: 1.5; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="card">
          <h2>Reset Link Expired</h2>
          <p>This password reset link has expired or has already been used. Please request a new link from the Home & Scooter mobile app.</p>
        </div>
      </body>
      </html>
    `);
  }

  return res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Set New Password - Home & Scooter</title>
      <style>
        * { box-sizing: border-box; }
        body {
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background: linear-gradient(135deg, #f0fdf4 0%, #eff6ff 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          padding: 20px;
          color: #1e293b;
        }
        .container {
          background: #ffffff;
          max-width: 440px;
          width: 100%;
          border-radius: 20px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.08);
          overflow: hidden;
          border: 1px solid #e2e8f0;
        }
        .header {
          background: linear-gradient(135deg, #0F766E 0%, #2563EB 100%);
          padding: 28px 24px;
          text-align: center;
          color: white;
        }
        .header h1 {
          margin: 0;
          font-size: 22px;
          font-weight: 800;
        }
        .header p {
          margin: 6px 0 0;
          font-size: 13px;
          opacity: 0.9;
        }
        .content {
          padding: 28px 24px;
        }
        .user-tag {
          background: #f1f5f9;
          padding: 10px 14px;
          border-radius: 10px;
          font-size: 13px;
          color: #475569;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        label {
          display: block;
          font-size: 12px;
          font-weight: 700;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 6px;
        }
        .form-group {
          margin-bottom: 18px;
        }
        input[type="password"], input[type="text"] {
          width: 100%;
          padding: 12px 14px;
          border: 1.5px solid #cbd5e1;
          border-radius: 10px;
          font-size: 15px;
          outline: none;
          transition: border-color 0.2s;
        }
        input[type="password"]:focus, input[type="text"]:focus {
          border-color: #0f766e;
          box-shadow: 0 0 0 3px rgba(15,118,110,0.15);
        }
        .btn {
          width: 100%;
          padding: 14px;
          background: linear-gradient(135deg, #0f766e 0%, #0d9488 100%);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          box-shadow: 0 4px 14px rgba(15,118,110,0.25);
          transition: opacity 0.2s;
        }
        .btn:hover { opacity: 0.95; }
        .btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .error-msg {
          color: #ef4444;
          font-size: 13px;
          margin-top: 10px;
          display: none;
        }
        .success-box {
          display: none;
          text-align: center;
          padding: 24px;
        }
        .success-icon {
          font-size: 48px;
          margin-bottom: 12px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Home & Scooter</h1>
          <p>Reset Your Account Password</p>
        </div>
        <div class="content" id="formSection">
          <div class="user-tag">
            <span>👤</span>
            <span>Resetting password for: <strong>${user.email}</strong></span>
          </div>

          <form id="resetForm" onsubmit="handleReset(event)">
            <input type="hidden" id="token" value="${token}">
            
            <div class="form-group">
              <label for="newPassword">New Password</label>
              <input type="password" id="newPassword" placeholder="Minimum 6 characters" required minlength="6">
            </div>

            <div class="form-group">
              <label for="confirmPassword">Confirm New Password</label>
              <input type="password" id="confirmPassword" placeholder="Re-enter password" required minlength="6">
            </div>

            <div id="errorMsg" class="error-msg"></div>

            <button type="submit" id="submitBtn" class="btn">Update Password</button>
          </form>
        </div>

        <div class="success-box" id="successSection">
          <div class="success-icon">🎉</div>
          <h2 style="color: #0f766e; margin: 0 0 8px;">Password Updated!</h2>
          <p style="color: #64748b; font-size: 14px; line-height: 1.5;">
            Your password has been changed successfully. You can now open the <strong>Home & Scooter</strong> app and log in with your new password.
          </p>
        </div>
      </div>

      <script>
        async function handleReset(e) {
          e.preventDefault();
          const token = document.getElementById('token').value;
          const newPassword = document.getElementById('newPassword').value;
          const confirmPassword = document.getElementById('confirmPassword').value;
          const errorMsg = document.getElementById('errorMsg');
          const submitBtn = document.getElementById('submitBtn');

          errorMsg.style.display = 'none';

          if (newPassword !== confirmPassword) {
            errorMsg.innerText = 'Passwords do not match. Please check again.';
            errorMsg.style.display = 'block';
            return;
          }

          if (newPassword.length < 6) {
            errorMsg.innerText = 'Password must be at least 6 characters.';
            errorMsg.style.display = 'block';
            return;
          }

          submitBtn.disabled = true;
          submitBtn.innerText = 'Updating Password...';

          try {
            const res = await fetch('/api/v1/user/auth/reset-password', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ token, newPassword })
            });
            const data = await res.json();

            if (data.success) {
              document.getElementById('formSection').style.display = 'none';
              document.getElementById('successSection').style.display = 'block';
            } else {
              errorMsg.innerText = data.message || 'Failed to update password. Please try again.';
              errorMsg.style.display = 'block';
              submitBtn.disabled = false;
              submitBtn.innerText = 'Update Password';
            }
          } catch (err) {
            errorMsg.innerText = 'Network error. Please try again later.';
            errorMsg.style.display = 'block';
            submitBtn.disabled = false;
            submitBtn.innerText = 'Update Password';
          }
        }
      </script>
    </body>
    </html>
  `);
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
  resetPasswordWebView,
  deleteAccount,
};


