

import React from 'react';
import { CaseBattleParticipant, Reel } from '../../types';
import SpinnerReel from '../cases/SpinnerReel';
import BattleWonSkinCard from './BattleWonSkinCard';

interface BattlePlayerViewProps {
    participant: CaseBattleParticipant;
    reel: Reel | undefined;
    isSpinFinished: boolean;
    onSpinComplete: () => void;
}

const BattlePlayerView: React.FC<BattlePlayerViewProps> = ({ participant, reel, isSpinFinished, onSpinComplete }) => {
    return (
        <div className="bg-[#0d1a2f]/50 border border-blue-900/50 rounded-lg p-3">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 min-w-0">
                    <img src={participant.avatar_url} alt={participant.username} className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
                    <span className="font-semibold text-white truncate">{participant.username}</span>
                </div>
                <span className="font-bold text-green-400 text-lg flex-shrink-0">${participant.total_value.toFixed(2)}</span>
            </div>

            <div className="relative w-full overflow-hidden bg-black/20 rounded-lg p-2 flex flex-col items-center justify-center gap-2 border-2 border-slate-800">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0.5 h-full z-30 pointer-events-none bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)] rounded-full"></div>
                <div className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-[#0d1a2f]/80 via-[#0d1a2f]/50 to-transparent z-20 pointer-events-none"></div>
                <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#0d1a2f]/80 via-[#0d1a2f]/50 to-transparent z-20 pointer-events-none"></div>
                
                 {reel ? (
                     <SpinnerReel
                        key={reel.key}
                        items={reel.fullItems}
                        winner={reel.winner}
                        winnerIndex={reel.winnerIndex}
                        isFinished={isSpinFinished}
                        onAnimationComplete={onSpinComplete}
                        animationDelay={0}
                    />
                 ) : (
                    <div className="h-48 flex items-center justify-center text-gray-500">Waiting for round...</div>
                 )}
            </div>

            <div className="flex gap-2 mt-3 overflow-x-auto min-h-[7rem] items-center p-2 rounded-lg bg-slate-900/50">
                {Object.values(participant.winnings).map((skin, i) => (
                    <BattleWonSkinCard key={i} skin={skin} />
                ))}
            </div>
        </div>
    );
};

export default BattlePlayerView;