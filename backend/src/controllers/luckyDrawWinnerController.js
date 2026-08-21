const LuckyDraw = require('../models/LuckyDraw');
const LuckyDrawResult = require('../models/LuckyDrawResult');
const LuckyDrawEntry = require('../models/LuckyDrawEntry');
const LuckyDrawAuditLog = require('../models/LuckyDrawAuditLog');
const Notification = require('../models/Notification');
const { selectLuckyDrawWinners } = require('../services/luckyDrawWinnerService');

/**
 * @desc Admin triggers automated system draw execution
 * @route POST /api/v1/admin/lucky-draws/:id/run-draw
 * @access Admin
 */
const startDraw = async (req, res) => {
  try {
    const { id } = req.params;
    const adminId = req.admin ? req.admin.adminId || req.admin.email : 'ADMIN';

    const resultDoc = await selectLuckyDrawWinners(id, adminId);

    return res.json({
      success: true,
      message: 'System draw executed successfully using cryptographically secure selection.',
      data: resultDoc,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * @desc Get draw result details
 * @route GET /api/v1/admin/lucky-draws/:id/result or GET /api/v1/user/lucky-draws/:id/result
 * @access Public / Admin
 */
const getDrawResult = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await LuckyDrawResult.findOne({ luckyDrawId: id });

    if (!result) {
      return res.status(404).json({ success: false, message: 'Result not found or draw has not been executed yet.' });
    }

    return res.json({ success: true, data: result });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc Admin verifies the system draw result
 * @route POST /api/v1/admin/lucky-draws/:id/verify-result
 * @access Admin
 */
const verifyResult = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await LuckyDrawResult.findOne({ luckyDrawId: id });

    if (!result) {
      return res.status(404).json({ success: false, message: 'Result not found.' });
    }

    result.status = LuckyDrawResult.RESULT_STATUS.VERIFIED;
    await result.save();

    const draw = await LuckyDraw.findById(id);
    if (draw) {
      draw.status = LuckyDraw.LUCKY_DRAW_STATUS.VERIFIED;
      await draw.save();
    }

    await LuckyDrawAuditLog.create({
      luckyDrawId: id,
      action: 'RESULT_VERIFIED_ADMIN',
      performedBy: req.admin ? req.admin.adminId || req.admin.email : 'ADMIN',
      metadata: { resultId: result._id },
    });

    return res.json({ success: true, message: 'Winner result verified by admin', data: result });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc Admin publishes the verified winner result to the public
 * @route POST /api/v1/admin/lucky-draws/:id/publish-result
 * @access Admin
 */
const publishResult = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await LuckyDrawResult.findOne({ luckyDrawId: id });

    if (!result) {
      return res.status(404).json({ success: false, message: 'Result not found.' });
    }

    result.status = LuckyDrawResult.RESULT_STATUS.PUBLISHED;
    result.publishedAt = new Date();
    await result.save();

    const draw = await LuckyDraw.findById(id);
    if (draw) {
      draw.status = LuckyDraw.LUCKY_DRAW_STATUS.COMPLETED;
      await draw.save();
    }

    // Send notifications to winners
    for (const w of result.winners) {
      await Notification.create({
        recipient: w.userId,
        sender: 'SYSTEM',
        title: '🎉 Congratulations! You Won the Lucky Draw!',
        message: `Your ticket ${w.ticketNumber} won '${w.prizeTitle}' in '${draw ? draw.title : 'Lucky Draw'}'.`,
        type: 'SYSTEM',
        read: false,
      });
    }

    await LuckyDrawAuditLog.create({
      luckyDrawId: id,
      action: 'RESULT_PUBLISHED_ADMIN',
      performedBy: req.admin ? req.admin.adminId || req.admin.email : 'ADMIN',
      metadata: { winnersCount: result.winners.length },
    });

    return res.json({ success: true, message: 'Winner result officially published to participants!', data: result });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc Get all winners across lucky draws
 * @route GET /api/v1/admin/lucky-draws/winners or GET /api/v1/user/lucky-draws/my-winners
 * @access Public / Admin / User
 */
const getWinners = async (req, res) => {
  try {
    const query = { status: LuckyDrawEntry.ENTRY_STATUS.WINNER };
    if (req.user && !req.admin) {
      query.userId = req.user.userId || req.user._id.toString();
    }

    const winningEntries = await LuckyDrawEntry.find(query)
      .populate('luckyDrawId', 'title slug bannerImage drawDate')
      .populate('prizeId', 'title prizeType prizeValue image rank')
      .sort({ winnerSelectedAt: -1 });

    return res.json({ success: true, data: winningEntries });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  startDraw,
  getDrawResult,
  verifyResult,
  publishResult,
  getWinners,
};
