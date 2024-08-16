import Link from 'next/link';

export default function VideoCard({ video }) {
    return (
        <div className="bg-white shadow-md rounded-lg p-4 mb-4">
            <Link href={`/video/${video._id}`}>
                <img src={video.thumbnail} alt={video.title} className="w-full h-48 object-cover rounded-md cursor-pointer" />
            </Link>
            <h2 className="text-xl font-bold mt-2">
                <Link href={`/video/${video._id}`}>
                    {video.title}
                </Link>
            </h2>
            <p className="text-gray-600">{video.description}</p>
        </div>
    );
}
