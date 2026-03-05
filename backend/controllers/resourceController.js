const Resource = require('../models/Resource');
const User = require('../models/User');
const { Op } = require('sequelize');
const path = require('path');
const fs = require('fs');

const createResource = async (req, res) => {
    try {
        const { title, description, platform, price, courseLink } = req.body;

        let courseImagePath = null;
        if (req.file) {
            courseImagePath = `/uploads/${req.file.filename}`;
        }

        const resource = await Resource.create({
            title,
            description,
            platform,
            price: price || 0,
            courseLink,
            courseImagePath,
            ownerId: req.user.id,
        });

        res.status(201).json({ success: true, data: resource });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

const getResourceById = async (req, res) => {
    try {
        const resource = await Resource.findByPk(req.params.id, {
            include: [{ model: User, as: 'owner', attributes: ['id', 'name', 'profilePic'] }]
        });

        if (!resource) {
            return res.status(404).json({ success: false, message: 'Resource not found' });
        }

        res.json({ success: true, data: resource });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

const updateResource = async (req, res) => {
    try {
        const resource = await Resource.findByPk(req.params.id);

        if (!resource) {
            return res.status(404).json({ success: false, message: 'Resource not found' });
        }

        // Check owner
        if (resource.ownerId !== req.user.id) {
            return res.status(401).json({ success: false, message: 'Not authorized' });
        }

        const { title, description, platform, price, courseLink } = req.body;

        resource.title = title || resource.title;
        resource.description = description || resource.description;
        resource.platform = platform || resource.platform;
        resource.price = price !== undefined ? price : resource.price;
        resource.courseLink = courseLink || resource.courseLink;

        if (req.file) {
            if (resource.courseImagePath) {
                const oldPath = path.join(__dirname, '..', resource.courseImagePath);
                if (fs.existsSync(oldPath)) {
                    fs.unlinkSync(oldPath);
                }
            }
            resource.courseImagePath = `/uploads/${req.file.filename}`;
        }

        await resource.save();

        res.json({ success: true, data: resource });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

const deleteResource = async (req, res) => {
    try {
        const resource = await Resource.findByPk(req.params.id);

        if (!resource) {
            return res.status(404).json({ success: false, message: 'Resource not found' });
        }

        if (resource.ownerId !== req.user.id) {
            return res.status(401).json({ success: false, message: 'Not authorized' });
        }

        if (resource.courseImagePath) {
            const oldPath = path.join(__dirname, '..', resource.courseImagePath);
            if (fs.existsSync(oldPath)) {
                fs.unlinkSync(oldPath);
            }
        }

        await resource.destroy();

        res.json({ success: true, message: 'Resource removed' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

const searchResources = async (req, res) => {
    try {
        const { title } = req.query;
        let whereClause = {};

        if (title) {
            whereClause.title = {
                [Op.like]: `%${title}%`
            };
        }

        const resources = await Resource.findAll({
            where: whereClause,
            include: [{ model: User, as: 'owner', attributes: ['id', 'name', 'profilePic'] }]
        });

        res.json({ success: true, data: resources });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

const filterResourcesByPlatform = async (req, res) => {
    try {
        const { platform } = req.query;

        // If no platform provided, just return all
        let whereClause = {};
        if (platform) {
            whereClause.platform = {
                [Op.like]: `%${platform}%`
            };
        }

        const resources = await Resource.findAll({
            where: whereClause,
            include: [{ model: User, as: 'owner', attributes: ['id', 'name', 'profilePic'] }]
        });

        res.json({ success: true, data: resources });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

module.exports = {
    createResource,
    getResourceById,
    updateResource,
    deleteResource,
    searchResources,
    filterResourcesByPlatform
};
