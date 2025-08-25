import React from 'react';
import { Skin } from '../../types';
import { rarityStyles } from '../../constants';

interface SpinnerItemCardProps {
    skin: Skin;
    isWinner: boolean;
}

const SpinnerItemCard: React.FC<SpinnerItemCardProps> = ({ skin, isWinner }) => {
    const rarityStyle = rarityStyles[skin.rarity];

    const nameParts = skin.name.split(' | ');
    const weaponName = nameParts[0];
    const skinName = nameParts.length > 1 ? nameParts.slice(1).join(' | ') : '';

    return (
        // The outer div now only provides layout spacing and context.
        <div className={`w-52 h-52 flex-shrink-0 mx-1 spinner-item ${isWinner ? 'winner' : ''}`}>
             {/* This inner div is targeted for scaling and filtering to prevent layout shifts. */}
            <div className="inner-card-wrapper w-full h-full">
                <div className={`relative w-full h-full flex flex-col items-center justify-between p-2 rounded-lg`}>
                    {/* Background and Border */}
                    <div className={`absolute inset-0 bg-gradient-to-b from-slate-800 to-slate-900 rounded-lg border-2 ${isWinner ? rarityStyle.border : 'border-slate-700'}`}></div>
                    
                    {/* Rarity Glow for Winner */}
                    {isWinner && (
                        <div className={`absolute -inset-1 ${rarityStyle.bg} opacity-50 blur-lg animate-pulse rounded-lg`}></div>
                    )}

                    {/* Shine effect for Winner */}
                    {isWinner && <div className="shine-effect"></div>}

                    {/* Content */}
                    <div className="relative z-10 text-center flex flex-col justify-between items-center h-full w-full">
                        {/* Rarity Bar */}
                        <div className={`absolute bottom-0 left-2 right-2 h-1 rounded-full ${rarityStyle.bg}`}></div>

                        <div className="relative flex-grow flex items-center justify-center w-full h-28 my-1">
                             <svg className="absolute w-32 h-32 text-gray-500/10" viewBox="0 0 100 100">
                                <polygon points="50,5 95,25 95,75 50,95 5,75 5,25" fill="currentColor"/>
                            </svg>
                            <img src={skin.image} alt={skin.name} className="relative z-10 max-h-24 object-contain drop-shadow-lg" />
                        </div>
                        
                        <div className="w-full text-center">
                            <p className="text-sm font-semibold truncate text-white px-1" title={weaponName}>{weaponName}</p>
                            <p className={`text-xs truncate ${rarityStyle.text} px-1`} title={skinName}>{skinName}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SpinnerItemCard;