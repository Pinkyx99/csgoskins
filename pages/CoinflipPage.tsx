import React, { useState, useEffect } from 'react';
import { useUser } from '../hooks/useUser';
import Button from '../components/ui/Button';

type Side = 'T' | 'CT';

const CoinflipPage: React.FC = () => {
  const { user, setAuthModalOpen, processGameWager, updateBalance } = useUser();
  const [betAmount, setBetAmount] = useState(1.0);
  const [side, setSide] = useState<Side>('T');
  const [isFlipping, setIsFlipping] = useState(false);
  const [result, setResult] = useState<Side | null>(null);
  const [history, setHistory] = useState<Side[]>([]);

  const handleFlip = async () => {
    if (!user) { setAuthModalOpen(true); return; }
    if (user.balance < betAmount || betAmount <= 0) { alert("Invalid bet or insufficient balance."); return; }

    setIsFlipping(true);
    setResult(null);
    await updateBalance(-betAmount);

    const outcome: Side = Math.random() < 0.5 ? 'T' : 'CT';
    
    setTimeout(() => {
        setResult(outcome);
        setHistory(prev => [outcome, ...prev].slice(0, 15));
        
        if (side === outcome) {
            processGameWager(betAmount, betAmount * 2);
        } else {
            processGameWager(betAmount, 0);
        }

        setTimeout(() => {
            setIsFlipping(false);
        }, 1500);
    }, 3000);
  };

  const coinFlipStyle: React.CSSProperties = {};
  if (isFlipping) {
    const randomRotations = 5 + Math.floor(Math.random() * 3);
    const finalRotation = result === 'CT' ? 180 : 0;
    coinFlipStyle.transform = `rotateY(${randomRotations * 360 + finalRotation}deg)`;
  } else if (result) {
    coinFlipStyle.transform = `rotateY(${result === 'CT' ? 180 : 0}deg)`;
  }

  const getResultColor = (res: Side) => res === 'T' ? 'bg-orange-500' : 'bg-blue-500';

  return (
    <div className="container mx-auto px-4 py-8 text-center fade-in-up">
      <h1 className="text-4xl font-bold mb-4">Coinflip</h1>
      <p className="text-gray-400 mb-8">Choose a side. Double or nothing.</p>

      <div className="flex items-center justify-center gap-2 mb-6">
        {history.slice().reverse().map((h, i) => (
          <div key={i} className={`w-6 h-6 rounded-full ${getResultColor(h)}`} title={h}></div>
        ))}
      </div>

      <div className="coin-container w-[150px] h-[150px] mx-auto mb-8">
        <div className="coin" style={coinFlipStyle}>
          <div className="coin-face coin-t"></div>
          <div className="coin-face coin-ct"></div>
        </div>
      </div>
      
       {result && !isFlipping && (
        <div className="mb-6 animate-fade-in">
            <p className={`text-3xl font-bold ${result === side ? 'text-green-400' : 'text-red-500'}`}>
                {result === side ? `You won ${(betAmount * 2).toFixed(2)}€!` : 'You lost.'}
            </p>
        </div>
      )}


      <div className="max-w-md mx-auto bg-[#12233f] border border-blue-900/50 rounded-lg p-6 space-y-4">
        <div>
            <label className="text-sm text-gray-400">Bet Amount</label>
            <input type="number" value={betAmount} onChange={e => setBetAmount(parseFloat(e.target.value) || 0)} disabled={isFlipping} className="w-full bg-[#0d1a2f] border border-blue-800/50 rounded-md py-2.5 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button onClick={() => setSide('T')} disabled={isFlipping} className={`p-4 rounded-lg transition-all border-2 ${side === 'T' ? 'bg-orange-500/30 border-orange-400' : 'bg-slate-800/50 border-transparent hover:border-orange-500'}`}>
             <img src="https://i.imgur.com/L40049G.png" alt="T-side" className="w-16 h-16 mx-auto"/>
          </button>
          <button onClick={() => setSide('CT')} disabled={isFlipping} className={`p-4 rounded-lg transition-all border-2 ${side === 'CT' ? 'bg-blue-500/30 border-blue-400' : 'bg-slate-800/50 border-transparent hover:border-blue-500'}`}>
             <img src="https://i.imgur.com/56h3P57.png" alt="CT-side" className="w-16 h-16 mx-auto"/>
          </button>
        </div>
        
        <Button onClick={handleFlip} disabled={isFlipping} variant="primary" className="w-full !py-3 text-lg">
          {isFlipping ? 'Flipping...' : 'Flip Coin'}
        </Button>
      </div>
    </div>
  );
};

export default CoinflipPage;
