import React, { ReactNode } from 'react';

interface ButtonProps {
    children: ReactNode;
    onClick?: () => void;
    variant?: 'primary' | 'secondary' | 'ghost' | 'glow';
    className?: string;
    disabled?: boolean;
    type?: 'button' | 'submit' | 'reset';
}

const Button: React.FC<ButtonProps> = ({ children, onClick, variant = 'primary', className = '', disabled = false, type }) => {
    const baseStyles = 'px-6 py-2 rounded-md font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0d1a2f] active:scale-95 disabled:cursor-not-allowed disabled:opacity-60';
    
    const variantStyles = {
        primary: 'bg-gradient-to-br from-green-500 to-green-600 text-slate-900 hover:from-green-400 hover:to-green-500 focus:ring-green-500 disabled:bg-gray-500',
        secondary: 'bg-gradient-to-br from-blue-600 to-blue-700 text-white hover:from-blue-500 hover:to-blue-600 focus:ring-blue-600',
        ghost: 'bg-transparent text-gray-300 hover:bg-gray-700/50 hover:text-white',
        glow: 'bg-blue-500 text-white hover:bg-blue-400 focus:ring-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.8)]'
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`${baseStyles} ${variantStyles[variant]} ${className}`}
        >
            {children}
        </button>
    );
};

export default Button;