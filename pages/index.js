import Head from 'next/head';
import { useState, useEffect } from 'react';
import VideoList from '../components/VideoList';
import InfiniteScroll from '../components/InfiniteScroll';

export default function Home() {
    const [videos, setVideos] = useState([]);
    const [page, setPage] = useState(1);

    useEffect(() => {
        fetchVideos();
    }, []);

    const fetchVideos = async () => {
        const res = await fetch(`/api/videos?page=${page}`);
        const data = await res.json();
        setVideos(prevVideos => [...prevVideos, ...data]);
    };

    const loadMoreVideos = () => {
        setPage(prevPage => prevPage + 1);
        fetchVideos();
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
                <InfiniteScroll fetchMoreData={loadMoreVideos}>
                    <VideoList videos={videos} />
                </InfiniteScroll>
            </main>
        </div>
    );
}
