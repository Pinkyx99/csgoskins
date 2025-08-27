import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CaseBattle } from '../../types';
import Button from '../ui/Button';
import { supabase } from '../../lib/supabaseClient';
import { useUser } from '../../hooks/useUser';

interface BattleListingCardProps {
    battle: CaseBattle;
}

const BattleListingCard: React.FC<BattleListingCardProps> = ({ battle }) => {
    const navigate = useNavigate();
    const { user, setAuthModalOpen } = useUser();
    const [isJoining, setIsJoining] = React.useState(false);

    const handleJoin = async () => {
        if (!user) {
            setAuthModalOpen(true);
            return;
        }
        if (user.balance < battle.total_value) {
            alert('Insufficient balance to join this battle.');
            return;
        }
        setIsJoining(true);
        const { error } = await supabase.rpc('join_case_battle', { p_battle_id: battle.id });
        if (error) {
            console.error("Failed to join battle:", error);
            alert(error.message);
        } else {
            navigate(`/case-battles/${battle.id}`);
        }
        setIsJoining(false);
    };

    const hasJoined = battle.participants.some(p => p.id === user?.id);

    return (
        <div className="bg-[#1a2c47] border border-blue-900/50 rounded-lg p-4 flex flex-col justify-between">
            <div>
                <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-gray-400">Creator: {battle.created_by_username}</span>
                    <span className="text-sm font-bold text-white bg-blue-500/50 px-2 py-0.5 rounded">
                        {battle.participants.length} / {battle.max_players} Players
                    </span>
                </div>
                <div className="flex items-center gap-2 mb-4 bg-black/20 p-2 rounded-md">
                    {battle.cases.slice(0, 5).map((c, i) => (
                        <img key={i} src={c.image} alt={c.name} className="w-12 h-12 object-contain" title={c.name} />
                    ))}
                    {battle.cases.length > 5 && <span className="text-gray-400 ml-2">+{battle.cases.length - 5} more</span>}
                </div>
            </div>
            <div className="flex items-center justify-between mt-2">
                <div>
                    <p className="text-sm text-gray-400">Total Value</p>
                    <p className="text-lg font-bold text-green-400">{battle.total_value.toFixed(2)}€</p>
                </div>
                {hasJoined ? (
                     <Button onClick={() => navigate(`/case-battles/${battle.id}`)} variant="secondary">Enter Battle</Button>
                ) : (
                    <Button onClick={handleJoin} disabled={isJoining || battle.participants.length >= battle.max_players} variant="primary">
                        {isJoining ? 'Joining...' : 'Join Battle'}
                    </Button>
                )}
            </div>
        </div>
    );
};

export default BattleListingCard;