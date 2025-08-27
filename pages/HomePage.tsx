import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MOCK_CASES } from '../constants';
import CaseCard from '../components/ui/CaseCard';

const HomePage: React.FC = () => {
    const navigate = useNavigate();
    
    const [search, setSearch] = useState('');
    const [price, setPrice] = useState(400);
    const [showEnoughBalance, setShowEnoughBalance] = useState(false);
    const [showFavorites, setShowFavorites] = useState(false);
    const [timeLeft, setTimeLeft] = useState('');

     useEffect(() => {
        const calculateTimeLeft = () => {
            const now = new Date();
            const endOfDay = new Date(now);
            endOfDay.setHours(23, 59, 59, 999);
            const difference = endOfDay.getTime() - now.getTime();

            let hours = String(Math.floor((difference / (1000 * 60 * 60)) % 24)).padStart(2, '0');
            let minutes = String(Math.floor((difference / 1000 / 60) % 60)).padStart(2, '0');
            let seconds = String(Math.floor((difference / 1000) % 60)).padStart(2, '0');

            setTimeLeft(`${hours}:${minutes}:${seconds}`);
        };

        const timer = setInterval(calculateTimeLeft, 1000);
        calculateTimeLeft(); // initial call
        return () => clearInterval(timer);
    }, []);

    const filteredCases = useMemo(() => {
        return MOCK_CASES.filter(c => {
            const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase());
            const matchesPrice = c.price <= price;
            // Add other filter logic here when available
            return matchesSearch && matchesPrice;
        });
    }, [search, price]);
    
    const anniversaryCases = filteredCases.filter(c => c.category === 'anniversary');
    const stickerCases = filteredCases.filter(c => c.category === 'sticker');
    const regularCases = filteredCases.filter(c => c.category === 'regular');

    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newPrice = Number(e.target.value);
        setPrice(newPrice);
        const target = e.target as HTMLElement;
        const progress = (newPrice / 400) * 100;
        target.style.setProperty('--range-progress', `${progress}%`);
    };

    return (
        <div className="container mx-auto px-4 py-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 fade-in-up">
                <div className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-lg p-6 flex items-center justify-between shadow-lg">
                    <div>
                        <h2 className="text-2xl font-bold">New Wasteland Case</h2>
                        <p className="text-blue-200 mt-1">Unbox exclusive post-apocalyptic skins!</p>
                        <button onClick={() => navigate('/cases?case=c17')} className="mt-4 bg-white/20 text-white font-semibold px-4 py-2 rounded-md hover:bg-white/30 transition-colors">
                            Check it out
                        </button>
                    </div>
                    <img src="https://media.csgo-skins.com/container/wasteland-case.png" alt="Wasteland Case" className="w-28 h-28 object-contain -mr-4" />
                </div>
                <div className="bg-gradient-to-br from-orange-500 to-yellow-600 rounded-lg p-6 flex items-center justify-between shadow-lg">
                    <div>
                        <h2 className="text-2xl font-bold">Daily Free Case</h2>
                        <p className="text-orange-200 mt-1">Your next free reward is waiting!</p>
                         <div className="mt-4 bg-black/30 text-white font-mono text-xl px-4 py-2 rounded-md inline-block">
                            {timeLeft}
                        </div>
                    </div>
                     <img src="https://media.csgo-skins.com/container/daily-case.png" alt="Daily Case" className="w-28 h-28 object-contain -mr-4" />
                </div>
            </div>

             <div className="my-8 fade-in-up animation-delay-300">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {anniversaryCases.map(caseItem => (
                       <CaseCard key={caseItem.id} caseItem={caseItem} onClick={() => navigate(`/cases?case=${caseItem.id}`)} />
                    ))}
                </div>
            </div>
            
            <div className="my-12 fade-in-up animation-delay-400">
                <h2 className="text-3xl font-bold mb-6 text-center">Sticker Cases</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {stickerCases.map(caseItem => (
                       <CaseCard key={caseItem.id} caseItem={caseItem} onClick={() => navigate(`/cases?case=${caseItem.id}`)} />
                    ))}
                </div>
            </div>

            <h2 className="text-3xl font-bold mb-6 text-center fade-in-up animation-delay-500">Regular Cases</h2>
            <div className="bg-[#1e2937]/50 border border-slate-700/50 rounded-lg p-4 mb-8 flex flex-col md:flex-row items-center gap-4 fade-in-up animation-delay-500">
                <div className="relative w-full md:w-1/3">
                    <input type="text" placeholder="Search case by name..." value={search} onChange={e => setSearch(e.target.value)} className="w-full bg-[#0d1a2f] border border-slate-700 rounded-md py-2.5 pl-4 pr-10 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
                    <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" /></svg>
                </div>
                <div className="flex-grow flex items-center gap-4 w-full md:w-auto">
                    <label htmlFor="price-range" className="text-gray-300 font-semibold hidden sm:block">Price</label>
                    <input id="price-range" type="range" min="0" max="400" value={price} onChange={handlePriceChange} className="w-full" />
                    <span className="text-white font-semibold w-24 text-right">{price.toFixed(2)}€</span>
                </div>
                <div className="flex items-center gap-4 flex-shrink-0">
                    <div className="flex items-center">
                        <input id="balance-check" type="checkbox" checked={showEnoughBalance} onChange={() => setShowEnoughBalance(!showEnoughBalance)} className="w-5 h-5 rounded form-checkbox" />
                        <label htmlFor="balance-check" className="ml-2 text-sm text-gray-300">Can afford</label>
                    </div>
                     <div className="flex items-center">
                        <input id="favorites-check" type="checkbox" checked={showFavorites} onChange={() => setShowFavorites(!showFavorites)} className="w-5 h-5 rounded form-checkbox" />
                        <label htmlFor="favorites-check" className="ml-2 text-sm text-gray-300">Favorites</label>
                    </div>
                </div>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 fade-in-up animation-delay-600">
                {regularCases.map((caseItem, index) => (
                    <div key={caseItem.id} className="h-full" style={{ animationDelay: `${Math.min(index * 40, 400)}ms`}}>
                        <CaseCard caseItem={caseItem} onClick={() => navigate(`/cases?case=${caseItem.id}`)} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HomePage;