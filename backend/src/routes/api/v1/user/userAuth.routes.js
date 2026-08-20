const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getMe,
  updateUserLocation,
  updateUserProfile,
  logoutUser,
  forgotPassword,
  resetPassword,
} = require('../../../../controllers/user/userAuthController');
const upload = require('../../../../middleware/uploadMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', getMe);
router.put('/profile', upload.single('avatar'), updateUserProfile);
router.post('/logout', logoutUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.put('/location', updateUserLocation);

module.exports = router;


