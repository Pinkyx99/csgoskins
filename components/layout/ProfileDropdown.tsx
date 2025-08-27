import React, { useState, useRef, useEffect } from 'react';
import { useUser } from '../../hooks/useUser';
import { Link } from 'react-router-dom';
import { useTradeNotifications } from '../../hooks/useTradeNotifications';
import NotificationDot from '../ui/NotificationDot';

interface ProfileDropdownProps {
  onAdminConsoleOpen: () => void;
}

const ProfileDropdown: React.FC<ProfileDropdownProps> = ({ onAdminConsoleOpen }) => {
  const { user, signOut } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { newTradeCount } = useTradeNotifications();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button onClick={() => setIsOpen(!isOpen)} className="relative">
        <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-md object-cover border-2 border-transparent hover:border-blue-500 transition-colors"/>
        {newTradeCount > 0 && <NotificationDot />}
      </button>

      {isOpen && (
        <div className="absolute top-14 right-0 bg-[#1a2c47] border border-blue-900/50 rounded-md shadow-lg w-48 z-50">
          <Link to="/profile" onClick={() => setIsOpen(false)} className="block p-3 border-b border-blue-900/50 hover:bg-blue-800/20 rounded-t-md">
            <p className="font-semibold text-white truncate">{user.name}</p>
            <p className="text-sm text-gray-400">Balance: ${user.balance.toFixed(2)}</p>
          </Link>
          <div className="p-2">
             <Link to="/profile" onClick={() => setIsOpen(false)} className="relative block w-full text-left px-3 py-2 text-sm text-gray-200 hover:bg-blue-800/30 rounded-md transition-colors">
              My Profile
              {newTradeCount > 0 && (
                <span className="absolute top-1/2 -translate-y-1/2 right-2 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center font-bold">
                    {newTradeCount}
                </span>
              )}
            </Link>
            {user.is_admin && (
                <button
                    onClick={() => {
                        onAdminConsoleOpen();
                        setIsOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-blue-800/30 rounded-md transition-colors"
                >
                    Admin Console
                </button>
            )}
            <button 
              onClick={async () => {
                  await signOut();
                  setIsOpen(false);
              }}
              className="w-full text-left px-3 py-2 text-sm text-gray-200 hover:bg-blue-800/30 rounded-md transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
