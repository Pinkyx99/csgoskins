import React from 'react';
import { Skin, SkinRarity } from '../../types';
import { rarityStyles } from '../../constants';
import Button from '../ui/Button';

interface InventorySkinCardProps {
    skin: Skin;
    onSell: () => void;
}

const InventorySkinCard: React.FC<InventorySkinCardProps> = ({ skin, onSell }) => {
    const rarityStyle = rarityStyles[skin.rarity] || rarityStyles[SkinRarity.Consumer];

    const nameParts = skin.name.split(' | ');
    const weaponName = nameParts[0];
    const skinName = nameParts.length > 1 ? nameParts.slice(1).join(' | ') : '';

    return (
        <div className={`relative bg-gradient-to-b from-[#1a2c47] to-[#12233f] rounded-lg p-3 text-center transition-transform transform hover:-translate-y-1 group border-t-2 ${rarityStyle.border} flex flex-col justify-between h-full`}>
            <div className={`absolute -top-px left-0 right-0 h-1 ${rarityStyle.bg} opacity-50 blur-md group-hover:opacity-80 transition-opacity`}></div>
            
            <div className="h-24 flex items-center justify-center my-2">
                <img src={skin.image} alt={skin.name} className="max-h-20 object-contain z-10 drop-shadow-lg" />
            </div>

            <div className="mt-2 h-10 flex flex-col justify-center">
                <p className="text-white text-sm font-medium truncate" title={weaponName}>{weaponName}</p>
                <p className={`text-xs truncate ${rarityStyle.text}`} title={skinName}>{skinName}</p>
            </div>
            <div className="mt-3">
                <Button onClick={onSell} variant="secondary" className="w-full !py-1.5 !px-2 text-sm bg-yellow-600 hover:bg-yellow-500 focus:ring-yellow-500">
                    Sell for ${skin.price.toFixed(2)}
                </Button>
            </div>
        </div>
    );
};

export default InventorySkinCard;
