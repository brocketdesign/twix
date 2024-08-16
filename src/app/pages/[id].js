import { useRouter } from 'next/router';
import Head from 'next/head';

export default function VideoPage() {
  const router = useRouter();
  const { id } = router.query;

  return (
    <div className="min-h-screen bg-gray-100">
      <Head>
        <title>Twix - Video</title>
      </Head>
      <main className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Video {id}</h1>
        {/* Video player component and similar videos will go here */}
      </main>
    </div>
  );
}
