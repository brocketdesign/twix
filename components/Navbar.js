import React from 'react';
import Link from 'next/link';

const Navbar = () => {
    return (
        <>
            <nav className="bg-gray-800 p-4">
                <div className="container mx-auto flex justify-between">
                    <Link href="/" className="text-white text-lg font-bold">
                        ツイックス (Twix)
                    </Link>
                    <div>
                        <Link href="/about" className="text-white mr-4">
                            アバウト
                        </Link>
                        <Link href="/contact" className="text-white">
                            お問い合わせ
                        </Link>
                    </div>
                </div>
            </nav>
            <div className="bg-red-500 text-center text-white text-xs p-2">
                免責事項: このサイトの管理者はビデオの所有者でもホストでもありません。Twitterからビデオが削除された場合、このサイトからもアクセスできなくなります。
            </div>
        </>
    );
};

export default Navbar;
