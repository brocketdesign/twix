import Head from 'next/head';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Head>
        <title>Twix - Latest Videos</title>
        <meta name="description" content="Watch the latest videos sourced from Twitter and other platforms" />
      </Head>
      <main className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">Latest Videos</h1>
        {/* Infinite Scroll Component will go here */}
      </main>
    </div>
  );
}
