
import React from 'react';
import { Skin } from '../../types';
import { rarityStyles } from '../../constants';

const SkinWearsModal: React.FC<{ skin: Skin; onClose: () => void }> = ({ skin, onClose }) => {
    const rarityStyle = rarityStyles[skin.rarity];

    if (!skin.wears || skin.wears.length === 0) return null;

    return (
        <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <div 
                className="bg-[#12233f] border border-blue-900/50 rounded-lg w-full max-w-md"
                onClick={e => e.stopPropagation()}
            >
                <div className="p-4 border-b border-blue-900/50 flex justify-between items-center">
                    <h3 className="font-semibold text-lg text-white">{skin.name}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">&times;</button>
                </div>
                <div className="p-4">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-24 h-24 bg-black/20 rounded-md flex items-center justify-center p-2">
                             <img src={skin.image} alt={skin.name} className="max-h-full max-w-full object-contain" />
                        </div>
                        <div>
                            <p className="font-bold text-white text-xl">{skin.rarity}</p>
                            <div className={`w-full h-1.5 rounded-full mt-2 ${rarityStyle.bg}`}></div>
                        </div>
                    </div>
                    <div className="space-y-2">
                        {skin.wears.map(wear => (
                            <div key={wear.name} className="bg-[#0d1a2f] p-3 rounded-md flex justify-between items-center text-sm">
                                <span className="font-medium text-gray-300 w-1/3">{wear.name}</span>
                                <span className="font-semibold text-green-400 w-1/3 text-center">${wear.price.toFixed(2)}</span>
                                <span className="font-medium text-blue-300 w-1/3 text-right">{wear.chance.toFixed(4)}%</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SkinWearsModal;