
import React from 'react';
import { Case } from '../../types';

interface ThemedCaseCardProps {
    caseItem: Case;
    onClick: () => void;
}

const ThemedCaseCard: React.FC<ThemedCaseCardProps> = ({ caseItem, onClick }) => {
    const priceStyle: React.CSSProperties = {
        clipPath: 'polygon(15% 0%, 85% 0, 100% 100%, 0% 100%)',
    };

    return (
        <div 
            className="bg-gradient-to-b from-orange-400 to-yellow-600 rounded-lg p-0.5 cursor-pointer transition-all duration-300 hover:scale-105 hover:-translate-y-2 hover:shadow-2xl hover:shadow-yellow-500/20 group"
            onClick={onClick}
        >
            <div className="bg-[#2a221a] h-full rounded-md flex flex-col items-center justify-between p-4">
                <h3 className="text-white font-semibold truncate transition-colors">{caseItem.name}</h3>
                <div className="flex-grow flex items-center justify-center my-4">
                     <img src={caseItem.image} alt={caseItem.name} className="max-h-32 object-contain group-hover:scale-110 transition-transform duration-300" />
                </div>
                <div 
                    className="w-28 h-9 flex items-center justify-center bg-gradient-to-b from-orange-400 to-yellow-600"
                    style={priceStyle}
                >
                    <p className="text-slate-900 font-bold text-sm text-center">
                        {caseItem.price === 0 ? 'Free' : `${caseItem.price.toFixed(2)}€`}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ThemedCaseCard;