import React, { forwardRef } from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    error?: boolean;
    options?: { value: string | number; label: string }[];
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(({
    className = '',
    error,
    options,
    children,
    ...props
}, ref) => {
    const baseStyles = "w-full px-4 py-2 border rounded-lg transition-all focus:outline-none focus:ring-2 appearance-none bg-no-repeat bg-[right_1rem_center] bg-[length:1em_1em] disabled:bg-slate-50 disabled:text-slate-400";
    const stateStyles = error
        ? "border-red-300 text-red-900 focus:ring-2 focus:ring-red-200"
        : "border-slate-300 text-slate-900 focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600";

    // Custom arrow icon
    const arrowUrl = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E`;

    return (
        <select
            {...props}
            ref={ref}
            className={`${baseStyles} ${stateStyles} ${className}`}
            style={{ backgroundImage: `url("${arrowUrl}")` }}
        >
            {options
                ? options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))
                : children
            }
        </select>
    );
});

Select.displayName = 'Select';

export default Select;
