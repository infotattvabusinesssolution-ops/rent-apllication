const dotenv = require('dotenv');
dotenv.config({ path: 'e:/infotatwaa-project/home-Sccoter-project/backend/.env' });
const connectDB = require('../src/config/db');
const Advertisement = require('../src/models/Advertisement');

const clearMockAds = async () => {
  try {
    await connectDB();
    console.log('Connected to DB...');

    // Delete mock sample ads by adId or posterName
    const result = await Advertisement.deleteMany({
      $or: [
        { adId: { $in: ['AD1024', 'AD1025', 'AD1026', 'AD1027', 'AD1028', 'AD1029', 'AD4304'] } },
        { posterName: 'Hoskote Realties' },
        { posterName: 'Gyana Prakash' },
      ],
    });

    console.log(`Deleted ${result.deletedCount} mock advertisement documents from MongoDB.`);
    process.exit(0);
  } catch (err) {
    console.error('Error clearing mock ads:', err);
    process.exit(1);
  }
};

clearMockAds();
