// Основний стилізований компонент кнопки з підтримкою різних розмірів, кольорів та станів завантаження.
import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'ghost' | 'outline' | 'purple';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
    icon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
    children,
    variant = 'primary',
    size = 'md',
    isLoading = false,
    icon,
    className = '',
    disabled,
    ...props
}) => {
    const baseStyles = 'inline-flex items-center justify-center gap-2 font-bold rounded-2xl transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none';

    const variants = {
        primary: 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-100',
        purple: 'bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-100',
        secondary: 'bg-slate-100 hover:bg-slate-200 text-slate-700',
        danger: 'bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-100',
        success: 'bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-100',
        outline: 'bg-transparent border-2 border-slate-200 text-slate-600 hover:border-slate-300',
        ghost: 'bg-transparent hover:bg-slate-50 text-slate-600'
    };

    const sizes = {
        sm: 'px-3 py-1.5 text-xs',
        md: 'px-5 py-2.5 text-sm',
        lg: 'px-8 py-4 text-lg'
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : icon}
            {children}
        </button>
    );
};

export default Button;
