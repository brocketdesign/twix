import Head from 'next/head';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/router';
import VideoList from '../components/VideoList';

export default function Home() {
    const [videos, setVideos] = useState([]);
    const [tags, setTags] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const observer = useRef();
    const initialFetchDone = useRef(false);
    const router = useRouter();

    useEffect(() => {
        if (!initialFetchDone.current) {
            fetchVideos();
            fetchTags();
            initialFetchDone.current = true;
        }
    }, []);

    const fetchTags = async () => {
        const res = await fetch('/api/tags');  // Adjusted API route
        const data = await res.json();
        setTags(data);
    };

    const fetchVideos = async () => {
        if (loading || !hasMore) return;
        setLoading(true);
        const res = await fetch(`/api/videos?page=${page}&limit=4`);
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

    const handleTagClick = (tag) => {
        router.push(`/tags/${tag}`);
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <Head>
                <title>Twix - 最新の動画</title>
                <meta name="description" content="Twitterや他のプラットフォームから最新の動画を視聴できます。" />
                <meta name="keywords" content="Twitter動画, 最新動画, 無料動画, 日本, 動画プラットフォーム" />
                <meta name="robots" content="index, follow" />
            </Head>
            <main className="container mx-auto p-4">
                <h1 className="text-3xl font-bold mb-4">最新の動画</h1>

                {/* Display Tags */}
                <div className="mb-4 flex flex-wrap gap-2">
                    {tags.map(tag => (
                        <button 
                            key={tag} 
                            className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-white font-semibold py-2 px-4 rounded-full shadow-lg transform transition duration-300 hover:scale-105 hover:shadow-xl"
                            onClick={() => handleTagClick(tag)}>
                            #{tag}
                        </button>
                    ))}
                </div>
                <p className="hidden mb-4">Current Page: {page - 1}</p>
                <VideoList videos={videos} lastVideoElementRef={lastVideoElementRef} />
                {loading && <p>Loading...</p>}
            </main>
        </div>
    );
}
