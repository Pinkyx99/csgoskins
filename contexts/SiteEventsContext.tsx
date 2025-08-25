
import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';
import { SiteEvent } from '../types';
import { RealtimeChannel } from '@supabase/supabase-js';

interface SiteEventsContextType {
    activeAnnouncement: SiteEvent | null;
    activeRain: SiteEvent | null;
    rainClaimsCount: number;
    chatClearedTimestamp: number | null;
    dismissAnnouncement: () => void;
    claimRain: (eventId: string) => Promise<{ error: any }>;
}

export const SiteEventsContext = createContext<SiteEventsContextType | undefined>(undefined);

export const SiteEventsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [activeAnnouncement, setActiveAnnouncement] = useState<SiteEvent | null>(null);
    const [activeRain, setActiveRain] = useState<SiteEvent | null>(null);
    const [rainClaimsCount, setRainClaimsCount] = useState(0);
    const [chatClearedTimestamp, setChatClearedTimestamp] = useState<number | null>(null);
    
    const rainClaimChannel = React.useRef<RealtimeChannel | null>(null);

    const dismissAnnouncement = () => setActiveAnnouncement(null);

    const claimRain = async (eventId: string) => {
        return supabase.rpc('claim_rain', { p_event_id: eventId });
    };

    const handleNewEvent = useCallback(async (event: SiteEvent) => {
        const now = new Date();
        const expiresAt = event.expires_at ? new Date(event.expires_at) : null;
        if (expiresAt && expiresAt < now) return; // Ignore expired events

        switch (event.event_type) {
            case 'ANNOUNCEMENT':
                setActiveAnnouncement(event);
                break;
            case 'RAIN':
                const { count, error } = await supabase
                    .from('rain_claims')
                    .select('*', { count: 'exact', head: true })
                    .eq('event_id', event.id);
                
                if (error) console.error("Error fetching initial rain claims:", error);
                else setRainClaimsCount(count ?? 0);
                
                setActiveRain(event);
                break;
            case 'CHAT_CLEARED':
                setChatClearedTimestamp(Date.now());
                break;
        }
    }, []);

    // Fetch initial active events on component mount
    useEffect(() => {
        const fetchInitialActiveEvents = async () => {
            const now = new Date().toISOString();
            const { data, error } = await supabase
                .from('site_events')
                .select('*')
                .or(`expires_at.gt.${now},expires_at.is.null`)
                .order('created_at', { ascending: false });

            if (error) {
                console.error("Error fetching initial active events:", error);
                return;
            }

            if (data && data.length > 0) {
                const latestAnnouncement = data.find(e => e.event_type === 'ANNOUNCEMENT');
                const latestRain = data.find(e => e.event_type === 'RAIN');
                
                if (latestAnnouncement) {
                    handleNewEvent(latestAnnouncement as SiteEvent);
                }
                if (latestRain) {
                    handleNewEvent(latestRain as SiteEvent);
                }
            }
        };

        fetchInitialActiveEvents();
    }, [handleNewEvent]);
    
    // Subscribe to new site-wide events (announcements, rain start, etc.)
    useEffect(() => {
        const channel = supabase.channel('public:site_events')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'site_events' }, payload => {
                handleNewEvent(payload.new as SiteEvent);
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [handleNewEvent]);
    
    // Subscribe to claims for the *active* rain event
    useEffect(() => {
        if (activeRain && !rainClaimChannel.current) {
            rainClaimChannel.current = supabase.channel(`rain_claims:${activeRain.id}`)
                .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'rain_claims', filter: `event_id=eq.${activeRain.id}` }, 
                () => {
                    setRainClaimsCount(prev => prev + 1);
                })
                .subscribe();
        }

        // Cleanup subscription when rain ends
        if (!activeRain && rainClaimChannel.current) {
            supabase.removeChannel(rainClaimChannel.current);
            rainClaimChannel.current = null;
        }

        return () => {
            if (rainClaimChannel.current) {
                supabase.removeChannel(rainClaimChannel.current);
                rainClaimChannel.current = null;
            }
        };
    }, [activeRain]);


    // Interval to clear expired events
    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date();
            if (activeAnnouncement?.expires_at && new Date(activeAnnouncement.expires_at) < now) {
                setActiveAnnouncement(null);
            }
            if (activeRain?.expires_at && new Date(activeRain.expires_at) < now) {
                setActiveRain(null);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [activeAnnouncement, activeRain]);

    const value = {
        activeAnnouncement,
        activeRain,
        rainClaimsCount,
        chatClearedTimestamp,
        dismissAnnouncement,
        claimRain,
    };

    return <SiteEventsContext.Provider value={value}>{children}</SiteEventsContext.Provider>;
};
