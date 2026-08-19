const express = require('express');
const router = express.Router();
const { loginAdmin, getCurrentAdmin, logoutAdmin } = require('../../../../controllers/authController');
const { protectAdmin } = require('../../../../middleware/authMiddleware');

router.post('/login', loginAdmin);
router.get('/me', protectAdmin, getCurrentAdmin);
router.post('/logout', protectAdmin, logoutAdmin);

module.exports = router;
