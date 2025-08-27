import React, { useState, useMemo, useContext, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { MOCK_CASES, JESTER_MODE_DATA } from '../constants';
import CaseCard from '../components/ui/CaseCard';
import { useUser } from '../hooks/useUser';
import CaseItemCard from '../components/cases/CaseItemCard';
import Spinner, { SpinnerContext } from '../components/cases/Spinner';
import CaseOpeningModal from '../components/cases/CaseOpeningModal';
import { Skin } from '../types';
import Button from '../components/ui/Button';
import { getBalancedCaseItems } from '../lib/caseOdds';

const HeartIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400 hover:text-red-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>;
const CrownIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.25278C12 6.25278 15.1111 3 17.5556 3C18.0051 3 18.4545 3.17714 18.8082 3.50429C19.1619 3.83143 19.3519 4.28571 19.3519 4.75714V10.2429C19.3519 10.7143 19.1619 11.1686 18.8082 11.5C18.4545 11.8271 18.0051 12 17.5556 12C15.1111 12 12 9.07436 12 9.07436M12 6.25278C12 6.25278 8.88889 3 6.44444 3C5.99494 3 5.54553 3.17714 5.1918 3.50429C4.83807 3.83143 4.64815 4.28571 4.64815 4.75714V10.2429C4.64815 10.7143 4.83807 11.1686 5.1918 11.5C5.54553 11.8271 5.99494 12 6.44444 12C8.88889 12 12 9.07436 12 9.07436M12 9.07436V21M3 21H21" /></svg>;

const ActionIcon: React.FC<{ children: React.ReactNode; title?: string; onClick?: () => void; disabled?: boolean; isActive?: boolean }> = ({ children, title, onClick, disabled, isActive }) => (
    <div
      title={title}
      onClick={!disabled ? onClick : undefined}
      className={`relative w-12 h-12 flex items-center justify-center rounded-md transition-all duration-300 text-gray-400 ${
        disabled
          ? 'bg-[#1a2c47] opacity-50 cursor-not-allowed'
          : `cursor-pointer hover:text-white hover:bg-blue-800/50 ${isActive ? 'text-purple-300 bg-purple-800/50' : 'bg-[#1a2c47]'}`
      }`}
    >
      {children}
      {isActive && !disabled && <div className="absolute inset-0 border-2 border-purple-400 rounded-md"></div>}
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
    const [isJesterMode, setIsJesterMode] = useState(false);

    const [dailyCaseCooldown, setDailyCaseCooldown] = useState(0);
    const DAILY_CASE_ID = 'c4';
    const DAILY_CASE_COOLDOWN_SECONDS = 60;

    const [search, setSearch] = useState('');
    const [price, setPrice] = useState(400);

    const selectedCase = useMemo(() => MOCK_CASES.find(c => c.id === caseId), [caseId]);
    const balancedItems = useMemo(() => selectedCase ? getBalancedCaseItems(selectedCase.items) : [], [selectedCase]);
    const jesterData = useMemo(() => selectedCase ? JESTER_MODE_DATA[selectedCase.id] : null, [selectedCase]);
    const jesterChance = useMemo(() => selectedCase ? 100 / selectedCase.items.length : 0, [selectedCase]);

    useEffect(() => {
        // Disable jester mode if case doesn't support it
        if (!jesterData) {
            setIsJesterMode(false);
        }
    }, [jesterData]);
    
    const currentPrice = isJesterMode && jesterData ? jesterData.price : (selectedCase?.price ?? 0);
    const isDailyCase = selectedCase?.id === DAILY_CASE_ID;
    const effectiveNumToOpen = isDailyCase ? 1 : numToOpen;
    const totalPrice = currentPrice * effectiveNumToOpen;

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
            await processSoldWinnings(winnings, totalPrice);
        }
        setWinnings([]); // Close modal
    };

    const handleKeepWinnings = async () => {
        if (user && winnings.length > 0 && selectedCase) {
            await addSkinsToInventory(winnings, totalPrice);
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
        const canAfford = user && user.balance >= totalPrice;

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
                        <p key={currentPrice} className={`animate-price-pop text-lg mt-1 transition-colors duration-300 ${isJesterMode ? 'text-purple-400' : 'text-green-400'}`}>${currentPrice.toFixed(2)}</p>
                    </div>

                    <Spinner
                        selectedCase={selectedCase}
                        balancedItems={balancedItems}
                        numToOpen={effectiveNumToOpen}
                        isSpinning={isSpinning}
                        setIsSpinning={setIsSpinning}
                        onSpinEnd={handleSpinEnd}
                        isJesterMode={isJesterMode && !!jesterData}
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
                                <ActionIcon title={jesterData ? "Jester Mode: Equal odds for every item" : "Jester Mode not available for this case"} onClick={() => jesterData && setIsJesterMode(!isJesterMode)} disabled={!jesterData} isActive={isJesterMode}>
                                    <CrownIcon />
                                </ActionIcon>
                                <ActionIcon><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" /></svg></ActionIcon>
                                <ActionIcon><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg></ActionIcon>
                                <ActionIcon><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /></svg></ActionIcon>
                            </div>
                        </div>
                    </Spinner>

                    <div className="mt-16">
                        <h2 className="text-2xl font-semibold mb-6 text-center">Case contents</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                            {balancedItems.sort((a, b) => b.price - a.price).map(item => (
                                <CaseItemCard 
                                    key={item.id} 
                                    skin={item} 
                                    isJesterMode={isJesterMode && !!jesterData}
                                    jesterChance={isJesterMode && !!jesterData ? jesterChance : undefined}
                                />
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