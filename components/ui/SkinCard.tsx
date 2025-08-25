import React from 'react';
import { Skin, SkinRarity } from '../../types';
import { rarityStyles } from '../../constants';

interface SkinCardProps {
    skin: Skin;
}

const SkinCard: React.FC<SkinCardProps> = ({ skin }) => {
    const rarityStyle = rarityStyles[skin.rarity] || rarityStyles[SkinRarity.Consumer];

    return (
        <div className={`relative bg-slate-800/50 rounded-lg p-2 flex flex-col items-center justify-between border-b-4 ${rarityStyle.border}`}>
             <div className="absolute top-1 right-1 bg-black/50 text-white text-xs px-1.5 py-0.5 rounded">
                {skin.chance.toFixed(4)}%
            </div>
            <div className="flex-grow flex items-center justify-center my-4 h-20">
                <img src={skin.image} alt={skin.name} className="max-h-full max-w-full object-contain" />
            </div>
            <div className="text-center w-full">
                <p className="text-sm font-semibold truncate text-white">{skin.name}</p>
                <p className={`text-xs ${rarityStyle.text}`}>{skin.rarity}</p>
            </div>
        </div>
    );
};

export default SkinCard;