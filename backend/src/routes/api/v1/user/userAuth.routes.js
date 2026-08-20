const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getMe,
  updateUserLocation,
  logoutUser,
  forgotPassword,
  resetPassword,
} = require('../../../../controllers/user/userAuthController');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', getMe);
router.post('/logout', logoutUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.put('/location', updateUserLocation);

module.exports = router;

