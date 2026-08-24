const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const EducationStudent = require('../models/EducationStudent');
const EducationContent = require('../models/EducationContent');
const EducationNotification = require('../models/EducationNotification');
const EducationActivity = require('../models/EducationActivity');
const DeviceToken = require('../models/DeviceToken');
const { generateEducationStudentId } = require('../services/educationIdService');

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_jwt_key_homescooter_2026';

// @desc    Get Public Education Desk Info
// @route   GET /api/v1/education/public-info
// @access  Public
const getPublicInfo = async (req, res) => {
  try {
    const activeContentCount = await EducationContent.countDocuments({ status: 'ACTIVE' });
    const totalStudents = await EducationStudent.countDocuments({ status: 'ACTIVE' });

    return res.json({
      success: true,
      data: {
        title: 'Education Desk',
        tagline: 'Learn • Stay Updated • Move Forward.',
        eligibility: [
          '10th Standard',
          '11th Standard',
          '12th Standard',
          'Diploma',
          'Undergraduate (UG)',
          'Postgraduate (PG)',
          'Job Seekers',
        ],
        categories: [
          { key: 'EDUCATION_UPDATE', title: 'Education Updates', icon: 'BookOpen' },
          { key: 'COURSE', title: 'Featured Courses', icon: 'GraduationCap' },
          { key: 'ADMISSION', title: 'Admissions', icon: 'Building' },
          { key: 'CAREER', title: 'Career Opportunities', icon: 'Briefcase' },
          { key: 'EXAM', title: 'Exam Notifications', icon: 'FileText' },
          { key: 'SCHOLARSHIP', title: 'Scholarship Alerts', icon: 'Award' },
          { key: 'ANNOUNCEMENT', title: 'Important Announcements', icon: 'Bell' },
        ],
        activeContentCount,
        totalStudents,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Student Registration
// @route   POST /api/v1/education/auth/register
// @access  Public
const registerStudent = async (req, res) => {
  try {
    const { fullName, mobile, email, educationLevel, classStandard, course, place, password } = req.body;

    if (!fullName || !mobile) {
      return res.status(400).json({
        success: false,
        message: 'Full Name and Mobile Number are required',
      });
    }

    const cleanMobile = mobile.trim();
    const existing = await EducationStudent.findOne({ mobile: cleanMobile });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'A student account with this mobile number already exists. Please log in.',
      });
    }

    const rawPassword = password || `Pass#${Math.floor(1000 + Math.random() * 9000)}`;
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(rawPassword, salt);

    const educationStudentId = await generateEducationStudentId();

    const student = await EducationStudent.create({
      educationStudentId,
      userId: educationStudentId,
      fullName: fullName.trim(),
      mobile: cleanMobile,
      email: email ? email.trim().toLowerCase() : '',
      educationLevel: educationLevel || 'OTHER',
      classStandard: classStandard || '',
      course: course || '',
      place: place || '',
      passwordHash,
      status: 'ACTIVE',
    });

    const token = jwt.sign(
      { id: student.educationStudentId, mobile: student.mobile, type: 'STUDENT' },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    const studentObj = student.toObject();
    delete studentObj.passwordHash;

    return res.status(201).json({
      success: true,
      token,
      educationStudentId: student.educationStudentId,
      generatedPassword: rawPassword,
      data: studentObj,
      message: 'Student account registered successfully!',
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Student Login
// @route   POST /api/v1/education/auth/login
// @access  Public
const loginStudent = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({
        success: false,
        message: 'Education Desk ID or Mobile Number and Password are required',
      });
    }

    const cleanId = identifier.trim();
    const student = await EducationStudent.findOne({
      $or: [
        { educationStudentId: cleanId.toUpperCase() },
        { mobile: cleanId },
        { email: cleanId.toLowerCase() },
      ],
    });

    if (!student) {
      return res.status(401).json({
        success: false,
        message: 'Invalid Education Desk ID or credentials',
      });
    }

    const isMatch = await bcrypt.compare(password, student.passwordHash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid Education Desk ID or password',
      });
    }

    if (student.status === 'BLOCKED') {
      return res.status(403).json({
        success: false,
        code: 'STUDENT_BLOCKED',
        message: student.blockedReason || 'Your Education Desk account has been blocked by administration.',
      });
    }

    student.lastLogin = new Date();
    await student.save();

    // Log LOGIN Activity
    await EducationActivity.create({
      studentId: student.educationStudentId,
      activityType: 'LOGIN',
      ipAddress: req.ip || '',
      userAgent: req.headers['user-agent'] || '',
    });

    const token = jwt.sign(
      { id: student.educationStudentId, mobile: student.mobile, type: 'STUDENT' },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    const studentObj = student.toObject();
    delete studentObj.passwordHash;

    return res.json({
      success: true,
      token,
      educationStudentId: student.educationStudentId,
      data: studentObj,
      message: 'Welcome back to Education Desk!',
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Student Logout
// @route   POST /api/v1/education/auth/logout
// @access  Private (Student)
const logoutStudent = async (req, res) => {
  try {
    if (req.educationStudent) {
      await EducationActivity.create({
        studentId: req.educationStudent.educationStudentId,
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

// @desc    Get Logged-in Student Profile
// @route   GET /api/v1/education/profile
// @access  Private (Student)
const getStudentProfile = async (req, res) => {
  try {
    const studentObj = req.educationStudent.toObject();
    delete studentObj.passwordHash;
    return res.json({ success: true, data: studentObj });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update Student Profile
// @route   PUT /api/v1/education/profile
// @access  Private (Student)
const updateStudentProfile = async (req, res) => {
  try {
    const student = req.educationStudent;
    const { fullName, email, educationLevel, classStandard, course, place, profileImage } = req.body;

    if (fullName) student.fullName = fullName.trim();
    if (email !== undefined) student.email = email.trim().toLowerCase();
    if (educationLevel) student.educationLevel = educationLevel;
    if (classStandard !== undefined) student.classStandard = classStandard;
    if (course !== undefined) student.course = course;
    if (place !== undefined) student.place = place;
    if (profileImage !== undefined) student.profileImage = profileImage;

    await student.save();

    const studentObj = student.toObject();
    delete studentObj.passwordHash;

    return res.json({ success: true, data: studentObj, message: 'Profile updated successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Education Desk Student Dashboard Feed
// @route   GET /api/v1/education/dashboard
// @access  Public or Protected Student
const getEducationDashboard = async (req, res) => {
  try {
    const now = new Date();
    const audience = req.educationStudent?.educationLevel || 'ALL';

    const baseQuery = {
      status: 'ACTIVE',
      $and: [
        { $or: [{ startDate: null }, { startDate: { $lte: now } }] },
        { $or: [{ endDate: null }, { endDate: { $gte: now } }] },
        { $or: [{ targetAudience: 'ALL' }, { targetAudience: audience }] },
      ],
    };

    const [
      latestUpdates,
      featuredCourses,
      careerOpportunities,
      upcomingExams,
      scholarships,
      announcements,
      recentNotifications,
    ] = await Promise.all([
      EducationContent.find({ ...baseQuery, category: 'EDUCATION_UPDATE' }).sort({ displayOrder: 1, createdAt: -1 }).limit(5),
      EducationContent.find({ ...baseQuery, category: 'COURSE' }).sort({ displayOrder: 1, createdAt: -1 }).limit(5),
      EducationContent.find({ ...baseQuery, category: 'CAREER' }).sort({ displayOrder: 1, createdAt: -1 }).limit(5),
      EducationContent.find({ ...baseQuery, category: 'EXAM' }).sort({ displayOrder: 1, createdAt: -1 }).limit(5),
      EducationContent.find({ ...baseQuery, category: 'SCHOLARSHIP' }).sort({ displayOrder: 1, createdAt: -1 }).limit(5),
      EducationContent.find({ ...baseQuery, category: 'ANNOUNCEMENT' }).sort({ displayOrder: 1, createdAt: -1 }).limit(5),
      EducationNotification.find({ status: 'SENT' }).sort({ createdAt: -1 }).limit(5),
    ]);

    return res.json({
      success: true,
      data: {
        latestUpdates,
        featuredCourses,
        careerOpportunities,
        upcomingExams,
        scholarships,
        announcements,
        recentNotifications,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Content Feed with Category, Type, Audience & Search filters + Pagination
// @route   GET /api/v1/education/content
// @access  Public or Protected Student
const getEducationContent = async (req, res) => {
  try {
    const { category, contentType, audience, search, page = 1, limit = 10 } = req.query;
    const now = new Date();

    const query = {
      status: 'ACTIVE',
      $and: [
        { $or: [{ startDate: null }, { startDate: { $lte: now } }] },
        { $or: [{ endDate: null }, { endDate: { $gte: now } }] },
      ],
    };

    if (category && category !== 'ALL') {
      query.category = category;
    }
    if (contentType && contentType !== 'ALL') {
      query.contentType = contentType;
    }
    if (audience && audience !== 'ALL') {
      query.$and.push({ $or: [{ targetAudience: 'ALL' }, { targetAudience: audience }] });
    }
    if (search) {
      query.$or = [
        { title: { $regex: search.trim(), $options: 'i' } },
        { shortDescription: { $regex: search.trim(), $options: 'i' } },
      ];
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const [items, total] = await Promise.all([
      EducationContent.find(query)
        .sort({ displayOrder: 1, createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      EducationContent.countDocuments(query),
    ]);

    return res.json({
      success: true,
      data: items,
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

// @desc    Get Content Detail & Record View Activity
// @route   GET /api/v1/education/content/:id
// @access  Public or Protected Student
const getEducationContentById = async (req, res) => {
  try {
    const contentQuery = [{ contentId: req.params.id }];
    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
      contentQuery.push({ _id: req.params.id });
    }

    const item = await EducationContent.findOne({
      $or: contentQuery,
      status: 'ACTIVE',
    });

    if (!item) {
      return res.status(404).json({ success: false, message: 'Educational content item not found' });
    }

    // Increment views count
    item.viewsCount = (item.viewsCount || 0) + 1;
    await item.save();

    // Determine activity type
    let activityType = 'CONTENT_VIEW';
    if (item.contentType === 'TEXT') activityType = 'CONTENT_VIEW';
    if (item.contentType === 'BANNER') activityType = 'BANNER_VIEW';
    if (item.contentType === 'VIDEO') activityType = 'VIDEO_VIEW';
    if (item.contentType === 'DOCUMENT') activityType = 'DOCUMENT_VIEW';
    if (item.contentType === 'LINK') activityType = 'LINK_CLICK';

    // Log Activity if student is logged in
    if (req.educationStudent) {
      await EducationActivity.create({
        studentId: req.educationStudent.educationStudentId,
        contentId: item.contentId,
        activityType,
        ipAddress: req.ip || '',
        userAgent: req.headers['user-agent'] || '',
      });
    }

    return res.json({ success: true, data: item });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Student Notifications List
// @route   GET /api/v1/education/notifications
// @access  Public or Protected Student
const getNotifications = async (req, res) => {
  try {
    const notifications = await EducationNotification.find({ status: 'SENT' })
      .sort({ createdAt: -1 })
      .limit(30);

    return res.json({
      success: true,
      data: notifications,
      unreadCount: notifications.length,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Register Device Token for Push Notifications
// @route   POST /api/v1/education/device-token
// @access  Public or Protected Student
const registerDeviceToken = async (req, res) => {
  try {
    const { fcmToken, platform = 'ANDROID', deviceName = '' } = req.body;
    if (!fcmToken) {
      return res.status(400).json({ success: false, message: 'fcmToken is required' });
    }

    const userId = req.educationStudent?.educationStudentId || 'GUEST';

    const tokenDoc = await DeviceToken.findOneAndUpdate(
      { fcmToken },
      { userId, platform, deviceName, lastActive: new Date() },
      { upsert: true, new: true }
    );

    return res.json({ success: true, data: tokenDoc, message: 'Device token registered successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getPublicInfo,
  registerStudent,
  loginStudent,
  logoutStudent,
  getStudentProfile,
  updateStudentProfile,
  getEducationDashboard,
  getEducationContent,
  getEducationContentById,
  getNotifications,
  registerDeviceToken,
};
