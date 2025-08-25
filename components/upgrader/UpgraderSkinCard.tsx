

import React from 'react';
import { Skin, SkinRarity } from '../../types';
import { rarityStyles } from '../../constants';

interface UpgraderSkinCardProps {
    skin: Skin;
    isSelected: boolean;
    onSelect: () => void;
}

const CheckIcon = () => (
    <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
    </svg>
);

const PlusIcon = () => (
    <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
    </svg>
);

const UpgraderSkinCard: React.FC<UpgraderSkinCardProps> = ({ skin, isSelected, onSelect }) => {
    const rarityStyle = rarityStyles[skin.rarity] || rarityStyles[SkinRarity.Consumer];
    
    const nameParts = skin.name.split(' | ');
    const weaponName = nameParts.length > 1 ? nameParts[1] : nameParts[0];
    const skinType = nameParts.length > 1 ? nameParts[0] : skin.rarity;

    return (
        <div 
            className="relative bg-[#1e293b] rounded-lg p-3 flex flex-col justify-between cursor-pointer transition-all duration-200 h-full group"
            onClick={onSelect}
        >
            <div className={`absolute top-0 left-0 right-0 h-1 rounded-t-md ${rarityStyle.bg}`}></div>
            
            <div className="absolute top-2 left-2 text-blue-300 text-xs font-bold">FN</div>

            <div className="h-24 w-full flex items-center justify-center my-4 relative">
                <svg className="absolute w-28 h-28 text-slate-700/50" viewBox="0 0 100 100">
                    <polygon points="50,5 95,25 95,75 50,95 5,75 5,25" stroke="currentColor" strokeWidth="2" fill="none"/>
                </svg>
                <img src={skin.image} alt={skin.name} className="max-h-20 max-w-full object-contain drop-shadow-lg z-10" />
            </div>

            <div className="w-full text-center mt-auto flex-grow flex flex-col justify-end">
                <p className="text-white text-sm font-bold truncate">{weaponName}</p>
                <p className="text-gray-400 text-xs font-medium truncate">{skinType}</p>
            </div>

            <div className="bg-slate-900/70 rounded-md py-2 px-3 text-center mt-3">
                <p className="text-white font-bold text-sm">{skin.price.toFixed(2)}€</p>
            </div>

            {isSelected ? (
                <div className="absolute inset-0 bg-green-500/30 rounded-lg flex items-center justify-center backdrop-blur-sm">
                    <div className="w-12 h-12 bg-green-500/80 rounded-full flex items-center justify-center shadow-lg">
                        <CheckIcon />
                    </div>
                </div>
            ) : (
                <div className="absolute inset-0 bg-blue-500/30 rounded-lg flex items-center justify-center backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-12 h-12 bg-blue-500/80 rounded-full flex items-center justify-center shadow-lg">
                        <PlusIcon />
                    </div>
                </div>
            )}
        </div>
    );
};

export default UpgraderSkinCard;