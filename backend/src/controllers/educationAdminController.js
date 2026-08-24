const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const EducationStudent = require('../models/EducationStudent');
const EducationContent = require('../models/EducationContent');
const EducationNotification = require('../models/EducationNotification');
const EducationActivity = require('../models/EducationActivity');
const DeviceToken = require('../models/DeviceToken');
const {
  generateEducationStudentId,
  generateEducationContentId,
  generateEducationNotificationId,
} = require('../services/educationIdService');
const { uploadToCloudinary } = require('../utils/cloudinary');

// Helper to safely build Mongoose query without throwing CastError on custom string IDs
const buildIdQuery = (customIdKey, id) => {
  const conditions = [{ [customIdKey]: id }];
  if (mongoose.Types.ObjectId.isValid(id)) {
    conditions.push({ _id: id });
  }
  return { $or: conditions };
};

// ==================== DASHBOARD CONTROLLER ====================

// @desc    Get Education Admin Dashboard Statistics & KPI Charts
// @route   GET /api/v1/admin/education/dashboard
// @access  Private (Admin)
const getEducationAdminDashboard = async (req, res) => {
  try {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const [
      totalStudents,
      activeStudents,
      blockedStudents,
      todayJoinedStudents,
      totalContent,
      publishedContent,
      draftContent,
      totalNotifications,
      todayContentViews,
      todayVideoViews,
      recentStudents,
      recentContent,
      recentActivities,
    ] = await Promise.all([
      EducationStudent.countDocuments(),
      EducationStudent.countDocuments({ status: 'ACTIVE' }),
      EducationStudent.countDocuments({ status: 'BLOCKED' }),
      EducationStudent.countDocuments({ createdAt: { $gte: todayStart } }),

      EducationContent.countDocuments(),
      EducationContent.countDocuments({ status: 'ACTIVE' }),
      EducationContent.countDocuments({ status: 'DRAFT' }),

      EducationNotification.countDocuments(),

      EducationActivity.countDocuments({
        createdAt: { $gte: todayStart },
        activityType: { $in: ['CONTENT_VIEW', 'TEXT_VIEW', 'BANNER_VIEW', 'DOCUMENT_VIEW'] },
      }),
      EducationActivity.countDocuments({
        createdAt: { $gte: todayStart },
        activityType: 'VIDEO_VIEW',
      }),

      EducationStudent.find().sort({ createdAt: -1 }).limit(5),
      EducationContent.find().sort({ createdAt: -1 }).limit(5),
      EducationActivity.find().sort({ createdAt: -1 }).limit(10),
    ]);

    // Content view breakdown by category
    const categoryPopularity = await EducationContent.aggregate([
      { $group: { _id: '$category', totalViews: { $sum: '$viewsCount' }, count: { $sum: 1 } } },
      { $sort: { totalViews: -1 } },
    ]);

    return res.json({
      success: true,
      stats: {
        totalStudents,
        activeStudents,
        blockedStudents,
        todayJoinedStudents,
        totalContent,
        publishedContent,
        draftContent,
        totalNotifications,
        todayContentViews,
        todayVideoViews,
      },
      categoryPopularity,
      recentStudents,
      recentContent,
      recentActivities,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== STUDENT MANAGEMENT CONTROLLERS ====================

// @desc    Get all Education Students with filters, search & pagination
// @route   GET /api/v1/admin/education/students
// @access  Private (Admin)
const getStudents = async (req, res) => {
  try {
    const { status, educationLevel, search, page = 1, limit = 15, exportCsv } = req.query;
    const query = {};

    if (status && status !== 'ALL') {
      query.status = status;
    }
    if (educationLevel && educationLevel !== 'ALL') {
      query.educationLevel = educationLevel;
    }
    if (search) {
      const q = search.trim();
      query.$or = [
        { fullName: { $regex: q, $options: 'i' } },
        { mobile: { $regex: q, $options: 'i' } },
        { educationStudentId: { $regex: q, $options: 'i' } },
        { place: { $regex: q, $options: 'i' } },
      ];
    }

    if (exportCsv === 'true') {
      const students = await EducationStudent.find(query).sort({ createdAt: -1 });
      return res.json({ success: true, data: students });
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const [students, total] = await Promise.all([
      EducationStudent.find(query).sort({ createdAt: -1 }).skip(skip).limit(limitNum),
      EducationStudent.countDocuments(query),
    ]);

    return res.json({
      success: true,
      data: students,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single Student by ID
// @route   GET /api/v1/admin/education/students/:id
// @access  Private (Admin)
const getStudentById = async (req, res) => {
  try {
    const student = await EducationStudent.findOne(buildIdQuery('educationStudentId', req.params.id));
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student record not found' });
    }

    const activities = await EducationActivity.find({ studentId: student.educationStudentId })
      .sort({ createdAt: -1 })
      .limit(30);

    return res.json({ success: true, data: student, activities });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update Student details
// @route   PUT /api/v1/admin/education/students/:id
// @access  Private (Admin)
const updateStudent = async (req, res) => {
  try {
    const student = await EducationStudent.findOne(buildIdQuery('educationStudentId', req.params.id));
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student record not found' });
    }

    const { fullName, email, educationLevel, classStandard, course, place, status } = req.body;
    if (fullName) student.fullName = fullName.trim();
    if (email !== undefined) student.email = email.trim().toLowerCase();
    if (educationLevel) student.educationLevel = educationLevel;
    if (classStandard !== undefined) student.classStandard = classStandard;
    if (course !== undefined) student.course = course;
    if (place !== undefined) student.place = place;
    if (status) student.status = status;

    await student.save();
    return res.json({ success: true, data: student, message: 'Student profile updated successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Block Student Account (Mandatory reason)
// @route   POST /api/v1/admin/education/students/:id/block
// @access  Private (Admin)
const blockStudent = async (req, res) => {
  try {
    const { reason } = req.body;
    if (!reason || !reason.trim()) {
      return res.status(400).json({ success: false, message: 'Block reason is required' });
    }

    const student = await EducationStudent.findOne(buildIdQuery('educationStudentId', req.params.id));
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student record not found' });
    }

    student.status = 'BLOCKED';
    student.blockedReason = reason.trim();
    await student.save();

    return res.json({ success: true, message: `Student ${student.educationStudentId} has been blocked.` });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Unblock Student Account
// @route   POST /api/v1/admin/education/students/:id/unblock
// @access  Private (Admin)
const unblockStudent = async (req, res) => {
  try {
    const student = await EducationStudent.findOne(buildIdQuery('educationStudentId', req.params.id));
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student record not found' });
    }

    student.status = 'ACTIVE';
    student.blockedReason = null;
    await student.save();

    return res.json({ success: true, message: `Student ${student.educationStudentId} has been unblocked.` });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== CONTENT MANAGEMENT CONTROLLERS ====================

// @desc    Get all Education Content with filters
// @route   GET /api/v1/admin/education/content
// @access  Private (Admin)
const getContentList = async (req, res) => {
  try {
    const { category, contentType, status, search } = req.query;
    const query = {};

    if (category && category !== 'ALL') {
      query.category = category;
    }
    if (contentType && contentType !== 'ALL') {
      query.contentType = contentType;
    }
    if (status && status !== 'ALL') {
      query.status = status;
    }
    if (search) {
      query.title = { $regex: search.trim(), $options: 'i' };
    }

    const items = await EducationContent.find(query).sort({ displayOrder: 1, createdAt: -1 });
    return res.json({ success: true, data: items, total: items.length });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create New Education Content (Text, Banner, Video, PDF Document, Link)
// @route   POST /api/v1/admin/education/content
// @access  Private (Admin)
const createContent = async (req, res) => {
  try {
    const {
      category,
      contentType,
      title,
      shortDescription,
      description,
      displayOrder,
      targetAudience,
      startDate,
      endDate,
      status,
      externalUrl,
    } = req.body;

    if (!category || !contentType || !title) {
      return res.status(400).json({
        success: false,
        message: 'Category, Content Type, and Title are required fields',
      });
    }

    let mediaUrl = req.body.mediaUrl || '';
    let thumbnailUrl = req.body.thumbnailUrl || '';
    let documentUrl = req.body.documentUrl || '';

    // Upload file directly to Cloudinary if file present (No local disk storage)
    if (req.file) {
      const isVideo = contentType === 'VIDEO' || (req.file.originalname && /mp4|webm|mov|avi|mkv/.test(req.file.originalname));
      const isDoc = contentType === 'DOCUMENT' || (req.file.originalname && /pdf|doc|docx|ppt/.test(req.file.originalname));
      const targetFolder = isVideo ? 'homescooter/education/videos' : isDoc ? 'homescooter/education/documents' : 'homescooter/education/banners';

      const cUrl = await uploadToCloudinary(
        req.file,
        targetFolder,
        isVideo ? 'video' : 'image'
      );

      if (isDoc) {
        documentUrl = cUrl;
      } else {
        mediaUrl = cUrl;
      }
    }

    const contentId = await generateEducationContentId();

    const newContent = await EducationContent.create({
      contentId,
      category,
      contentType,
      title: title.trim(),
      shortDescription: shortDescription || '',
      description: description || '',
      mediaUrl,
      thumbnailUrl,
      documentUrl,
      externalUrl: externalUrl || '',
      displayOrder: parseInt(displayOrder || '0', 10),
      targetAudience: targetAudience || 'ALL',
      startDate: startDate ? new Date(startDate) : null,
      endDate: endDate ? new Date(endDate) : null,
      status: status || 'DRAFT',
      createdBy: req.admin?.adminId || 'ADMIN',
    });

    return res.status(201).json({
      success: true,
      data: newContent,
      message: 'Education content created successfully',
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single Content by ID
// @route   GET /api/v1/admin/education/content/:id
// @access  Private (Admin)
const getContentById = async (req, res) => {
  try {
    const item = await EducationContent.findOne(buildIdQuery('contentId', req.params.id));
    if (!item) {
      return res.status(404).json({ success: false, message: 'Content item not found' });
    }
    return res.json({ success: true, data: item });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update Education Content
// @route   PUT /api/v1/admin/education/content/:id
// @access  Private (Admin)
const updateContent = async (req, res) => {
  try {
    const item = await EducationContent.findOne(buildIdQuery('contentId', req.params.id));
    if (!item) {
      return res.status(404).json({ success: false, message: 'Content item not found' });
    }

    const {
      category,
      contentType,
      title,
      shortDescription,
      description,
      displayOrder,
      targetAudience,
      startDate,
      endDate,
      status,
      externalUrl,
      mediaUrl,
      documentUrl,
    } = req.body;

    if (category) item.category = category;
    if (contentType) item.contentType = contentType;
    if (title) item.title = title.trim();
    if (shortDescription !== undefined) item.shortDescription = shortDescription;
    if (description !== undefined) item.description = description;
    if (displayOrder !== undefined) item.displayOrder = parseInt(displayOrder, 10);
    if (targetAudience) item.targetAudience = targetAudience;
    if (startDate !== undefined) item.startDate = startDate ? new Date(startDate) : null;
    if (endDate !== undefined) item.endDate = endDate ? new Date(endDate) : null;
    if (status) item.status = status;
    if (externalUrl !== undefined) item.externalUrl = externalUrl;
    if (mediaUrl !== undefined) item.mediaUrl = mediaUrl;
    if (documentUrl !== undefined) item.documentUrl = documentUrl;

    if (req.file) {
      const isVideo = item.contentType === 'VIDEO' || (req.file.originalname && /mp4|webm|mov|avi|mkv/.test(req.file.originalname));
      const isDoc = item.contentType === 'DOCUMENT' || (req.file.originalname && /pdf|doc|docx|ppt/.test(req.file.originalname));
      const targetFolder = isVideo ? 'homescooter/education/videos' : isDoc ? 'homescooter/education/documents' : 'homescooter/education/banners';

      const cUrl = await uploadToCloudinary(
        req.file,
        targetFolder,
        isVideo ? 'video' : 'image'
      );

      if (isDoc) {
        item.documentUrl = cUrl;
      } else {
        item.mediaUrl = cUrl;
      }
    }

    await item.save();
    return res.json({ success: true, data: item, message: 'Content updated successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete Education Content
// @route   DELETE /api/v1/admin/education/content/:id
// @access  Private (Admin)
const deleteContent = async (req, res) => {
  try {
    const item = await EducationContent.findOneAndDelete(buildIdQuery('contentId', req.params.id));
    if (!item) {
      return res.status(404).json({ success: false, message: 'Content item not found' });
    }
    return res.json({ success: true, message: 'Content item deleted' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Publish Content
// @route   POST /api/v1/admin/education/content/:id/publish
// @access  Private (Admin)
const publishContent = async (req, res) => {
  try {
    const item = await EducationContent.findOne(buildIdQuery('contentId', req.params.id));
    if (!item) {
      return res.status(404).json({ success: false, message: 'Content item not found' });
    }

    item.status = 'ACTIVE';
    await item.save();
    return res.json({ success: true, data: item, message: 'Content published (ACTIVE)' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Unpublish Content
// @route   POST /api/v1/admin/education/content/:id/unpublish
// @access  Private (Admin)
const unpublishContent = async (req, res) => {
  try {
    const item = await EducationContent.findOne(buildIdQuery('contentId', req.params.id));
    if (!item) {
      return res.status(404).json({ success: false, message: 'Content item not found' });
    }

    item.status = 'INACTIVE';
    await item.save();
    return res.json({ success: true, data: item, message: 'Content unpublished (INACTIVE)' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== NOTIFICATION CONTROLLERS ====================

// @desc    Get all Education Notifications
// @route   GET /api/v1/admin/education/notifications
// @access  Private (Admin)
const getNotifications = async (req, res) => {
  try {
    const notifications = await EducationNotification.find().sort({ createdAt: -1 });
    return res.json({ success: true, data: notifications });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create & Broadcast / Schedule Notification
// @route   POST /api/v1/admin/education/notifications
// @access  Private (Admin)
const createNotification = async (req, res) => {
  try {
    const { title, message, notificationType, targetAudience, contentId, scheduledAt, sendNow } = req.body;

    if (!title || !message) {
      return res.status(400).json({ success: false, message: 'Title and message are required' });
    }

    let imageUrl = req.body.imageUrl || '';
    if (req.file) {
      imageUrl = await uploadToCloudinary(req.file, 'homescooter/education/notifications', 'image');
    }

    const notificationId = await generateEducationNotificationId();
    const isSendNow = sendNow === true || sendNow === 'true';

    const newNotification = await EducationNotification.create({
      notificationId,
      title: title.trim(),
      message: message.trim(),
      notificationType: notificationType || 'GENERAL',
      targetAudience: targetAudience || 'ALL',
      imageUrl,
      contentId: contentId || null,
      scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
      sentAt: isSendNow ? new Date() : null,
      status: isSendNow ? 'SENT' : scheduledAt ? 'SCHEDULED' : 'DRAFT',
    });

    return res.status(201).json({
      success: true,
      data: newNotification,
      message: isSendNow ? 'Notification sent successfully!' : 'Notification created',
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== REPORTS CONTROLLER ====================

// @desc    Get Engagement Analytics & Activity Reports
// @route   GET /api/v1/admin/education/reports
// @access  Private (Admin)
const getEducationReports = async (req, res) => {
  try {
    const activities = await EducationActivity.find().sort({ createdAt: -1 }).limit(100);
    const topViewedContent = await EducationContent.find({ viewsCount: { $gt: 0 } })
      .sort({ viewsCount: -1 })
      .limit(10);

    return res.json({
      success: true,
      data: {
        activities,
        topViewedContent,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getEducationAdminDashboard,

  getStudents,
  getStudentById,
  updateStudent,
  blockStudent,
  unblockStudent,

  getContentList,
  createContent,
  getContentById,
  updateContent,
  deleteContent,
  publishContent,
  unpublishContent,

  getNotifications,
  createNotification,

  getEducationReports,
};
