const LuckyDrawAuditLog = require('../models/LuckyDrawAuditLog');

/**
 * @desc Retrieve write-only audit logs for Lucky Draw module
 * @route GET /api/v1/admin/lucky-draws/audit-logs
 * @access Admin
 */
const getAuditLogs = async (req, res) => {
  try {
    const { luckyDrawId, action, page = 1, limit = 50 } = req.query;

    const query = {};
    if (luckyDrawId) {
      query.luckyDrawId = luckyDrawId;
    }
    if (action) {
      query.action = action;
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await LuckyDrawAuditLog.countDocuments(query);
    const logs = await LuckyDrawAuditLog.find(query)
      .populate('luckyDrawId', 'title slug')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    return res.json({
      success: true,
      data: logs,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / limit) || 1,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAuditLogs,
};
