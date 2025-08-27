import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useUser } from '../hooks/useUser';
import { FullPublicProfile, Skin, SkinRarity } from '../types';
import Button from '../components/ui/Button';
import { rarityStyles } from '../constants';
import TradeModal from '../components/trade/TradeModal';

const StatCard = ({ label, value }: { label: string, value: string | number}) => (
    <div className="bg-[#0d1a2f] p-4 rounded-lg text-center border border-blue-900/50">
        <p className="text-sm text-gray-400">{label}</p>
        <p className="text-xl font-bold text-white">{value}</p>
    </div>
);

const BestSkinCard = ({ skin }: { skin: Skin }) => {
    const rarityStyle = rarityStyles[skin.rarity] || rarityStyles[SkinRarity.Consumer];
    const nameParts = skin.name.split(' | ');
    const weaponName = nameParts[0];
    const skinName = nameParts.length > 1 ? nameParts.slice(1).join(' | ') : '';
    return (
        <div className={`bg-gradient-to-b from-[#1a2c47] to-[#12233f] p-4 rounded-lg text-center border-t-4 ${rarityStyle.border}`}>
             <p className="text-sm text-gray-400 mb-4">Best Item Drop</p>
             <div className="h-24 flex items-center justify-center">
                <img src={skin.image} alt={skin.name} className="max-h-20 object-contain drop-shadow-lg" />
             </div>
             <div className="mt-2 h-10 flex flex-col justify-center">
                <p className="text-white text-base font-medium truncate" title={weaponName}>{weaponName}</p>
                <p className={`text-sm truncate ${rarityStyle.text}`} title={skinName}>{skinName}</p>
             </div>
             <div className="mt-2 text-center">
                <p className="text-lg font-semibold text-green-400">${skin.price.toFixed(2)}</p>
             </div>
        </div>
    );
};


const PublicProfilePage: React.FC = () => {
    const { username } = useParams<{ username: string }>();
    const navigate = useNavigate();
    const { user: currentUser, transferBalance, setAuthModalOpen } = useUser();
    
    const [profile, setProfile] = useState<FullPublicProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isTradeModalOpen, setIsTradeModalOpen] = useState(false);

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
                .select('id, username, avatar_url, inventory, best_win, total_wagered, total_won')
                .eq('username', username)
                .single();
            
            if (error || !data) {
                setError('User not found.');
            } else {
                setProfile(data as FullPublicProfile);
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
        <>
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-2xl mx-auto bg-[#12233f] border border-blue-900/50 rounded-lg p-8">
                    <div className="text-center">
                        <img 
                            src={profile.avatar_url || `https://api.dicebear.com/8.x/bottts/svg?seed=${profile.username}`}
                            alt={profile.username}
                            className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-blue-800/50"
                        />
                        <h1 className="text-3xl font-bold text-white">{profile.username}</h1>
                        <p className="text-gray-500 text-sm mt-1">ID: {profile.id.substring(0,12)}...</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6">
                        <StatCard label="Total Wagered" value={`${(profile.total_wagered || 0).toFixed(2)}€`} />
                        <StatCard label="Total Won" value={`${(profile.total_won || 0).toFixed(2)}€`} />
                        {profile.best_win ? (
                            <BestSkinCard skin={profile.best_win} />
                        ) : (
                            <div className="bg-[#0d1a2f] p-4 rounded-lg text-center border border-blue-900/50 flex flex-col justify-center items-center">
                                <p className="text-sm text-gray-400">Best Item Drop</p>
                                <p className="text-gray-500 mt-4">No drops yet!</p>
                            </div>
                        )}
                    </div>

                    {isOwnProfile ? (
                        <div className="text-center"><Button onClick={() => navigate('/profile')}>View My Profile</Button></div>
                    ) : (
                        <div className="flex items-center justify-center gap-4">
                            <Button variant="secondary" onClick={() => setIsTradeModalOpen(true)}>
                                Trade with {profile.username}
                            </Button>
                            <div className="mt-6 bg-slate-900/50 p-4 rounded-lg">
                                <h3 className="font-semibold text-lg mb-3 text-center">Send Balance</h3>
                                <div className="flex gap-2 max-w-sm mx-auto">
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
                                    <p className={`text-sm mt-3 text-center ${paymentStatus.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                                        {paymentStatus.message}
                                    </p>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
            {isTradeModalOpen && currentUser && (
                <TradeModal 
                    targetUser={profile}
                    onClose={() => setIsTradeModalOpen(false)}
                />
            )}
        </>
    );
};

export default PublicProfilePage;