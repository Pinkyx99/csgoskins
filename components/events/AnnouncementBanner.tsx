
import React, { useState, useEffect } from 'react';
import { useSiteEvents } from '../../hooks/useSiteEvents';
import { AnnouncementEventData } from '../../types';

const AnnouncementBanner: React.FC = () => {
    const { activeAnnouncement, dismissAnnouncement } = useSiteEvents();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (activeAnnouncement) {
            setIsVisible(true);
            const timer = setTimeout(() => {
                handleDismiss();
            }, 7000);
            return () => clearTimeout(timer);
        }
    }, [activeAnnouncement]);

    const handleDismiss = () => {
        setIsVisible(false);
        // Delay dismissal to allow for fade-out animation
        setTimeout(() => {
            dismissAnnouncement();
        }, 300);
    };

    if (!activeAnnouncement) return null;

    const data = activeAnnouncement.data as AnnouncementEventData;

    return (
        <div className={`fixed top-24 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-4xl bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-lg z-50 transition-all duration-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}`}>
             <div className="absolute bottom-0 left-0 h-1 bg-white/30 animate-progress-bar rounded-b-lg"></div>
            <div className="p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-2.236 9.168-5.5" /></svg>
                    <p className="text-white font-semibold">{data.message}</p>
                    <span className="text-blue-200 text-sm hidden sm:block">by {activeAnnouncement.created_by_username}</span>
                </div>
                <button onClick={handleDismiss} className="text-white/70 hover:text-white text-2xl leading-none">&times;</button>
            </div>
             <style>{`
                @keyframes progressBar {
                    from { width: 100%; }
                    to { width: 0%; }
                }
                .animate-progress-bar {
                    animation: progressBar 7s linear forwards;
                }
            `}</style>
        </div>
    );
};

export default AnnouncementBanner;
