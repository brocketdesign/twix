const express = require('express');
const router = express.Router();
const { getAllVideos, addVideo, getVideoById } = require('../controllers/videoController');

router.get('/', getAllVideos);
router.post('/', addVideo);
router.get('/:id', getVideoById);

module.exports = router;
