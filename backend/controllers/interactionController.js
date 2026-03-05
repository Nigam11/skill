const Like = require('../models/Like');
const Save = require('../models/Save');
const Rating = require('../models/Rating');
const Resource = require('../models/Resource');

const toggleLike = async (req, res) => {
    try {
        const userId = req.user.id;
        const resourceId = req.params.resourceId;

        const existingLike = await Like.findOne({ where: { userId, resourceId } });

        if (existingLike) {
            await existingLike.destroy();
            return res.json({ success: true, message: 'Resource unliked', liked: false });
        } else {
            await Like.create({ userId, resourceId });
            return res.status(201).json({ success: true, message: 'Resource liked', liked: true });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

const toggleSave = async (req, res) => {
    try {
        const userId = req.user.id;
        const resourceId = req.params.resourceId;

        const existingSave = await Save.findOne({ where: { userId, resourceId } });

        if (existingSave) {
            await existingSave.destroy();
            return res.json({ success: true, message: 'Resource unsaved', saved: false });
        } else {
            await Save.create({ userId, resourceId });
            return res.status(201).json({ success: true, message: 'Resource saved', saved: true });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

const submitRating = async (req, res) => {
    try {
        const userId = req.user.id;
        const resourceId = req.params.resourceId;
        const { score } = req.body;

        if (!score || score < 1 || score > 5) {
            return res.status(400).json({ success: false, message: 'Invalid rating score' });
        }

        const existingRating = await Rating.findOne({ where: { userId, resourceId } });

        if (existingRating) {
            existingRating.score = score;
            await existingRating.save();
            return res.json({ success: true, message: 'Rating updated', data: existingRating });
        } else {
            const rating = await Rating.create({ userId, resourceId, score });
            return res.status(201).json({ success: true, message: 'Rating submitted', data: rating });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

const getInteractionStats = async (req, res) => {
    try {
        const resourceId = req.params.resourceId;
        const userId = req.user ? req.user.id : null; // Optional if user is auth

        const totalLikes = await Like.count({ where: { resourceId } });
        const totalSaves = await Save.count({ where: { resourceId } });

        const ratings = await Rating.findAll({ where: { resourceId } });
        const totalRatings = ratings.length;
        const averageRating = totalRatings > 0
            ? (ratings.reduce((acc, curr) => acc + curr.score, 0) / totalRatings).toFixed(1)
            : 0;

        let userInteractions = { liked: false, saved: false, userRating: null };
        if (userId) {
            const like = await Like.findOne({ where: { userId, resourceId } });
            if (like) userInteractions.liked = true;

            const save = await Save.findOne({ where: { userId, resourceId } });
            if (save) userInteractions.saved = true;

            const rating = await Rating.findOne({ where: { userId, resourceId } });
            if (rating) userInteractions.userRating = rating.score;
        }

        res.json({
            success: true,
            data: {
                totalLikes,
                totalSaves,
                totalRatings,
                averageRating,
                userInteractions
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

module.exports = {
    toggleLike,
    toggleSave,
    submitRating,
    getInteractionStats
};
