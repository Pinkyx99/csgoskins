
import React from 'react';
import { Skin } from '../../types';
import { rarityStyles } from '../../constants';

interface BattleWonSkinCardProps {
    skin: Skin;
}

const BattleWonSkinCard: React.FC<BattleWonSkinCardProps> = ({ skin }) => {
    const rarityStyle = rarityStyles[skin.rarity];

    return (
        <div 
            className={`relative bg-gradient-to-b from-[#1a2c47] to-[#12233f] p-2 rounded-lg flex-shrink-0 border-t-2 ${rarityStyle.border} animate-fade-in w-24 h-24 flex flex-col items-center justify-center`}
            title={`${skin.name} - $${skin.price.toFixed(2)}`}
        >
            <div className={`absolute -top-px left-0 right-0 h-1 ${rarityStyle.bg} opacity-50 blur-md`}></div>
            
            <div className="flex-grow flex items-center justify-center">
                 <img src={skin.image} alt={skin.name} className="max-h-16 max-w-full object-contain drop-shadow-lg" />
            </div>

            <div className="absolute bottom-1 right-1 bg-black/70 text-white text-[10px] px-1.5 py-0.5 rounded font-bold">
                ${skin.price.toFixed(2)}
            </div>
            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: scale(0.8); }
                    to { opacity: 1; transform: scale(1); }
                }
                .animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
            `}</style>
        </div>
    );
};

export default BattleWonSkinCard;
