const crypto = require('crypto');
const LuckyDraw = require('../models/LuckyDraw');
const LuckyDrawPrize = require('../models/LuckyDrawPrize');
const LuckyDrawEntry = require('../models/LuckyDrawEntry');
const LuckyDrawResult = require('../models/LuckyDrawResult');
const LuckyDrawAuditLog = require('../models/LuckyDrawAuditLog');
const User = require('../models/User');

/**
 * Cryptographically Secure Winner Selection Engine for Lucky Draw.
 * Uses Node.js crypto.randomInt (CSRNG) to pick winning ticket entries.
 * 
 * @param {string} luckyDrawId MongoDB ObjectId string of the draw
 * @param {string} executedBy User ID or 'SYSTEM'
 * @returns {Promise<Object>} Created LuckyDrawResult document
 */
const selectLuckyDrawWinners = async (luckyDrawId, executedBy = 'SYSTEM') => {
  // 1. Validate draw existence
  const draw = await LuckyDraw.findById(luckyDrawId);
  if (!draw) {
    throw new Error('Lucky Draw campaign not found');
  }

  // 2. Validate draw status is CLOSED
  if (draw.status !== LuckyDraw.LUCKY_DRAW_STATUS.CLOSED) {
    if (draw.status === LuckyDraw.LUCKY_DRAW_STATUS.WINNER_SELECTED || draw.status === LuckyDraw.LUCKY_DRAW_STATUS.VERIFIED || draw.status === LuckyDraw.LUCKY_DRAW_STATUS.COMPLETED) {
      throw new Error('The winner has already been selected for this lucky draw.');
    }
    throw new Error(`Draw cannot be executed because current status is '${draw.status}'. It must be CLOSED first.`);
  }

  // 3. Prevent duplicate draw execution
  const existingResult = await LuckyDrawResult.findOne({ luckyDrawId: draw._id });
  if (existingResult) {
    throw new Error('System draw execution result already exists for this lucky draw.');
  }

  // 4. Retrieve all VALID entries for this draw
  const validEntries = await LuckyDrawEntry.find({
    luckyDrawId: draw._id,
    status: LuckyDrawEntry.ENTRY_STATUS.VALID,
  }).sort({ createdAt: 1 });

  if (validEntries.length === 0) {
    throw new Error('No valid entries exist for this lucky draw.');
  }

  // 5. Freeze eligible entry set & create SHA-256 verification hash
  const ticketList = validEntries.map((e) => e.ticketNumber);
  const snapshotData = {
    drawId: draw._id.toString(),
    totalEntries: validEntries.length,
    ticketNumbers: ticketList,
    timestamp: new Date().toISOString(),
  };

  const verificationHash = crypto
    .createHash('sha256')
    .update(JSON.stringify(snapshotData))
    .digest('hex');

  const randomReference = `CSRNG-${crypto.randomBytes(8).toString('hex').toUpperCase()}`;

  // 6. Fetch prizes sorted by rank
  const prizes = await LuckyDrawPrize.find({ luckyDrawId: draw._id }).sort({ rank: 1 });
  if (prizes.length === 0) {
    throw new Error('No prizes configured for this lucky draw.');
  }

  // 7. Perform Cryptographic Selection without replacement
  const availableIndices = Array.from({ length: validEntries.length }, (_, i) => i);
  const winnersList = [];

  for (const prize of prizes) {
    const requiredWinners = prize.winnersRequired || prize.quantity || 1;
    for (let count = 0; count < requiredWinners; count++) {
      if (availableIndices.length === 0) break; // No more unique entries available

      // Cryptographically secure integer index selection
      const cryptoRandomIndex = crypto.randomInt(0, availableIndices.length);
      const selectedPoolIndex = availableIndices.splice(cryptoRandomIndex, 1)[0];
      const winningEntry = validEntries[selectedPoolIndex];

      // Fetch winner user details for snapshot
      const user = await User.findOne({ userId: winningEntry.userId }).select('name phone email');

      winnersList.push({
        ticketNumber: winningEntry.ticketNumber,
        userId: winningEntry.userId,
        userName: user ? user.name : 'Participant',
        userPhone: user ? user.phone : '',
        prizeId: prize._id,
        prizeTitle: prize.title,
        selectedAt: new Date(),
        entryId: winningEntry._id,
      });
    }
  }

  // 8. Update selected entries in DB
  const winningEntryIds = winnersList.map((w) => w.entryId);
  const selectedTime = new Date();

  for (const w of winnersList) {
    await LuckyDrawEntry.findByIdAndUpdate(w.entryId, {
      status: LuckyDrawEntry.ENTRY_STATUS.WINNER,
      isWinner: true,
      prizeId: w.prizeId,
      winnerSelectedAt: selectedTime,
    });
  }

  // Update non-selected entries
  await LuckyDrawEntry.updateMany(
    {
      luckyDrawId: draw._id,
      status: LuckyDrawEntry.ENTRY_STATUS.VALID,
      _id: { $nin: winningEntryIds },
    },
    {
      status: LuckyDrawEntry.ENTRY_STATUS.NOT_SELECTED,
    }
  );

  // 9. Save LuckyDrawResult
  const resultDoc = await LuckyDrawResult.create({
    luckyDrawId: draw._id,
    totalEligibleEntries: validEntries.length,
    eligibleEntrySnapshot: snapshotData,
    winners: winnersList.map(({ entryId, ...rest }) => rest),
    randomProvider: 'NODE_CRYPTO_CSRNG',
    randomReference,
    verificationHash,
    executedAt: selectedTime,
    executedBy,
    status: LuckyDrawResult.RESULT_STATUS.GENERATED,
  });

  // 10. Update Lucky Draw status to WINNER_SELECTED
  draw.status = LuckyDraw.LUCKY_DRAW_STATUS.WINNER_SELECTED;
  await draw.save();

  // 11. Write Audit Log
  await LuckyDrawAuditLog.create({
    luckyDrawId: draw._id,
    action: 'WINNER_SELECTED_SYSTEM',
    performedBy: executedBy,
    metadata: {
      resultId: resultDoc._id,
      totalEligibleEntries: validEntries.length,
      winnersCount: winnersList.length,
      verificationHash,
    },
  });

  return resultDoc;
};

module.exports = {
  selectLuckyDrawWinners,
};
