import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Link from 'next/link';
import { useRouter } from 'next/router';

const Layout = ({ children }) => {
    const [tags, setTags] = useState([]);
    const router = useRouter();

    useEffect(() => {
        const fetchTags = async () => {
            const res = await fetch('/api/tags');  // Adjusted API route
            const data = await res.json();
            setTags(data);
        };
        fetchTags();
    }, []);

    const handleTagClick = (tag) => {
        router.push(`/tags/${tag}`);
    };

    return (
        <div>
            <Navbar />
            <div className="bg-gray-100 p-4">
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
                <main className="container mx-auto">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Layout;
