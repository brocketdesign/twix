import VideoCard from './VideoCard';

export default function VideoList({ videos }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {videos.map(video => (
                <VideoCard key={video._id} video={video} />
            ))}
        </div>
    );
}
