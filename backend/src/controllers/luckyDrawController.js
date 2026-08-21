const LuckyDraw = require('../models/LuckyDraw');
const LuckyDrawPrize = require('../models/LuckyDrawPrize');
const LuckyDrawEntry = require('../models/LuckyDrawEntry');
const LuckyDrawOrder = require('../models/LuckyDrawOrder');
const LuckyDrawResult = require('../models/LuckyDrawResult');
const LuckyDrawAuditLog = require('../models/LuckyDrawAuditLog');

// Helper to generate slug from title
const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
};

/**
 * @desc Create a new Lucky Draw campaign
 * @route POST /api/v1/admin/lucky-draws
 * @access Admin
 */
const createLuckyDraw = async (req, res) => {
  try {
    const {
      title,
      shortDescription,
      description,
      bannerImage,
      thumbnailImage,
      entryPrice,
      currency,
      maxEntries,
      maxEntriesPerUser,
      startDate,
      endDate,
      drawDate,
      isFeatured,
      showOnHomepage,
      rules,
      terms,
    } = req.body;

    if (!title || entryPrice === undefined || !maxEntries || !startDate || !endDate || !drawDate) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields.' });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const draw = new Date(drawDate);

    if (start >= end || end > draw) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed: Start Date < End Date <= Draw Date.',
      });
    }

    let baseSlug = slugify(title);
    let slug = baseSlug;
    let count = 1;
    while (await LuckyDraw.findOne({ slug })) {
      slug = `${baseSlug}-${count++}`;
    }

    const now = new Date();
    let initialStatus = LuckyDraw.LUCKY_DRAW_STATUS.DRAFT;
    if (now >= start && now < end) {
      initialStatus = LuckyDraw.LUCKY_DRAW_STATUS.ACTIVE;
    } else if (now < start) {
      initialStatus = LuckyDraw.LUCKY_DRAW_STATUS.UPCOMING;
    }

    const luckyDraw = await LuckyDraw.create({
      title,
      slug,
      shortDescription: shortDescription || '',
      description: description || '',
      bannerImage: bannerImage || '',
      thumbnailImage: thumbnailImage || '',
      entryPrice: Number(entryPrice),
      currency: currency || 'INR',
      maxEntries: Number(maxEntries),
      maxEntriesPerUser: Number(maxEntriesPerUser || 5),
      startDate: start,
      endDate: end,
      drawDate: draw,
      status: initialStatus,
      isPublished: true,
      isFeatured: Boolean(isFeatured),
      showOnHomepage: showOnHomepage !== undefined ? Boolean(showOnHomepage) : true,
      rules: Array.isArray(rules) ? rules : [],
      terms: Array.isArray(terms) ? terms : [],
      createdBy: req.admin ? req.admin.adminId || req.admin._id.toString() : 'SUPER_ADMIN',
    });

    await LuckyDrawAuditLog.create({
      luckyDrawId: luckyDraw._id,
      action: 'DRAW_CREATED',
      performedBy: req.admin ? req.admin.adminId || req.admin.email : 'ADMIN',
      metadata: { title, entryPrice, maxEntries },
    });

    return res.status(201).json({
      success: true,
      message: 'Lucky Draw campaign created successfully',
      data: luckyDraw,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc Get all Lucky Draws with pagination & status filters
 * @route GET /api/v1/admin/lucky-draws or GET /api/v1/user/lucky-draws
 * @access Admin / Public User
 */
const getLuckyDraws = async (req, res) => {
  try {
    const { status, isFeatured, isPublished, search, page = 1, limit = 20 } = req.query;
    const query = {};

    // Public users only see published draws unless admin requested
    if (!req.admin) {
      query.isPublished = true;
    } else if (isPublished !== undefined) {
      query.isPublished = isPublished === 'true';
    }

    if (status) {
      query.status = status;
    }
    if (isFeatured !== undefined) {
      query.isFeatured = isFeatured === 'true';
    }

    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await LuckyDraw.countDocuments(query);
    const draws = await LuckyDraw.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    // Attach prize count for each draw
    const formattedDraws = await Promise.all(
      draws.map(async (draw) => {
        const prizeCount = await LuckyDrawPrize.countDocuments({ luckyDrawId: draw._id });
        const obj = draw.toObject();
        obj.prizeCount = prizeCount;
        return obj;
      })
    );

    return res.json({
      success: true,
      data: formattedDraws,
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

/**
 * @desc Get single Lucky Draw details with prizes & user entry count
 * @route GET /api/v1/admin/lucky-draws/:id or GET /api/v1/user/lucky-draws/:id
 * @access Admin / Public User
 */
const getLuckyDrawById = async (req, res) => {
  try {
    const { id } = req.params;
    let luckyDraw;

    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      luckyDraw = await LuckyDraw.findById(id);
    } else {
      luckyDraw = await LuckyDraw.findOne({ slug: id });
    }

    if (!luckyDraw) {
      return res.status(404).json({ success: false, message: 'Lucky Draw not found' });
    }

    const prizes = await LuckyDrawPrize.find({ luckyDrawId: luckyDraw._id }).sort({ rank: 1 });

    let userEntriesCount = 0;
    let userTickets = [];
    if (req.user) {
      const userEntryDocs = await LuckyDrawEntry.find({
        luckyDrawId: luckyDraw._id,
        userId: req.user.userId || req.user._id.toString(),
      });
      userEntriesCount = userEntryDocs.length;
      userTickets = userEntryDocs.map((e) => ({
        ticketNumber: e.ticketNumber,
        status: e.status,
        isWinner: e.isWinner,
        purchasedAt: e.purchasedAt,
      }));
    }

    // Result document if available
    let result = null;
    if (['WINNER_SELECTED', 'VERIFIED', 'PUBLISHED', 'COMPLETED'].includes(luckyDraw.status)) {
      result = await LuckyDrawResult.findOne({ luckyDrawId: luckyDraw._id });
    }

    return res.json({
      success: true,
      data: {
        ...luckyDraw.toObject(),
        prizes,
        userEntriesCount,
        userTickets,
        result,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc Update Lucky Draw details
 * @route PUT /api/v1/admin/lucky-draws/:id
 * @access Admin
 */
const updateLuckyDraw = async (req, res) => {
  try {
    const { id } = req.params;
    const luckyDraw = await LuckyDraw.findById(id);

    if (!luckyDraw) {
      return res.status(404).json({ success: false, message: 'Lucky Draw not found' });
    }

    if (['CLOSED', 'DRAWING', 'WINNER_SELECTED', 'VERIFIED', 'COMPLETED'].includes(luckyDraw.status)) {
      return res.status(400).json({
        success: false,
        message: 'Locked: Cannot update a closed or completed lucky draw.',
      });
    }

    const fields = [
      'title',
      'shortDescription',
      'description',
      'bannerImage',
      'thumbnailImage',
      'entryPrice',
      'currency',
      'maxEntries',
      'maxEntriesPerUser',
      'startDate',
      'endDate',
      'drawDate',
      'isFeatured',
      'showOnHomepage',
      'rules',
      'terms',
    ];

    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        luckyDraw[field] = req.body[field];
      }
    });

    if (req.body.title && req.body.title !== luckyDraw.title) {
      luckyDraw.slug = slugify(req.body.title);
    }

    await luckyDraw.save();

    await LuckyDrawAuditLog.create({
      luckyDrawId: luckyDraw._id,
      action: 'DRAW_UPDATED',
      performedBy: req.admin ? req.admin.adminId || req.admin.email : 'ADMIN',
      metadata: req.body,
    });

    return res.json({ success: true, message: 'Lucky Draw updated successfully', data: luckyDraw });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc Publish a Lucky Draw
 * @route POST /api/v1/admin/lucky-draws/:id/publish
 * @access Admin
 */
const publishLuckyDraw = async (req, res) => {
  try {
    const luckyDraw = await LuckyDraw.findById(req.params.id);
    if (!luckyDraw) return res.status(404).json({ success: false, message: 'Lucky Draw not found' });

    luckyDraw.isPublished = true;
    await luckyDraw.save();

    await LuckyDrawAuditLog.create({
      luckyDrawId: luckyDraw._id,
      action: 'DRAW_PUBLISHED',
      performedBy: req.admin ? req.admin.adminId || req.admin.email : 'ADMIN',
    });

    return res.json({ success: true, message: 'Lucky Draw published', data: luckyDraw });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc Unpublish a Lucky Draw
 * @route POST /api/v1/admin/lucky-draws/:id/unpublish
 * @access Admin
 */
const unpublishLuckyDraw = async (req, res) => {
  try {
    const luckyDraw = await LuckyDraw.findById(req.params.id);
    if (!luckyDraw) return res.status(404).json({ success: false, message: 'Lucky Draw not found' });

    luckyDraw.isPublished = false;
    await luckyDraw.save();

    await LuckyDrawAuditLog.create({
      luckyDrawId: luckyDraw._id,
      action: 'DRAW_UNPUBLISHED',
      performedBy: req.admin ? req.admin.adminId || req.admin.email : 'ADMIN',
    });

    return res.json({ success: true, message: 'Lucky Draw unpublished', data: luckyDraw });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc Manually close a Lucky Draw (Freezes entries)
 * @route POST /api/v1/admin/lucky-draws/:id/close
 * @access Admin
 */
const closeLuckyDraw = async (req, res) => {
  try {
    const luckyDraw = await LuckyDraw.findById(req.params.id);
    if (!luckyDraw) return res.status(404).json({ success: false, message: 'Lucky Draw not found' });

    if (luckyDraw.status === LuckyDraw.LUCKY_DRAW_STATUS.CLOSED) {
      return res.status(400).json({ success: false, message: 'Lucky draw is already closed.' });
    }

    luckyDraw.status = LuckyDraw.LUCKY_DRAW_STATUS.CLOSED;
    await luckyDraw.save();

    await LuckyDrawAuditLog.create({
      luckyDrawId: luckyDraw._id,
      action: 'DRAW_CLOSED_MANUAL',
      performedBy: req.admin ? req.admin.adminId || req.admin.email : 'ADMIN',
    });

    return res.json({ success: true, message: 'Lucky Draw closed successfully. Entries are now frozen.', data: luckyDraw });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc Cancel a Lucky Draw
 * @route POST /api/v1/admin/lucky-draws/:id/cancel
 * @access Admin
 */
const cancelLuckyDraw = async (req, res) => {
  try {
    const luckyDraw = await LuckyDraw.findById(req.params.id);
    if (!luckyDraw) return res.status(404).json({ success: false, message: 'Lucky Draw not found' });

    luckyDraw.status = LuckyDraw.LUCKY_DRAW_STATUS.CANCELLED;
    luckyDraw.isPublished = false;
    await luckyDraw.save();

    await LuckyDrawAuditLog.create({
      luckyDrawId: luckyDraw._id,
      action: 'DRAW_CANCELLED',
      performedBy: req.admin ? req.admin.adminId || req.admin.email : 'ADMIN',
    });

    return res.json({ success: true, message: 'Lucky Draw cancelled', data: luckyDraw });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc Executive Dashboard KPIs for Lucky Draw Module
 * @route GET /api/v1/admin/lucky-draws/stats/overview
 * @access Admin
 */
const getLuckyDrawStats = async (req, res) => {
  try {
    const totalDraws = await LuckyDraw.countDocuments();
    const activeDraws = await LuckyDraw.countDocuments({ status: LuckyDraw.LUCKY_DRAW_STATUS.ACTIVE });
    const upcomingDraws = await LuckyDraw.countDocuments({ status: LuckyDraw.LUCKY_DRAW_STATUS.UPCOMING });
    const completedDraws = await LuckyDraw.countDocuments({
      status: { $in: [LuckyDraw.LUCKY_DRAW_STATUS.COMPLETED, LuckyDraw.LUCKY_DRAW_STATUS.PUBLISHED, LuckyDraw.LUCKY_DRAW_STATUS.VERIFIED] },
    });

    const totalEntries = await LuckyDrawEntry.countDocuments({ status: LuckyDrawEntry.ENTRY_STATUS.VALID });
    
    const paidOrders = await LuckyDrawOrder.aggregate([
      { $match: { paymentStatus: 'PAID' } },
      { $group: { _id: null, totalRevenue: { $sum: '$amount' } } },
    ]);
    const totalRevenue = paidOrders.length > 0 ? paidOrders[0].totalRevenue : 0;

    const totalWinners = await LuckyDrawEntry.countDocuments({ isWinner: true });
    const pendingVerificationWinners = await LuckyDrawResult.countDocuments({ status: LuckyDrawResult.RESULT_STATUS.GENERATED });

    return res.json({
      success: true,
      data: {
        totalDraws,
        activeDraws,
        upcomingDraws,
        completedDraws,
        totalEntries,
        totalRevenue,
        totalWinners,
        pendingVerificationWinners,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createLuckyDraw,
  getLuckyDraws,
  getLuckyDrawById,
  updateLuckyDraw,
  publishLuckyDraw,
  unpublishLuckyDraw,
  closeLuckyDraw,
  cancelLuckyDraw,
  getLuckyDrawStats,
};
