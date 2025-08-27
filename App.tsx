


import React, { useEffect, useState } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/layout/Header';
import HomePage from './pages/HomePage';
import CasesPage from './pages/CasesPage';
import PlaceholderPage from './pages/PlaceholderPage';
import UpgraderPage from './pages/UpgraderPage';
import AuthModal from './components/auth/AuthModal';
import { useUser } from './hooks/useUser';
import ChatPanel from './components/chat/ChatPanel';
// FIX: Module '"file:///pages/ProfilePage"' has no default export.
import ProfilePage from './pages/ProfilePage';
import LeaderboardPage from './pages/LeaderboardPage';
import PublicProfilePage from './pages/PublicProfilePage';
import BannedScreen from './components/auth/BannedScreen';
import AnnouncementBanner from './components/events/AnnouncementBanner';
import AdminConsole from './components/admin/AdminConsole';
import CaseBattlesPage from './pages/CaseBattlesPage';
import CaseBattleRoomPage from './pages/CaseBattleRoomPage';
import GamesPage from './pages/GamesPage';
import MinesPage from './pages/MinesPage';
import CoinflipPage from './pages/CoinflipPage';

const App: React.FC = () => {
    const { user, authModalOpen, setAuthModalOpen, checkUserStatus } = useUser();
    const [isAdminConsoleOpen, setIsAdminConsoleOpen] = useState(false);

    // Periodically check the user's status to enforce live bans/mutes
    useEffect(() => {
        if (user) {
            const interval = setInterval(() => {
                checkUserStatus();
            }, 30000); // Check every 30 seconds
            return () => clearInterval(interval);
        }
    }, [user, checkUserStatus]);
    
    // Determine if the user is currently banned
    const isBanned = user?.is_banned && 
                     user.ban_expires_at && 
                     new Date(user.ban_expires_at) > new Date();
    
    const isPermanentlyBanned = user?.is_banned && user.ban_expires_at === null;


    if (isBanned || isPermanentlyBanned) {
        return <BannedScreen />;
    }

    return (
        <HashRouter>
            <div className="min-h-screen bg-[#0d1a2f] text-white">
                <Header onAdminConsoleOpen={() => setIsAdminConsole