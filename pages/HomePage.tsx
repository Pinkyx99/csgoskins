

import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import { MOCK_CASES } from '../constants';
import CaseCard from '../components/ui/CaseCard';
import { Case } from '../types';

const HomePage: React.FC = () => {
    const navigate = useNavigate();
    
    const [search, setSearch] = useState('');
    const [price, setPrice] = useState(400);
    const [showEnoughBalance, setShowEnoughBalance] = useState(false);
    const [showFavorites, setShowFavorites] = useState(false);

    const calculateTimeLeft = () => {
        const difference = +new Date("2024-12-31T23:59:59") - +new Date();
        let timeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };

        if (difference > 0) {
            timeLeft = {
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60)
            };
        }
        return timeLeft;
    };

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {
        const timer = setTimeout(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);
        return () => clearTimeout(timer);
    });

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
            <div className="bg-[#1e2a4a] rounded-lg p-2.5 flex items-center justify-between mb-6 fade-in-up animation-delay-100">
                <div className="flex items-center gap-4">
                    <img src="https://i.imgur.com/hBdSKzz.png" alt="Promo Banner" className="h-12 hidden sm:block rounded" />
                    <div>
                        <h2 className="text-md font-bold text-white">Explore our Exclusive Cases!</h2>
                        <p className="text-blue-200 text-sm">Discover rare skins and unique collections.</p>
                    </div>
                </div>
                <Button onClick={() => navigate('/cases')} className="flex-shrink-0 !py-2 !px-4 text-sm bg-blue-600 hover:bg-blue-500">Explore Now</Button>
            </div>

            <div className="relative rounded-lg overflow-hidden mb-8 fade-in-up animation-delay-200 group">
                <img src="https://i.imgur.com/INvdkTs.png" alt="10 Year Anniversary" className="w-full h-auto transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 mt-12 sm:mt-16 md:mt-24">
                     <div className="bg-black/50 rounded-full px-6 py-2 text-center">
                        <span className="text-white font-bold text-xl md:text-2xl tracking-widest">
                            {timeLeft.days}D {String(timeLeft.hours).padStart(2, '0')}H {String(timeLeft.minutes).padStart(2, '0')}M {String(timeLeft.seconds).padStart(2, '0')}S
                        </span>
                    </div>
                </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8 fade-in-up animation-delay-300">
                {anniversaryCases.map(caseItem => (
                   <CaseCard key={caseItem.id} caseItem={caseItem} onClick={() => navigate(`/cases?case=${caseItem.id}`)} />
                ))}
            </div>

             <div className="my-12 fade-in-up animation-delay-400">
                <h2 className="text-3xl font-bold mb-6 text-center">Sticker Cases</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {stickerCases.map(caseItem => (
                       <CaseCard key={caseItem.id} caseItem={caseItem} onClick={() => navigate(`/cases?case=${caseItem.id}`)} />
                    ))}
                </div>
            </div>

            <div className="bg-[#12233f] border border-blue-900/50 rounded-lg p-4 mb-8 flex flex-col md:flex-row items-center gap-4 fade-in-up animation-delay-500">
                <div className="relative w-full md:w-1/3">
                    <input type="text" placeholder="Search case by name..." value={search} onChange={e => setSearch(e.target.value)} className="w-full bg-[#0d1a2f] border border-blue-800/50 rounded-md py-2.5 pl-4 pr-10 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
                    <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" /></svg>
                </div>
                <div className="flex items-center gap-4">
                    <label className="flex items-center cursor-pointer"><input type="checkbox" className="form-checkbox h-5 w-5 rounded text-blue-500 focus:ring-blue-500" checked={showEnoughBalance} onChange={() => setShowEnoughBalance(!showEnoughBalance)} /> <span className="ml-2 text-gray-300">Enough balance</span></label>
                    <label className="flex items-center cursor-pointer"><input type="checkbox" className="form-checkbox h-5 w-5 rounded text-blue-500 focus:ring-blue-500" checked={showFavorites} onChange={() => setShowFavorites(!showFavorites)} /> <span className="ml-2 text-gray-300">My favourites</span></label>
                </div>
                <div className="w-full md:w-1/3 flex items-center gap-4">
                    <input type="range" min="0" max="400" value={price} onChange={handlePriceChange} className="w-full" />
                    <span className="text-white font-semibold w-24 text-right">{price.toFixed(2)}€</span>
                </div>
                <button onClick={() => { setSearch(''); setPrice(400); }} className="text-gray-400 hover:text-white transition-colors hover:bg-blue-800/20 px-3 py-1.5 rounded-md">Clear filters</button>
            </div>

            <div className="mb-12 fade-in-up animation-delay-600">
                <img src="https://i.imgur.com/FPDK2i2.png" alt="Promotion" className="rounded-lg w-full cursor-pointer hover:scale-[1.02] transition-transform duration-300 shadow-lg shadow-black/30" />
            </div>

             <div className="my-12 fade-in-up animation-delay-700">
                <h2 className="text-3xl font-bold mb-6 text-center">Regular Cases</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {regularCases.map(caseItem => (
                       <CaseCard key={caseItem.id} caseItem={caseItem} onClick={() => navigate(`/cases?case=${caseItem.id}`)} />
                    ))}
                </div>
            </div>


            <div className="fixed bottom-6 right-6 z-50 group">
                 <div className="absolute bottom-20 right-0 mb-2 w-48 bg-cyan-600 text-white text-sm rounded-lg p-3 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                    Do you need help? We're here!
                    <div className="absolute right-4 -bottom-2 w-4 h-4 bg-cyan-600 transform rotate-45"></div>
                </div>
                <button className="w-16 h-16 bg-cyan-500 rounded-full flex items-center justify-center shadow-2xl hover:bg-cyan-400 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 16 16"><path d="M14 1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H4.414A2 2 0 0 0 3 11.586l-2 2V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12.793a.5.5 0 0 0 .854.353l2.853-2.853A1 1 0 0 1 4.414 12H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/></svg>
                </button>
            </div>
        </div>
    );
};

export default HomePage;