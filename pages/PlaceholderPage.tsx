
import React from 'react';

interface PlaceholderPageProps {
    title: string;
}

const PlaceholderPage: React.FC<PlaceholderPageProps> = ({ title }) => {
    return (
        <div className="container mx-auto px-4 py-8 text-center">
            <h1 className="text-5xl font-bold text-white mb-4">{title}</h1>
            <p className="text-2xl text-gray-400">Coming Soon!</p>
            <div className="mt-8 text-6xl animate-pulse">⚙️</div>
        </div>
    );
};

export default PlaceholderPage;
