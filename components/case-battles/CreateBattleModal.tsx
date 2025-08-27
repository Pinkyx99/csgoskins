import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { MOCK_CASES } from '../../constants';
import { Case } from '../../types';
import { useUser } from '../../hooks/useUser';
import Button from '../ui/Button';
import { supabase } from '../../lib/supabaseClient';

interface CreateBattleModalProps {
    onClose: () => void;
}

const BattleCaseCard: React.FC<{ caseItem: Case; onClick: () => void }> = ({ caseItem, onClick }) => (
    <div 
        onClick={onClick}
        className="relative p-2 rounded-lg cursor-pointer bg-slate-800/50 border-2 border-transparent hover:border-blue-500 transition-colors group"
    >
        <div className="aspect-square flex items-center justify-center">
             <img src={caseItem.image} alt={caseItem.name} className="w-full h-auto object-contain max-h-20 group-hover:scale-110 transition-transform"/>
        </div>
        <p className="text-center text-xs text-green-400 font-semibold mt-1">{caseItem.price.toFixed(2)}€</p>
    </div>
);


const CreateBattleModal: React.FC<CreateBattleModalProps> = ({ onClose }) => {
    const [selectedCases, setSelectedCases] = useState<Case[]>([]);
    const [playerCount, setPlayerCount] = useState(2);
    const [isCreating, setIsCreating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { user } = useUser();
    const navigate = useNavigate();

    const totalCost = useMemo(() => selectedCases.reduce((sum, c) => sum + c.price, 0), [selectedCases]);

    const addCase = (caseItem: Case) => {
        if (selectedCases.length < 10) {
            setSelectedCases(prev => [...prev, caseItem]);
        }
    };

    const removeCase = (indexToRemove: number) => {
        setSelectedCases(prev => prev.filter((_, index) => index !== indexToRemove));
    };

    const handleCreateBattle = async () => {
        if (!user || selectedCases.length === 0 || totalCost > user.balance || isCreating) return;

        setIsCreating(true);
        setError(null);
        
        try {
            const { data, error: rpcError } = await supabase.rpc('create_case_battle', {
                p_cases: selectedCases,
                p_max_players: playerCount,
                p_total_value: totalCost
            });

            if (rpcError) throw rpcError;

            // The RPC returns the new battle ID
            const newBattleId = data;
            navigate(`/case-battles/${newBattleId}`);
            onClose();

        } catch (err: any) {
            console.error("Failed to create battle:", err);
            setError(err.message || 'An unexpected error occurred.');
        } finally {
            setIsCreating(false);
        }
    };

    const canAfford = user && totalCost <= user.balance;

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[100] p-4" onClick={onClose}>
            <div 
                className="bg-[#12233f] border border-blue-900/50 rounded-lg w-full max-w-3xl max-h-[90vh] flex flex-col"
                onClick={e => e.stopPropagation()}
            >
                <div className="p-4 border-b border-blue-900/50 flex justify-between items-center flex-shrink-0">
                    <h3 className="font-semibold text-xl text-white">Create a Case Battle</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">&times;</button>
                </div>

                <div className="p-6 flex-grow overflow-y-auto">
                    <h4 className="font-semibold mb-2">Selected Cases ({selectedCases.length}/10)</h4>
                    <div className="bg-slate-900/50 p-2 rounded-lg min-h-[110px] flex items-center gap-2 overflow-x-auto mb-4">
                        {selectedCases.length === 0 ? (
                            <p className="text-gray-500 text-sm w-full text-center">Select cases from the list below</p>
                        ) : (
                            selectedCases.map((sc, index) => (
                                <div key={index} className="relative flex-shrink-0 w-24 text-center group bg-[#12233f] p-1 rounded-md">
                                    <img src={sc.image} alt={sc.name} className="w-16 h-16 object-contain mx-auto"/>
                                    <p className="text-xs truncate text-gray-300">{sc.name}</p>
                                    <p className="text-xs font-bold text-green-400">{sc.price.toFixed(2)}€</p>
                                    <button 
                                        onClick={() => removeCase(index)} 
                                        className="absolute -top-1 -right-1 bg-red-600 rounded-full w-5 h-5 text-white text-xs font-bold flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        &times;
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                    
                    <h4 className="font-semibold mb-3">Case List</h4>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 max-h-56 overflow-y-auto pr-2">
                        {MOCK_CASES.map(caseItem => (
                           <BattleCaseCard 
                                key={caseItem.id}
                                caseItem={caseItem}
                                onClick={() => addCase(caseItem)}
                           />
                        ))}
                    </div>

                    <h4 className="font-semibold mt-6 mb-3">Number of Players</h4>
                    <div className="flex gap-3">
                        {[2, 3, 4].map(num => (
                             <button 
                                key={num}
                                onClick={() => setPlayerCount(num)}
                                className={`w-16 h-12 rounded-md flex items-center justify-center text-lg font-bold transition-colors ${playerCount === num ? 'bg-blue-600 border-2 border-blue-400' : 'bg-[#1a2c47] text-gray-400 hover:bg-blue-800/50'}`}
                            >
                                {num}
                            </button>
                        ))}
                    </div>
                    {error && <p className="text-red-400 text-sm mt-4">{error}</p>}
                </div>

                <div className="p-4 border-t border-blue-900/50 flex-shrink-0 flex items-center justify-between gap-4 bg-slate-900/50 rounded-b-lg">
                    <div className="flex items-center gap-4">
                        <div className="flex -space-x-4">
                            {selectedCases.slice(0, 5).map((c, i) => <img key={`${c.id}-${i}`} src={c.image} alt={c.name} className="w-10 h-10 object-contain bg-slate-800 rounded-full border-2 border-slate-700" title={c.name}/>)}
                        </div>
                         <div>
                            <p className="text-gray-400 text-sm">Total Cost</p>
                            <p className={`text-2xl font-bold ${canAfford ? 'text-green-400' : 'text-red-500'}`}>{totalCost.toFixed(2)}€</p>
                        </div>
                    </div>
                    <Button onClick={handleCreateBattle} disabled={!canAfford || selectedCases.length === 0 || isCreating} variant="primary" className="text-lg !py-3 !px-6">
                        {isCreating ? 'Creating...' : 'Create Battle'}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default CreateBattleModal;