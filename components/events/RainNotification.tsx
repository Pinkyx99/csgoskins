
import React, { useState, useEffect } from 'react';
import { useSiteEvents } from '../../hooks/useSiteEvents';
import { useUser } from '../../hooks/useUser';
import { RainEventData } from '../../types';
import Button from '../ui/Button';

const RainNotification: React.FC = () => {
    const { activeRain, rainClaimsCount, claimRain } = useSiteEvents();
    const { user, checkUserStatus, setAuthModalOpen } = useUser();

    const [isClaiming, setIsClaiming] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [timeLeft, setTimeLeft] = useState('');

    useEffect(() => {
        if (activeRain) {
            setMessage(null);
            
            const interval = setInterval(() => {
                const expires = new Date(activeRain.expires_at!).getTime();
                const now = new Date().getTime();
                const distance = expires - now;

                if (distance < 0) {
                    setTimeLeft('00:00');
                    clearInterval(interval);
                    return;
                }
                const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((distance % (1000 * 60)) / 1000);
                setTimeLeft(`${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`);
            }, 1000);
    
            return () => clearInterval(interval);
        }
    }, [activeRain]);

    const handleClaim = async () => {
        if (!user) { setAuthModalOpen(true); return; }
        if (!activeRain) return;

        setIsClaiming(true);
        setMessage(null);
        const { error } = await claimRain(activeRain.id);
        
        if (error) {
            setMessage({ type: 'error', text: error.message });
        } else {
            const data = activeRain.data as RainEventData;
            setMessage({ type: 'success', text: `You claimed ${data.amount_per_user.toFixed(2)}€!` });
            checkUserStatus(); // refetch balance
        }
        setIsClaiming(false);
    };
    
    if (!activeRain) return null;
    
    const data = activeRain.data as RainEventData;
    const claimsLeft = data.max_claims - rainClaimsCount;
    
    const hasClaimed = message?.type === 'success';

    return (
        <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 p-3 border-b border-blue-900/50 flex-shrink-0">
             <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-bold text-blue-300">
                   🌧️ Rain by {activeRain.created_by_username}
                </p>
                <div className="text-xs text-gray-400 font-semibold">{timeLeft}</div>
            </div>
            <div className="flex items-center justify-between">
                <div>
                     <p className="text-lg font-bold text-green-400">{data.amount_per_user.toFixed(2)}€</p>
                     <p className="text-xs text-gray-400">{claimsLeft} / {data.max_claims} left</p>
                </div>
                 <Button onClick={handleClaim} disabled={isClaiming || hasClaimed || claimsLeft <= 0} variant="primary" className="!py-2 !px-4 text-sm">
                    {hasClaimed ? 'Claimed' : (claimsLeft <= 0 ? 'Finished' : (isClaiming ? '...' : 'Claim'))}
                </Button>
            </div>
             {message && message.type === 'error' && (
                <p className="text-red-400 text-xs text-center mt-2">{message.text}</p>
            )}
        </div>
    );
};
export default RainNotification;
