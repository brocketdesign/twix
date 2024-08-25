import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/router';
import VideoList from '../../components/VideoList';
import Head from 'next/head';

export default function VideoPage() {
    const router = useRouter();
    const { id } = router.query;
    const [video, setVideo] = useState(null);
    const [similarVideos, setSimilarVideos] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const observer = useRef();
    const initialLoad = useRef(true); // Ref to track initial load

    useEffect(() => {
        if (id) {
            fetchVideo();
        }
    }, [id]);

    useEffect(() => {
        if (id && initialLoad.current) {
            fetchSimilarVideos();
            initialLoad.current = false; // Set initial load to false after the first call
        }
    }, [id]);

    useEffect(() => {
        if (!initialLoad.current && page > 1) {
            fetchSimilarVideos();
        }
    }, [page]);

    const fetchVideo = async () => {
        const res = await fetch(`/api/videos/${id}`);
        const data = await res.json();
        setVideo(data.video);
    };

    const fetchSimilarVideos = async () => {
        if (loading || !hasMore) return;
        setLoading(true);

        const res = await fetch(`/api/videos/${id}/similar?page=${page}&limit=4`);
        const data = await res.json();

        if (Array.isArray(data.similarVideos)) {
            if (data.similarVideos.length === 0) {
                setHasMore(false);
            } else {
                setSimilarVideos(prev => [...prev, ...data.similarVideos]);
            }
        } else {
            console.error('similarVideos is not an array:', data.similarVideos);
            setHasMore(false);
        }

        setLoading(false);
    };

    const lastVideoElementRef = useCallback(node => {
        if (loading || !hasMore) return;
        if (observer.current) observer.current.disconnect();

        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                console.log('Intersection observed, fetching more videos');
                setPage(prev => prev + 1);
            }
        });

        if (node) observer.current.observe(node);
    }, [loading, hasMore]);

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
                <video key={video.url} controls autoPlay className="full-width h-auto mb-4">
                    <source src={video.url} type="video/mp4" />
                </video>
                <p className="text-gray-600 mb-6">{video.description}</p>
    
                {/* Display Similar Videos */}
                <h2 className="text-xl font-bold mb-4">類似の動画</h2>
                <VideoList videos={similarVideos} lastVideoElementRef={lastVideoElementRef} />
                {loading && <p>Loading...</p>}
            </main>
        </div>
    );
}
