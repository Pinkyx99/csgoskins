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
                <Header onAdminConsoleOpen={() => setIsAdminConsoleOpen(true)} />

                <AnnouncementBanner />
                <ChatPanel />

                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/cases" element={<CasesPage />} />
                    <Route path="/upgrader" element={<UpgraderPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/leaderboard" element={<LeaderboardPage />} />
                    <Route path="/profile/:id" element={<PublicProfilePage />} />
                    <Route path="/case-battles" element={<CaseBattlesPage />} />
                    <Route path="/case-battles/:id" element={<CaseBattleRoomPage />} />
                    <Route path="/games" element={<GamesPage />} />
                    <Route path="/games/mines" element={<MinesPage />} />
                    <Route path="/games/coinflip" element={<CoinflipPage />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>

                {authModalOpen && <AuthModal onClose={() => setAuthModalOpen(false)} />}
                {isAdminConsoleOpen && <AdminConsole onClose={() => setIsAdminConsoleOpen(false)} />}
            </div>
        </HashRouter>
    );
};

export default App;
