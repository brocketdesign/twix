const express = require('express');
const { getAllVideos, addVideo } = require('../controllers/videoController');

const router = express.Router();

// GET all videos
router.get('/', getAllVideos);

// POST a new video
router.post('/', addVideo);

module.exports = router;
