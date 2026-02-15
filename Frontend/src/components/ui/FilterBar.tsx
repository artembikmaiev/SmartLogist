// Цей компонент представляє панель фільтрації з полем пошуку та можливістю додавання додаткових фільтрів.
import React from 'react';
import { Search } from 'lucide-react';
import Input from '@/components/ui/Input';

interface FilterBarProps {
    searchQuery: string;
    onSearchChange: (query: string) => void;
    searchPlaceholder?: string;
    children?: React.ReactNode; // Для додаткових фільтрів, таких як селектори
    className?: string;
}

export default function FilterBar({
    searchQuery,
    onSearchChange,
    searchPlaceholder = 'Пошук...',
    children,
    className = ''
}: FilterBarProps) {
    return (
        <div className={`bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-8 flex flex-col md:flex-row gap-4 ${className}`}>
            <div className="flex-1">
                <Input
                    type="text"
                    icon={Search}
                    placeholder={searchPlaceholder}
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="font-medium"
                />
            </div>
            {children && (
                <div className="flex flex-wrap gap-4 items-center">
                    {children}
                </div>
            )}
        </div>
    );
}
