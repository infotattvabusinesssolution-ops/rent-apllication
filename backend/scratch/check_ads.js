const dotenv = require('dotenv');
dotenv.config({ path: '../.env' });
const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://infotattvabusinesssolution_db_user:04fVmFxtMblpE78o@ac-ekyirqk-shard-00-00.tvhknen.mongodb.net:27017,ac-ekyirqk-shard-00-01.tvhknen.mongodb.net:27017,ac-ekyirqk-shard-00-02.tvhknen.mongodb.net:27017/?ssl=true&replicaSet=atlas-gqe9ui-shard-0&authSource=admin&appName=Cluster0';

mongoose.connect(MONGO_URI).then(async () => {
  const Advertisement = require('../src/models/Advertisement');
  const ads = await Advertisement.find({}).sort({ createdAt: -1 }).limit(10);
  console.log(`TOTAL ADS IN MONGO: ${ads.length}`);
  ads.forEach((a) => {
    console.log(`- ID: ${a.adId} | Title: ${a.title} | Status: ${a.status} | Category: ${a.category} | Poster: ${a.posterName} (${a.posterId})`);
  });
  process.exit(0);
}).catch((err) => {
  console.error(err);
  process.exit(1);
});
