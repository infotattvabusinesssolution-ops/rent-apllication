const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const EducationStudent = require('../models/EducationStudent');

const protectEducationStudent = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'super_secret_jwt_key_homescooter_2026'
      );

      const studentQuery = [{ educationStudentId: decoded.id }, { mobile: decoded.id }];
      if (mongoose.Types.ObjectId.isValid(decoded.id)) {
        studentQuery.push({ _id: decoded.id });
      }

      const student = await EducationStudent.findOne({ $or: studentQuery });

      if (!student) {
        return res.status(401).json({
          success: false,
          message: 'Student account not found',
        });
      }

      if (student.status === 'BLOCKED') {
        return res.status(403).json({
          success: false,
          code: 'STUDENT_BLOCKED',
          message: student.blockedReason || 'Your Education Desk account has been blocked by administration.',
        });
      }

      if (student.status === 'INACTIVE') {
        return res.status(403).json({
          success: false,
          code: 'STUDENT_INACTIVE',
          message: 'Your Education Desk account is currently inactive.',
        });
      }

      req.educationStudent = student;
      return next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired student session token',
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Education Desk authorization token required',
    });
  }
};

module.exports = { protectEducationStudent };
