import React from 'react';
import { Plus, RotateCcw } from 'lucide-react';
import Button from './Button';

interface PageHeaderProps {
    title: string;
    description?: string;
    primaryAction?: {
        label: string;
        onClick: () => void;
        icon?: React.ReactNode;
    };
    onRefresh?: () => void;
    className?: string;
}

export default function PageHeader({
    title,
    description,
    primaryAction,
    onRefresh,
    className = ''
}: PageHeaderProps) {
    return (
        <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 ${className}`}>
            <div>
                <h1 className="text-3xl font-bold text-slate-900">{title}</h1>
                {description && <p className="text-slate-600 mt-1">{description}</p>}
            </div>
            <div className="flex items-center gap-3">
                {onRefresh && (
                    <button
                        onClick={onRefresh}
                        className="p-2.5 text-slate-500 hover:text-slate-900 hover:bg-white hover:shadow-sm rounded-xl transition-all border border-transparent hover:border-slate-200"
                        title="Оновити"
                    >
                        <RotateCcw className="w-5 h-5" />
                    </button>
                )}
                {primaryAction && (
                    <Button
                        onClick={primaryAction.onClick}
                        variant="purple"
                        className="shadow-lg shadow-purple-100"
                    >
                        {primaryAction.icon || <Plus className="w-5 h-5" />}
                        {primaryAction.label}
                    </Button>
                )}
            </div>
        </div>
    );
}
