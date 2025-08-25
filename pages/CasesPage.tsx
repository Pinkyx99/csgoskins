import React, { useState, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { MOCK_CASES } from '../constants';
import CaseCard from '../components/ui/CaseCard';
import { useUser } from '../hooks/useUser';
import CaseItemCard from '../components/cases/CaseItemCard';
import Spinner from '../components/cases/Spinner';
import CaseOpeningModal from '../components/cases/CaseOpeningModal';
import { Skin } from '../types';

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
    const { user, updateBalance } = useUser();
    
    const [numToOpen, setNumToOpen] = useState(1);
    const [isSpinning, setIsSpinning] = useState(false);
    const [winnings, setWinnings] = useState<Skin[]>([]);

    const selectedCase = useMemo(() => MOCK_CASES.find(c => c.id === caseId), [caseId]);
    
    const handleSellWinnings = (totalValue: number) => {
        if(user) {
            updateBalance(totalValue);
            setWinnings([]); // Close modal
        }
    };


    if (selectedCase) {
        const canAfford = user && user.balance >= selectedCase.price * numToOpen;

        return (
            <>
                <div className="container mx-auto px-4 py-8">
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
                        numToOpen={numToOpen}
                        isSpinning={isSpinning}
                        setIsSpinning={setIsSpinning}
                        onSpinEnd={setWinnings}
                    >
                        <div className="flex flex-col items-center gap-4 my-8">
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

                            <div className="my-4">
                            <Spinner.Button canAfford={canAfford ?? false} />
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
                        onClose={() => setWinnings([])}
                        onSell={handleSellWinnings}
                        caseName={selectedCase.name}
                    />
                )}
            </>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold mb-8 text-center">All Cases</h1>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {MOCK_CASES.map(caseItem => (
                    <CaseCard key={caseItem.id} caseItem={caseItem} onClick={() => navigate(`/cases?case=${caseItem.id}`)} />
                ))}
            </div>
        </div>
    );
};

export default CasesPage;