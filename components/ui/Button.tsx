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
    const baseStyles = 'px-6 py-2 rounded-md font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0d1a2f]';
    
    const variantStyles = {
        primary: 'bg-green-500 text-slate-900 hover:bg-green-400 focus:ring-green-500 disabled:bg-gray-500',
        secondary: 'bg-blue-600 text-white hover:bg-blue-500 focus:ring-blue-600',
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