
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useUser } from '../hooks/useUser';
import { PublicProfile } from '../types';
import Button from '../components/ui/Button';

const PublicProfilePage: React.FC = () => {
    const { username } = useParams<{ username: string }>();
    const navigate = useNavigate();
    const { user: currentUser, transferBalance, setAuthModalOpen } = useUser();
    
    const [profile, setProfile] = useState<PublicProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [paymentAmount, setPaymentAmount] = useState('');
    const [isPaying, setIsPaying] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);


    useEffect(() => {
        const fetchProfile = async () => {
            if (!username) {
                setError("No user specified.");
                setLoading(false);
                return;
            }
            setLoading(true);
            const { data, error } = await supabase
                .from('profiles')
                .select('id, username, avatar_url')
                .eq('username', username)
                .single();
            
            if (error || !data) {
                setError('User not found.');
            } else {
                setProfile(data);
            }
            setLoading(false);
        };
        fetchProfile();
    }, [username]);

    const handlePayment = async () => {
        if (!currentUser) {
            setAuthModalOpen(true);
            return;
        }
        if (!profile || isPaying) return;
        
        const amount = parseFloat(paymentAmount);
        if (isNaN(amount) || amount <= 0) {
            setPaymentStatus({ type: 'error', message: 'Please enter a valid amount.' });
            return;
        }
        if (amount > currentUser.balance) {
            setPaymentStatus({ type: 'error', message: 'You have insufficient balance.' });
            return;
        }

        setIsPaying(true);
        setPaymentStatus(null);

        const { error } = await transferBalance(profile.username, amount);

        if (error) {
            setPaymentStatus({ type: 'error', message: error.message || 'Transaction failed.' });
        } else {
            setPaymentStatus({ type: 'success', message: `Successfully sent ${amount.toFixed(2)}€ to ${profile.username}!` });
            setPaymentAmount('');
        }
        setIsPaying(false);
    };

    if (loading) {
        return <div className="text-center py-12">Loading profile...</div>;
    }

    if (error) {
        return <div className="text-center py-12 text-red-400">{error}</div>;
    }
    
    if (!profile) return null;

    const isOwnProfile = currentUser?.id === profile.id;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-md mx-auto bg-[#12233f] border border-blue-900/50 rounded-lg p-8 text-center">
                <img 
                    src={profile.avatar_url || `https://api.dicebear.com/8.x/bottts/svg?seed=${profile.username}`}
                    alt={profile.username}
                    className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-blue-800/50"
                />
                <h1 className="text-3xl font-bold text-white">{profile.username}</h1>
                <p className="text-gray-500 text-sm mt-1">ID: {profile.id.substring(0,12)}...</p>

                {isOwnProfile ? (
                     <Button onClick={() => navigate('/profile')} className="mt-6">View My Profile</Button>
                ) : (
                    <div className="mt-6 bg-slate-900/50 p-4 rounded-lg">
                        <h3 className="font-semibold text-lg mb-3">Send Balance</h3>
                        <div className="flex gap-2">
                             <input
                                type="number"
                                value={paymentAmount}
                                onChange={(e) => setPaymentAmount(e.target.value)}
                                placeholder="Amount in €"
                                disabled={isPaying}
                                className="w-full bg-[#0d1a2f] border border-blue-800/50 rounded-md py-2 px-3 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                            <Button onClick={handlePayment} disabled={isPaying}>
                                {isPaying ? 'Sending...' : 'Pay'}
                            </Button>
                        </div>
                        {paymentStatus && (
                            <p className={`text-sm mt-3 ${paymentStatus.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                                {paymentStatus.message}
                            </p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PublicProfilePage;
