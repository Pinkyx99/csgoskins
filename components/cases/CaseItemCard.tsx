
import React, { useState } from 'react';
import { Skin, SkinRarity } from '../../types';
import { rarityStyles } from '../../constants';
import SkinWearsModal from './SkinWearsModal';

const InfoIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
    </svg>
);

const CaseItemCard: React.FC<{ skin: Skin }> = ({ skin }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const rarityStyle = rarityStyles[skin.rarity] || rarityStyles[SkinRarity.Consumer];

    const nameParts = skin.name.split(' | ');
    const weaponName = nameParts[0];
    const skinName = nameParts[1] || '';
    
    const handleInfoClick = (e: React.MouseEvent) => {
        if (skin.wears && skin.wears.length > 0) {
            e.preventDefault();
            e.stopPropagation();
            setIsModalOpen(true);
        }
    };


    return (
        <>
            <div className={`relative bg-gradient-to-b from-[#1a2c47] to-[#12233f] rounded-lg p-3 text-center transition-transform transform hover:-translate-y-1 group border-t-2 ${rarityStyle.border}`}>
                <div className={`absolute -top-px left-0 right-0 h-1 ${rarityStyle.bg} opacity-50 blur-md group-hover:opacity-80 transition-opacity`}></div>
                
                <div className="flex justify-between items-center text-xs text-gray-400 mb-2">
                    <button onClick={handleInfoClick} className="disabled:opacity-20 z-10"><InfoIcon /></button>
                    <span className="font-semibold">{skin.chance.toFixed(4)}%</span>
                </div>

                <div className="h-24 flex items-center justify-center">
                     <div className="relative w-full h-full flex items-center justify-center">
                        <svg className="absolute w-28 h-28 text-gray-500/10 group-hover:text-blue-500/20 transition-colors" viewBox="0 0 100 100">
                            <polygon points="50,5 95,25 95,75 50,95 5,75 5,25" stroke="currentColor" strokeWidth="2" fill="none"/>
                        </svg>
                        <img src={skin.image} alt={skin.name} className="max-h-20 object-contain z-10 drop-shadow-lg" />
                     </div>
                </div>

                <div className="mt-2 h-10 flex flex-col justify-center">
                    <p className="text-white text-sm font-medium truncate" title={weaponName}>{weaponName}</p>
                    <p className={`text-xs truncate ${rarityStyle.text}`} title={skinName}>{skinName}</p>
                </div>
            </div>
            {isModalOpen && <SkinWearsModal skin={skin} onClose={() => setIsModalOpen(false)} />}
        </>
    );
};

export default CaseItemCard;