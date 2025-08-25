
import React, { useState, useEffect } from 'react';
import Button from '../components/ui/Button';
import CreateBattleModal from '../components/case-battles/CreateBattleModal';
import { useUser } from '../hooks/useUser';
import { supabase } from '../lib/supabaseClient';
import { CaseBattle } from '../types';
import BattleListingCard from '../components/case-battles/BattleListingCard';

const CaseBattlesPage: React.FC = () => {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const { user, setAuthModalOpen } = useUser();
    const [battles, setBattles] = useState<CaseBattle[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBattles = async () => {
            setLoading(true);
            const { data, error } = await supabase
                .from('case_battles')
                .select('*')
                .eq('status', 'waiting')
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Error fetching battles:', error);
            } else {
                setBattles(data as CaseBattle[]);
            }
            setLoading(false);
        };

        fetchBattles();

        const channel = supabase
            .channel('public:case_battles')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'case_battles' },
                (payload) => {
                   // Just refetch all for simplicity
                   fetchBattles();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const handleCreateClick = () => {
        if (user) {
            setIsCreateModalOpen(true);
        } else {
            setAuthModalOpen(true);
        }
    };

    return (
        <>
            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-4xl font-bold">Case Battles</h1>
                    <Button variant="glow" onClick={handleCreateClick}>
                        Create Battle
                    </Button>
                </div>
                
                {loading ? (
                    <div className="text-center py-24 text-gray-500">Loading active battles...</div>
                ) : battles.length === 0 ? (
                    <div className="bg-[#12233f] border border-blue-900/50 rounded-lg p-6">
                        <div className="text-center py-24 text-gray-500">
                            <h3 className="text-2xl font-semibold">No Active Battles</h3>
                            <p className="mt-2">Be the first to create one!</p>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {battles.map(battle => <BattleListingCard key={battle.id} battle={battle} />)}
                    </div>
                )}
            </div>
            {isCreateModalOpen && <CreateBattleModal onClose={() => setIsCreateModalOpen(false)} />}
        </>
    );
};

export default CaseBattlesPage;