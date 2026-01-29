import React, { forwardRef } from 'react';

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    error?: boolean;
}

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(({
    className = '',
    error,
    ...props
}, ref) => {
    const baseStyles = "w-full px-4 py-2 border rounded-lg transition-all focus:outline-none focus:ring-2 disabled:bg-slate-50 disabled:text-slate-400 min-h-[100px]";
    const stateStyles = error
        ? "border-red-300 text-red-900 placeholder:text-red-300 focus:ring-red-200"
        : "border-slate-300 text-slate-900 placeholder:text-slate-400 focus:ring-blue-600/20 focus:border-blue-600";

    return (
        <textarea
            {...props}
            ref={ref}
            className={`${baseStyles} ${stateStyles} ${className}`}
        />
    );
});

TextArea.displayName = 'TextArea';

export default TextArea;
