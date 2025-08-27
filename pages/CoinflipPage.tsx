import React, { useState, useEffect, useRef } from 'react';
import { useUser } from '../hooks/useUser';
import Button from '../components/ui/Button';

type Side = 'T' | 'CT';

const T_IMAGE_URL = 'https://i.imgur.com/IdFLbGN.png';
const CT_IMAGE_URL = 'https://i.imgur.com/QB3JUf7.png';

const HistoryIcon: React.FC<{ side: Side }> = ({ side }) => (
    <div
        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${side === 'T' ? 'bg-orange-500/80' : 'bg-blue-500/80'}`}
        title={side === 'T' ? 'Terrorist' : 'Counter-Terrorist'}
    >
        <img src={side === 'T' ? T_IMAGE_URL : CT_IMAGE_URL} alt={side} className="w-5 h-5 object-contain" />
    </div>
);

const BetControlButton: React.FC<{ onClick: () => void, children: React.ReactNode, disabled?: boolean }> = ({ onClick, children, disabled }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        className="bg-slate-700/50 text-gray-300 font-semibold px-3 py-1 rounded-md hover:bg-slate-600/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
        {children}
    </button>
);

const SideButton: React.FC<{ side: Side, selectedSide: Side, onSelect: () => void, disabled?: boolean }> = ({ side, selectedSide, onSelect, disabled }) => {
    const isSelected = side === selectedSide;
    const imageUrl = side === 'T' ? T_IMAGE_URL : CT_IMAGE_URL;
    const teamName = side === 'T' ? 'Terrorists' : 'Counter-Terrorists';
    const selectedClasses = side === 'T'
        ? 'border-orange-400 bg-orange-900/30 ring-2 ring-orange-400'
        : 'border-blue-400 bg-blue-900/30 ring-2 ring-blue-400';
    const hoverClasses = side === 'T' ? 'hover:border-orange-500' : 'hover:border-blue-500';

    return (
        <button
            onClick={onSelect}
            disabled={disabled}
            className={`flex flex-col items-center justify-center p-4 rounded-lg transition-all border-2 ${isSelected ? selectedClasses : `border-transparent ${hoverClasses}`}`}
        >
            <img src={imageUrl} alt={`${teamName} side`} className="w-20 h-20 object-contain mb-2" />
            <span className="font-bold text-lg text-white">{teamName}</span>
        </button>
    );
};

const CoinflipPage: React.FC = () => {
    const { user, setAuthModalOpen, processGameWager, updateBalance } = useUser();
    const [betAmount, setBetAmount] = useState(1.0);
    const [selectedSide, setSelectedSide] = useState<Side>('T');
    const [isFlipping, setIsFlipping] = useState(false);
    const [result, setResult] = useState<Side | null>(null);
    const [history, setHistory] = useState<Side[]>([]);
    
    const coinRef = useRef<HTMLDivElement>(null);

    const handleFlip = async () => {
        if (!user) { setAuthModalOpen(true); return; }
        if (user.balance < betAmount || betAmount <= 0) { alert("Invalid bet or insufficient balance."); return; }

        setIsFlipping(true);
        setResult(null);
        if(coinRef.current) {
            coinRef.current.classList.remove('glow-t', 'glow-ct');
        }
        await updateBalance(-betAmount);

        const outcome: Side = Math.random() < 0.5 ? 'T' : 'CT';
        
        // This timeout is for the animation to start
        setTimeout(() => {
            setResult(outcome);
        }, 100);

        // This timeout is for the animation to finish
        setTimeout(async () => {
            setHistory(prev => [outcome, ...prev].slice(0, 15));

            if (selectedSide === outcome) {
                await processGameWager(betAmount, betAmount * 1.95);
            } else {
                await processGameWager(betAmount, 0);
            }

            setTimeout(() => {
                setIsFlipping(false);
            }, 2000); // Time to view result
        }, 4000); // Corresponds to CSS animation time
    };
    
    const coinFlipStyle: React.CSSProperties = {};
    if (isFlipping && result) {
        const randomRotations = 7 + Math.floor(Math.random() * 3);
        const finalRotation = result === 'CT' ? 180 : 0;
        coinFlipStyle.transform = `rotateY(${randomRotations * 360 + finalRotation}deg)`;
    } else if (result) {
        coinFlipStyle.transform = `rotateY(${result === 'CT' ? 180 : 0}deg)`;
    }

    const modifyBet = (action: 'clear' | 'half' | 'double' | 'max') => {
        if (isFlipping) return;
        switch (action) {
            case 'clear': setBetAmount(1.0); break;
            case 'half': setBetAmount(prev => parseFloat(Math.max(0.01, prev / 2).toFixed(2))); break;
            case 'double': setBetAmount(prev => parseFloat(Math.min(user?.balance || 1000, prev * 2).toFixed(2))); break;
            case 'max': setBetAmount(user?.balance || 0); break;
        }
    };
    
    const hasWon = result !== null && result === selectedSide;

    return (
        <div className={`transition-colors duration-500 ${selectedSide === 'T' ? 'bg-orange-900/10' : 'bg-blue-900/10'}`}>
            <div className="container mx-auto px-4 py-8 text-center min-h-screen flex flex-col items-center justify-center fade-in-up">
                <h1 className="text-5xl font-bold mb-2">Coinflip</h1>
                <p className="text-gray-400 mb-6">Choose your side. 50/50 chance to win 1.95x your bet.</p>

                <div className="flex items-center justify-center gap-3 mb-8 p-2 bg-slate-900/30 rounded-full">
                    <span className="text-xs font-bold text-gray-500 px-2">PREVIOUS ROLLS</span>
                    {history.map((h, i) => (
                        <HistoryIcon key={i} side={h} />
                    ))}
                </div>

                <div className="coin-container w-[180px] h-[180px] mx-auto mb-8">
                    <div ref={coinRef} className={`coin w-[180px] h-[180px] ${!isFlipping && result ? (result === 'T' ? 'glow-t' : 'glow-ct') : ''}`} style={coinFlipStyle}>
                        <div className="coin-face coin-t"></div>
                        <div className="coin-face coin-ct"></div>
                    </div>
                </div>
                
                <div className="mb-6 h-16 flex flex-col justify-center items-center">
                    {result !== null && !isFlipping && (
                        <div className="animate-fade-in">
                            <p className={`text-4xl font-black ${hasWon ? 'text-green-400' : 'text-red-500'}`}>
                                {hasWon ? `YOU WON!` : 'YOU LOST'}
                            </p>
                            {hasWon && <p className="text-lg text-green-300 font-semibold">{(betAmount * 1.95).toFixed(2)}€</p>}
                        </div>
                    )}
                </div>

                <div className="w-full max-w-lg mx-auto bg-[#12233f] border border-blue-900/50 rounded-lg p-6 space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <SideButton side="T" selectedSide={selectedSide} onSelect={() => setSelectedSide('T')} disabled={isFlipping} />
                        <SideButton side="CT" selectedSide={selectedSide} onSelect={() => setSelectedSide('CT')} disabled={isFlipping} />
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between items-center text-sm text-gray-400">
                            <span>Bet Amount</span>
                            <span>Balance: {user?.balance.toFixed(2) ?? '0.00'}€</span>
                        </div>
                        <div className="flex gap-2">
                            <input type="number" step="0.01" value={betAmount} onChange={e => setBetAmount(parseFloat(e.target.value) || 0)} disabled={isFlipping} className="w-full bg-[#0d1a2f] border border-blue-800/50 rounded-md py-2.5 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 text-lg font-semibold" />
                             <div className="flex gap-1.5 flex-shrink-0">
                                <BetControlButton onClick={() => modifyBet('half')} disabled={isFlipping}>½</BetControlButton>
                                <BetControlButton onClick={() => modifyBet('double')} disabled={isFlipping}>2x</BetControlButton>
                                <BetControlButton onClick={() => modifyBet('max')} disabled={isFlipping || !user}>Max</BetControlButton>
                            </div>
                        </div>
                    </div>

                    <Button onClick={handleFlip} disabled={isFlipping || betAmount <= 0} variant="glow" className="w-full !py-4 text-xl tracking-wider">
                        {isFlipping ? 'FLIPPING...' : `FLIP FOR ${betAmount.toFixed(2)}€`}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default CoinflipPage;
