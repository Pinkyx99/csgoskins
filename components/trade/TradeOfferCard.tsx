import React from 'react';
import { useUser } from '../../hooks/useUser';
import { TradeOffer, Skin } from '../../types';
import Button from '../ui/Button';

interface TradeOfferCardProps {
    trade: TradeOffer;
    type: 'incoming' | 'outgoing' | 'history';
    onAction: (tradeId: string, action: 'accept' | 'decline' | 'cancel') => void;
}

const TradeColumn: React.FC<{
    user: { username?: string, avatar_url?: string };
    skins: Skin[];
    value: number;
    title: string;
}> = ({ user, skins, value, title }) => (
    <div className="flex-1 flex flex-col gap-3">
        <div className="flex items-center gap-3 p-2 bg-slate-900/50 rounded-lg">
            <img src={user.avatar_url || `https://api.dicebear.com/8.x/bottts/svg?seed=${user.username}`} alt={user.username} className="w-10 h-10 rounded-full" />
            <div>
                <p className="font-bold text-white truncate">{user.username}</p>
                <p className="text-sm text-gray-400">{title}</p>
            </div>
        </div>
        <div className="bg-black/20 p-2 rounded-md grid grid-cols-4 sm:grid-cols-6 gap-2 min-h-[120px] flex-grow content-start">
            {skins.map(skin => (
                <div key={skin.instance_id} className="aspect-square bg-slate-800/50 rounded flex items-center justify-center p-1" title={`${skin.name} | ${skin.price.toFixed(2)}€`}>
                    <img src={skin.image} alt={skin.name} className="max-w-full max-h-full object-contain" />
                </div>
            ))}
        </div>
        <div className="text-right font-bold text-lg text-green-400">{value.toFixed(2)}€</div>
    </div>
);


const TradeOfferCard: React.FC<TradeOfferCardProps> = ({ trade, type, onAction }) => {
    const { user } = useUser();
    
    if (!user) return null;

    const mySkins = trade.sender_id === user.id ? trade.sender_skins : trade.recipient_skins;
    const theirSkins = trade.sender_id === user.id ? trade.recipient_skins : trade.sender_skins;
    
    const myValue = mySkins?.reduce((sum, s) => sum + s.price, 0) || 0;
    const theirValue = theirSkins?.reduce((sum, s) => sum + s.price, 0) || 0;

    const otherUser = {
        username: trade.sender_id === user.id ? trade.recipient_username : trade.sender_username,
        avatar_url: trade.sender_id === user.id ? trade.recipient_avatar_url : trade.sender_avatar_url,
    };

    const statusColors = {
        pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
        accepted: 'bg-green-500/20 text-green-400 border-green-500/50',
        declined: 'bg-red-500/20 text-red-400 border-red-500/50',
        cancelled: 'bg-gray-500/20 text-gray-400 border-gray-500/50',
    };

    const statusBackgrounds = {
        pending: 'from-yellow-900/30 to-slate-800/50',
        accepted: 'from-green-900/30 to-slate-800/50',
        declined: 'from-red-900/30 to-slate-800/50',
        cancelled: 'from-gray-800/30 to-slate-800/50',
    };

    const valueDiff = myValue - theirValue;

    return (
        <div className={`bg-gradient-to-br ${statusBackgrounds[trade.status]} border border-blue-900/50 rounded-lg p-4`}>
             <div className="flex flex-col md:flex-row items-stretch gap-4">
                <TradeColumn user={otherUser} skins={theirSkins || []} value={theirValue} title="Their Offer" />
                
                <div className="flex flex-col items-center justify-center gap-2 flex-shrink-0 w-full md:w-24">
                    <div className="text-3xl font-bold text-gray-400">⇄</div>
                    <div className="text-center bg-slate-900/50 p-2 rounded-md">
                        <p className="text-xs text-gray-400">Difference</p>
                        <p className={`font-bold ${valueDiff > 0 ? 'text-green-400' : valueDiff < 0 ? 'text-red-400' : 'text-white'}`}>
                            {valueDiff >= 0 ? '+' : ''}{valueDiff.toFixed(2)}€
                        </p>
                    </div>
                </div>

                <TradeColumn user={{ username: user.name, avatar_url: user.avatar }} skins={mySkins || []} value={myValue} title="Your Offer" />
            </div>

            <div className="flex justify-between items-center mt-4 pt-4 border-t border-blue-900/50">
                <div className="flex items-center gap-4">
                    <div className={`px-3 py-1 text-xs font-bold rounded-full border ${statusColors[trade.status]}`}>
                        {trade.status.charAt(0).toUpperCase() + trade.status.slice(1)}
                    </div>
                     <p className="text-xs text-gray-500">{new Date(trade.created_at).toLocaleString()}</p>
                </div>

                {type === 'incoming' && (
                    <div className="flex justify-end gap-3">
                        <Button onClick={() => onAction(trade.id, 'decline')} className="bg-red-600 hover:bg-red-500 !px-4 !py-1.5 text-sm">Decline</Button>
                        <Button onClick={() => onAction(trade.id, 'accept')} variant="primary" className="!px-4 !py-1.5 text-sm">Accept</Button>
                    </div>
                )}
                {type === 'outgoing' && (
                     <div className="flex justify-end gap-3">
                         <Button onClick={() => onAction(trade.id, 'cancel')} className="bg-gray-600 hover:bg-gray-500 !px-4 !py-1.5 text-sm">Cancel</Button>
                     </div>
                )}
            </div>
        </div>
    );
};

export default TradeOfferCard;