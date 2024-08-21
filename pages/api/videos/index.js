import dbConnect from '../../../lib/dbConnect';
import Video from '../../../models/Video';

export default async function handler(req, res) {
    const { method } = req;
    const { page = 1, limit = 5, tag } = req.query;

    await dbConnect();

    switch (method) {
        case 'GET':
            try {
                const query = tag ? { tags: { $in: [tag] } } : {};
                const videos = await Video.find(query)
                    .sort({ _id: -1 })
                    .skip((page - 1) * limit)
                    .limit(parseInt(limit));
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
