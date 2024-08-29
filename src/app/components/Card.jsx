import React from 'react';
import Image from 'next/image';

const Card = ({ title, qty, handleCancelDropdownOption }) => {
    return (
        <div className="flex border hover:shadow-lg transition-shadow duration-300 relative p-4 bg-white rounded-lg shadow-md">
            <Image
                src="/adsense.png"
                alt={`Image for ${title}`}
                className="w-16 h-16 object-cover rounded-md mr-4 bg-white"
                width={64}
                height={64}
                priority
            />
            <div className="flex flex-col justify-between flex-1">
                <div>
                    <h2 className="text-lg me-4 font-semibold text-blue-500">{title}</h2>
                    <p className="text-2xl font-bold text-green-500">{qty}</p>
                </div>
            </div>
            <button type="button" className="absolute top-2 right-2 inline-flex items-center justify-center w-5 h-5 text-white bg-red-600 border border-red-500 rounded-full shadow-lg transition-transform transform hover:scale-105 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-opacity-50"
                onClick={() => handleCancelDropdownOption(title)}
            >
                <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div >
    );
};

export default Card