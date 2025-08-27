import React, { useState, useMemo } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useUser } from '../../hooks/useUser';
import { FullPublicProfile, Skin } from '../../types';
import Button from '../ui/Button';
import TradeItem from './TradeItem';

interface TradeModalProps {
    targetUser: FullPublicProfile;
    onClose: () => void;
}

const TradeInventoryPanel: React.FC<{
    title: string;
    items: Skin[];
    selectedItems: Skin[];
    onItemClick: (skin: Skin) => void;
    disabled?: boolean;
}> = ({ title, items, selectedItems, onItemClick, disabled }) => {
    return (
        <div className="bg-[#0d1a2f]/50 p-3 rounded-lg flex flex-col h-[400px]">
            <h4 className="font-semibold text-center mb-2">{title}</h4>
            <div className="flex-grow overflow-y-auto pr-1">
                <div className="grid grid-cols-3 gap-2">
                    {items.map(skin => (
                        <TradeItem 
                            key={skin.instance_id} 
                            skin={skin}
                            isSelected={selectedItems.some(s => s.instance_id === skin.instance_id)}
                            onClick={onItemClick}
                            disabled={disabled}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

const TradeModal: React.FC<TradeModalProps> = ({ targetUser, onClose }) => {
    const { user, checkUserStatus } = useUser();
    const [myOffer, setMyOffer] = useState<Skin[]>([]);
    const [theirOffer, setTheirOffer] = useState<Skin[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [tradeSent, setTradeSent] = useState(false);

    const myValue = useMemo(() => myOffer.reduce((sum, s) => sum + s.price, 0), [myOffer]);
    const theirValue = useMemo(() => theirOffer.reduce((sum, s) => sum + s.price, 0), [theirOffer]);
    const valueDiff = myValue - theirValue;

    if (!user) return null;

    const toggleMyOffer = (skin: Skin) => {
        setMyOffer(prev => prev.some(s => s.instance_id === skin.instance_id) 
            ? prev.filter(s => s.instance_id !== skin.instance_id) 
            : [...prev, skin]
        );
    };
    
    const toggleTheirOffer = (skin: Skin) => {
        setTheirOffer(prev => prev.some(s => s.instance_id === skin.instance_id) 
            ? prev.filter(s => s.instance_id !== skin.instance_id)
            : [...prev, skin]
        );
    };

    const handleSendTrade = async () => {
        if (myOffer.length === 0 && theirOffer.length === 0) {
            setError("Cannot send an empty trade offer.");
            return;
        }
        setIsLoading(true);
        setError(null);

        const myItemIds = myOffer.map(s => s.instance_id);
        const theirItemIds = theirOffer.map(s => s.instance_id);
        
        const { error: insertError } = await supabase.from('trades').insert({
            sender_id: user.id,
            recipient_id: targetUser.id,
            sender_items: myItemIds,
            recipient_items: theirItemIds,
            status: 'pending',
        });

        if (insertError) {
            setError(insertError.message);
            setIsLoading(false);
        } else {
            setTradeSent(true);
            checkUserStatus(); // Refresh inventory to lock items (future feature)
            setTimeout(onClose, 2000);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[100] p-4" onClick={onClose}>
            <div 
                className="bg-[#12233f] border border-blue-900/50 rounded-lg w-full max-w-6xl max-h-[90vh] flex flex-col"
                onClick={e => e.stopPropagation()}
            >
                <div className="p-4 border-b border-blue-900/50 flex justify-between items-center flex-shrink-0">
                    <h3 className="font-semibold text-xl text-white">Trade with {targetUser.username}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">&times;</button>
                </div>

                {tradeSent ? (
                    <div className="flex-grow flex flex-col items-center justify-center p-8 text-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-green-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        <h3 className="text-2xl font-bold">Trade Offer Sent!</h3>
                        <p className="text-gray-400 mt-2">{targetUser.username} has been notified of your offer.</p>
                    </div>
                ) : (
                    <>
                    <div className="p-4 grid grid-cols-1 lg:grid-cols-[1fr_0.75fr_1fr] gap-4 flex-grow overflow-y-auto">
                        <TradeInventoryPanel title="Your Inventory" items={user.inventory} selectedItems={myOffer} onItemClick={toggleMyOffer} />
                        
                        <div className="flex flex-col gap-4">
                            <div className="bg-[#0d1a2f]/50 p-3 rounded-lg flex flex-col h-1/2">
                                <h4 className="font-semibold text-center mb-2">Your Offer - <span className="text-green-400">{myValue.toFixed(2)}€</span></h4>
                                <div className="flex-grow overflow-y-auto pr-1">
                                    <div className="grid grid-cols-4 gap-2">
                                        {myOffer.map(s => <TradeItem key={s.instance_id} skin={s} onClick={toggleMyOffer} isSelected={true}/>)}
                                    </div>
                                </div>
                            </div>
                             <div className="bg-[#0d1a2f]/50 p-3 rounded-lg flex flex-col h-1/2">
                                <h4 className="font-semibold text-center mb-2">Their Offer - <span className="text-green-400">{theirValue.toFixed(2)}€</span></h4>
                                 <div className="flex-grow overflow-y-auto pr-1">
                                    <div className="grid grid-cols-4 gap-2">
                                        {theirOffer.map(s => <TradeItem key={s.instance_id} skin={s} onClick={toggleTheirOffer} isSelected={true}/>)}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <TradeInventoryPanel title={`${targetUser.username}'s Inventory`} items={targetUser.inventory || []} selectedItems={theirOffer} onItemClick={toggleTheirOffer} />
                    </div>

                    <div className="p-4 border-t border-blue-900/50 flex-shrink-0 flex items-center justify-between gap-4 bg-slate-900/50 rounded-b-lg">
                        <div className="text-center">
                            <p className="text-sm text-gray-400">Difference</p>
                            <p className={`text-xl font-bold ${valueDiff > 0 ? 'text-green-400' : valueDiff < 0 ? 'text-red-400' : 'text-white'}`}>
                                {valueDiff >= 0 ? '+' : ''}{valueDiff.toFixed(2)}€
                            </p>
                        </div>
                        {error && <p className="text-red-400 text-sm flex-grow text-center">{error}</p>}
                        <Button variant="glow" onClick={handleSendTrade} disabled={isLoading}>
                            {isLoading ? 'Sending...' : 'Send Trade Offer'}
                        </Button>
                    </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default TradeModal;
