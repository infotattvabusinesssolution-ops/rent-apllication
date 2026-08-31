const fs = require('fs');
const crypto = require('crypto');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const PremiumMember = require('../models/PremiumMember');
const PremiumContent = require('../models/PremiumContent');
const PremiumUpgradeRequest = require('../models/PremiumUpgradeRequest');
const PremiumActivity = require('../models/PremiumActivity');
const User = require('../models/User');
const Counter = require('../models/Counter');
const { uploadToCloudinary } = require('../utils/cloudinary');

// Helper to safely build Mongoose query without throwing CastError on invalid ObjectIds
const buildIdQuery = (customIdKey, id) => {
  const conditions = [{ [customIdKey]: id }];
  if (mongoose.Types.ObjectId.isValid(id)) {
    conditions.push({ _id: id });
  }
  return { $or: conditions };
};

// Helper to generate unique Premium Member ID (e.g., PREM-2026-00001)
const generatePremiumMemberId = async () => {
  const year = new Date().getFullYear();
  const count = await PremiumMember.countDocuments();
  const nextNum = (count + 1).toString().padStart(5, '0');
  return `PREM-${year}-${nextNum}`;
};

// Helper to generate unique Content ID using MongoDB Atomic Counter (e.g., PREM-CNT-1001)
const generateContentId = async () => {
  const counterName = 'premium_content_id';
  const prefix = 'PREM-CNT-';
  const defaultStartSeq = 1000;

  // 1. Find highest existing numeric ID in PremiumContent
  const lastItem = await PremiumContent.findOne(
    { contentId: /^PREM-CNT-\d+$/ },
    { contentId: 1 }
  )
    .sort({ contentId: -1 })
    .lean();

  let maxExistingSeq = defaultStartSeq;
  if (lastItem && lastItem.contentId) {
    const numStr = lastItem.contentId.replace(prefix, '');
    const num = parseInt(numStr, 10);
    if (!isNaN(num) && num > maxExistingSeq) {
      maxExistingSeq = num;
    }
  }

  // 2. Ensure Counter document is synced to at least maxExistingSeq
  let counter = await Counter.findById(counterName);
  if (!counter || counter.seq < maxExistingSeq) {
    try {
      await Counter.updateOne(
        { _id: counterName },
        { $max: { seq: maxExistingSeq } },
        { upsert: true }
      );
    } catch (e) {
      // Ignore potential upsert race conditions
    }
  }

  // 3. Atomically increment counter
  counter = await Counter.findByIdAndUpdate(
    counterName,
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );

  let candidateId = `${prefix}${counter.seq}`;

  // 4. Verify candidate ID does not exist in database; if it exists, keep incrementing
  while (await PremiumContent.exists({ contentId: candidateId })) {
    counter = await Counter.findByIdAndUpdate(
      counterName,
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    candidateId = `${prefix}${counter.seq}`;
  }

  return candidateId;
};

// Helper to calculate expiry date based on plan
const calculateExpiryDate = (startDate, plan) => {
  const date = new Date(startDate);
  switch (plan) {
    case '1 Month':
      date.setMonth(date.getMonth() + 1);
      break;
    case '3 Months':
      date.setMonth(date.getMonth() + 3);
      break;
    case '6 Months':
      date.setMonth(date.getMonth() + 6);
      break;
    case '12 Months':
      date.setFullYear(date.getFullYear() + 1);
      break;
    default:
      date.setMonth(date.getMonth() + 1);
  }
  return date;
};

// @desc    Get Premium Admin Dashboard Statistics
// @route   GET /api/v1/admin/premium/dashboard
// @access  Private (Admin)
const getPremiumDashboardStats = async (req, res) => {
  try {
    const now = new Date();

    // Auto-update expired status in bulk
    await PremiumMember.updateMany(
      { status: 'ACTIVE', expiryDate: { $lt: now } },
      { $set: { status: 'EXPIRED' } }
    );

    const [
      activeMembers,
      pendingRequests,
      expiredMembers,
      blockedMembers,
      publishedContent,
      draftContent,
      recentRequests,
      recentContent,
      recentActivities,
    ] = await Promise.all([
      PremiumMember.countDocuments({ status: 'ACTIVE' }),
      PremiumUpgradeRequest.countDocuments({ requestStatus: 'PENDING' }),
      PremiumMember.countDocuments({ status: 'EXPIRED' }),
      PremiumMember.countDocuments({ status: 'BLOCKED' }),
      PremiumContent.countDocuments({ status: 'ACTIVE' }),
      PremiumContent.countDocuments({ status: 'DRAFT' }),
      PremiumUpgradeRequest.find({ requestStatus: 'PENDING' }).sort({ createdAt: -1 }).limit(5),
      PremiumContent.find().sort({ createdAt: -1 }).limit(5),
      PremiumActivity.find().sort({ createdAt: -1 }).limit(10),
    ]);

    // Content view stats
    const textViews = await PremiumActivity.countDocuments({ activityType: 'TEXT_VIEW' });
    const bannerViews = await PremiumActivity.countDocuments({ activityType: 'BANNER_VIEW' });
    const videoViews = await PremiumActivity.countDocuments({ activityType: 'VIDEO_VIEW' });

    return res.json({
      success: true,
      stats: {
        activeMembers,
        pendingRequests,
        expiredMembers,
        blockedMembers,
        publishedContent,
        draftContent,
        textViews,
        bannerViews,
        videoViews,
      },
      recentRequests,
      recentContent,
      recentActivities,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== PREMIUM CONTENT CONTROLLERS ====================

// @desc    Get Premium Content list with filters
// @route   GET /api/v1/admin/premium/content
// @access  Private (Admin)
const getPremiumContent = async (req, res) => {
  try {
    const { contentType, status, search } = req.query;
    const query = {};

    if (contentType && contentType !== 'ALL') {
      query.contentType = contentType;
    }
    if (status && status !== 'ALL') {
      query.status = status;
    }
    if (search) {
      query.title = { $regex: search.trim(), $options: 'i' };
    }

    const items = await PremiumContent.find(query).sort({ displayOrder: 1, createdAt: -1 });
    return res.json({ success: true, data: items, total: items.length });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new Premium Content (Text, Banner, Video)
// @route   POST /api/v1/admin/premium/content
// @access  Private (Admin)
const createPremiumContent = async (req, res) => {
  try {
    const { contentType, title, description, displayOrder, startDate, endDate, status, premiumOnly } = req.body;

    if (!contentType || !['TEXT', 'BANNER', 'VIDEO'].includes(contentType)) {
      if (req.file && req.file.path && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
      return res.status(400).json({ success: false, message: 'Valid content type (TEXT, BANNER, VIDEO) is required' });
    }
    if (!title || !title.trim()) {
      if (req.file && req.file.path && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
      return res.status(400).json({ success: false, message: 'Content title is required' });
    }

    let mediaUrl = req.body.mediaUrl || '';
    let thumbnailUrl = req.body.thumbnailUrl || '';

    // Handle file upload if present
    if (req.file) {
      const isVideo = contentType === 'VIDEO' || (req.file.originalname && /mp4|webm|mov|avi|mkv/.test(req.file.originalname));
      mediaUrl = await uploadToCloudinary(
        req.file,
        'homescooter_premium',
        isVideo ? 'video' : 'image',
        { isPremium: true }
      );
    }

    if (contentType === 'BANNER' && !mediaUrl) {
      return res.status(400).json({ success: false, message: 'Image banner file or URL is required for BANNER content' });
    }

    if (contentType === 'VIDEO' && !mediaUrl) {
      return res.status(400).json({ success: false, message: 'Video file or URL is required for VIDEO content' });
    }

    if (contentType === 'TEXT' && (!description || !description.trim())) {
      return res.status(400).json({ success: false, message: 'Description text is required for TEXT content' });
    }

    const isPremiumBool = premiumOnly !== undefined ? (premiumOnly === 'true' || premiumOnly === true) : true;

    let newContent;
    let attempts = 0;
    const maxAttempts = 5;

    while (attempts < maxAttempts) {
      attempts++;
      try {
        const contentId = await generateContentId();
        newContent = await PremiumContent.create({
          contentId,
          contentType,
          title: title.trim(),
          description: description || '',
          mediaUrl,
          thumbnailUrl,
          displayOrder: parseInt(displayOrder || '0', 10),
          startDate: startDate ? new Date(startDate) : null,
          endDate: endDate ? new Date(endDate) : null,
          status: status || 'DRAFT',
          premiumOnly: isPremiumBool,
          createdBy: req.admin?.adminId || 'ADMIN',
        });
        break;
      } catch (err) {
        if ((err.code === 11000 || (err.message && err.message.includes('E11000'))) && attempts < maxAttempts) {
          continue;
        }
        throw err;
      }
    }

    return res.status(201).json({
      success: true,
      data: newContent,
      message: `${contentType} content created successfully`,
    });
  } catch (error) {
    if (req.file && req.file.path && fs.existsSync(req.file.path)) {
      try { fs.unlinkSync(req.file.path); } catch (e) {}
    }
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single Premium Content by ID
// @route   GET /api/v1/admin/premium/content/:id
// @access  Private (Admin)
const getPremiumContentById = async (req, res) => {
  try {
    const item = await PremiumContent.findOne(buildIdQuery('contentId', req.params.id));
    if (!item) {
      return res.status(404).json({ success: false, message: 'Premium Content not found' });
    }
    return res.json({ success: true, data: item });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update Premium Content
// @route   PUT /api/v1/admin/premium/content/:id
// @access  Private (Admin)
const updatePremiumContent = async (req, res) => {
  try {
    const item = await PremiumContent.findOne(buildIdQuery('contentId', req.params.id));
    if (!item) {
      if (req.file && req.file.path && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
      return res.status(404).json({ success: false, message: 'Premium Content not found' });
    }

    const { title, description, displayOrder, startDate, endDate, status, premiumOnly, thumbnailUrl } = req.body;

    if (title) item.title = title.trim();
    if (description !== undefined) item.description = description;
    if (displayOrder !== undefined) item.displayOrder = parseInt(displayOrder, 10);
    if (startDate !== undefined) item.startDate = startDate ? new Date(startDate) : null;
    if (endDate !== undefined) item.endDate = endDate ? new Date(endDate) : null;
    if (status) item.status = status;
    if (premiumOnly !== undefined) item.premiumOnly = (premiumOnly === 'true' || premiumOnly === true);
    if (thumbnailUrl !== undefined) item.thumbnailUrl = thumbnailUrl;

    if (req.file) {
      const isVideo = item.contentType === 'VIDEO' || (req.file.originalname && /mp4|webm|mov|avi|mkv/.test(req.file.originalname));
      item.mediaUrl = await uploadToCloudinary(
        req.file,
        'homescooter_premium',
        isVideo ? 'video' : 'image',
        { isPremium: true }
      );
    } else if (req.body.mediaUrl) {
      item.mediaUrl = req.body.mediaUrl;
    }

    await item.save();
    return res.json({ success: true, data: item, message: 'Content updated successfully' });
  } catch (error) {
    if (req.file && req.file.path && fs.existsSync(req.file.path)) {
      try { fs.unlinkSync(req.file.path); } catch (e) {}
    }
    return res.status(500).json({ success: false, message: error.message });
  }
};


// @desc    Delete Premium Content
// @route   DELETE /api/v1/admin/premium/content/:id
// @access  Private (Admin)
const deletePremiumContent = async (req, res) => {
  try {
    const item = await PremiumContent.findOneAndDelete(buildIdQuery('contentId', req.params.id));
    if (!item) {
      return res.status(404).json({ success: false, message: 'Premium Content not found' });
    }
    return res.json({ success: true, message: 'Content deleted successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Publish Premium Content
// @route   POST /api/v1/admin/premium/content/:id/publish
// @access  Private (Admin)
const publishPremiumContent = async (req, res) => {
  try {
    const item = await PremiumContent.findOne(buildIdQuery('contentId', req.params.id));
    if (!item) {
      return res.status(404).json({ success: false, message: 'Premium Content not found' });
    }

    if (!item.title) {
      return res.status(400).json({ success: false, message: 'Cannot publish content without a title' });
    }
    if (item.contentType === 'BANNER' && !item.mediaUrl) {
      return res.status(400).json({ success: false, message: 'Cannot publish banner without an image' });
    }
    if (item.contentType === 'VIDEO' && !item.mediaUrl) {
      return res.status(400).json({ success: false, message: 'Cannot publish video content without a video file' });
    }

    item.status = 'ACTIVE';
    await item.save();
    return res.json({ success: true, data: item, message: 'Content published successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Unpublish Premium Content
// @route   POST /api/v1/admin/premium/content/:id/unpublish
// @access  Private (Admin)
const unpublishPremiumContent = async (req, res) => {
  try {
    const item = await PremiumContent.findOne(buildIdQuery('contentId', req.params.id));
    if (!item) {
      return res.status(404).json({ success: false, message: 'Premium Content not found' });
    }

    item.status = 'INACTIVE';
    await item.save();
    return res.json({ success: true, data: item, message: 'Content unpublished' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== PREMIUM MEMBERS CONTROLLERS ====================

// @desc    Get all Premium Members with filters
// @route   GET /api/v1/admin/premium/members
// @access  Private (Admin)
const getPremiumMembers = async (req, res) => {
  try {
    const { status, search } = req.query;
    const now = new Date();

    // Auto update expired status
    await PremiumMember.updateMany(
      { status: 'ACTIVE', expiryDate: { $lt: now } },
      { $set: { status: 'EXPIRED' } }
    );

    const query = {};
    if (status && status !== 'ALL') {
      query.status = status;
    }
    if (search) {
      const q = search.trim();
      query.$or = [
        { userName: { $regex: q, $options: 'i' } },
        { userPhone: { $regex: q, $options: 'i' } },
        { premiumMemberId: { $regex: q, $options: 'i' } },
        { userId: { $regex: q, $options: 'i' } },
      ];
    }

    const members = await PremiumMember.find(query).sort({ createdAt: -1 });
    return res.json({ success: true, data: members, total: members.length });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Manually Create Premium Member (Admin API)
// @route   POST /api/v1/admin/premium/members
// @access  Private (Admin)
const createPremiumMember = async (req, res) => {
  try {
    const { userId, userName, userPhone, userEmail, plan, password } = req.body;

    if (!userName || !userPhone || !plan) {
      return res.status(400).json({ success: false, message: 'Name, phone, and plan are required' });
    }

    const rawPassword = password || `Pass#${Math.floor(1000 + Math.random() * 9000)}`;
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(rawPassword, salt);

    const premiumMemberId = await generatePremiumMemberId();
    const startDate = new Date();
    const expiryDate = calculateExpiryDate(startDate, plan);

    const newMember = await PremiumMember.create({
      userId: userId || `USR-${Math.floor(1000 + Math.random() * 9000)}`,
      userName: userName.trim(),
      userPhone: userPhone.trim(),
      userEmail: userEmail ? userEmail.trim().toLowerCase() : '',
      premiumMemberId,
      passwordHash,
      plan,
      startDate,
      expiryDate,
      status: 'ACTIVE',
    });

    return res.status(201).json({
      success: true,
      data: {
        ...newMember.toObject(),
        generatedPassword: rawPassword,
      },
      message: 'Premium Member created and activated successfully',
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single Premium Member by ID
// @route   GET /api/v1/admin/premium/members/:id
// @access  Private (Admin)
const getPremiumMemberById = async (req, res) => {
  try {
    const member = await PremiumMember.findOne(buildIdQuery('premiumMemberId', req.params.id));
    if (!member) {
      return res.status(404).json({ success: false, message: 'Premium Member not found' });
    }

    const activities = await PremiumActivity.find({ memberId: member.premiumMemberId })
      .sort({ createdAt: -1 })
      .limit(20);

    return res.json({ success: true, data: member, activities });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update Premium Member details
// @route   PUT /api/v1/admin/premium/members/:id
// @access  Private (Admin)
const updatePremiumMember = async (req, res) => {
  try {
    const member = await PremiumMember.findOne(buildIdQuery('premiumMemberId', req.params.id));
    if (!member) {
      return res.status(404).json({ success: false, message: 'Premium Member not found' });
    }

    const { userName, userPhone, userEmail, plan, status } = req.body;
    if (userName) member.userName = userName.trim();
    if (userPhone) member.userPhone = userPhone.trim();
    if (userEmail !== undefined) member.userEmail = userEmail.trim().toLowerCase();
    if (plan && plan !== member.plan) {
      member.plan = plan;
      member.expiryDate = calculateExpiryDate(member.startDate, plan);
    }
    if (status) member.status = status;

    await member.save();
    return res.json({ success: true, data: member, message: 'Member details updated successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Renew Premium Member Plan
// @route   POST /api/v1/admin/premium/members/:id/renew
// @access  Private (Admin)
const renewPremiumMember = async (req, res) => {
  try {
    const { plan } = req.body;
    const member = await PremiumMember.findOne(buildIdQuery('premiumMemberId', req.params.id));

    if (!member) {
      return res.status(404).json({ success: false, message: 'Premium Member not found' });
    }

    const renewalPlan = plan || member.plan;
    const now = new Date();

    let newStartDate, newExpiryDate;
    if (member.status === 'ACTIVE' && new Date(member.expiryDate) > now) {
      // Add renewal period to existing expiry date
      newStartDate = member.startDate;
      newExpiryDate = calculateExpiryDate(member.expiryDate, renewalPlan);
    } else {
      // Set new start date to now and calculate expiry
      newStartDate = now;
      newExpiryDate = calculateExpiryDate(now, renewalPlan);
    }

    member.plan = renewalPlan;
    member.startDate = newStartDate;
    member.expiryDate = newExpiryDate;
    member.status = 'ACTIVE';
    await member.save();

    return res.json({
      success: true,
      data: member,
      message: `Premium Membership renewed successfully for ${renewalPlan}`,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Block Premium Member
// @route   POST /api/v1/admin/premium/members/:id/block
// @access  Private (Admin)
const blockPremiumMember = async (req, res) => {
  try {
    const { reason = 'Blocked by administrator' } = req.body;
    const member = await PremiumMember.findOne(buildIdQuery('premiumMemberId', req.params.id));

    if (!member) {
      return res.status(404).json({ success: false, message: 'Premium Member not found' });
    }

    member.status = 'BLOCKED';
    member.blockedReason = reason;
    member.blockedAt = new Date();
    await member.save();

    return res.json({ success: true, message: 'Premium Member blocked successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Unblock Premium Member
// @route   POST /api/v1/admin/premium/members/:id/unblock
// @access  Private (Admin)
const unblockPremiumMember = async (req, res) => {
  try {
    const member = await PremiumMember.findOne(buildIdQuery('premiumMemberId', req.params.id));

    if (!member) {
      return res.status(404).json({ success: false, message: 'Premium Member not found' });
    }

    const now = new Date();
    member.status = new Date(member.expiryDate) > now ? 'ACTIVE' : 'EXPIRED';
    member.blockedReason = null;
    member.blockedAt = null;
    await member.save();

    return res.json({ success: true, message: 'Premium Member unblocked' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Change Premium Member Password
// @route   POST /api/v1/admin/premium/members/:id/change-password
// @access  Private (Admin)
const changePremiumMemberPassword = async (req, res) => {
  try {
    const { newPassword } = req.body;
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long' });
    }

    const member = await PremiumMember.findOne(buildIdQuery('premiumMemberId', req.params.id));

    if (!member) {
      return res.status(404).json({ success: false, message: 'Premium Member not found' });
    }

    const salt = await bcrypt.genSalt(10);
    member.passwordHash = await bcrypt.hash(newPassword, salt);
    await member.save();

    return res.json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== UPGRADE REQUEST CONTROLLERS ====================

// @desc    Get all Premium Upgrade Requests
// @route   GET /api/v1/admin/premium/upgrade-requests
// @access  Private (Admin)
const getUpgradeRequests = async (req, res) => {
  try {
    const { requestStatus, search } = req.query;
    const query = {};

    if (requestStatus && requestStatus !== 'ALL') {
      query.requestStatus = requestStatus;
    }
    if (search) {
      const q = search.trim();
      query.$or = [
        { userName: { $regex: q, $options: 'i' } },
        { userPhone: { $regex: q, $options: 'i' } },
        { paymentReference: { $regex: q, $options: 'i' } },
        { requestId: { $regex: q, $options: 'i' } },
      ];
    }

    const requests = await PremiumUpgradeRequest.find(query).sort({ createdAt: -1 });
    return res.json({ success: true, data: requests, total: requests.length });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Approve Upgrade Request & Activate Premium Member
// @route   POST /api/v1/admin/premium/upgrade-requests/:id/approve
// @access  Private (Admin)
const approveUpgradeRequest = async (req, res) => {
  try {
    const request = await PremiumUpgradeRequest.findOne(buildIdQuery('requestId', req.params.id));

    if (!request) {
      return res.status(404).json({ success: false, message: 'Upgrade request record not found' });
    }

    if (request.requestStatus === 'APPROVED') {
      return res.status(400).json({ success: false, message: 'This request has already been approved' });
    }

    const { customPassword } = req.body;
    const rawPassword = customPassword || `Pass#${Math.floor(1000 + Math.random() * 9000)}`;
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(rawPassword, salt);

    // Check if user already has a PremiumMember record
    let member = await PremiumMember.findOne({ userId: request.userId });

    const startDate = new Date();
    const expiryDate = calculateExpiryDate(startDate, request.plan);

    if (!member) {
      const premiumMemberId = await generatePremiumMemberId();
      member = await PremiumMember.create({
        userId: request.userId,
        userName: request.userName,
        userPhone: request.userPhone,
        userEmail: request.userEmail || '',
        premiumMemberId,
        passwordHash,
        plan: request.plan,
        startDate,
        expiryDate,
        status: 'ACTIVE',
      });
    } else {
      member.plan = request.plan;
      member.startDate = startDate;
      member.expiryDate = expiryDate;
      member.status = 'ACTIVE';
      member.passwordHash = passwordHash;
      await member.save();
    }

    request.requestStatus = 'APPROVED';
    request.paymentStatus = 'PAID';
    request.premiumMemberId = member.premiumMemberId;
    request.approvedBy = req.admin?.adminId || 'ADMIN';
    request.approvedAt = new Date();
    await request.save();

    return res.json({
      success: true,
      premiumMemberId: member.premiumMemberId,
      generatedPassword: rawPassword,
      expiryDate: expiryDate.toISOString(),
      message: 'Upgrade request approved and Premium Member activated!',
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Reject Upgrade Request
// @route   POST /api/v1/admin/premium/upgrade-requests/:id/reject
// @access  Private (Admin)
const rejectUpgradeRequest = async (req, res) => {
  try {
    const { reason = 'Payment verification failed' } = req.body;
    const request = await PremiumUpgradeRequest.findOne(buildIdQuery('requestId', req.params.id));

    if (!request) {
      return res.status(404).json({ success: false, message: 'Upgrade request record not found' });
    }

    request.requestStatus = 'REJECTED';
    request.rejectionReason = reason;
    request.rejectedAt = new Date();
    await request.save();

    return res.json({ success: true, message: 'Upgrade request rejected' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== REPORTS & ACTIVITY CONTROLLERS ====================

// @desc    Get Premium Activity logs & Content View Reports
// @route   GET /api/v1/admin/premium/reports
// @access  Private (Admin)
const getPremiumReports = async (req, res) => {
  try {
    const activities = await PremiumActivity.find().sort({ createdAt: -1 }).limit(100);
    return res.json({ success: true, data: activities });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Cloudinary Signed Parameters for Direct Client Upload
// @route   GET /api/v1/admin/premium/cloudinary-signature
// @access  Private (Admin)
const getCloudinarySignature = async (req, res) => {
  try {
    const timestamp = Math.floor(Date.now() / 1000);
    const folder = 'homescooter_premium';
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME || 'dwmokcagc';
    const apiKey = process.env.CLOUDINARY_API_KEY || '811782714826833';
    const apiSecret = process.env.CLOUDINARY_API_SECRET || 'YaT7sDQ5TSUNH276l35lPYXp9fI';

    const publicId = req.query.public_id || req.query.publicId || req.body.public_id || req.body.publicId || null;

    let signatureStr = '';
    if (publicId) {
      // Strictly sorted parameter order: folder, public_id, timestamp
      signatureStr = `folder=${folder}&public_id=${publicId}&timestamp=${timestamp}${apiSecret}`;
    } else {
      signatureStr = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;
    }

    const signature = crypto.createHash('sha1').update(signatureStr).digest('hex');

    return res.json({
      success: true,
      cloudName,
      apiKey,
      timestamp,
      folder,
      publicId,
      signature,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getPremiumDashboardStats,
  getCloudinarySignature,

  getPremiumContent,
  createPremiumContent,
  getPremiumContentById,
  updatePremiumContent,
  deletePremiumContent,
  publishPremiumContent,
  unpublishPremiumContent,

  getPremiumMembers,
  createPremiumMember,
  getPremiumMemberById,
  updatePremiumMember,
  renewPremiumMember,
  blockPremiumMember,
  unblockPremiumMember,
  changePremiumMemberPassword,

  getUpgradeRequests,
  approveUpgradeRequest,
  rejectUpgradeRequest,

  getPremiumReports,
};
