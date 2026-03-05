const express = require('express');
const router = express.Router();
const {
    createResource,
    getResourceById,
    updateResource,
    deleteResource,
    searchResources,
    filterResourcesByPlatform
} = require('../controllers/resourceController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/search', searchResources);
router.get('/filter/platform', filterResourcesByPlatform);
router.post('/', protect, upload.single('courseImage'), createResource);
router.get('/:id', getResourceById);
router.put('/:id', protect, upload.single('courseImage'), updateResource);
router.delete('/:id', protect, deleteResource);

module.exports = router;
