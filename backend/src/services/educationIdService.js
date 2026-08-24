const EducationStudent = require('../models/EducationStudent');
const EducationContent = require('../models/EducationContent');
const EducationNotification = require('../models/EducationNotification');

/**
 * Generate automated Education Student ID: EDU-2026-00001
 */
const generateEducationStudentId = async () => {
  const year = new Date().getFullYear();
  const count = await EducationStudent.countDocuments();
  const nextNum = (count + 1).toString().padStart(5, '0');
  return `EDU-${year}-${nextNum}`;
};

/**
 * Generate automated Content ID: EDU-CNT-1001
 */
const generateEducationContentId = async () => {
  const count = await EducationContent.countDocuments();
  const nextNum = (count + 1001).toString();
  return `EDU-CNT-${nextNum}`;
};

/**
 * Generate automated Notification ID: EDU-NOTIF-5001
 */
const generateEducationNotificationId = async () => {
  const count = await EducationNotification.countDocuments();
  const nextNum = (count + 5001).toString();
  return `EDU-NOTIF-${nextNum}`;
};

module.exports = {
  generateEducationStudentId,
  generateEducationContentId,
  generateEducationNotificationId,
};
