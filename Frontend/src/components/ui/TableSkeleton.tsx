// Компонент-заглушка для таблиці, що відображається під час завантаження даних.
import React from 'react';

interface TableSkeletonProps {
    columns: number;
    rows?: number;
    hasHeader?: boolean;
}

const TableSkeleton: React.FC<TableSkeletonProps> = ({
    columns,
    rows = 5,
    hasHeader = true
}) => {
    return (
        <div className="w-full bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm animate-pulse">
            {hasHeader && (
                <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex gap-4">
                    {Array.from({ length: columns }).map((_, i) => (
                        <div key={`header-${i}`} className="h-4 bg-slate-200 rounded flex-1"></div>
                    ))}
                </div>
            )}
            <div className="divide-y divide-slate-100">
                {Array.from({ length: rows }).map((_, rowIndex) => (
                    <div key={`row-${rowIndex}`} className="px-6 py-5 flex gap-4 items-center">
                        {Array.from({ length: columns }).map((_, colIndex) => (
                            <div key={`cell-${rowIndex}-${colIndex}`} className="h-5 bg-slate-100 rounded flex-1"></div>
                        ))}
                    </div>
                ))}
            </div>
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
                <div className="h-4 w-32 bg-slate-200 rounded"></div>
                <div className="flex gap-2">
                    <div className="h-8 w-8 bg-slate-200 rounded-lg"></div>
                    <div className="h-8 w-8 bg-slate-200 rounded-lg"></div>
                </div>
            </div>
        </div>
    );
};

export default TableSkeleton;
