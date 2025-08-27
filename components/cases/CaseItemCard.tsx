import React, { useState } from 'react';
import { Skin, SkinRarity } from '../../types';
import { rarityStyles } from '../../constants';
import SkinWearsModal from './SkinWearsModal';

const InfoIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
    </svg>
);

interface CaseItemCardProps {
    skin: Skin;
    isJesterMode?: boolean;
    jesterChance?: number;
}

const CaseItemCard: React.FC<CaseItemCardProps> = ({ skin, isJesterMode, jesterChance }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const rarityStyle = rarityStyles[skin.rarity] || rarityStyles[SkinRarity.Consumer];

    const nameParts = skin.name.split(' | ');
    const weaponName = nameParts[0];
    const skinName = nameParts[1] || '';

    const jesterRarityStyle = {
        bg: 'bg-purple-500',
        text: 'text-purple-300'
    };

    const finalRarityStyle = isJesterMode ? jesterRarityStyle : rarityStyle;
    
    const handleInfoClick = (e: React.MouseEvent) => {
        if (skin.wears && skin.wears.length > 0) {
            e.preventDefault();
            e.stopPropagation();
            setIsModalOpen(true);
        }
    };


    return (
        <>
            <div className={`relative flex flex-col bg-[#101F38] rounded-lg p-4 text-center transition-all duration-300 group hover:-translate-y-2 hover:shadow-2xl ${isJesterMode ? 'hover:shadow-purple-500/20' : 'hover:shadow-blue-500/20'} border border-slate-800 h-full`}>
                <div className="flex justify-between items-center text-xs text-gray-400 mb-2">
                    <button 
                        onClick={handleInfoClick} 
                        className="disabled:opacity-20 z-10 p-1 -m-1 hover:bg-slate-700 rounded-full transition-colors"
                        disabled={!skin.wears || skin.wears.length === 0}
                    >
                        <InfoIcon />
                    </button>
                    <span className="font-semibold">{jesterChance ? `${jesterChance.toFixed(3)}%` : `${skin.chance.toFixed(4)}%`}</span>
                </div>

                <div className="flex-grow flex items-center justify-center my-2">
                     <div className="relative w-full h-full flex items-center justify-center">
                        <svg className={`absolute w-36 h-36 text-gray-500/5 ${isJesterMode ? 'group-hover:text-purple-500/10' : 'group-hover:text-blue-500/10'} transition-colors duration-300`} viewBox="0 0 100 100">
                            <polygon points="50,5 95,25 95,75 50,95 5,75 5,25" stroke="currentColor" strokeWidth="2" fill="none"/>
                        </svg>
                        <img 
                            src={skin.image} 
                            alt={skin.name} 
                            className="max-h-28 object-contain z-10 drop-shadow-lg group-hover:scale-110 transition-transform duration-300" 
                        />
                     </div>
                </div>

                <div className="mt-auto">
                     <div className="h-12 flex flex-col justify-center">
                        <p className="text-white text-base font-medium truncate" title={weaponName}>{weaponName}</p>
                        <p className={`text-sm truncate ${finalRarityStyle.text} transition-colors duration-300`} title={skinName}>{skinName}</p>
                    </div>
                     <div className="bg-slate-900/50 rounded-md py-1 px-3 text-center mt-2">
                        <p className="text-green-400 font-bold text-sm">${skin.price.toFixed(2)}</p>
                    </div>
                </div>

                <div className={`w-full h-1.5 ${finalRarityStyle.bg} rounded-b-md absolute bottom-0 left-0 transition-colors duration-300`}></div>
            </div>
            {isModalOpen && <SkinWearsModal skin={skin} onClose={() => setIsModalOpen(false)} />}
        </>
    );
};

export default CaseItemCard;