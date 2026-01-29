import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    error?: string;
    icon?: React.ReactNode;
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

    return (
        <div className="relative w-full">
            {icon && (
                <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none">
                    {icon}
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
