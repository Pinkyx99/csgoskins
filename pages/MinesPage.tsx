import React, { useState, useMemo, useEffect } from 'react';
import { useUser } from '../hooks/useUser';
import Button from '../components/ui/Button';
import { MINES_MULTIPLIERS } from '../constants';

const DiamondIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-cyan-300" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM5.5 9a.5.5 0 01.5-.5h2a.5.5 0 01.5.5v2a.5.5 0 01-1 0V9.5H6a.5.5 0 01-.5-.5zm3 .5a.5.5 0 000-1h2a.5.5 0 000 1h-2z" clipRule="evenodd" /></svg>;
const MineIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 8a1 1 0 100-2 1 1 0 000 2zM6 11a1 1 0 11-2 0 1 1 0 012 0zm6-3a1 1 0 100-2 1 1 0 000 2zM9 14a1 1 0 100-2 1 1 0 000 2zm3-3a1 1 0 11-2 0 1 1 0 012 0zM14 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" /></svg>;


interface Tile {
  isMine: boolean;
  isRevealed: boolean;
}

const MinesPage: React.FC = () => {
    const { user, setAuthModalOpen, processGameWager, updateBalance } = useUser();
    const [betAmount, setBetAmount] = useState(1.0);
    const [minesCount, setMinesCount] = useState(3);
    const [grid, setGrid] = useState<Tile[]>([]);
    const [gameState, setGameState] = useState<'idle' | 'playing' | 'busted'>('idle');
    const [pickedCount, setPickedCount] = useState(0);
    const [loading, setLoading] = useState(false);
  
    const GRID_SIZE = 25;
  
    useEffect(() => {
      // Initialize grid on mount
      setGrid(Array(GRID_SIZE).fill({ isMine: false, isRevealed: false }));
    }, []);
  
    const handleBetAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseFloat(e.target.value);
      setBetAmount(isNaN(value) ? 0 : value);
    };

    const handleStartGame = async () => {
        if (!user) { setAuthModalOpen(true); return; }
        if (user.balance < betAmount || betAmount <= 0) { alert("Invalid bet or insufficient balance."); return; }
        
        setLoading(true);
        await updateBalance(-betAmount);

        setGameState('playing');
        setPickedCount(0);
        
        const newGrid = Array(GRID_SIZE).fill(0).map(() => ({ isMine: false, isRevealed: false }));
        let minesPlaced = 0;
        while (minesPlaced < minesCount) {
          const index = Math.floor(Math.random() * GRID_SIZE);
          if (!newGrid[index].isMine) {
            newGrid[index].isMine = true;
            minesPlaced++;
          }
        }
        setGrid(newGrid);
        setLoading(false);
    };
  
    const handleTileClick = (index: number) => {
      if (gameState !== 'playing' || grid[index].isRevealed) return;
  
      const newGrid = [...grid];
      newGrid[index] = { ...newGrid[index], isRevealed: true };
  
      if (newGrid[index].isMine) {
        setGameState('busted');
        // Reveal all tiles after a short delay for animation
        setTimeout(() => {
          setGrid(g => g.map(tile => ({...tile, isRevealed: true})));
        }, 800);
        processGameWager(betAmount, 0); // Log the loss
      } else {
        setPickedCount(prev => prev + 1);
        setGrid(newGrid);
      }
    };

    const handleCashOut = async () => {
        if (gameState !== 'playing' || pickedCount === 0) return;
        setLoading(true);

        const multiplier = MINES_MULTIPLIERS[minesCount][pickedCount - 1];
        const winAmount = betAmount * multiplier;
        await processGameWager(betAmount, winAmount);
        
        setGameState('idle');
        setGrid(g => g.map(tile => ({...tile, isRevealed: true})));
        setLoading(false);
    };

    const currentMultiplier = (gameState === 'playing' && pickedCount > 0) ? MINES_MULTIPLIERS[minesCount][pickedCount - 1] : 1;
    const nextMultiplier = (gameState === 'playing' && (GRID_SIZE - minesCount) > pickedCount) ? MINES_MULTIPLIERS[minesCount][pickedCount] : currentMultiplier;
    
    const isGameActive = gameState === 'playing';
    const profit = isGameActive && pickedCount > 0 ? betAmount * (currentMultiplier - 1) : 0;
    const nextProfit = isGameActive ? betAmount * (nextMultiplier - 1) : 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">Mines</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-1 bg-[#12233f] border border-blue-900/50 rounded-lg p-6 h-fit">
            <h3 className="font-bold text-lg mb-4">Controls</h3>
            <div className="space-y-4">
                <div>
                    <label className="text-sm text-gray-400">Bet Amount</label>
                    <input type="number" value={betAmount} onChange={handleBetAmountChange} disabled={isGameActive} className="w-full bg-[#0d1a2f] border border-blue-800/50 rounded-md py-2.5 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
                </div>
                 <div>
                    <label className="text-sm text-gray-400">Mines</label>
                    <input type="number" value={minesCount} onChange={e => setMinesCount(Math.max(1, Math.min(24, parseInt(e.target.value) || 1)))} disabled={isGameActive} className="w-full bg-[#0d1a2f] border border-blue-800/50 rounded-md py-2.5 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
                </div>
                 {isGameActive ? (
                    <Button onClick={handleCashOut} disabled={loading || pickedCount === 0} variant="secondary" className="w-full !py-3 text-lg">{`Cash Out ${profit.toFixed(2)}€`}</Button>
                 ) : (
                    <Button onClick={handleStartGame} disabled={loading} variant="primary" className="w-full !py-3 text-lg">Bet</Button>
                 )}
            </div>
             {isGameActive && (
                <div className="mt-6 text-center space-y-2">
                    <div className="bg-slate-800/50 p-3 rounded-lg">
                        <p className="text-sm text-gray-400">Next Tile Profit</p>
                        <p className="text-xl font-bold text-green-400">{nextProfit.toFixed(2)}€ ({nextMultiplier.toFixed(2)}x)</p>
                    </div>
                     <div className="bg-slate-800/50 p-3 rounded-lg">
                        <p className="text-sm text-gray-400">Gems Picked</p>
                        <p className="text-xl font-bold text-white">{pickedCount}</p>
                    </div>
                </div>
            )}
        </div>
        
        <div className="lg:col-span-2 bg-[#12233f] border border-blue-900/50 rounded-lg p-6">
            {gameState === 'busted' && (
                <div className="absolute inset-0 bg-red-900/40 rounded-lg flex items-center justify-center z-10">
                    <p className="text-5xl font-black text-white drop-shadow-lg">BUSTED!</p>
                </div>
            )}
            <div className="mines-grid">
                {grid.map((tile, i) => (
                    <div key={i} className={`mine-tile ${tile.isRevealed ? 'revealed' : ''}`} onClick={() => handleTileClick(i)}>
                        <div className="mine-tile-inner">
                            <div className="mine-tile-front"></div>
                            <div className={`mine-tile-back ${tile.isMine ? 'tile-mine' : 'tile-gem'} ${gameState === 'busted' && tile.isMine ? 'mine-busted' : ''}`}>
                                {tile.isMine ? <MineIcon /> : <DiamondIcon />}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>

      </div>
    </div>
  );
};

export default MinesPage;
