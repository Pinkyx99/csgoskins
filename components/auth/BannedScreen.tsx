
import React, { useState, useEffect } from 'react';
import { useUser } from '../../hooks/useUser';
import { supabase } from '../../lib/supabaseClient';

const BannedScreen: React.FC = () => {
    const { user, signOut } = useUser();
    const [timeLeft, setTimeLeft] = useState('...');

    useEffect(() => {
        if (!user || !user.ban_expires_at) {
            setTimeLeft('Permanent');
            return;
        }

        const interval = setInterval(() => {
            const expires = new Date(user.ban_expires_at!).getTime();
            const now = new Date().getTime();
            const distance = expires - now;

            if (distance < 0) {
                setTimeLeft('Expired');
                clearInterval(interval);
                // Optionally trigger a page reload or status check
                window.location.reload();
                return;
            }

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
        }, 1000);

        return () => clearInterval(interval);
    }, [user]);

    return (
        <div className="fixed inset-0 bg-red-900/50 backdrop-blur-lg flex items-center justify-center z-[200]">
            <div className="bg-[#12233f] border-2 border-red-500 rounded-lg shadow-2xl p-8 max-w-lg text-center mx-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="currentColor" className="text-red-500 mx-auto mb-4" viewBox="0 0 16 16">
                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z"/>
                </svg>
                <h1 className="text-4xl font-bold text-white mb-2">You Are Banned</h1>
                <p className="text-gray-300 mb-4">Your account has been suspended from accessing this site.</p>
                
                <div className="bg-red-500/10 p-4 rounded-md text-left mb-6">
                    <p className="font-semibold text-red-300">Reason:</p>
                    <p className="text-white">{user?.ban_reason || 'No reason provided.'}</p>
                </div>

                <div className="bg-slate-800/50 p-4 rounded-md">
                    <p className="font-semibold text-gray-300">Ban Lifts In:</p>
                    <p className="text-2xl font-bold text-yellow-400 tracking-wider">{timeLeft}</p>
                </div>

                <button 
                    onClick={() => signOut()} 
                    className="mt-6 px-6 py-2 bg-blue-600 hover:bg-blue-500 rounded-md font-semibold text-white transition-colors"
                >
                    Logout
                </button>
            </div>
        </div>
    );
};

export default BannedScreen;
