const express = require('express');
const router = express.Router();
const { getMe, updateMe, deleteProfilePic, getUserProfile, getSavedResources } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/me', protect, getMe);
router.put('/me', protect, upload.single('profilePic'), updateMe);
router.delete('/me/profile-pic', protect, deleteProfilePic);
router.get('/me/saves', protect, getSavedResources);
router.get('/:id/profile', getUserProfile);

module.exports = router;
