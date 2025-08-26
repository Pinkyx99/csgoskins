

import React from 'react';
import { NavLink } from 'react-router-dom';
import { Logo } from '../../constants';
import { useUser } from '../../hooks/useUser';
import Button from '../ui/Button';
import ProfileDropdown from './ProfileDropdown';

const SocialIcon = ({ href, children }: { href: string, children: React.ReactNode }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
        {children}
    </a>
);

interface HeaderProps {
    onAdminConsoleOpen: () => void;
}

const Header: React.FC<HeaderProps> = ({ onAdminConsoleOpen }) => {
    const { user, setAuthModalOpen } = useUser();
    
    const navItems = ['Cases', 'Upgrader', 'Case Battles', 'Leaderboard', 'Exchanger'];

    const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
        `py-2 relative font-semibold transition-colors ${
            isActive ? 'text-white' : 'text-gray-400 hover:text-white'
        } after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[3px] after:bg-blue-500 after:transition-transform after:duration-300 ${
            isActive ? 'after:scale-x-100' : 'after:scale-x-0'
        } hover:after:scale-x-100 after:origin-center`;


    return (
        <header className="bg-[#1a1c3c]/80 backdrop-blur-sm border-b border-blue-900/50 sticky top-0 z-50">
            <div className="container mx-auto px-4 flex items-center justify-between h-20">
                <div className="flex items-center gap-4">
                    <Logo />
                    <div className="h-8 w-[1px] bg-gray-700 hidden lg:block"></div>
                    <div className="hidden lg:flex items-center gap-4">
                        <SocialIcon href="https://github.com/Pinkyx99">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
                            </svg>
                        </SocialIcon>
                        <SocialIcon href="https://www.snapchat.com/add/ramill_alijaa?share_id=EI-Jlq2zClE&locale=en-US">
                           <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M19.05,2.44A1.028,1.028,0,0,0,17.61,2H6.39a1.014,1.014,0,0,0-.56.16,1,1,0,0,0-.4,1.21,11.55,11.55,0,0,1,3.2,7.28,1,1,0,0,0,1,1h4.72a1,1,0,0,0,1-1,11.43,11.43,0,0,1,3.2-7.28,1,1,0,0,0-.31-1.37A1.01,1.01,0,0,0,19.05,2.44ZM8.08,12.06a12.8,12.8,0,0,0-3.3,6.38,1,1,0,0,0,1,1.19H18.22a1,1,0,0,0,1-1.19,12.8,12.8,0,0,0-3.3-6.38,1.49,1.49,0,0,1-2-2.12,1,1,0,0,0-1.33-.28,1.52,1.52,0,0,1-2.07,0,1,1,0,0,0-1.33.28A1.49,1.49,0,0,1,8.08,12.06Z"/></svg>
                        </SocialIcon>
                        <SocialIcon href="https://ramill.framer.website/">
                           <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1.2 15H9v-4.8l-1.8.6v-1.7l3-1.1h1v7.3zm3.7-1.1c-.6.7-1.4 1.1-2.5 1.1H9.5v-1.3h2.4c.7 0 1.2-.2 1.5-.6s.5-.9.5-1.5V12c0-1.3-.8-1.9-2.2-1.9H9.5V8.8h2.5c.8 0 1.4.2 1.8.6.4.4.6 1 .6 1.7h1.4c0-1.2-.5-2.2-1.5-2.8s-2.2-.9-3.7-.9H8v9.5h4.5c1.4 0 2.5-.4 3.3-1.1s1.2-1.7 1.2-2.9c0-1-.3-1.8-.8-2.5s-1.2-1.1-2-1.4v-.1c.7-.3 1.3-.8 1.7-1.4.4-.6.6-1.4.6-2.3 0-1.3-.4-2.4-1.3-3.2s-2-1.2-3.4-1.2H8v2.3h2.1c.7 0 1.2.2 1.6.5.3.3.5.7.5 1.2 0 .5-.2 1-.5 1.3-.3.3-.8.5-1.5.5H8v1.3h2.2c1.2 0 2 .5 2.5 1.4.5.9.8 2 .8 3.3 0 1.3-.4 2.4-1.2 3.2z"/></svg>
                        </SocialIcon>
                    </div>
                </div>

                <nav className="hidden md:flex items-center gap-6">
                    {navItems.map(item => (
                        <NavLink 
                            key={item} 
                            to={`/${item.toLowerCase().replace(' ', '-')}`}
                            className={navLinkClasses}
                        >
                            {item}
                        </NavLink>
                    ))}
                </nav>

                <div className="flex items-center gap-2">
                    {user ? (
                        <>
                            <div className="bg-[#0f172a] border border-blue-800/50 rounded-md flex items-center">
                                <div className='flex items-center gap-2 px-3 py-1.5'>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="text-green-400" viewBox="0 0 16 16"><path d="M1.5 3.5a.5.5 0 0 1 .5-.5h11.5a.5.5 0 0 1 0 1H2a.5.5 0 0 1-.5-.5zM1.5 6.5a.5.5 0 0 1 .5-.5h8.5a.5.5 0 0 1 0 1H2a.5.5 0 0 1-.5-.5zm5.5 3a.5.5 0 0 1 .5-.5h2.5a.5.5 0 0 1 0 1H7.5a.5.5 0 0 1-.5-.5z"/><path d="M0 2a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1V2zm1 0v12h14V2H1z"/></svg>
                                    <span className="text-white font-semibold text-md">${user.balance.toFixed(2)}</span>
                                </div>
                                <button className="bg-green-500/20 text-green-400 h-full px-3 border-l border-blue-800/50 hover:bg-green-500/40 transition-colors">+</button>
                            </div>
                           <ProfileDropdown onAdminConsoleOpen={onAdminConsoleOpen} />
                        </>
                    ) : (
                         <Button onClick={() => setAuthModalOpen(true)} variant='secondary'>Login</Button>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;