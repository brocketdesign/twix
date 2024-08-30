import '../styles/globals.css';
import Layout from '../components/Layout';
import Head from 'next/head';
import ConsentBanner from '../components/ConsentBanner';
import App from 'next/app'; // Import App for getInitialProps

function MyApp({ Component, pageProps }) {
    return (
        <Layout>
            <Head>
                <link rel="icon" href="/favicon.ico" />
                <script
                    dangerouslySetInnerHTML={{
                        __html: `
                        window.dataLayer = window.dataLayer || [];
                        function gtag() { dataLayer.push(arguments); }
                        gtag('consent', 'default', {
                            'ad_user_data': 'denied',
                            'ad_personalization': 'denied',
                            'ad_storage': 'denied',
                            'analytics_storage': 'denied',
                            'wait_for_update': 500,
                        });
                        gtag('js', new Date());
                        gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_TAG_ID}');
                        `,
                    }}
                />
                <script async src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_TAG_ID}`}></script>
            </Head>
            <ConsentBanner />
            <Component {...pageProps} />
        </Layout>
    );
}

// Handle getInitialProps if needed
MyApp.getInitialProps = async (appContext) => {
    const appProps = await App.getInitialProps(appContext);
    return { ...appProps };
};

export default MyApp;
