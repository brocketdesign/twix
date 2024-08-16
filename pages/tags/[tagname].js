import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import VideoList from '../../components/VideoList';

export default function TagPage() {
    const router = useRouter();
    const { tagname } = router.query;
    const [tags, setTags] = useState([]);
    const [videos, setVideos] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const initialFetchDone = useRef(false);
    const observer = useRef();

    useEffect(() => {
        if (!initialFetchDone.current && tagname) {
            fetchVideos();
            fetchTags();
            initialFetchDone.current = true;
        }
    }, [tagname]);

    useEffect(() => {
        if (page > 1) {
            fetchVideos();
        }
    }, [page]);

    const fetchTags = async () => {
        const res = await fetch('/api/tags');
        const data = await res.json();
        setTags(data);
    };

    const fetchVideos = async () => {
        if (loading || !hasMore) return;
        setLoading(true);
        const res = await fetch(`/api/videos?tag=${tagname}&page=${page}&limit=4`);
        const data = await res.json();

        if (data.length === 0) {
            setHasMore(false);
        } else {
            setVideos(prev => [...prev, ...data]);
        }

        setLoading(false);
    };

    const lastVideoElementRef = useCallback(node => {
        if (loading) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                setPage(prev => prev + 1);
            }
        });
        if (node) observer.current.observe(node);
    }, [loading, hasMore]);

    const handleTagClick = (tag) => {
        setPage(1);  // Reset page when switching tags
        setVideos([]);  // Clear videos when switching tags
        setHasMore(true);  // Reset hasMore when switching tags
        initialFetchDone.current = false;  // Allow re-fetching for new tag
        router.push(`/tags/${tag}`);
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <Head>
                <title>Twix - {tagname}の動画</title>
                <meta name="description" content={`タグ: ${tagname} の動画を視聴できます。`} />
            </Head>
            <main className="container mx-auto p-4">
                <h1 className="text-3xl font-bold mb-4">タグ: {tagname}</h1>
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
                <VideoList key={tagname} videos={videos} lastVideoElementRef={lastVideoElementRef} />
                {loading && <p>Loading...</p>}
            </main>
        </div>
    );
}
