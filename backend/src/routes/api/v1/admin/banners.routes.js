const express = require('express');
const router = express.Router();
const {
  getBanners,
  approveBanner,
  rejectBanner,
  createBanner,
  deleteBanner,
} = require('../../../../controllers/bannerController');
const { protectAdmin } = require('../../../../middleware/authMiddleware');
const upload = require('../../../../middleware/uploadMiddleware');

router.get('/', protectAdmin, getBanners);
router.post('/', protectAdmin, upload.single('image'), createBanner);
router.patch('/:id/approve', protectAdmin, approveBanner);
router.patch('/:id/reject', protectAdmin, rejectBanner);
router.delete('/:id', protectAdmin, deleteBanner);

module.exports = router;
