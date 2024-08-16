import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import VideoList from '../../components/VideoList';

export default function TagPage() {
    const router = useRouter();
    const { tagname } = router.query;
    const [videos, setVideos] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const observer = useRef();

    useEffect(() => {
        if (tagname) {
            fetchVideos();
        }
    }, [tagname]);

    const fetchVideos = async () => {
        if (loading || !hasMore) return;
        setLoading(true);
        const res = await fetch(`/api/videos?tag=${tagname}&page=${page}&limit=4`);
        const data = await res.json();

        if (data.length === 0) {
            setHasMore(false);
        } else {
            setVideos(prev => [...prev, ...data]);
            setPage(prev => prev + 1);
        }

        setLoading(false);
    };

    const lastVideoElementRef = useCallback(node => {
        if (loading) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                fetchVideos();
            }
        });
        if (node) observer.current.observe(node);
    }, [loading, hasMore]);

    return (
        <div className="min-h-screen bg-gray-100">
            <Head>
                <title>Twix - {tagname}の動画</title>
                <meta name="description" content={`タグ: ${tagname} の動画を視聴できます。`} />
            </Head>
            <main className="container mx-auto p-4">
                <h1 className="text-3xl font-bold mb-4">タグ: {tagname}</h1>
                <VideoList videos={videos} lastVideoElementRef={lastVideoElementRef} />
                {loading && <p>Loading...</p>}
            </main>
        </div>
    );
}
