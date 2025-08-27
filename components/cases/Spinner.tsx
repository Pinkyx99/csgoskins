import React, { useState, useCallback, createContext, useContext, ReactNode, useEffect } from 'react';
import { Case, Skin, SkinWear, Reel } from '../../types';
import { useUser } from '../../hooks/useUser';
import Button from '../ui/Button';
import SpinnerReel from './SpinnerReel';
import { JESTER_MODE_DATA } from '../../constants';

interface SpinnerProps {
    selectedCase: Case;
    balancedItems: Skin[];
    numToOpen: number;
    isSpinning: boolean;
    setIsSpinning: (isSpinning: boolean) => void;
    onSpinEnd: (winnings: Skin[]) => void;
    children: ReactNode;
    isJesterMode?: boolean;
}

interface SpinnerContextType {
    handleOpenCase: () => void;
    totalPrice: number;
    isSpinning: boolean;
    isJesterMode?: boolean;
}

interface SpinnerButtonProps {
    canAfford: boolean;
}

export const SpinnerContext = createContext<SpinnerContextType | null>(null);

const WinningMarker = () => (
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0.5 h-full z-30 pointer-events-none bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)] rounded-full">
    </div>
);

export const SPINNER_DURATION_MS = 8000;
export const POST_SPIN_RESULT_MS = 1500;

const Spinner: React.FC<SpinnerProps> & { Button: React.FC<SpinnerButtonProps> } = ({ selectedCase, balancedItems, numToOpen, isSpinning, setIsSpinning, children, onSpinEnd, isJesterMode }) => {
    const [reels, setReels] = useState<Reel[]>([]);
    const [finishedReelCount, setFinishedReelCount] = useState(0);
    const { user } = useUser();
    
    useEffect(() => {
        const placeholderItems = [...selectedCase.items].sort(() => 0.5 - Math.random()).slice(0, 9);
        setReels(Array.from({ length: numToOpen }).map((_, i) => ({
            key: `ph-${i}`,
            fullItems: placeholderItems,
            winner: null,
            isFinished: false,
            isPlaceholder: true,
        })));
    }, [selectedCase, numToOpen]);
    
    useEffect(() => {
        const handleAllReelsFinished = async () => {
            setReels(prev => prev.map(r => ({ ...r, isFinished: true })));
            
            const winners = reels.map(r => r.winner).filter((w): w is Skin => w !== null);

            setTimeout(() => {
                onSpinEnd(winners);
                setIsSpinning(false);
                setFinishedReelCount(0);
            }, POST_SPIN_RESULT_MS);
        };

        if (reels.length > 0 && !reels.some(r => r.isPlaceholder) && finishedReelCount === numToOpen && !reels.some(r => r.isFinished)) {
            handleAllReelsFinished();
        }
    }, [finishedReelCount, numToOpen, onSpinEnd, setIsSpinning, reels]);


    const applyWearToSkin = (chosenBaseSkin: Skin): Skin => {
        if (chosenBaseSkin.wears && chosenBaseSkin.wears.length > 0) {
            const totalWearsChance = chosenBaseSkin.wears.reduce((sum, wear) => sum + wear.chance, 0);
            let randomWear = Math.random() * totalWearsChance;
            let chosenWear: SkinWear | null = null;
            for (const wear of chosenBaseSkin.wears) {
                if (randomWear < wear.chance) {
                    chosenWear = wear;
                    break;
                }
                randomWear -= wear.chance;
            }
            if (!chosenWear) chosenWear = chosenBaseSkin.wears[chosenBaseSkin.wears.length-1];

            return {
                ...chosenBaseSkin,
                id: `${chosenBaseSkin.id}-${chosenWear.name}`,
                name: `${chosenBaseSkin.name} (${chosenWear.name})`,
                price: chosenWear.price,
                chance: chosenWear.chance,
                wears: undefined,
            };
        }
        return chosenBaseSkin;
    };
    
    const determineWinningSkin = (items: Skin[], useEqualOdds: boolean): Skin => {
        let chosenBaseSkin: Skin | null = null;
        if (useEqualOdds) {
            const winnerIndex = Math.floor(Math.random() * items.length);
            chosenBaseSkin = items[winnerIndex];
        } else {
            const totalCaseChance = 100;
            let random = Math.random() * totalCaseChance;
            for (const item of items) {
                if (random < item.chance) {
                    chosenBaseSkin = item;
                    break;
                }
                random -= item.chance;
            }
            if (!chosenBaseSkin) chosenBaseSkin = items[items.length - 1];
        }
        return applyWearToSkin(chosenBaseSkin);
    };

    const handleOpenCase = useCallback(async () => {
        const jesterPrice = isJesterMode ? (JESTER_MODE_DATA[selectedCase.id]?.price ?? selectedCase.price) : selectedCase.price;
        const totalCost = jesterPrice * numToOpen;
        
        if (isSpinning || !user || !selectedCase || user.balance < totalCost) {
            if (user && selectedCase && user.balance < totalCost) {
                alert("Insufficient balance!");
            }
            return;
        }

        setIsSpinning(true);
        setFinishedReelCount(0);

        const newReels: Reel[] = [];
        
        const sortedItems = [...selectedCase.items].sort((a, b) => b.price - a.price);
        const highTierItems = sortedItems.slice(0, 5);
        const lowTierItems = sortedItems.slice(5);

        for (let i = 0; i < numToOpen; i++) {
            const itemsToUseForWin = isJesterMode ? selectedCase.items : balancedItems;
            const winner = determineWinningSkin(itemsToUseForWin, !!isJesterMode);

            const REEL_LENGTH = 150;
            const WINNER_INDEX_MIN = 105;
            const WINNER_INDEX_MAX = 115;
            const winnerIndex = Math.floor(Math.random() * (WINNER_INDEX_MAX - WINNER_INDEX_MIN + 1)) + WINNER_INDEX_MIN;
            
            const fillerChunk = Array.from({ length: 30 }, () => 
                lowTierItems.length > 0 ? lowTierItems[Math.floor(Math.random() * lowTierItems.length)] : sortedItems[Math.floor(Math.random() * sortedItems.length)]
            );
            const reelItems: Skin[] = Array.from({ length: REEL_LENGTH }).map((_, idx) => fillerChunk[idx % fillerChunk.length]);

            reelItems[winnerIndex] = winner;

            const teaserIndices = new Set<number>();
            if(highTierItems.length > 0) {
                while (teaserIndices.size < 3) {
                    const randIndex = Math.floor(Math.random() * (winnerIndex - 40)) + 30; 
                    if (randIndex !== winnerIndex) teaserIndices.add(randIndex);
                }
                teaserIndices.forEach(index => {
                    const teaserItem = highTierItems[Math.floor(Math.random() * highTierItems.length)];
                    if (teaserItem.id !== winner.id) reelItems[index] = teaserItem;
                });
            }

            newReels.push({
                key: Date.now() + i, 
                fullItems: reelItems,
                winner: winner,
                winnerIndex: winnerIndex,
                isFinished: false,
            });
        }
        
        setReels(newReels);

    }, [isSpinning, user, selectedCase, numToOpen, setIsSpinning, balancedItems, isJesterMode]);
    
    const handleReelAnimationComplete = useCallback(() => {
        setFinishedReelCount(count => count + 1);
    }, []);

    const jesterPrice = isJesterMode ? (JESTER_MODE_DATA[selectedCase.id]?.price ?? selectedCase.price) : selectedCase.price;
    const totalPrice = jesterPrice * numToOpen;
    

    return (
        <SpinnerContext.Provider value={{ handleOpenCase, totalPrice, isSpinning, isJesterMode }}>
            <div className={`relative w-full overflow-hidden ${isJesterMode ? 'bg-gradient-to-b from-purple-900 via-purple-800/80 to-[#12233f]' : 'bg-black/20'} rounded-lg p-4 flex flex-col items-center justify-center gap-2 border-2 ${isJesterMode ? 'border-purple-500' : 'border-slate-800'} transition-all duration-500`}>
                <WinningMarker />
                <div className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-[#0d1a2f] via-[#0d1a2f]/80 to-transparent z-20 pointer-events-none"></div>
                <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#0d1a2f] via-[#0d1a2f]/80 to-transparent z-20 pointer-events-none"></div>
                
                {reels.map((reel, index) => (
                    <SpinnerReel 
                        key={reel.key} 
                        items={reel.fullItems}
                        winner={reel.winner}
                        winnerIndex={reel.winnerIndex}
                        isFinished={reel.isFinished}
                        isPlaceholder={reel.isPlaceholder}
                        onAnimationComplete={handleReelAnimationComplete}
                        animationDelay={index * 300}
                    />
                ))}
            </div>
            {children}
        </SpinnerContext.Provider>
    );
};


const SpinnerButton: React.FC<SpinnerButtonProps> = ({ canAfford }) => {
    const context = useContext(SpinnerContext);
    if (!context) return null;
    const { handleOpenCase, totalPrice, isSpinning, isJesterMode } = context;
    return (
        <Button 
            onClick={handleOpenCase} 
            disabled={isSpinning || !canAfford} 
            variant={isJesterMode ? 'secondary' : 'glow'} 
            className={`${isJesterMode ? '!bg-purple-600 hover:!bg-purple-500 focus:ring-purple-500 !shadow-[0_0_15px_rgba(168,85,247,0.8)]' : ''} min-w-[200px] text-lg py-3`}
        >
            {isSpinning ? 'Spinning...' : `Open for ${totalPrice.toFixed(2)}€`}
        </Button>
    );
};

Spinner.Button = SpinnerButton;

export default Spinner;