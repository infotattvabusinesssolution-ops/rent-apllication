const mongoose = require('mongoose');

const educationStudentSchema = new mongoose.Schema(
  {
    educationStudentId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    userId: {
      type: String,
      default: function () {
        return this.educationStudentId;
      },
    },
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
    },
    mobile: {
      type: String,
      required: [true, 'Mobile number is required'],
      unique: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: '',
    },
    educationLevel: {
      type: String,
      enum: ['10TH', '11TH', '12TH', 'DIPLOMA', 'UG', 'PG', 'JOB_SEEKER', 'OTHER'],
      default: 'OTHER',
    },
    classStandard: {
      type: String,
      default: '',
    },
    course: {
      type: String,
      default: '',
    },
    place: {
      type: String,
      default: '',
    },
    profileImage: {
      type: String,
      default: '',
    },
    passwordHash: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'BLOCKED', 'INACTIVE'],
      default: 'ACTIVE',
      index: true,
    },
    blockedReason: {
      type: String,
      default: null,
    },
    lastLogin: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

educationStudentSchema.index({ fullName: 'text', mobile: 'text', educationStudentId: 'text' });

module.exports = mongoose.model('EducationStudent', educationStudentSchema);
