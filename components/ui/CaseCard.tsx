
import React from 'react';
import { Case } from '../../types';

interface CaseCardProps {
    caseItem: Case;
    onClick: () => void;
}

const CaseCard: React.FC<CaseCardProps> = ({ caseItem, onClick }) => {
    const priceStyle: React.CSSProperties = {
        clipPath: 'polygon(10% 0%, 90% 0%, 100% 50%, 90% 100%, 10% 100%, 0% 50%)',
    };

    return (
        <div 
            className="bg-[#12233f] border border-blue-900/50 rounded-lg p-4 flex flex-col items-center justify-between cursor-pointer transition-all duration-300 hover:border-blue-500 hover:scale-105 hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-500/20 group h-full"
            onClick={onClick}
        >
            <div className="flex items-center justify-center gap-2">
                <h3 className="text-gray-300 group-hover:text-white font-semibold truncate transition-colors">{caseItem.name}</h3>
                {caseItem.isNew && <span className="bg-blue-500 text-white text-xs font-bold px-2 py-0.5 rounded-sm flex-shrink-0">New</span>}
            </div>
            <div className="flex-grow flex items-center justify-center my-4">
                 <img src={caseItem.image} alt={caseItem.name} className="max-h-32 object-contain group-hover:scale-110 transition-transform duration-300" />
            </div>
            <div 
                className="w-28 h-9 flex items-center justify-center bg-[#0d1a2f]"
                style={priceStyle}
            >
                <p className="text-white font-semibold text-sm text-center">
                    {caseItem.price === 0 ? 'Free' : `${caseItem.price.toFixed(2)}€`}
                </p>
            </div>
        </div>
    );
};

export default CaseCard;