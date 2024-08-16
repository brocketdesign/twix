require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const path = require('path');

// Serve frontend client in production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/out')));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, '../client/out', 'index.html'));
    });
}

// Middleware
app.use(cors());
app.use(express.json());

const videoRoutes = require('./routes/videoRoutes');
app.use('/api/videos', videoRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Basic route
app.get('/', (req, res) => res.send('Twix API'));

module.exports = app;
