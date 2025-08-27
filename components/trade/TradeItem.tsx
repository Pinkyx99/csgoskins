import React from 'react';
import { Skin } from '../../types';
import { rarityStyles } from '../../constants';

interface TradeItemProps {
    skin: Skin;
    isSelected?: boolean;
    onClick: (skin: Skin) => void;
    disabled?: boolean;
}

const TradeItem: React.FC<TradeItemProps> = ({ skin, isSelected, onClick, disabled }) => {
    const rarityStyle = rarityStyles[skin.rarity];
    
    return (
        <div 
            className={`relative p-2 rounded-lg aspect-square flex flex-col items-center justify-center cursor-pointer transition-all duration-200 group ${isSelected ? 'bg-blue-500/20' : 'bg-slate-800/50'} ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-800/30'}`}
            onClick={() => !disabled && onClick(skin)}
            title={`${skin.name}\n$${skin.price.toFixed(2)}`}
        >
            <div className={`absolute bottom-0 left-0 right-0 h-1 rounded-b-md ${rarityStyle.bg}`}></div>
            <div className="flex-grow flex items-center justify-center w-full h-16">
                 <img src={skin.image} alt={skin.name} className="max-h-full max-w-full object-contain drop-shadow-lg" />
            </div>
            <p className="text-white text-xs font-bold truncate w-full text-center mt-1">${skin.price.toFixed(2)}</p>

             {isSelected && (
                <div className="absolute inset-0 bg-blue-500/30 rounded-lg flex items-center justify-center border-2 border-blue-400">
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
            )}
        </div>
    );
};

export default TradeItem;
