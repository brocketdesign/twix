const Video = require('../models/Video');

// Fetch all videos
exports.getAllVideos = async (req, res) => {
    try {
        const videos = await Video.find().sort({ createdAt: -1 });
        res.json(videos);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Add new video
exports.addVideo = async (req, res) => {
    try {
        const newVideo = new Video(req.body);
        const savedVideo = await newVideo.save();
        res.json(savedVideo);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
