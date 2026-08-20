const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const { getSettings, updateSettings, uploadQrCode } = require('../../../../controllers/settingsController');
const { protectAdmin } = require('../../../../middleware/authMiddleware');

router.get('/', protectAdmin, getSettings);
router.put('/', protectAdmin, updateSettings);
router.post('/upload-qr', protectAdmin, upload.single('qrImage'), uploadQrCode);

module.exports = router;
