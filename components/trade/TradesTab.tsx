import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useUser } from '../../hooks/useUser';
import { TradeOffer, Skin, FullPublicProfile } from '../../types';
import TradeOfferCard from './TradeOfferCard';
import { useTradeNotifications } from '../../hooks/useTradeNotifications';

const TradesTab: React.FC = () => {
    const { user, checkUserStatus } = useUser();
    const [trades, setTrades] = useState<TradeOffer[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'incoming' | 'outgoing' | 'history'>('incoming');
    const { refetchTradeCount } = useTradeNotifications();

    const fetchTrades = useCallback(async () => {
        if (!user) return;
        setLoading(true);
        setError(null);
        
        const { data, error: fetchError } = await supabase
            .from('trades')
            .select('*')
            .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
            .order('created_at', { ascending: false });

        if (fetchError) {
            setError(fetchError.message);
            setLoading(false);
            return;
        }

        const userIds = new Set<string>();
        data.forEach(t => {
            userIds.add(t.sender_id);
            userIds.add(t.recipient_id);
        });

        const { data: profiles, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .in('id', Array.from(userIds));

        if (profileError) {
            setError(profileError.message);
            setLoading(false);
            return;
        }

        const profilesMap = new Map<string, FullPublicProfile>();
        profiles.forEach(p => profilesMap.set(p.id, p as FullPublicProfile));

        const populatedTrades = data.map(t => {
            const sender = profilesMap.get(t.sender_id);
            const recipient = profilesMap.get(t.recipient_id);

            const senderSkins = t.sender_items.map((id: string) => sender?.inventory?.find(s => s.instance_id === id)).filter((s): s is Skin => !!s);
            const recipientSkins = t.recipient_items.map((id: string) => recipient?.inventory?.find(s => s.instance_id === id)).filter((s): s is Skin => !!s);

            return {
                ...t,
                sender_username: sender?.username,
                sender_avatar_url: sender?.avatar_url,
                recipient_username: recipient?.username,
                recipient_avatar_url: recipient?.avatar_url,
                sender_skins: senderSkins,
                recipient_skins: recipientSkins,
            };
        });

        setTrades(populatedTrades);
        setLoading(false);
    }, [user]);

    useEffect(() => {
        fetchTrades();
        refetchTradeCount(); // Clear notification count on view

        const channel = supabase
            .channel(`trades-user:${user?.id}`)
            .on('postgres_changes', { 
                event: '*', 
                schema: 'public', 
                table: 'trades',
                filter: `or(sender_id.eq.${user?.id},recipient_id.eq.${user?.id})`
             }, 
             () => {
                fetchTrades();
             }
            ).subscribe();
        
        return () => { supabase.removeChannel(channel) };

    }, [fetchTrades, user?.id, refetchTradeCount]);

    const handleTradeAction = async (tradeId: string, action: 'accept' | 'decline' | 'cancel') => {
        const { error: rpcError } = await supabase.rpc('respond_to_trade', {
            trade_id: tradeId,
            action: action
        });

        if (rpcError) {
            alert(`Error: ${rpcError.message}`);
        } else {
            // Refetch trades and user data
            fetchTrades();
            checkUserStatus();
        }
    };
    
    const incomingTrades = trades.filter(t => t.recipient_id === user?.id && t.status === 'pending');
    const outgoingTrades = trades.filter(t => t.sender_id === user?.id && t.status === 'pending');
    const tradeHistory = trades.filter(t => t.status !== 'pending');

    const renderTrades = (tradeList: TradeOffer[], type: 'incoming' | 'outgoing' | 'history') => {
        if (tradeList.length === 0) {
            return <p className="text-gray-500 text-center py-8">No {type} trades found.</p>;
        }
        return (
            <div className="space-y-4">
                {tradeList.map(trade => (
                    <TradeOfferCard 
                        key={trade.id} 
                        trade={trade} 
                        type={type}
                        onAction={handleTradeAction}
                    />
                ))}
            </div>
        );
    };

    return (
        <div className="bg-[#12233f] border border-blue-900/50 rounded-lg p-6">
            <div className="flex border-b border-blue-900/50 mb-4">
                <button onClick={() => setActiveTab('incoming')} className={`px-4 py-2 font-semibold ${activeTab === 'incoming' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400'}`}>Incoming ({incomingTrades.length})</button>
                <button onClick={() => setActiveTab('outgoing')} className={`px-4 py-2 font-semibold ${activeTab === 'outgoing' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400'}`}>Outgoing ({outgoingTrades.length})</button>
                <button onClick={() => setActiveTab('history')} className={`px-4 py-2 font-semibold ${activeTab === 'history' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400'}`}>History</button>
            </div>
            {loading ? (
                <div className="text-center py-8 text-gray-400">Loading trades...</div>
            ) : error ? (
                <div className="text-center py-8 text-red-400">{error}</div>
            ) : (
                <>
                    {activeTab === 'incoming' && renderTrades(incomingTrades, 'incoming')}
                    {activeTab === 'outgoing' && renderTrades(outgoingTrades, 'outgoing')}
                    {activeTab === 'history' && renderTrades(tradeHistory, 'history')}
                </>
            )}
        </div>
    );
};

export default TradesTab;