const mongoose = require('mongoose');

const VideoSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    url: { type: String, required: true },
    source: String,  // e.g., Twitter, other websites
    thumbnail: String,
    tags: [String],
    createdAt: { type: Date, default: Date.now }
});

// Check if the model already exists to avoid OverwriteModelError
module.exports = mongoose.models.Video || mongoose.model('Video', VideoSchema);
