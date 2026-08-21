const LuckyDrawPrize = require('../models/LuckyDrawPrize');
const LuckyDraw = require('../models/LuckyDraw');
const LuckyDrawAuditLog = require('../models/LuckyDrawAuditLog');

/**
 * @desc Create a prize for a Lucky Draw
 * @route POST /api/v1/admin/lucky-draws/:id/prizes
 * @access Admin
 */
const createPrize = async (req, res) => {
  try {
    const { id } = req.params;
    const draw = await LuckyDraw.findById(id);

    if (!draw) {
      return res.status(404).json({ success: false, message: 'Lucky Draw not found' });
    }

    if (['CLOSED', 'DRAWING', 'WINNER_SELECTED', 'VERIFIED', 'COMPLETED'].includes(draw.status)) {
      return res.status(400).json({ success: false, message: 'Cannot add prizes to a closed or completed draw.' });
    }

    const { rank, title, description, image, prizeType, prizeValue, quantity, winnersRequired } = req.body;

    if (!title) {
      return res.status(400).json({ success: false, message: 'Prize title is required.' });
    }

    const prize = await LuckyDrawPrize.create({
      luckyDrawId: draw._id,
      rank: Number(rank || 1),
      title,
      description: description || '',
      image: image || '',
      prizeType: prizeType || 'CASH',
      prizeValue: Number(prizeValue || 0),
      quantity: Number(quantity || 1),
      winnersRequired: Number(winnersRequired || 1),
    });

    await LuckyDrawAuditLog.create({
      luckyDrawId: draw._id,
      action: 'PRIZE_ADDED',
      performedBy: req.admin ? req.admin.adminId || req.admin.email : 'ADMIN',
      metadata: { prizeId: prize._id, title },
    });

    return res.status(201).json({ success: true, message: 'Prize added successfully', data: prize });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc Get all prizes for a Lucky Draw
 * @route GET /api/v1/admin/lucky-draws/:id/prizes or GET /api/v1/user/lucky-draws/:id/prizes
 * @access Public / Admin
 */
const getPrizes = async (req, res) => {
  try {
    const { id } = req.params;
    const prizes = await LuckyDrawPrize.find({ luckyDrawId: id }).sort({ rank: 1 });
    return res.json({ success: true, data: prizes });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc Update a prize
 * @route PUT /api/v1/admin/lucky-draws/:id/prizes/:prizeId
 * @access Admin
 */
const updatePrize = async (req, res) => {
  try {
    const { id, prizeId } = req.params;
    const draw = await LuckyDraw.findById(id);

    if (!draw) {
      return res.status(404).json({ success: false, message: 'Lucky Draw not found' });
    }

    if (['CLOSED', 'DRAWING', 'WINNER_SELECTED', 'VERIFIED', 'COMPLETED'].includes(draw.status)) {
      return res.status(400).json({ success: false, message: 'Cannot edit prizes of a closed draw.' });
    }

    const prize = await LuckyDrawPrize.findOne({ _id: prizeId, luckyDrawId: draw._id });
    if (!prize) {
      return res.status(404).json({ success: false, message: 'Prize not found' });
    }

    const fields = ['rank', 'title', 'description', 'image', 'prizeType', 'prizeValue', 'quantity', 'winnersRequired'];
    fields.forEach((f) => {
      if (req.body[f] !== undefined) prize[f] = req.body[f];
    });

    await prize.save();

    await LuckyDrawAuditLog.create({
      luckyDrawId: draw._id,
      action: 'PRIZE_UPDATED',
      performedBy: req.admin ? req.admin.adminId || req.admin.email : 'ADMIN',
      metadata: { prizeId: prize._id },
    });

    return res.json({ success: true, message: 'Prize updated', data: prize });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc Delete a prize
 * @route DELETE /api/v1/admin/lucky-draws/:id/prizes/:prizeId
 * @access Admin
 */
const deletePrize = async (req, res) => {
  try {
    const { id, prizeId } = req.params;
    const draw = await LuckyDraw.findById(id);

    if (!draw) {
      return res.status(404).json({ success: false, message: 'Lucky Draw not found' });
    }

    if (['CLOSED', 'DRAWING', 'WINNER_SELECTED', 'VERIFIED', 'COMPLETED'].includes(draw.status)) {
      return res.status(400).json({ success: false, message: 'Cannot delete prizes of a closed draw.' });
    }

    const prize = await LuckyDrawPrize.findOneAndDelete({ _id: prizeId, luckyDrawId: draw._id });
    if (!prize) {
      return res.status(404).json({ success: false, message: 'Prize not found' });
    }

    await LuckyDrawAuditLog.create({
      luckyDrawId: draw._id,
      action: 'PRIZE_DELETED',
      performedBy: req.admin ? req.admin.adminId || req.admin.email : 'ADMIN',
      metadata: { prizeId },
    });

    return res.json({ success: true, message: 'Prize deleted' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createPrize,
  getPrizes,
  updatePrize,
  deletePrize,
};
