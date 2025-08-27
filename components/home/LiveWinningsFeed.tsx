
import React from 'react';
import { MOCK_WINNINGS } from '../../constants';

const LiveWinningsFeed: React.FC = () => {
    return (
        <div className="relative mb-6">
            <div className="flex space-x-3 overflow-x-auto pb-4 scrollbar-hide">
                <div className="flex items-center justify-center bg-[#1a1c3c] rounded-md p-3 w-32 flex-shrink-0">
                    <div className='flex items-center gap-2'>
                        <div className='w-3 h-3 bg-red-500 rounded-full animate-pulse'></div>
                        <span className='font-bold text-sm'>LIVE</span>
                    </div>
                </div>
                {[...MOCK_WINNINGS].reverse().map((winning) => (
                    <div key={winning.id} className="flex-shrink-0 bg-[#1a1c3c] rounded-md p-2 flex items-center gap-3 w-60 live-winning-card cursor-pointer">
                         <div className="w-16 h-12 flex items-center justify-center bg-black/20 rounded-md">
                            <img src={winning.skin.image} alt={winning.skin.name} className="max-h-full max-w-full object-contain" />
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-semibold text-white truncate">{winning.skin.name}</p>
                            <p className="text-xs text-gray-400 truncate">{winning.time}</p>
                        </div>
                    </div>
                ))}
            </div>
             <style>{`
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
                .scrollbar-hide {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </div>
    );
};

export default LiveWinningsFeed;
