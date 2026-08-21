const LuckyDraw = require('../models/LuckyDraw');
const LuckyDrawAuditLog = require('../models/LuckyDrawAuditLog');

/**
 * Checks and updates Lucky Draw statuses automatically based on start and end dates.
 * Transitions UPCOMING -> ACTIVE and ACTIVE -> CLOSED.
 */
const checkAndTransitionDrawStatuses = async () => {
  const now = new Date();

  try {
    // 1. Transition UPCOMING -> ACTIVE
    const upcomingDraws = await LuckyDraw.find({
      status: LuckyDraw.LUCKY_DRAW_STATUS.UPCOMING,
      isPublished: true,
      startDate: { $lte: now },
    });

    for (const draw of upcomingDraws) {
      draw.status = LuckyDraw.LUCKY_DRAW_STATUS.ACTIVE;
      await draw.save();

      await LuckyDrawAuditLog.create({
        luckyDrawId: draw._id,
        action: 'STATUS_AUTO_TRANSITION_ACTIVE',
        performedBy: 'SCHEDULER',
        metadata: { startDate: draw.startDate, transitionedAt: now },
      });
    }

    // 2. Transition ACTIVE -> CLOSED
    const activeDraws = await LuckyDraw.find({
      status: LuckyDraw.LUCKY_DRAW_STATUS.ACTIVE,
      endDate: { $lte: now },
    });

    for (const draw of activeDraws) {
      draw.status = LuckyDraw.LUCKY_DRAW_STATUS.CLOSED;
      await draw.save();

      await LuckyDrawAuditLog.create({
        luckyDrawId: draw._id,
        action: 'STATUS_AUTO_TRANSITION_CLOSED',
        performedBy: 'SCHEDULER',
        metadata: { endDate: draw.endDate, transitionedAt: now },
      });
    }
  } catch (error) {
    console.error('Error in luckyDrawScheduler:', error.message);
  }
};

/**
 * Initializes the background scheduler running every 60 seconds.
 */
const initLuckyDrawScheduler = () => {
  // Run once on boot
  checkAndTransitionDrawStatuses();

  // Run every 60 seconds
  setInterval(checkAndTransitionDrawStatuses, 60000);
};

module.exports = {
  checkAndTransitionDrawStatuses,
  initLuckyDrawScheduler,
};
