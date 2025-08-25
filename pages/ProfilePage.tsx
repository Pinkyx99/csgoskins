

import React, { useEffect, useState } from 'react';
import { useUser } from '../hooks/useUser';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { Skin, Transaction } from '../types';
import InventorySkinCard from '../components/profile/InventorySkinCard';

const ProfilePage: React.FC = () => {
    const { user, updateAvatar, removeSkinFromInventory, updateBalance } = useUser();
    const navigate = useNavigate();
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'profile' | 'transactions'>('profile');
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
            </div>
        </div>
    );

    return (
        <div className="container mx-auto px-4 py-6 fade-in-up">
            <ProfileNav />
            {activeTab === 'profile' ? (
                <>
                    <div className="bg-[#12233f] border border-blue-900/50 rounded-lg p-6 mb-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex items-start gap-4">
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
                                <div className="bg-[#0d1a2f] text-sm text-gray-300 px-3 py-1 rounded-md">ID: {user.id.substring(0, 8)}...</div>
                                <button className="bg-[#0d1a2f] text-sm text-gray-300 px-3 py-1 rounded-md hover:bg-blue-800/50">Profile</button>
                                </div>
                                <div className="flex items-center gap-2 mt-3">
                                <div className="bg-green-500/10 border border-green-500/30 text-green-300 px-3 py-1.5 rounded-md flex items-center gap-2">
                                    <span>{user.balance.toFixed(2)}€</span>
                                    <button className="bg-green-500/20 w-6 h-6 rounded-sm">+</button>
                                </div>
                                    <div className="bg-yellow-500/10 border border-yellow-500/30 text-yellow-300 px-3 py-1.5 rounded-md flex items-center gap-1">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M11.25.75a.75.75 0 0 1 .75.75v.005l.007.005.014.01.028.018a3.7 3.7 0 0 1 .455.263c.1.07.2.148.3.235l.024.022.013.012.006.005a.75.75 0 0 1-1.06 1.06l-.005-.006-.012-.013-.022-.024a2.2 2.2 0 0 0-.235-.3c-.07-.1-.148-.2-.235-.3a3.7 3.7 0 0 1-.263-.455l-.018-.028-.01-.014-.005-.007A.75.75 0 0 1 11.25.75zM4.75.75a.75.75 0 0 0-.75.75v.005l-.007.005-.014.01-.028.018a3.7 3.7 0 0 0-.455.263c-.1.07-.2.148-.3.235l-.024.022-.013.012-.006.005a.75.75 0 0 0 1.06 1.06l.005-.006.012-.013.022-.024c.078-.087.156-.163.235-.235.07-.1.148-.2.235-.3a3.7 3.7 0 0 0 .263-.455l.018-.028.01-.014.005-.007A.75.75 0 0 0 4.75.75zm.124 10.325a.75.75 0 0 1 1.06 0l.005.006.012.013.022.024c.078.087.156.163.235.235.07.1.148.2.235.3.116.14.239.27.368.392l.003.002.005.004.01.007.014.009.022.012.043.02.045.017.05.015.055.013.06.01.064.007.05.003h.001L8 14.5l2.126-.001.05-.003.064-.007.06-.01.055-.013.05-.015.045-.017.043-.2.022-.012.014-.009.01-.007.005-.004.003-.002c.129-.122.252-.252.368-.392.1-.07.2-.148.3-.235l.024-.022.013-.012.006-.005a.75.75 0 1 1 1.06 1.06l-.005.006-.012.013-.022.024a2.2 2.2 0 0 1-.235.3c-.07.1-.148.2-.235.3a3.7 3.7 0 0 1-.263.455l-.018.028-.01.014-.005.007a.75.75 0 0 1-1.5 0l.005-.007.01-.014.018-.028a3.7 3.7 0 0 0 .263-.455c.1-.07.2-.148.3-.235l.024-.022.013-.012.006-.005a.75.75 0 0 1 0-1.06zm6.152-7.11a.75.75 0 0 0-1.06 0l-.005.006-.012.013-.022.024c-.078.087-.156.163-.235.235-.07.1-.148.2-.235.3a3.7 3.7 0 0 0-.263.455l-.018.028-.01.014-.005.007a.75.75 0 0 0 1.5 0l-.005-.007-.01-.014-.018-.028a3.7 3.7 0 0 1-.263-.455c-.1-.07-.2-.148-.3-.235l-.024-.022-.013-.012-.006-.005a.75.75 0 0 0 1.06-1.06zM8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1z"/></svg>
                                        <span>0</span>
                                </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <label className="text-white font-semibold">Trade URL:</label>
                                <a href="#" className="text-xs text-blue-400 hover:underline">How to get it?</a>
                            </div>
                            <div className="flex gap-2">
                                <input type="text" placeholder="https://steamcommunity.com/tradeoffer/..." className="w-full bg-[#0d1a2f] border border-blue-800/50 rounded-md py-2 px-3 text-white placeholder-gray-500"/>
                                <button className="bg-blue-600 text-white font-semibold px-4 rounded-md hover:bg-blue-500">Save</button>
                            </div>
                        </div>
                        {error && <p className="text-red-400 text-sm mt-2 md:col-span-2">{error}</p>}
                    </div>
                    <div className="bg-[#12233f] border border-blue-900/50 rounded-lg p-6">
                        {user.inventory.length > 0 ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
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
            ) : (
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
             <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center mt-8">
                <div className="bg-[#12233f] p-4 rounded-lg"><p className="text-2xl font-bold">4,866,252</p><p className="text-sm text-gray-400">Players</p></div>
                <div className="bg-[#12233f] p-4 rounded-lg"><p className="text-2xl font-bold">10,283</p><p className="text-sm text-gray-400">Online</p></div>
                <div className="bg-[#12233f] p-4 rounded-lg"><p className="text-2xl font-bold">157,778,321</p><p className="text-sm text-gray-400">Opened cases</p></div>
                <div className="bg-[#12233f] p-4 rounded-lg"><p className="text-2xl font-bold">since 2015</p><p className="text-sm text-gray-400">in the case opening</p></div>
            </div>
        </div>
    );
};

export default ProfilePage;