const express = require('express');
const router = express.Router();
const {
  getUsers,
  getUserById,
  banUser,
  unbanUser,
  verifyUser,
  toggleSubscriber,
} = require('../../../../controllers/userController');
const { protectAdmin } = require('../../../../middleware/authMiddleware');

router.get('/', protectAdmin, getUsers);
router.get('/:id', protectAdmin, getUserById);
router.post('/:id/ban', protectAdmin, banUser);
router.post('/:id/unban', protectAdmin, unbanUser);
router.post('/:id/verify', protectAdmin, verifyUser);
router.post('/:id/toggle-subscriber', protectAdmin, toggleSubscriber);

module.exports = router;
