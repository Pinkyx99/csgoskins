

import React, { useEffect, useState } from 'react';
import { useUser } from '../hooks/useUser';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { Skin, Transaction } from '../types';
import InventorySkinCard from '../components/profile/InventorySkinCard';
import { rarityStyles } from '../constants';
import { SkinRarity } from '../types';
import TradesTab from '../components/trade/TradesTab';

const StatCard = ({ label, value }: { label: string, value: string | number}) => (
    <div className="bg-[#0d1a2f] p-4 rounded-lg text-center border border-blue-900/50">
        <p className="text-sm text-gray-400">{label}</p>
        <p className="text-2xl font-bold text-white">{value}</p>
    </div>
);


const ProfilePage: React.FC = () => {
    const { user, updateAvatar, removeSkinFromInventory, updateBalance } = useUser();
    const navigate = useNavigate();
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'profile' | 'transactions' | 'trades'>('profile');
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loadingTransactions, setLoadingTransactions] = useState(false);
    const [sellingSkinIds, setSellingSkinIds] = useState<string[]>([]);

    useEffect(() => {
        if (!user) {
            navigate('/');
        }
    }, [user, navigate]);

     useEffect(() => {
        if (activeTab === 'transactions' && user) {
            const fetchTransactions = async () => {
                setLoadingTransactions(true);
                const { data, error } = await supabase
                    .from('transactions')
                    .select('*')
                    .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
                    .order('created_at', { ascending: false });

                if (error) {
                    console.error("Error fetching transactions:", error);
                } else {
                    setTransactions(data);
                }
                setLoadingTransactions(false);
            };
            fetchTransactions();
        }
    }, [activeTab, user]);

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!event.target.files || event.target.files.length === 0 || !user) return;
        const file = event.target.files[0];
        if (!file.type.startsWith('image/')) {
            setError('Please select an image file.');
            return;
        }
        if (file.size > 2 * 1024 * 1024) { // 2MB limit
            setError('File is too large. Max size is 2MB.');
            return;
        }
        setIsUploading(true);
        setError(null);
        const fileExt = file.name.split('.').pop();
        const filePath = `${user.id}/${Date.now()}.${fileExt}`;

        try {
            const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file, { upsert: true });
            if (uploadError) throw uploadError;
            const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
            if (data.publicUrl) await updateAvatar(data.publicUrl);
        } catch (err: any) {
            console.error('Avatar upload error:', err);
            setError(err.message || 'Failed to upload avatar.');
        } finally {
            setIsUploading(false);
        }
    };

    const handleSellSkin = async (skin: Skin) => {
        if (skin.instance_id && !sellingSkinIds.includes(skin.instance_id)) {
            setSellingSkinIds(prev => [...prev, skin.instance_id!]);
            await removeSkinFromInventory(skin.instance_id);
            await updateBalance(skin.price);
            // No need to remove from sellingSkinIds, as component will re-render without the skin
        }
    };
    
    if (!user) return null;

    const ProfileNav = () => (
        <div className="flex items-center justify-between border-b border-blue-900/50 mb-6">
            <div className="flex items-center gap-6">
                <button onClick={() => setActiveTab('profile')} className={`py-3 font-semibold flex items-center gap-2 ${activeTab === 'profile' ? 'text-white border-b-2 border-blue-500' : 'text-gray-400 hover:text-white'}`}><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z"/></svg> Profile</button>
                <button onClick={() => setActiveTab('transactions')} className={`py-3 font-semibold flex items-center gap-2 ${activeTab === 'transactions' ? 'text-white border-b-2 border-blue-500' : 'text-gray-400 hover:text-white'}`}><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M5.5 7a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1h-5zM5 9.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5z"/><path d="M2 1a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V1zm11 0H3v14h3.5a.5.5 0 0 1 .5.5c0 .276.224.5.5.5h2a.5.5 0 0 0 .5-.5.5.5 0 0 1 .5-.5H13V1z"/></svg> Transactions</button>
                <button onClick={() => setActiveTab('trades')} className={`py-3 font-semibold flex items-center gap-2 ${activeTab === 'trades' ? 'text-white border-b-2 border-blue-500' : 'text-gray-400 hover:text-white'}`}><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M16 10h-4.268a2.5 2.5 0 1 0 0 2h4.268a2.5 2.5 0 1 0 0-2zm-4.57 2.427a.5.5 0 0 1 .427.223l.75.937a.5.5 0 1 1-.854.54l-.75-.937a.5.5 0 0 1 .427-.223zM12.5 11.5a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1z"/><path d="M0 2a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1V2zm14 1v3H2V3h12zM2 12.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5z"/></svg> Trades</button>
            </div>
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
                 <div className="h-32 flex items-center justify-center">
                    <img src={skin.image} alt={skin.name} className="max-h-28 object-contain drop-shadow-lg" />
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

    return (
        <div className="container mx-auto px-4 py-6 fade-in-up">
            <ProfileNav />
            {activeTab === 'profile' && (
                <>
                    <div className="bg-[#12233f] border border-blue-900/50 rounded-lg p-6 mb-6 flex flex-col md:flex-row items-start gap-6">
                        <div className="flex items-start gap-4 flex-shrink-0">
                            <div className="relative group cursor-pointer" onClick={handleAvatarClick}>
                                <img src={user.avatar} alt={user.name} className="w-20 h-20 rounded-md object-cover"/>
                                <div className="absolute inset-0 bg-black/50 rounded-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    {isUploading 
                                        ? <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        : <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="text-white" viewBox="0 0 16 16"><path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/><path d="M7.646 1.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 2.707V11.5a.5.5 0 0 1-1 0V2.707L5.354 4.854a.5.5 0 1 1-.708-.708l3-3z"/></svg>
                                    }
                                </div>
                            </div>
                            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/png, image/jpeg, image/gif" className="hidden"/>
                            
                            <div>
                                <h2 className="text-2xl font-bold text-white">{user.name}</h2>
                                <div className="flex items-center gap-2 mt-2">
                                <div className="bg-green-500/10 border border-green-500/30 text-green-300 px-3 py-1.5 rounded-md flex items-center gap-2">
                                    <span>{user.balance.toFixed(2)}€</span>
                                    <button className="bg-green-500/20 w-6 h-6 rounded-sm">+</button>
                                </div>
                                <div className="bg-[#0d1a2f] text-sm text-gray-300 px-3 py-1 rounded-md">ID: {user.id.substring(0, 8)}...</div>
                                </div>
                            </div>
                        </div>
                        <div className="w-full flex-grow">
                             <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <StatCard label="Total Wagered" value={`${user.total_wagered.toFixed(2)}€`} />
                                <StatCard label="Total Won" value={`${user.total_won.toFixed(2)}€`} />
                                {user.best_win ? (
                                    <BestSkinCard skin={user.best_win} />
                                ) : (
                                    <div className="bg-[#0d1a2f] p-4 rounded-lg text-center border border-blue-900/50 flex flex-col justify-center items-center">
                                         <p className="text-sm text-gray-400">Best Item Drop</p>
                                         <p className="text-gray-500 mt-4">No drops yet!</p>
                                    </div>
                                )}
                            </div>
                        </div>
                        {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
                    </div>
                    <div className="bg-[#12233f] border border-blue-900/50 rounded-lg p-6">
                        <h3 className="text-xl font-bold mb-4">Inventory ({user.inventory.length} items)</h3>
                        {user.inventory.length > 0 ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                {user.inventory.map(skin => (
                                    <InventorySkinCard 
                                        key={skin.instance_id} 
                                        skin={skin} 
                                        onSell={() => handleSellSkin(skin)}
                                        isSelling={sellingSkinIds.includes(skin.instance_id!)}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-16">
                                <p className="text-4xl text-gray-500 font-bold">Inventory is empty.</p>
                                <p className="text-lg text-gray-400 mt-2">Open some cases to get skins!</p>
                            </div>
                        )}
                    </div>
                </>
            )}
            {activeTab === 'transactions' && (
                <div className="bg-[#12233f] border border-blue-900/50 rounded-lg p-6">
                    <h2 className="text-xl font-bold mb-4">Transaction History</h2>
                    {loadingTransactions ? (
                        <div className="text-center py-8 text-gray-400">Loading...</div>
                    ) : transactions.length === 0 ? (
                        <div className="text-center py-8 text-gray-400">No transactions yet.</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs text-gray-400 uppercase bg-[#0d1a2f]">
                                    <tr>
                                        <th className="px-4 py-3">Date</th>
                                        <th className="px-4 py-3">Type</th>
                                        <th className="px-4 py-3">User</th>
                                        <th className="px-4 py-3 text-right">Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {transactions.map(t => {
                                        const isSender = t.sender_id === user.id;
                                        return (
                                            <tr key={t.id} className="border-b border-blue-900/50">
                                                <td className="px-4 py-3 text-gray-300">{new Date(t.created_at).toLocaleString()}</td>
                                                <td className={`px-4 py-3 font-semibold ${isSender ? 'text-red-400' : 'text-green-400'}`}>{isSender ? 'Sent' : 'Received'}</td>
                                                <td className="px-4 py-3 text-white">{isSender ? t.recipient_username : t.sender_username}</td>
                                                <td className={`px-4 py-3 text-right font-semibold ${isSender ? 'text-red-400' : 'text-green-400'}`}>{isSender ? '-' : '+'}{t.amount.toFixed(2)}€</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}
            {activeTab === 'trades' && <TradesTab />}
        </div>
    );
};

export default ProfilePage;