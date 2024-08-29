import Image from 'next/image';
import React from 'react';

export default function Navbar() {
    return (
        <nav className="bg-blue-300 py-4 sticky top-0 z-50">
            <div className="container mx-auto flex justify-between items-center">
                <a href="#" className="text-gray-800 font-bold text-lg">
                    <Image
                        src="/zocket.svg"
                        alt="Zocket Logo"
                        className="dark:invert"
                        width={100}
                        height={0}
                        priority
                    />
                </a>
                <ul className="flex space-x-6">
                    <li>
                        <a href="#" className="text-gray-800 hover:text-blue-600">Features</a>
                    </li>
                    <li>
                        <a href="#" className="text-gray-800 hover:text-blue-600">Integrations</a>
                    </li>
                    <li>
                        <a href="#" className="text-gray-800 hover:text-blue-600">Resources</a>
                    </li>
                    <li>
                        <a href="#" className="text-gray-800 hover:text-blue-600">Pricing</a>
                    </li>
                </ul>
            </div>
        </nav>
    );
}