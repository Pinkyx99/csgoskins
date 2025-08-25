
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { PublicProfile } from '../types';

interface LeaderboardUser extends PublicProfile {
    balance: number;
}

const LeaderboardPage: React.FC = () => {
    const [users, setUsers] = useState<LeaderboardUser[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            setLoading(true);
            const { data, error } = await supabase
                .from('profiles')
                .select('id, username, avatar_url, balance')
                .order('balance', { ascending: false })
                .limit(100);

            if (error) {
                console.error("Error fetching leaderboard:", error);
            } else {
                setUsers(data as LeaderboardUser[]);
            }
            setLoading(false);
        };

        fetchLeaderboard();
    }, []);

    const getRankColor = (rank: number) => {
        if (rank === 0) return 'text-yellow-400';
        if (rank === 1) return 'text-gray-300';
        if (rank === 2) return 'text-yellow-600';
        return 'text-gray-400';
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold text-center mb-8">Top Players</h1>

            <div className="bg-[#12233f] border border-blue-900/50 rounded-lg max-w-3xl mx-auto">
                {loading ? (
                     <div className="text-center p-8 text-gray-400">Loading leaderboard...</div>
                ) : (
                    <ul className="divide-y divide-blue-900/50">
                        {users.map((user, index) => (
                            <li key={user.id} className="p-4 flex items-center gap-4 hover:bg-blue-800/20 transition-colors">
                                <span className={`text-xl font-bold w-8 text-center ${getRankColor(index)}`}>{index + 1}</span>
                                <img 
                                    src={user.avatar_url || `https://api.dicebear.com/8.x/bottts/svg?seed=${user.username}`} 
                                    alt={user.username} 
                                    className="w-12 h-12 rounded-md object-cover"
                                />
                                <span className="font-semibold text-white text-lg flex-grow">{user.username}</span>
                                <span className="text-green-400 font-bold text-lg">{user.balance.toFixed(2)}€</span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default LeaderboardPage;
