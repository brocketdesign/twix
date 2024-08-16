import dbConnect from '../../../lib/dbConnect';
import Video from '../../../models/Video';

export default async function handler(req, res) {
    const { method } = req;
    const { id } = req.query;

    await dbConnect();
    console.log(`Request method: ${method}, Video ID: ${id}`);

    switch (method) {
        case 'GET':
            try {
                const video = await Video.findById(id);

                if (!video) {
                    return res.status(404).json({ success: false, message: 'Video not found' });
                }

                const similarVideos = await Video.find({
                    _id: { $ne: id }, // Exclude the current video
                    tags: { $in: video.tags } // Match videos with similar tags
                });


                res.status(200).json({ video, similarVideos });
            } catch (error) {
                console.error(`Error fetching video or similar videos: ${error.message}`);
                res.status(400).json({ success: false, message: error.message });
            }
            break;

        case 'PUT':
            try {
                const video = await Video.findByIdAndUpdate(id, req.body, {
                    new: true,
                    runValidators: true,
                });

                if (!video) {
                    console.log(`Video not found for ID: ${id} during update`);
                    return res.status(404).json({ success: false, message: 'Video not found' });
                }

                console.log(`Updated video: ${video}`);
                res.status(200).json(video);
            } catch (error) {
                console.error(`Error updating video: ${error.message}`);
                res.status(400).json({ success: false, message: error.message });
            }
            break;

        case 'DELETE':
            try {
                const deletedVideo = await Video.deleteOne({ _id: id });

                if (!deletedVideo.deletedCount) {
                    console.log(`Video not found for ID: ${id} during delete`);
                    return res.status(404).json({ success: false, message: 'Video not found' });
                }

                console.log(`Deleted video with ID: ${id}`);
                res.status(200).json({ success: true, message: 'Video deleted' });
            } catch (error) {
                console.error(`Error deleting video: ${error.message}`);
                res.status(400).json({ success: false, message: error.message });
            }
            break;

        default:
            console.log(`Method not allowed: ${method}`);
            res.status(400).json({ success: false, message: 'Method not allowed' });
            break;
    }
}
