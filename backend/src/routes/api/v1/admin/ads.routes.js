const express = require('express');
const router = express.Router();
const upload = require('../../../../middleware/uploadMiddleware');
const {
  getAds,
  getPendingAds,
  getAdById,
  approveAd,
  rejectAd,
  updateBadges,
  updateLuckyDrawStatus,
  uploadLuckyDrawImage,
  unpublishAd,
  deleteAd,
} = require('../../../../controllers/adsController');
const { protectAdmin } = require('../../../../middleware/authMiddleware');

router.get('/', protectAdmin, getAds);
router.get('/pending', protectAdmin, getPendingAds);
router.get('/:id', protectAdmin, getAdById);
router.patch('/:id/approve', protectAdmin, approveAd);
router.patch('/:id/reject', protectAdmin, rejectAd);
router.patch('/:id/badges', protectAdmin, updateBadges);
router.patch('/:id/lucky-draw', protectAdmin, updateLuckyDrawStatus);
router.post('/:id/lucky-draw-image', protectAdmin, upload.single('image'), uploadLuckyDrawImage);
router.patch('/:id/unpublish', protectAdmin, unpublishAd);
router.delete('/:id', protectAdmin, deleteAd);

module.exports = router;
