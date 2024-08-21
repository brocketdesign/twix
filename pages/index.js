import Head from 'next/head';
import { useState, useEffect, useRef, useCallback } from 'react';
import VideoList from '../components/VideoList';

export default function Home() {
    const [videos, setVideos] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const observer = useRef();
    const initialFetchDone = useRef(false);

    useEffect(() => {
        if (!initialFetchDone.current) {
            fetchVideos();
            initialFetchDone.current = true;
        }
    }, []);

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

    return (
        <div className="min-h-screen bg-gray-100">
            <Head>
                <title>Twitter最新の動画保存ランキング | Twix</title>
                <meta name="description" content="Twitterや他のプラットフォームから最新の動画を視聴できます。" />
                <meta name="keywords" content="Twitter動画, 最新動画, 無料動画, 日本, 動画プラットフォーム" />
                <meta name="robots" content="index, follow" />
            </Head>
            <main className="container mx-auto p-4">
                <h1 className="text-3xl font-bold mb-4">最新の動画</h1>
                <span>みんながダウンロード保存した人気のツイッター動画</span>
                <VideoList videos={videos} lastVideoElementRef={lastVideoElementRef} />
                {loading && <p>Loading...</p>}
            </main>
        </div>
    );
}
