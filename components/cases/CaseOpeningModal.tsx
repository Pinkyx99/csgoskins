import React from 'react';
import { Skin, SkinRarity } from '../../types';
import { rarityStyles } from '../../constants';
import Button from '../ui/Button';

// --- Sub-component for a single winning item ---
interface WinningItemCardProps {
    skin: Skin;
}

const WinningItemCard: React.FC<WinningItemCardProps> = ({ skin }) => {
    const rarityStyle = rarityStyles[skin.rarity] || rarityStyles[SkinRarity.Consumer];

    const nameParts = skin.name.split(' | ');
    const weaponName = nameParts[0];
    const skinName = nameParts.length > 1 ? nameParts.slice(1).join(' | ') : '';

    return (
        <div className={`relative bg-gradient-to-b from-[#1a2c47] to-[#12233f] rounded-lg p-3 text-center transition-transform transform hover:-translate-y-1 group border-t-2 ${rarityStyle.border}`}>
            <div className={`absolute -top-px left-0 right-0 h-1 ${rarityStyle.bg} opacity-50 blur-md group-hover:opacity-80 transition-opacity`}></div>
            
            <div className="h-24 flex items-center justify-center">
                <img src={skin.image} alt={skin.name} className="max-h-20 object-contain z-10 drop-shadow-lg" />
            </div>

            <div className="mt-2 h-10 flex flex-col justify-center">
                <p className="text-white text-sm font-medium truncate" title={weaponName}>{weaponName}</p>
                <p className={`text-xs truncate ${rarityStyle.text}`} title={skinName}>{skinName}</p>
            </div>
            <div className="mt-2 text-center">
                <p className="text-sm font-semibold text-green-400">${skin.price.toFixed(2)}</p>
            </div>
        </div>
    );
};


// --- Main Modal Component ---
interface CaseOpeningModalProps {
    winnings: Skin[];
    onClose: () => void;
    onSell: (totalValue: number) => void;
    caseName: string;
}

const CaseOpeningModal: React.FC<CaseOpeningModalProps> = ({ winnings, onClose, onSell, caseName }) => {
    const totalValue = winnings.reduce((sum, skin) => sum + skin.price, 0);

    const handleSell = () => {
        onSell(totalValue);
    };

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[100] p-4 fade-in-up">
            <div 
                className="bg-[#12233f] border border-blue-900/50 rounded-lg w-full max-w-4xl max-h-[90vh] flex flex-col"
                onClick={e => e.stopPropagation()}
            >
                <div className="p-4 border-b border-blue-900/50 flex justify-between items-center flex-shrink-0">
                    <h3 className="font-semibold text-xl text-white">Your winnings from {caseName}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">&times;</button>
                </div>

                <div className="p-6 flex-grow overflow-y-auto">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {winnings.map((skin, index) => (
                            <WinningItemCard key={`${skin.id}-${index}`} skin={skin} />
                        ))}
                    </div>
                </div>

                <div className="p-4 border-t border-blue-900/50 flex-shrink-0 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900/50 rounded-b-lg">
                    <div className="text-center sm:text-left">
                        <p className="text-gray-400 text-sm">Total Value</p>
                        <p className="text-2xl font-bold text-green-400">${totalValue.toFixed(2)}</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button onClick={handleSell} variant="secondary" className="bg-yellow-600 hover:bg-yellow-500 focus:ring-yellow-500">
                            Sell all for ${totalValue.toFixed(2)}
                        </Button>
                         <Button onClick={onClose} variant="primary">
                            Keep All Items
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CaseOpeningModal;