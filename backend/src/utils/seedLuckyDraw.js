const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const connectDB = require('../config/db');
const LuckyDraw = require('../models/LuckyDraw');
const LuckyDrawPrize = require('../models/LuckyDrawPrize');

const seedLuckyDrawData = async () => {
  try {
    await connectDB();

    console.log('Clearing existing sample lucky draw data...');
    await LuckyDraw.deleteMany({ slug: 'bumper-scooter-draw-2026' });

    const now = new Date();
    const startDate = new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000); // Started 1 day ago
    const endDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);   // Ends in 7 days
    const drawDate = new Date(now.getTime() + 8 * 24 * 60 * 60 * 1000);  // Draw in 8 days

    const draw = await LuckyDraw.create({
      title: 'Win ₹50,000 Electric Scooter Bumper Draw',
      slug: 'bumper-scooter-draw-2026',
      shortDescription: 'Participate in our official platform bumper draw. Win cash rewards & high-speed electric scooters!',
      description: 'The Home & Scooter Platform Bumper Draw 2026 is officially live. Purchase your entries to receive verified ticket numbers. System algorithm automatically selects winners upon closing.',
      bannerImage: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&q=80&w=1200',
      thumbnailImage: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&q=80&w=400',
      entryPrice: 99,
      currency: 'INR',
      maxEntries: 10000,
      maxEntriesPerUser: 5,
      totalEntries: 1245,
      startDate,
      endDate,
      drawDate,
      status: LuckyDraw.LUCKY_DRAW_STATUS.ACTIVE,
      isPublished: true,
      isFeatured: true,
      showOnHomepage: true,
      rules: [
        'Each paid entry gives 1 valid ticket number.',
        'Maximum 5 entries allowed per user account.',
        'Winner is automatically selected by cryptographically secure system algorithm.',
        'Admin cannot manually select or alter winners.',
      ],
      terms: [
        'Entries are non-refundable once payment is completed.',
        'Winner verification must be completed within 14 days of announcement.',
      ],
      createdBy: 'SUPER_ADMIN',
    });

    await LuckyDrawPrize.create([
      {
        luckyDrawId: draw._id,
        rank: 1,
        title: 'First Prize - ₹50,000 Bumper Cash',
        description: 'Direct bank transfer or check payment',
        prizeType: 'CASH',
        prizeValue: 50000,
        quantity: 1,
        winnersRequired: 1,
      },
      {
        luckyDrawId: draw._id,
        rank: 2,
        title: 'Second Prize - Brand New Electric Scooter',
        description: 'High-speed 80km/h range EV Scooter',
        prizeType: 'SCOOTER',
        prizeValue: 75000,
        quantity: 1,
        winnersRequired: 1,
      },
      {
        luckyDrawId: draw._id,
        rank: 3,
        title: 'Third Prize - ₹5,000 Shopping Vouchers',
        description: 'Vouchers valid on partner outlets',
        prizeType: 'VOUCHER',
        prizeValue: 5000,
        quantity: 3,
        winnersRequired: 3,
      },
    ]);

    console.log('Sample Lucky Draw data seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedLuckyDrawData();
