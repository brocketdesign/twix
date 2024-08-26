import dbConnect from '../../../../lib/dbConnect';
import Video from '../../../../models/Video'; 

export default async function handler(req, res) {
    await dbConnect(); // Ensure database is connected

    const { method } = req;

    switch (method) {
        case 'GET':
            try {
                const { id } = req.query;
                const { page = 1, limit = 4 } = req.query;

                const video = await Video.findById(id);

                if (!video) {
                    return res.status(404).json({ success: false, message: 'Video not found' });
                }

                const skip = (page - 1) * limit;
                
                const similarVideos = await Video.aggregate([
                    { $match: { _id: { $ne: id }, tags: { $in: video.tags } } },
                    { $sort: { _id: -1 } },
                    { $skip: skip },
                    { $limit: parseInt(limit) }
                ]);                

                res.status(200).json({ video, similarVideos });
            } catch (error) {
                console.error(`Error fetching video or similar videos: ${error.message}`);
                res.status(400).json({ success: false, message: error.message });
            }
            break;
        default:
            res.status(405).json({ success: false, message: 'Method not allowed' });
            break;
    }
}
