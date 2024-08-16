import React from 'react';
import Link from 'next/link';

const VideoCard = React.forwardRef(({ video }, ref) => {
    return (
        <div ref={ref} className="bg-white shadow-md rounded-lg p-1 mb-4">
            <Link href={`/video/${video._id}`}>
                <img src={video.thumbnail} alt={video.title} className="full-width h-48 object-cover rounded-md cursor-pointer" />
            </Link>
            <h2 className="hidden text-xl font-bold mt-2">
                <Link href={`/video/${video._id}`}>
                    {video.title}
                </Link>
            </h2>
            <p className="text-gray-600">{video.description}</p>
        </div>
    );
});

// Assign a display name to the component for better debugging
VideoCard.displayName = 'VideoCard';

export default VideoCard;
