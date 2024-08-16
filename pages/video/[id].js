import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import VideoList from '../../components/VideoList';
import Head from 'next/head';

export default function VideoPage() {
    const router = useRouter();
    const { id } = router.query;
    const [video, setVideo] = useState(null);
    const [similarVideos, setSimilarVideos] = useState([]);

    useEffect(() => {
        if (id) {
            fetchVideo();
        }
    }, [id]);

    const fetchVideo = async () => {
        const res = await fetch(`/api/videos/${id}`);
        const data = await res.json();
        setVideo(data.video);
        setSimilarVideos(data.similarVideos); 
    };

    if (!video) return <div>Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-100">
            <Head>
                <title>{video.title} - Twix</title>
                <meta name="description" content={video.description} />
                <meta name="keywords" content={`Twitter動画, ${video?.tags?.join(', ') ?? ''}, 無料動画, 日本`} />
                <meta name="robots" content="index, follow" />
            </Head>
            <main className="container mx-auto p-4">
                <h1 className="text-2xl font-bold mb-4">{video.title}</h1>
                <video key={video.url} controls className="full-width h-auto mb-4">
                    <source src={video.url} type="video/mp4" />
                </video>
                <p className="text-gray-600 mb-6">{video.description}</p>
    
                {/* Display Similar Videos */}
                <h2 className="text-xl font-bold mb-4">類似の動画</h2>
                <VideoList videos={similarVideos} />
            </main>
        </div>
    );
    
}
