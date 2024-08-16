import { useState, useEffect } from 'react';

export default function InfiniteScroll({ fetchMoreData, children }) {
    const [isFetching, setIsFetching] = useState(false);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (!isFetching) return;
        fetchMoreData();
    }, [isFetching]);

    function handleScroll() {
        if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight || isFetching) {
            return;
        }
        setIsFetching(true);
    }

    // Renamed this function to avoid conflict
    function doneFetching() {
        setIsFetching(false);
    }

    return (
        <div>
            {children}
            {isFetching && <p>Loading more videos...</p>}
        </div>
    );
}
