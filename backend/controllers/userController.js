const User = require('../models/User');
const Resource = require('../models/Resource');
const Save = require('../models/Save');
const path = require('path');
const fs = require('fs');

const getMe = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, {
            attributes: { exclude: ['password', 'resetToken', 'resetTokenExpiry'] },
            include: [{ model: Resource, as: 'resources' }]
        });
        res.json({ success: true, data: user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

const updateMe = async (req, res) => {
    try {
        const { name, bio, gender, whatsapp, instagram, linkedin } = req.body;
        const user = await User.findByPk(req.user.id);

        if (user) {
            user.name = name || user.name;
            user.bio = bio || user.bio;
            user.gender = gender || user.gender;
            user.whatsapp = whatsapp || user.whatsapp;
            user.instagram = instagram || user.instagram;
            user.linkedin = linkedin || user.linkedin;

            if (req.file) {
                // Delete old profile pic if exists
                if (user.profilePic) {
                    const oldPath = path.join(__dirname, '..', user.profilePic);
                    if (fs.existsSync(oldPath)) {
                        fs.unlinkSync(oldPath);
                    }
                }
                user.profilePic = `/uploads/${req.file.filename}`;
            }

            await user.save();
            res.json({ success: true, data: user });
        } else {
            res.status(404).json({ success: false, message: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

const deleteProfilePic = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id);
        if (user && user.profilePic) {
            const oldPath = path.join(__dirname, '..', user.profilePic);
            if (fs.existsSync(oldPath)) {
                fs.unlinkSync(oldPath);
            }
            user.profilePic = null;
            await user.save();
            res.json({ success: true, message: 'Profile picture deleted' });
        } else {
            res.status(400).json({ success: false, message: 'No profile picture to delete' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

const getUserProfile = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id, {
            attributes: { exclude: ['password', 'resetToken', 'resetTokenExpiry'] },
            include: [{ model: Resource, as: 'resources' }]
        });

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.json({ success: true, data: user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

const getSavedResources = async (req, res) => {
    try {
        const saves = await Save.findAll({
            where: { userId: req.user.id },
            include: [{
                model: Resource,
                as: 'resource',
                include: [{ model: User, as: 'owner', attributes: ['id', 'name', 'profilePic'] }]
            }],
            order: [['createdAt', 'DESC']]
        });

        res.json({ success: true, data: saves });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

module.exports = { getMe, updateMe, deleteProfilePic, getUserProfile, getSavedResources };
