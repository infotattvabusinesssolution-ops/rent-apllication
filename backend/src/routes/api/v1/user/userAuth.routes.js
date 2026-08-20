const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getMe,
  updateUserLocation,
} = require('../../../../controllers/user/userAuthController');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', getMe);
router.put('/location', updateUserLocation);

module.exports = router;
