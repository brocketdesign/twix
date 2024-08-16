const express = require('express');
const next = require('next');
const mongoose = require('mongoose');
const cors = require('cors');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

require('dotenv').config();

app.prepare().then(() => {
    const server = express();

    server.use(cors());
    server.use(express.json());

    mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(() => console.log('MongoDB connected'))
      .catch(err => console.log(err));

    // API routes
    const videoRoutes = require('./routes/videoRoutes');
    server.use('/api/videos', videoRoutes);

    // All other routes
    server.get('*', (req, res) => {
        return handle(req, res);
    });

    const PORT = process.env.PORT || 3000;
    server.listen(PORT, (err) => {
        if (err) throw err;
        console.log(`Server running on http://localhost:${PORT}`);
    });
}).catch((err) => {
    console.error(err.stack);
    process.exit(1);
});
