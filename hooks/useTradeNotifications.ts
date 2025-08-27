import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useUser } from './useUser';

export const useTradeNotifications = () => {
    const { user } = useUser();
    const [newTradeCount, setNewTradeCount] = useState(0);

    const fetchCount = useCallback(async () => {
        if (!user) return;
        const { count, error } = await supabase
            .from('trades')
            .select('*', { count: 'exact', head: true })
            .eq('recipient_id', user.id)
            .eq('status', 'pending');
        
        if (!error) {
            setNewTradeCount(count ?? 0);
        }
    }, [user]);

    useEffect(() => {
        if (!user) {
            setNewTradeCount(0);
            return;
        }

        fetchCount();

        const channel = supabase.channel(`trades-notify:${user.id}`)
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'trades',
                filter: `recipient_id=eq.${user.id}`
            }, () => {
                fetchCount(); // Re-fetch count on any change to relevant trades
            })
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'trades',
                filter: `sender_id=eq.${user.id}`
            }, (payload) => {
                 // Also refetch if an outgoing trade is updated (accepted/declined)
                if (payload.eventType === 'UPDATE') {
                    fetchCount();
                }
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [user, fetchCount]);

    return { newTradeCount, refetchTradeCount: fetchCount };
};
