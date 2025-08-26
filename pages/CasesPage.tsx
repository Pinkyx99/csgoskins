import React, { useState, useMemo, useContext, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { MOCK_CASES } from '../constants';
import CaseCard from '../components/ui/CaseCard';
import { useUser } from '../hooks/useUser';
import CaseItemCard from '../components/cases/CaseItemCard';
import Spinner, { SpinnerContext } from '../components/cases/Spinner';
import CaseOpeningModal from '../components/cases/CaseOpeningModal';
import { Skin } from '../types';
import Button from '../components/ui/Button';

const HeartIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400 hover:text-red-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>;
const ActionIcon = ({ children }: { children: React.ReactNode }) => (
    <div className="w-12 h-12 bg-[#1a2c47] rounded-md flex items-center justify-center cursor-pointer text-gray-400 hover:text-white hover:bg-blue-800/50 transition-colors">
        {children}
    </div>
);

const CasesPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const caseId = searchParams.get('case');
    const { user, addSkinsToInventory, processSoldWinnings, setAuthModalOpen } = useUser();
    
    const [numToOpen, setNumToOpen] = useState(1);
    const [isSpinning, setIsSpinning] = useState(false);
    const [winnings, setWinnings] = useState<Skin[]>([]);

    const [dailyCaseCooldown, setDailyCaseCooldown] = useState(0);
    const DAILY_CASE_ID = 'c4';
    const DAILY_CASE_COOLDOWN_SECONDS = 60;

    const [search, setSearch] = useState('');
    const [price, setPrice] = useState(400);

    const selectedCase = useMemo(() => MOCK_CASES.find(c => c.id === caseId), [caseId]);
    const isDailyCase = selectedCase?.id === DAILY_CASE_ID;
    
    // For daily case, we always open 1. For others, we use the state.
    const effectiveNumToOpen = isDailyCase ? 1 : numToOpen;

    useEffect(() => {
        if (isDailyCase) {
            const lastOpenTime = localStorage.getItem('lastDailyCaseOpenTime');
            if (lastOpenTime) {
                const timePassed = (Date.now() - parseInt(lastOpenTime, 10)) / 1000;
                const cooldownLeft = Math.max(0, DAILY_CASE_COOLDOWN_SECONDS - timePassed);
                setDailyCaseCooldown(Math.ceil(cooldownLeft));
            }
        }
    }, [isDailyCase]);

    useEffect(() => {
        if (isDailyCase && dailyCaseCooldown > 0) {
            const timer = setInterval(() => {
                setDailyCaseCooldown(prev => Math.max(0, prev - 1));
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [isDailyCase, dailyCaseCooldown]);
    
    const handleSpinEnd = (wonSkins: Skin[]) => {
        setWinnings(wonSkins);
    };

    const handleSellWinnings = async () => {
        if (user && winnings.length > 0 && selectedCase) {
            await processSoldWinnings(winnings, selectedCase.price * effectiveNumToOpen);
        }
        setWinnings([]); // Close modal
    };

    const handleKeepWinnings = async () => {
        if (user && winnings.length > 0 && selectedCase) {
            await addSkinsToInventory(winnings, selectedCase.price * effectiveNumToOpen);
        }
        setWinnings([]); // Close modal
    };

    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newPrice = Number(e.target.value);
        setPrice(newPrice);
        const target = e.target as HTMLElement;
        const progress = (newPrice / 400) * 100;
        target.style.setProperty('--range-progress', `${progress}%`);
    };

    const handleClearFilters = () => {
        setSearch('');
        setPrice(400);
        const rangeInput = document.querySelector('input[type=range].cases-page-slider');
        if (rangeInput) {
            (rangeInput as HTMLElement).style.setProperty('--range-progress', '100%');
        }
    };

    const filteredCases = useMemo(() => {
        return MOCK_CASES.filter(c => {
            const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase());
            const matchesPrice = c.price <= price;
            return matchesSearch && matchesPrice;
        });
    }, [search, price]);

    // Button component specifically for the daily case
    const DailyCaseButton = () => {
        const context = useContext(SpinnerContext);
        if (!context) return null;

        const { handleOpenCase, isSpinning } = context;

        const handleDailyOpen = () => {
            if (!user) {
                setAuthModalOpen(true);
                return;
            }
            if (dailyCaseCooldown > 0 || isSpinning) return;

            handleOpenCase();
            localStorage.setItem('lastDailyCaseOpenTime', String(Date.now()));
            setDailyCaseCooldown(DAILY_CASE_COOLDOWN_SECONDS);
        };

        const canOpen = !isSpinning && dailyCaseCooldown <= 0;
        
        return (
            <Button 
                onClick={handleDailyOpen} 
                disabled={!canOpen && !!user}
                variant="glow" 
                className="min-w-[200px] text-lg py-3"
            >
                {isSpinning ? 'Spinning...' : (
                    user ? (
                        dailyCaseCooldown > 0 ? `Open in ${dailyCaseCooldown}s` : 'Open Free Case'
                    ) : 'Login to Open'
                )}
            </Button>
        );
    };


    if (selectedCase) {
        const canAfford = user && user.balance >= selectedCase.price * numToOpen;

        return (
            <>
                <div className="container mx-auto px-4 py-8 fade-in-up">
                    <button onClick={() => navigate('/cases')} className="text-gray-300 hover:text-white mb-6 flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                        Back to cases
                    </button>

                    <div className="text-center my-6">
                        <h1 className="text-3xl lg:text-4xl font-bold flex items-center justify-center gap-3 cursor-pointer">
                            <HeartIcon />
                            {selectedCase.name}
                        </h1>
                        <p className="text-green-400 text-lg mt-1">${selectedCase.price.toFixed(2)}</p>
                    </div>

                    <Spinner
                        selectedCase={selectedCase}
                        numToOpen={effectiveNumToOpen}
                        isSpinning={isSpinning}
                        setIsSpinning={setIsSpinning}
                        onSpinEnd={handleSpinEnd}
                    >
                        <div className="flex flex-col items-center gap-4 my-8">
                            {!isDailyCase && (
                                <div className="flex gap-2">
                                    {[1, 2, 3].map(num => (
                                        <button 
                                            key={num}
                                            onClick={() => setNumToOpen(num)}
                                            className={`w-12 h-12 rounded-md flex items-center justify-center text-lg font-bold transition-colors ${numToOpen === num ? 'bg-blue-600 border-2 border-blue-400' : 'bg-[#1a2c47] text-gray-400 hover:bg-blue-800/50'}`}
                                        >
                                            {num}
                                        </button>
                                    ))}
                                </div>
                            )}

                            <div className="my-4">
                                {isDailyCase ? <DailyCaseButton /> : <Spinner.Button canAfford={canAfford ?? false} />}
                            </div>
                        
                            <div className="flex gap-2">
                                <ActionIcon><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg></ActionIcon>
                                <ActionIcon><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" /></svg></ActionIcon>
                                <ActionIcon><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg></ActionIcon>
                                <ActionIcon><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /></svg></ActionIcon>
                            </div>
                        </div>
                    </Spinner>

                    <div className="mt-16">
                        <h2 className="text-2xl font-semibold mb-6 text-center">Case contents</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                            {[...selectedCase.items].sort((a, b) => b.price - a.price).map(item => (
                                <CaseItemCard key={item.id} skin={item} />
                            ))}
                        </div>
                    </div>
                </div>
                {winnings.length > 0 && !isSpinning && (
                    <CaseOpeningModal 
                        winnings={winnings}
                        onClose={handleKeepWinnings}
                        onSell={handleSellWinnings}
                        caseName={selectedCase.name}
                    />
                )}
            </>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 fade-in-up">
            <h1 className="text-4xl font-bold mb-8 text-center">All Cases</h1>
            <div className="bg-[#12233f] border border-blue-900/50 rounded-lg p-4 mb-8 flex flex-col md:flex-row items-center gap-4">
                <div className="relative w-full md:w-2/5">
                    <input type="text" placeholder="Search case by name..." value={search} onChange={e => setSearch(e.target.value)} className="w-full bg-[#0d1a2f] border border-blue-800/50 rounded-md py-2.5 pl-4 pr-10 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
                    <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" /></svg>
                </div>
                <div className="w-full md:w-2/5 flex items-center gap-4">
                    <input type="range" min="0" max="400" value={price} onChange={handlePriceChange} className="w-full cases-page-slider" />
                    <span className="text-white font-semibold w-24 text-right">{price.toFixed(2)}€</span>
                </div>
                <button onClick={handleClearFilters} className="text-gray-400 hover:text-white transition-colors hover:bg-blue-800/20 px-3 py-1.5 rounded-md flex-shrink-0">Clear filters</button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {filteredCases.map(caseItem => (
                    <CaseCard key={caseItem.id} caseItem={caseItem} onClick={() => navigate(`/cases?case=${caseItem.id}`)} />
                ))}
            </div>
        </div>
    );
};

export default CasesPage;