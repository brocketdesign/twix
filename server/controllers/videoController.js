const Video = require('../models/Video');

// Fetch all videos
exports.getAllVideos = async (req, res) => {
    try {
        const query = req.query.tags ? { tags: { $in: req.query.tags.split(',') } } : {};
        const videos = await Video.find(query).sort({ createdAt: -1 });
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

// Fetch a single video by ID
exports.getVideoById = async (req, res) => {
    try {
        const video = await Video.findById(req.params.id);
        if (!video) return res.status(404).json({ message: 'Video not found' });
        res.json(video);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
