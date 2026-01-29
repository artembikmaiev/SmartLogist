import React from 'react';

interface FormFieldProps {
    label: string;
    error?: string;
    required?: boolean;
    children: React.ReactNode;
    className?: string;
    id?: string;
}

const FormField: React.FC<FormFieldProps> = ({
    label,
    error,
    required,
    children,
    className = '',
    id
}) => {
    return (
        <div className={`space-y-1.5 ${className}`}>
            <label
                htmlFor={id}
                className="block text-sm font-medium text-slate-700"
            >
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <div className="relative">
                {children}
            </div>
            {error && (
                <p className="text-xs text-red-500 font-medium animate-in fade-in slide-in-from-top-1">
                    {error}
                </p>
            )}
        </div>
    );
};

export default FormField;
