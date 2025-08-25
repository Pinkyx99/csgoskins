
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
                        <SocialIcon href="#"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M13.545 2.907a13.2 13.2 0 0 0-3.257-1.011.05.05 0 0 0-.052.025c-.141.25-.297.577-.406.833a12.2 12.2 0 0 0-3.658 0 8.2 8.2 0 0 0-.412-.833.05.05 0 0 0-.052-.025c-1.125.194-2.22.534-3.257 1.011a.04.04 0 0 0-.021.037c.334 1.425.98 3.65 1.54 4.667a.04.04 0 0 0 .041.025c.143-.09.29-.18.428-.275a.03.03 0 0 0 .028-.044s-.042-.058-.09-.114c-.048-.057-.1-.114-.143-.172a.04.04 0 0 0-.042-.03c-.143.043-.28.09-.412.143a.04.04 0 0 0-.022.043c.12.316.25.641.393.96.043.09.09.175.143.258a.04.04 0 0 0 .042.026c.143-.086.29-.172.434-.258a.03.03 0 0 0 .028-.043c-.043-.057-.086-.114-.128-.171a.03.03 0 0 0-.043-.025c-.128.043-.25.086-.372.128a.03.03 0 0 0-.022.037c.6.93.982 1.63 1.157 1.996a.04.04 0 0 0 .043.03c.143-.043.284-.09.422-.143a.03.03 0 0 0 .028-.043c-.043-.057-.086-.114-.128-.172a.03.03 0 0 0-.043-.025c-.128.043-.25.086-.372.128a.03.03 0 0 0-.022.037c.224.434.515.833.825 1.182a.04.04 0 0 0 .043.025c.143-.043.284-.09.422-.143a.03.03 0 0 0 .028-.043c-.043-.057-.086-.12-.128-.178a.03.03 0 0 0-.043-.025c-.128.043-.25.086-.372.128a.03.03 0 0 0-.022.037c.2.46.434.862.688 1.206a.04.04 0 0 0 .043.025c.143-.043.28-.09.412-.143a.03.03 0 0 0 .028-.043c-.043-.057-.086-.114-.128-.172a.03.03 0 0 0-.043-.025c-.128.043-.25.086-.372.128a.03.03 0 0 0-.022.037c.172.333.36.633.558.9.043.057.09.114.143.165a.04.04 0 0 0 .042.026c.143-.086.29-.172.434-.258a.03.03 0 0 0 .028-.043c-.043-.057-.086-.114-.128-.172a.03.03 0 0 0-.043-.025c-.128.043-.25.086-.372.128a.03.03 0 0 0-.022.037c.12.25.25.494.393.72a.04.04 0 0 0 .042.025c.143-.043.284-.086.422-.143a.03.03 0 0 0 .028-.043c-.043-.057-.086-.114-.128-.171a.03.03 0 0 0-.043-.025c-.128.043-.25.086-.372.128a.03.03 0 0 0-.022.037c.12.316.25.641.393.96a.04.04 0 0 0 .042.025c.143-.043.284-.086.422-.143a.03.03 0 0 0 .028-.043c-.043-.057-.086-.114-.128-.171a.03.03 0 0 0-.043-.025c-.128.043-.25.086-.372.128a.03.03 0 0 0-.022.037c.48.982 1.125 2.11 1.54 3.034a.04.04 0 0 0 .041.025c.143-.09.29-.18.428-.275a.03.03 0 0 0 .028-.044s-.042-.058-.09-.114c-.048-.057-.1-.114-.143-.172a.04.04 0 0 0-.042-.03c-.143.043-.28.09-.412.143a.04.04 0 0 0-.022-.043c.12.316.25.641.393.96.043.09.09.175.143.258a.04.04 0 0 0 .042.026c.143-.086.29-.172.434-.258a.03.03 0 0 0 .028-.043c-.043-.057-.086-.114-.128-.171a.03.03 0 0 0 .043-.025c.128-.043.25-.086.372-.128a.03.03 0 0 0 .022-.037c-.172-.333-.36-.633-.558-.9a.04.04 0 0 0-.043-.03c-3.257-1.011-3.257-1.011-3.257-1.011s-.006 0-.012.006a13.3 13.3 0 0 0-3.245 1.005.04.04 0 0 0-.021.037Z"/></svg></SocialIcon>
                        <SocialIcon href="#"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z"/></svg></SocialIcon>
                        <SocialIcon href="#"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.9 3.9 0 0 0-1.417.923A3.9 3.9 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.703.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372.527-.205.973-.478 1.417-.923.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.942a3.9 3.9 0 0 0-.923-1.417A3.9 3.9 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0zm0 1.442c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599s.453.546.598.92c.11.282.24.705.275 1.486.039.843.047 1.096.047 3.232s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.5 2.5 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.5 2.5 0 0 1-.92-.598 2.5 2.5 0 0 1-.598-.919c-.11-.282-.24-.705-.276-1.485-.038-.843-.046-1.096-.046-3.232s.008-2.389.046-3.232c.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92s.546-.453.92-.598c.282-.11.705-.24 1.485-.276.843-.039 1.096-.047 3.232-.047zM8 3.882a4.102 4.102 0 1 0 0 8.204 4.102 4.102 0 0 0 0-8.204zm0 6.762a2.662 2.662 0 1 1 0-5.324 2.662 2.662 0 0 1 0 5.324zM12.5 3.169a.942.942 0 1 0 0 1.884.942.942 0 0 0 0-1.884z"/></svg></SocialIcon>
                        <SocialIcon href="#"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865l8.875 11.633Z"/></svg></SocialIcon>
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
