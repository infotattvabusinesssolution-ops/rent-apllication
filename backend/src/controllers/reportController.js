const Report = require('../models/Report');
const Advertisement = require('../models/Advertisement');
const { REPORT_STATUS, AD_STATUS } = require('../config/constants');

// @desc    Get flagged reports
// @route   GET /api/v1/admin/reports
// @access  Private (Admin)
const getReports = async (req, res) => {
  try {
    const { status, search } = req.query;
    const query = {};

    if (status && status !== 'ALL') {
      query.status = status;
    }
    if (search) {
      const q = search.trim();
      query.$or = [
        { adTitle: { $regex: q, $options: 'i' } },
        { sellerName: { $regex: q, $options: 'i' } },
        { reporterName: { $regex: q, $options: 'i' } },
        { reportReason: { $regex: q, $options: 'i' } },
      ];
    }

    const reports = await Report.find(query).sort({ createdAt: -1 });
    const formatted = reports.map((r) => {
      const obj = r.toObject();
      return { ...obj, id: obj.reportId };
    });

    return res.json({ success: true, data: formatted, total: formatted.length });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get report detail by ID
// @route   GET /api/v1/admin/reports/:id
// @access  Private (Admin)
const getReportById = async (req, res) => {
  try {
    const report = await Report.findOne({ $or: [{ reportId: req.params.id }, { _id: req.params.id }] });
    if (!report) {
      return res.status(404).json({ success: false, message: 'Report not found' });
    }

    const obj = report.toObject();
    return res.json({ success: true, ...obj, id: obj.reportId });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Dismiss report
// @route   POST /api/v1/admin/reports/:id/dismiss
// @access  Private (Admin)
const dismissReport = async (req, res) => {
  try {
    const report = await Report.findOne({ $or: [{ reportId: req.params.id }, { _id: req.params.id }] });
    if (!report) {
      return res.status(404).json({ success: false, message: 'Report not found' });
    }

    report.status = REPORT_STATUS.DISMISSED;
    await report.save();

    return res.json({ success: true, message: 'Report dismissed successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Take down ad from report
// @route   POST /api/v1/admin/reports/:id/takedown
// @access  Private (Admin)
const takeDownAdFromReport = async (req, res) => {
  try {
    const report = await Report.findOne({ $or: [{ reportId: req.params.id }, { _id: req.params.id }] });
    if (!report) {
      return res.status(404).json({ success: false, message: 'Report not found' });
    }

    report.status = REPORT_STATUS.TAKEN_DOWN;
    await report.save();

    // Automatically unpublish reported advertisement
    await Advertisement.findOneAndUpdate(
      { $or: [{ adId: report.adId }, { _id: report.adId }] },
      { status: AD_STATUS.UNPUBLISHED, promoTag: 'Taken Down' }
    );

    return res.json({ success: true, message: 'Advertisement taken down and report resolved' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getReports,
  getReportById,
  dismissReport,
  takeDownAdFromReport,
};
