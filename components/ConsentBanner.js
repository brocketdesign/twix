import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ConsentBanner() {
    const [showBanner, setShowBanner] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem('cookies_consent');
        if (!consent) {
            setShowBanner(true);
        }
    }, []);

    function handleAcceptCookies() {
        window.gtag('consent', 'update', {
            'ad_user_data': 'granted',
            'ad_personalization': 'granted',
            'ad_storage': 'granted',
            'analytics_storage': 'granted',
        });
        localStorage.setItem('cookies_consent', 'accepted');
        setShowBanner(false);
    }

    function handleRejectCookies() {
        window.gtag('consent', 'update', {
            'ad_user_data': 'denied',
            'ad_personalization': 'denied',
            'ad_storage': 'denied',
            'analytics_storage': 'denied',
        });
        localStorage.setItem('cookies_consent', 'rejected');
        setShowBanner(false);
    }

    return (
        <AnimatePresence>
            {showBanner && (
                <motion.div
                    className="fixed bottom-0 left-0 right-0 bg-gray-800 text-white p-4 flex flex-col md:flex-row justify-between items-center shadow-lg"
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <p className="mb-4 md:mb-0 text-center md:text-left">
                        当サイトでは、クッキーを使用してウェブサイトとサービスを最適化しています。
                    </p>
                    <div className="flex space-x-4">
                        <button
                            onClick={handleAcceptCookies}
                            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded transition duration-300"
                        >
                            同意する
                        </button>
                        <button
                            onClick={handleRejectCookies}
                            className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded transition duration-300"
                        >
                            拒否する
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
