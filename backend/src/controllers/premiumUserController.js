const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const PremiumMember = require('../models/PremiumMember');
const PremiumContent = require('../models/PremiumContent');
const PremiumUpgradeRequest = require('../models/PremiumUpgradeRequest');
const PremiumActivity = require('../models/PremiumActivity');
const User = require('../models/User');
const { uploadToCloudinary } = require('../utils/cloudinary');

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_jwt_key_homescooter_2026';

const generateRequestId = async () => {
  const count = await PremiumUpgradeRequest.countDocuments();
  const nextNum = (count + 5001).toString();
  return `PREM-REQ-${nextNum}`;
};

// @desc    Premium Member Login
// @route   POST /api/v1/premium/auth/login
// @access  Public
const premiumLogin = async (req, res) => {
  try {
    const { premiumMemberId, password } = req.body;

    if (!premiumMemberId || !password) {
      return res.status(400).json({ success: false, message: 'Premium Member ID and Password are required' });
    }

    const cleanId = premiumMemberId.trim().toUpperCase();
    const member = await PremiumMember.findOne({
      $or: [{ premiumMemberId: cleanId }, { userPhone: cleanId }, { userEmail: cleanId.toLowerCase() }],
    });

    if (!member) {
      return res.status(401).json({ success: false, message: 'Invalid Premium Member ID or credentials' });
    }

    const isMatch = await bcrypt.compare(password, member.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid Premium Member ID or password' });
    }

    if (member.status === 'BLOCKED') {
      return res.status(403).json({
        success: false,
        code: 'MEMBER_BLOCKED',
        message: 'Your Premium Member account has been blocked by administration. Please contact support.',
      });
    }

    const now = new Date();
    if (member.expiryDate && new Date(member.expiryDate) < now) {
      member.status = 'EXPIRED';
      await member.save();
      return res.status(403).json({
        success: false,
        code: 'MEMBERSHIP_EXPIRED',
        message: 'Your Premium Membership has expired. Please renew your plan to regain access.',
        expiryDate: member.expiryDate,
      });
    }

    if (member.status !== 'ACTIVE') {
      return res.status(403).json({
        success: false,
        code: 'MEMBER_INACTIVE',
        message: 'Your Premium Membership is currently inactive or pending activation.',
      });
    }

    // Update last login timestamp
    member.lastLogin = now;
    await member.save();

    // Log LOGIN Activity
    await PremiumActivity.create({
      memberId: member.premiumMemberId,
      activityType: 'LOGIN',
      ipAddress: req.ip || '',
      userAgent: req.headers['user-agent'] || '',
    });

    // Sign JWT
    const token = jwt.sign(
      { id: member.premiumMemberId, userId: member.userId, type: 'PREMIUM_MEMBER' },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    const memberObj = member.toObject();
    delete memberObj.passwordHash;

    return res.json({
      success: true,
      token,
      member: memberObj,
      message: 'Welcome back to Premium Access!',
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Premium Member Logout
// @route   POST /api/v1/premium/auth/logout
// @access  Private (Premium)
const premiumLogout = async (req, res) => {
  try {
    if (req.premiumMember) {
      await PremiumActivity.create({
        memberId: req.premiumMember.premiumMemberId,
        activityType: 'LOGOUT',
        ipAddress: req.ip || '',
        userAgent: req.headers['user-agent'] || '',
      });
    }
    return res.json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Authenticated Member Profile
// @route   GET /api/v1/premium/profile
// @access  Private (Premium)
const getProfile = async (req, res) => {
  try {
    const memberObj = req.premiumMember.toObject();
    delete memberObj.passwordHash;
    return res.json({ success: true, member: memberObj });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Membership Status & Expiry Info
// @route   GET /api/v1/premium/membership
// @access  Private (Premium)
const getMembershipDetails = async (req, res) => {
  try {
    const member = req.premiumMember;
    const now = new Date();
    const expiry = new Date(member.expiryDate);
    const diffTime = expiry - now;
    const daysRemaining = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

    return res.json({
      success: true,
      data: {
        premiumMemberId: member.premiumMemberId,
        userName: member.userName,
        userPhone: member.userPhone,
        plan: member.plan,
        startDate: member.startDate,
        expiryDate: member.expiryDate,
        status: member.status,
        daysRemaining,
        isExpired: daysRemaining <= 0,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Public Teaser info for non-members
// @route   GET /api/v1/premium/public-info
// @access  Public
const getPublicPremiumInfo = async (req, res) => {
  try {
    const activeContentCount = await PremiumContent.countDocuments({ status: 'ACTIVE' });

    return res.json({
      success: true,
      features: [
        { title: 'Important Text Updates', description: 'Access exclusive market analysis and rental advisories', icon: 'FileText' },
        { title: 'Premium Media Banners', description: 'View high-value property and scooter promotion highlights', icon: 'Image' },
        { title: 'Exclusive Video Streams', description: 'Watch detailed video walkthroughs and feature showcases', icon: 'Video' },
      ],
      activeContentCount,
      plans: [
        { name: '1 Month', price: 299, duration: '30 Days', popular: false },
        { name: '3 Months', price: 799, duration: '90 Days', popular: true },
        { name: '6 Months', price: 1499, duration: '180 Days', popular: false },
        { name: '12 Months', price: 2499, duration: '365 Days', popular: false },
      ],
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Protected Premium Content Feed
// @route   GET /api/v1/premium/content
// @access  Private (Premium)
const getPremiumContent = async (req, res) => {
  try {
    const now = new Date();
    const { contentType } = req.query;

    const query = {
      status: 'ACTIVE',
      $or: [{ endDate: null }, { endDate: { $gte: now } }],
    };

    if (contentType && ['TEXT', 'BANNER', 'VIDEO'].includes(contentType)) {
      query.contentType = contentType;
    }

    const items = await PremiumContent.find(query).sort({ displayOrder: 1, createdAt: -1 });

    return res.json({
      success: true,
      data: items,
      total: items.length,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Single Protected Content Item & Record Activity
// @route   GET /api/v1/premium/content/:id
// @access  Private (Premium)
const getPremiumContentById = async (req, res) => {
  try {
    const contentQuery = [{ contentId: req.params.id }];
    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
      contentQuery.push({ _id: req.params.id });
    }

    const item = await PremiumContent.findOne({
      $or: contentQuery,
      status: 'ACTIVE',
    });

    if (!item) {
      return res.status(404).json({ success: false, message: 'Premium content not found or inactive' });
    }

    // Determine activity type
    let activityType = 'CONTENT_VIEW';
    if (item.contentType === 'TEXT') activityType = 'TEXT_VIEW';
    if (item.contentType === 'BANNER') activityType = 'BANNER_VIEW';
    if (item.contentType === 'VIDEO') activityType = 'VIDEO_VIEW';

    // Log Activity
    await PremiumActivity.create({
      memberId: req.premiumMember.premiumMemberId,
      contentId: item.contentId,
      activityType,
      ipAddress: req.ip || '',
      userAgent: req.headers['user-agent'] || '',
    });

    return res.json({ success: true, data: item });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Submit Upgrade to Premium Request (From normal user or renewing member)
// @route   POST /api/v1/premium/upgrade-request
// @access  Public or Protected User
const submitUpgradeRequest = async (req, res) => {
  try {
    const { userId, userName, userPhone, userEmail, plan, amount, paymentReference } = req.body;

    if (!userName || !userPhone || !plan || !paymentReference) {
      return res.status(400).json({
        success: false,
        message: 'Name, phone, plan, and UPI payment reference are required',
      });
    }

    let paymentScreenshot = '';
    if (req.file) {
      paymentScreenshot = await uploadToCloudinary(req.file, 'homescooter_upgrades', 'image');
    } else if (req.body.paymentScreenshot) {
      paymentScreenshot = req.body.paymentScreenshot;
    }

    const requestId = await generateRequestId();
    const planPrices = {
      '1 Month': 299,
      '3 Months': 799,
      '6 Months': 1499,
      '12 Months': 2499,
    };
    const finalAmount = amount || planPrices[plan] || 299;

    const request = await PremiumUpgradeRequest.create({
      requestId,
      userId: userId || `USR-${Math.floor(1000 + Math.random() * 9000)}`,
      userName: userName.trim(),
      userPhone: userPhone.trim(),
      userEmail: userEmail ? userEmail.trim().toLowerCase() : '',
      plan,
      amount: finalAmount,
      paymentReference: paymentReference.trim(),
      paymentScreenshot,
      paymentStatus: 'PENDING',
      requestStatus: 'PENDING',
    });

    return res.status(201).json({
      success: true,
      data: request,
      message: 'Upgrade request submitted successfully! Admin will verify payment and activate your Premium Member ID.',
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  premiumLogin,
  premiumLogout,
  getProfile,
  getMembershipDetails,
  getPublicPremiumInfo,
  getPremiumContent,
  getPremiumContentById,
  submitUpgradeRequest,
};
