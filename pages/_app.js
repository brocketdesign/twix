import '../styles/globals.css';
import Layout from '../components/Layout'; // Adjust the path if necessary

function MyApp({ Component, pageProps }) {
    return (
        <Layout>
            <Component {...pageProps} />
        </Layout>
    );
}

export default MyApp;
