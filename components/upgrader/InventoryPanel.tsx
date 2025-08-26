

import React, { useState, useMemo, useEffect } from 'react';
import { Skin } from '../../types';
import UpgraderSkinCard from './UpgraderSkinCard';

interface InventoryPanelProps {
    inventory: Skin[];
    selectedSkinIds: string[];
    onToggleSkin: (skin: Skin) => void;
}

const ITEMS_PER_PAGE = 24;

const InventoryPanel: React.FC<InventoryPanelProps> = ({ inventory, selectedSkinIds, onToggleSkin }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const [currentPage, setCurrentPage] = useState(1);

    const filteredAndSortedInventory = useMemo(() => {
        return inventory
            .filter(skin => skin.name.toLowerCase().includes(searchTerm.toLowerCase()))
            .sort((a, b) => sortOrder === 'desc' ? b.price - a.price : a.price - b.price);
    }, [inventory, searchTerm, sortOrder]);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, sortOrder]);

    const totalPages = Math.ceil(filteredAndSortedInventory.length / ITEMS_PER_PAGE);

    const paginatedSkins = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        const end = start + ITEMS_PER_PAGE;
        return filteredAndSortedInventory.slice(start, end);
    }, [currentPage, filteredAndSortedInventory]);

    const handleSortToggle = () => {
        setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc');
    };

    return (
        <div className="bg-[#0d1a2f] p-4 rounded-lg border border-blue-900/50 h-[600px] flex flex-col">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-white font-semibold text-lg">My Inventory</h3>
                <button onClick={handleSortToggle} className="bg-[#1a2c47] text-gray-300 px-3 py-1.5 rounded-md text-sm hover:bg-[#253d63]">
                    Price {sortOrder === 'desc' ? '↓' : '↑'}
                </button>
            </div>
            <div className="relative mb-4">
                <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-[#1a2c47] border border-blue-800/50 rounded-md py-2 pl-4 pr-10 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"></path></svg>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 flex-grow overflow-y-auto pr-2">
                {paginatedSkins.map(skin => (
                    <UpgraderSkinCard
                        key={skin.instance_id}
                        skin={skin}
                        isSelected={selectedSkinIds.includes(skin.instance_id!)}
                        onSelect={() => onToggleSkin(skin)}
                    />
                ))}
            </div>
             {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-4 flex-shrink-0">
                    <button 
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))} 
                        disabled={currentPage === 1} 
                        className="px-3 py-1.5 bg-[#1a2c47] rounded-md disabled:opacity-50 text-gray-300 hover:bg-blue-800/50 transition-colors"
                    >
                        &lt;
                    </button>
                    <span className="text-gray-400 text-sm font-semibold">Page {currentPage} of {totalPages}</span>
                    <button 
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} 
                        disabled={currentPage === totalPages} 
                        className="px-3 py-1.5 bg-[#1a2c47] rounded-md disabled:opacity-50 text-gray-300 hover:bg-blue-800/50 transition-colors"
                    >
                        &gt;
                    </button>
                </div>
            )}
        </div>
    );
};

export default InventoryPanel;