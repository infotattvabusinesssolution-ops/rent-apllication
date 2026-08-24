const mongoose = require('mongoose');

const educationContentSchema = new mongoose.Schema(
  {
    contentId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    category: {
      type: String,
      enum: [
        'EDUCATION_UPDATE',
        'COURSE',
        'ADMISSION',
        'CAREER',
        'EXAM',
        'SCHOLARSHIP',
        'ANNOUNCEMENT',
      ],
      required: true,
      index: true,
    },
    contentType: {
      type: String,
      enum: ['TEXT', 'BANNER', 'VIDEO', 'DOCUMENT', 'LINK'],
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    shortDescription: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
    mediaUrl: {
      type: String,
      default: '',
    },
    thumbnailUrl: {
      type: String,
      default: '',
    },
    documentUrl: {
      type: String,
      default: '',
    },
    externalUrl: {
      type: String,
      default: '',
    },
    displayOrder: {
      type: Number,
      default: 0,
    },
    targetAudience: {
      type: String,
      enum: ['ALL', '10TH', '11TH', '12TH', 'DIPLOMA', 'UG', 'PG', 'JOB_SEEKER'],
      default: 'ALL',
      index: true,
    },
    startDate: {
      type: Date,
      default: null,
    },
    endDate: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: ['DRAFT', 'ACTIVE', 'INACTIVE'],
      default: 'DRAFT',
      index: true,
    },
    createdBy: {
      type: String,
      default: 'ADMIN',
    },
    viewsCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

educationContentSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('EducationContent', educationContentSchema);
