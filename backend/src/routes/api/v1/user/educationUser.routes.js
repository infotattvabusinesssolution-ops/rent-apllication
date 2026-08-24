const express = require('express');
const router = express.Router();
const {
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
} = require('../../../../controllers/educationStudentController');
const { protectEducationStudent } = require('../../../../middleware/educationAuthMiddleware');

// Public Information & Authentication
router.get('/public-info', getPublicInfo);
router.post('/auth/register', registerStudent);
router.post('/auth/login', loginStudent);
router.post('/auth/logout', protectEducationStudent, logoutStudent);

// Student Profile
router.get('/profile', protectEducationStudent, getStudentProfile);
router.put('/profile', protectEducationStudent, updateStudentProfile);

// Dashboard Feed & Content Discovery
router.get('/dashboard', getEducationDashboard);
router.get('/content', getEducationContent);
router.get('/content/:id', getEducationContentById);

// Notifications & FCM Token
router.get('/notifications', getNotifications);
router.post('/device-token', registerDeviceToken);

module.exports = router;
