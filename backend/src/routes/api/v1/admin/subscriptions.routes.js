const express = require('express');
const router = express.Router();
const {
  getSubscriptions,
  getPendingSubscriptions,
  getSubscriptionById,
  activateSubscription,
  rejectSubscription,
} = require('../../../../controllers/subscriptionController');
const { protectAdmin } = require('../../../../middleware/authMiddleware');

router.get('/', protectAdmin, getSubscriptions);
router.get('/pending', protectAdmin, getPendingSubscriptions);
router.get('/:id', protectAdmin, getSubscriptionById);
router.post('/:id/activate', protectAdmin, activateSubscription);
router.post('/:id/reject', protectAdmin, rejectSubscription);

module.exports = router;
