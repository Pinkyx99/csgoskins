
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CaseBattle, Reel, Skin, SkinWear } from '../types';
import { useUser } from '../hooks/useUser';
import Button from '../components/ui/Button';
import BattlePlayerView from '../components/case-battles/BattlePlayerView';
import BattleResultsModal from '../components/case-battles/BattleResultsModal';
import { POST_SPIN_RESULT_MS } from '../components/cases/Spinner';
import { supabase } from '../lib/supabaseClient';

const CaseBattleRoomPage: React.FC = () => {
    const { battleId } = useParams<{ battleId: string }>();
    const navigate = useNavigate();
    const { user } = useUser();

    const [battle, setBattle] = useState<CaseBattle | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [countdown, setCountdown] = useState<number | null>(null);
    const [currentRoundReels, setCurrentRoundReels] = useState<Reel[]>([]);
    const [finishedSpinsCount, setFinishedSpinsCount] = useState(0);
    const [isAddingBot, setIsAddingBot] = useState(false);
    const [isStarting, setIsStarting] = useState(false);

    const isCreator = useMemo(() => user && battle && user.id === battle.created_by_user_id, [user, battle]);

    // --- Fetch initial battle state and subscribe to updates ---
    useEffect(() => {
        const fetchBattle = async () => {
            if (!battleId) {
                setError("No battle ID provided.");
                setIsLoading(false);
                return;
            }
            const { data, error: fetchError } = await supabase
                .from('case_battles')
                .select('*')
                .eq('id', battleId)
                .single();
            
            if (fetchError || !data) {
                setError("Battle not found or an error occurred.");
                setIsLoading(false);
            } else {
                setBattle(data as CaseBattle);
                setIsLoading(false);
            }
        };

        fetchBattle();

        const channel = supabase
            .channel(`case_battle:${battleId}`)
            .on('postgres_changes', {
                event: 'UPDATE',
                schema: 'public',
                table: 'case_battles',
                filter: `id=eq.${battleId}`
            }, payload => {
                setBattle(payload.new as CaseBattle);
            }).subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [battleId]);

    // --- Game State Logic ---
    const openCase = useCallback((caseItems: Skin[]): Skin => {
        const totalCaseChance = caseItems.reduce((sum, item) => sum + item.chance, 0);
        let random = Math.random() * totalCaseChance;
        let chosenBaseSkin: Skin | null = null;
        for (const item of caseItems) {
            if (random < item.chance) {
                chosenBaseSkin = item;
                break;
            }
            random -= item.chance;
        }
        if (!chosenBaseSkin) chosenBaseSkin = caseItems[caseItems.length-1];

        if (chosenBaseSkin.wears && chosenBaseSkin.wears.length > 0) {
            const totalWearsChance = chosenBaseSkin.wears.reduce((sum, wear) => sum + wear.chance, 0);
            let randomWear = Math.random() * totalWearsChance;
            let chosenWear: SkinWear | null = null;
            for (const wear of chosenBaseSkin.wears) {
                if (randomWear < wear.chance) {
                    chosenWear = wear;
                    break;
                }
                randomWear -= wear.chance;
            }
            if (!chosenWear) chosenWear = chosenBaseSkin.wears[chosenBaseSkin.wears.length-1];

            return {
                ...chosenBaseSkin,
                id: `${chosenBaseSkin.id}-${chosenWear.name}`,
                name: `${chosenBaseSkin.name} (${chosenWear.name})`,
                price: chosenWear.price,
                chance: chosenWear.chance,
                wears: undefined,
            };
        }
        return chosenBaseSkin;
    }, []);

    const processRound = useCallback(async () => {
        if (!isCreator || !battle) return;

        const roundIndex = battle.current_case_index;
        if (roundIndex >= battle.cases.length) return;

        const currentCaseForRound = battle.cases[roundIndex];
        const winnings: { [participantId: string]: Skin } = {};

        for (const p of battle.participants) {
            winnings[p.id] = openCase(currentCaseForRound.items);
        }

        const { error: rpcError } = await supabase.rpc('submit_round_results', {
            p_battle_id: battle.id,
            p_winnings: winnings,
        });
        if (rpcError) {
            console.error("Error submitting round results:", rpcError);
            setError(rpcError.message);
        }
    }, [isCreator, battle, openCase]);

    // Handle countdown
    useEffect(() => {
        if (battle?.status === 'starting' && countdown === null) {
            setCountdown(3);
        }
        if (countdown === null || countdown === 0) return;
        
        const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
        return () => clearTimeout(timer);
    }, [battle?.status, countdown]);

    // Creator's client: Kick off the first round after countdown
    useEffect(() => {
        if (countdown === 0 && isCreator && battle?.status === 'starting') {
            const timer = setTimeout(processRound, 500); // Small delay for UX
            return () => clearTimeout(timer);
        }
    }, [countdown, isCreator, battle?.status, processRound]);

    // Creator's client: Process subsequent rounds
    useEffect(() => {
        if (isCreator && battle?.status === 'in_progress' && !battle.current_round_winnings) {
            processRound();
        }
    }, [battle, isCreator, processRound]);

    // All clients: Start spinning when round results are available
    useEffect(() => {
        if (battle?.status === 'in_progress' && battle.current_round_winnings) {
            const roundIndex = battle.current_case_index;
            const currentCaseForRound = battle.cases[roundIndex];
            if (!currentCaseForRound) return;
            
            const sortedItems = [...currentCaseForRound.items].sort((a, b) => b.price - a.price);

            const newReels = battle.participants.map(p => {
                const winner = battle.current_round_winnings![p.id];
                if (!winner) return { key: `${p.id}-${roundIndex}`, fullItems: [], winner: null, isFinished: false };

                const REEL_LENGTH = 150;
                const WINNER_INDEX_MIN = 105, WINNER_INDEX_MAX = 115;
                const winnerIndex = Math.floor(Math.random() * (WINNER_INDEX_MAX - WINNER_INDEX_MIN + 1)) + WINNER_INDEX_MIN;
                
                const reelItems: Skin[] = Array.from({ length: REEL_LENGTH }).map(() => sortedItems[Math.floor(Math.random() * sortedItems.length)]);
                reelItems[winnerIndex] = winner;

                return {
                    key: `${p.id}-${roundIndex}-${winner.id}`,
                    fullItems: reelItems,
                    winner: winner,
                    winnerIndex: winnerIndex,
                    isFinished: false
                };
            });
            setCurrentRoundReels(newReels as Reel[]);
        }
    }, [battle?.current_round_winnings, battle?.status, battle?.current_case_index, battle?.cases, battle?.participants]);


    // Creator's client: Finish the round after spins
    useEffect(() => {
        if (isCreator && battle && finishedSpinsCount >= battle.participants.length && battle.current_round_winnings) {
            const finishRound = async () => {
                const { error: rpcError } = await supabase.rpc('finish_battle_round', { p_battle_id: battle.id });
                if (rpcError) console.error("Error finishing round:", rpcError);
                else {
                    setFinishedSpinsCount(0);
                    setCurrentRoundReels([]);
                }
            }
            // Delay to allow clients to see winnings before next round
            const timer = setTimeout(finishRound, POST_SPIN_RESULT_MS);
            return () => clearTimeout(timer);
        }
    }, [finishedSpinsCount, battle, isCreator]);
    
    const handleSpinComplete = useCallback(() => {
        setFinishedSpinsCount(prev => prev + 1);
    }, []);

    // --- RPC Calls for Creator ---
    const addBot = async () => {
        if (isAddingBot || !battle) return;
        setIsAddingBot(true);
        setError(null);
        const { error: rpcError } = await supabase.rpc('add_bot_to_battle', { p_battle_id: battle.id });
        if (rpcError) {
            console.error("Error adding bot:", rpcError);
            setError(rpcError.message || 'An unknown error occurred.');
        }
        setIsAddingBot(false);
    };

    const startBattle = async () => {
        if (!battle || isStarting) return;
        setIsStarting(true);
        setError(null);
        const { error: rpcError } = await supabase.rpc('start_case_battle', { p_battle_id: battle.id });
        if (rpcError) {
            setError(rpcError.message || "Failed to start the battle.");
            setIsStarting(false);
        }
    };

    // --- Render Logic ---
    if (isLoading) return <div className="text-center py-20">Loading Battle...</div>;
    if (error && !battle) return <div className="text-center py-20 text-red-400">Error: {error}</div>;
    if (!battle) return <div className="text-center py-20">Battle not found.</div>;

    if (battle.status === 'starting' && countdown !== null) {
        return (
            <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100]">
                 <div className="text-center">
                    <p className="text-9xl font-black text-white drop-shadow-lg animate-countdown-pop">{countdown > 0 ? countdown : 'BATTLE!'}</p>
                </div>
                <style>{`
                    @keyframes countdown-pop {
                        0% { transform: scale(0.5) rotate(-15deg); opacity: 0; }
                        50% { transform: scale(1.1) rotate(5deg); opacity: 1; }
                        100% { transform: scale(1) rotate(0deg); opacity: 1; }
                    }
                    .animate-countdown-pop { animation: countdown-pop 0.8s ease-out forwards; }
                `}</style>
            </div>
        );
    }
    
    if (battle.status === 'waiting') {
        const slots = Array.from({ length: battle.max_players });
        return (
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-center mb-2">Case Battle</h1>
                <p className="text-center text-gray-400 mb-6">Created by {battle.created_by_username}</p>
                <div className="flex justify-center items-center gap-2 mb-6">
                    {battle.cases.map((c, i) => <img key={`${c.id}-${i}`} src={c.image} alt={c.name} className="w-16 h-16 object-contain" />)}
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-8">
                    {slots.map((_, i) => {
                        const participant = battle.participants[i];
                        return (
                            <div key={i} className="aspect-square bg-[#0d1a2f] border-2 border-dashed border-blue-800/50 rounded-lg flex flex-col items-center justify-center p-4">
                               {participant ? (
                                   <>
                                    <img src={participant.avatar_url} alt={participant.username} className="w-16 h-16 rounded-full mb-2 object-cover"/>
                                    <p className="font-semibold text-white truncate">{participant.username}</p>
                                   </>
                               ) : (
                                  isCreator ? <Button onClick={addBot} variant="secondary" disabled={isAddingBot}>{isAddingBot ? '...' : 'Add Bot'}</Button> : <p className="text-gray-600">Waiting...</p>
                               )}
                            </div>
                        );
                    })}
                </div>
                <div className="text-center">
                    {error && <p className="text-red-400 mb-4">Error: {error.replace(/(\r\n|\n|\r)/gm, "")}</p>}
                    {isCreator && (
                        <Button variant='glow' className="text-lg py-3 px-8" onClick={startBattle} disabled={battle.participants.length < battle.max_players || isStarting}>
                            {isStarting ? 'Starting...' : 'Start Battle'}
                        </Button>
                    )}
                 </div>
            </div>
        )
    }

    const currentCase = battle.cases[battle.current_case_index];

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="text-center mb-6">
                 <h2 className="text-2xl font-bold">Round {Math.min(battle.current_case_index + 1, battle.cases.length)} / {battle.cases.length}</h2>
                 <div className="flex items-center justify-center gap-4 mt-2">
                    {currentCase && <img src={currentCase.image} alt={currentCase.name} className="w-12 h-12 object-contain" />}
                    <p className="text-xl text-gray-300">{currentCase?.name || 'Finishing...'}</p>
                 </div>
            </div>
            
            <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${battle.max_players > 2 ? battle.max_players : 2} gap-4`}>
                {battle.participants.map((p) => (
                    <BattlePlayerView 
                        key={p.id}
                        participant={p}
                        reel={currentRoundReels.find(r => String(r.key).startsWith(p.id))}
                        isRoundFinished={!!battle.current_round_winnings}
                        onSpinComplete={handleSpinComplete}
                    />
                ))}
            </div>
            
            {battle.status === 'finished' && <BattleResultsModal battle={battle} />}
        </div>
    );
};

export default CaseBattleRoomPage;
