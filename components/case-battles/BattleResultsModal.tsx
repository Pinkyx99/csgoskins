
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CaseBattle } from '../../types';
import Button from '../ui/Button';

interface BattleResultsModalProps {
    battle: CaseBattle;
}

const BattleResultsModal: React.FC<BattleResultsModalProps> = ({ battle }) => {
    const navigate = useNavigate();
    const winner = battle.participants.find(p => p.id === battle.winner_id);
    const allItems = battle.participants.flatMap(p => Object.values(p.winnings));
    const totalWinningsValue = allItems.reduce((sum, item) => sum + item.price, 0);

    if (!winner) return null;

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[100] p-4 fade-in-up">
            <div 
                className="bg-[#12233f] border border-blue-900/50 rounded-lg w-full max-w-4xl max-h-[90vh] flex flex-col"
                onClick={e => e.stopPropagation()}
            >
                <div className="p-4 border-b border-blue-900/50 text-center flex-shrink-0">
                    <h3 className="font-bold text-2xl text-yellow-400 animate-pulse">
                        {winner.username} wins the battle!
                    </h3>
                    <p className="text-green-400 font-semibold text-lg">Total Value: ${totalWinningsValue.toFixed(2)}</p>
                </div>

                <div className="p-6 flex-grow overflow-y-auto">
                    <h4 className="font-semibold text-lg text-center mb-4">Items Won</h4>
                    <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3 bg-black/20 p-4 rounded-lg">
                        {allItems.sort((a,b) => b.price - a.price).map((skin, index) => (
                           <div key={`${skin.id}-${index}`} className="bg-slate-800 p-1 rounded-md" title={`${skin.name} - $${skin.price.toFixed(2)}`}>
                                <img src={skin.image} alt={skin.name} className="w-full h-auto object-contain aspect-square" />
                           </div>
                        ))}
                    </div>

                    <h4 className="font-semibold text-lg text-center mt-6 mb-4">Final Scores</h4>
                     <div className="space-y-2 max-w-md mx-auto">
                        {battle.participants.sort((a,b) => b.total_value - a.total_value).map(p => (
                             <div key={p.id} className={`flex items-center justify-between p-3 rounded-lg ${p.id === winner.id ? 'bg-green-500/20 border-2 border-green-500' : 'bg-slate-800/50'}`}>
                                <div className="flex items-center gap-3">
                                    <img src={p.avatar_url} alt={p.username} className="w-10 h-10 rounded-full object-cover" />
                                    <span className="font-semibold text-white">{p.username}</span>
                                </div>
                                 <span className="font-bold text-lg text-green-400">${p.total_value.toFixed(2)}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="p-4 border-t border-blue-900/50 flex-shrink-0 flex items-center justify-center gap-4 bg-slate-900/50 rounded-b-lg">
                    <Button onClick={() => navigate('/case-battles')} variant="primary">
                        Back to Lobby
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default BattleResultsModal;
