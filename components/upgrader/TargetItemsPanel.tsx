

import React, { useState, useMemo } from 'react';
import { Skin } from '../../types';
import UpgraderSkinCard from './UpgraderSkinCard';

interface TargetItemsPanelProps {
    skins: Skin[];
    selectedSkinId: string | undefined;
    onSelectSkin: (skin: Skin) => void;
    inventorySkinPrice?: number;
}

const TargetItemsPanel: React.FC<TargetItemsPanelProps> = ({ skins, selectedSkinId, onSelectSkin }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const [fromValue, setFromValue] = useState('');
    const [toValue, setToValue] = useState('');

    const filteredAndSortedSkins = useMemo(() => {
        return skins
        .filter(skin => skin.name.toLowerCase().includes(searchTerm.toLowerCase()))
        .filter(skin => fromValue ? skin.price >= parseFloat(fromValue) : true)
        .filter(skin => toValue ? skin.price <= parseFloat(toValue) : true)
        .sort((a, b) => sortOrder === 'desc' ? b.price - a.price : a.price - b.price);
    }, [skins, searchTerm, fromValue, toValue, sortOrder]);

     const handleSortToggle = () => {
        setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc');
    };
    
    const inputStyles = "w-full bg-[#1a2c47] border border-blue-800/50 rounded-md py-2 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500";

    return (
        <div className="bg-[#0d1a2f] p-4 rounded-lg border border-blue-900/50 h-[600px] flex flex-col">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-white font-semibold text-lg">Items to get</h3>
                <button onClick={handleSortToggle} className="bg-[#1a2c47] text-gray-300 px-3 py-1.5 rounded-md text-sm hover:bg-[#253d63]">
                    Price {sortOrder === 'desc' ? '↓' : '↑'}
                </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-4">
                 <div className="relative col-span-1 sm:col-span-3">
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={inputStyles}
                    />
                     <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"></path></svg>
                </div>
                <input type="number" placeholder="From value" value={fromValue} onChange={e => setFromValue(e.target.value)} className={inputStyles} />
                <input type="number" placeholder="To value" value={toValue} onChange={e => setToValue(e.target.value)} className={inputStyles} />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 flex-grow overflow-y-auto pr-2">
                {filteredAndSortedSkins.map(skin => (
                    <UpgraderSkinCard
                        key={skin.id}
                        skin={skin}
                        isSelected={skin.id === selectedSkinId}
                        onSelect={() => onSelectSkin(skin)}
                    />
                ))}
            </div>
        </div>
    );
};

export default TargetItemsPanel;