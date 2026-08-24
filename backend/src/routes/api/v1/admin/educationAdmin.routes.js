const express = require('express');
const router = express.Router();
const {
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
} = require('../../../../controllers/educationAdminController');
const { uploadMedia } = require('../../../../middleware/uploadMiddleware');

// Dashboard
router.get('/dashboard', getEducationAdminDashboard);

// Student Directory Management
router.get('/students', getStudents);
router.get('/students/:id', getStudentById);
router.put('/students/:id', updateStudent);
router.post('/students/:id/block', blockStudent);
router.post('/students/:id/unblock', unblockStudent);

// Content Management (Supports Text, Banner, Video, PDF Document, Link)
router.get('/content', getContentList);
router.post('/content', uploadMedia.single('media'), createContent);
router.get('/content/:id', getContentById);
router.put('/content/:id', uploadMedia.single('media'), updateContent);
router.delete('/content/:id', deleteContent);
router.post('/content/:id/publish', publishContent);
router.post('/content/:id/unpublish', unpublishContent);

// Notifications Management
router.get('/notifications', getNotifications);
router.post('/notifications', uploadMedia.single('media'), createNotification);

// Engagement Reports & Analytics
router.get('/reports', getEducationReports);

module.exports = router;
