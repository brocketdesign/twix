import dbConnect from '../../../lib/dbConnect';
import Video from '../../../models/Video';

dbConnect();

export default async function handler(req, res) {
    const { method } = req;

    switch (method) {
        case 'GET':
            try {
                const videos = await Video.find({});
                res.status(200).json(videos);
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;
        case 'POST':
            try {
                const video = await Video.create(req.body);
                res.status(201).json(video);
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;
        default:
            res.status(400).json({ success: false });
            break;
    }
}
