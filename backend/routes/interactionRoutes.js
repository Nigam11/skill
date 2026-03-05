const express = require('express');
const router = express.Router();
const { toggleLike, toggleSave, submitRating, getInteractionStats } = require('../controllers/interactionController');
const { protect } = require('../middleware/authMiddleware');

router.post('/:resourceId/like', protect, toggleLike);
router.post('/:resourceId/save', protect, toggleSave);
router.post('/:resourceId/rate', protect, submitRating);

// Optional auth for getting stats to show user-specific boolean flags if logged in
appAuthOptional = (req, res, next) => {
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        // We'll let `protect` handle it if we want, or just verify token manually. 
        // For simplicity, let's use a soft-protect.
        const jwt = require('jsonwebtoken');
        const token = req.headers.authorization.split(' ')[1];
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = { id: decoded.id };
        } catch (error) {
            // Ignore token error for stats
        }
    }
    next();
};

router.get('/:resourceId/stats', appAuthOptional, getInteractionStats);

module.exports = router;
