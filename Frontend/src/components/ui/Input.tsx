// Стандартний стилізований компонент текстового поля введення з підтримкою іконок та станів валідації.
import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    error?: string;
    icon?: any;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({
    className = '',
    error,
    icon,
    ...props
}, ref) => {
    const baseStyles = "w-full pr-4 py-2 border rounded-lg transition-all focus:outline-none focus:ring-2 disabled:bg-slate-50 disabled:text-slate-400";
    const stateStyles = error
        ? "border-red-300 text-red-900 placeholder:text-red-300 focus:ring-red-200"
        : "border-slate-300 text-slate-900 placeholder:text-slate-400 focus:ring-blue-600/20 focus:border-blue-600";
    const iconPadding = icon ? 'pl-11' : 'pl-4';
    const Icon = icon;

    return (
        <div className="relative w-full">
            {icon && (
                <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none">
                    {React.isValidElement(icon) ? (
                        icon
                    ) : (
                        <Icon className="w-5 h-5 text-slate-400" />
                    )}
                </div>
            )}
            <input
                {...props}
                ref={ref}
                className={`${baseStyles} ${stateStyles} ${iconPadding} ${className}`}
            />
        </div>
    );
});

Input.displayName = 'Input';

export default Input;
