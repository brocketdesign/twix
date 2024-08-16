import dbConnect from '../../../lib/dbConnect';
import Video from '../../../models/Video';

export default async function handler(req, res) {
    await dbConnect();

    try {
        const tags = await Video.distinct('tags'); // Fetch unique tags from the videos
        res.status(200).json(tags);
    } catch (error) {
        res.status(400).json({ success: false });
    }
}
