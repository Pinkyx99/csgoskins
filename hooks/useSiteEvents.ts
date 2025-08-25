
import { useContext } from 'react';
import { SiteEventsContext } from '../contexts/SiteEventsContext';

export const useSiteEvents = () => {
    const context = useContext(SiteEventsContext);
    if (context === undefined) {
        throw new Error('useSiteEvents must be used within a SiteEventsProvider');
    }
    return context;
};
