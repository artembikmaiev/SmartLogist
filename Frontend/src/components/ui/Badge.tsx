import React from 'react';

interface BadgeProps {
    children: React.ReactNode;
    variant?: 'success' | 'error' | 'warning' | 'info' | 'neutral' | 'purple';
    className?: string;
    pulse?: boolean;
}

const Badge: React.FC<BadgeProps> = ({
    children,
    variant = 'neutral',
    className = '',
    pulse = false
}) => {
    const variants = {
        success: 'bg-green-50 text-green-700 border-green-200',
        error: 'bg-red-50 text-red-700 border-red-200',
        warning: 'bg-amber-50 text-amber-700 border-amber-200',
        info: 'bg-blue-50 text-blue-700 border-blue-200',
        purple: 'bg-purple-50 text-purple-700 border-purple-200',
        neutral: 'bg-slate-50 text-slate-600 border-slate-200'
    };

    return (
        <span className={`
            inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border
            ${variants[variant]}
            ${pulse ? 'animate-pulse' : ''}
            ${className}
        `}>
            {children}
        </span>
    );
};

export default Badge;
