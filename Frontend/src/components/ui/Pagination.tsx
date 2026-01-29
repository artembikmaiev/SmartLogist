'use client';

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface PaginationProps {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    pageSize: number;
    onPageChange: (page: number) => void;
    onPageSizeChange: (size: number) => void;
    label?: string;
    className?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    totalPages,
    totalItems,
    pageSize,
    onPageChange,
    onPageSizeChange,
    label = 'елементів',
    className = ''
}) => {
    if (totalItems === 0) return null;

    const start = (currentPage - 1) * pageSize + 1;
    const end = Math.min(currentPage * pageSize, totalItems);

    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
        if (
            i === 1 ||
            i === totalPages ||
            (i >= currentPage - 1 && i <= currentPage + 1)
        ) {
            pageNumbers.push(i);
        } else if (i === currentPage - 2 || i === currentPage + 2) {
            pageNumbers.push('...');
        }
    }

    const uniquePages = [...new Set(pageNumbers)];

    return (
        <div className={`px-6 py-4 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-50/50 ${className}`}>
            <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
                <p className="text-sm text-slate-600 order-2 sm:order-1">
                    Показано <span className="font-semibold text-slate-900">{start}</span> до <span className="font-semibold text-slate-900">{end}</span> з <span className="font-semibold text-slate-900">{totalItems}</span> {label}
                </p>
                <div className="flex items-center gap-2 order-1 sm:order-2">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">По</span>
                    <select
                        value={pageSize}
                        onChange={(e) => onPageSizeChange(Number(e.target.value))}
                        className="bg-white border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block p-1.5 transition-colors hover:border-slate-400 focus:outline-none"
                    >
                        {[10, 20, 50, 100].map(size => (
                            <option key={size} value={size}>{size}</option>
                        ))}
                    </select>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 border border-slate-300 rounded-lg text-slate-600 hover:bg-white hover:border-slate-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                    title="Попередня"
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-1">
                    {uniquePages.map((page, index) => (
                        typeof page === 'number' ? (
                            <button
                                key={index}
                                onClick={() => onPageChange(page)}
                                className={`w-10 h-10 rounded-lg text-sm font-semibold transition-all ${currentPage === page
                                    ? 'bg-slate-900 text-white shadow-sm shadow-slate-200'
                                    : 'text-slate-600 hover:bg-white border border-transparent hover:border-slate-200'
                                    }`}
                            >
                                {page}
                            </button>
                        ) : (
                            <span key={index} className="px-2 text-slate-400 font-medium">
                                {page}
                            </span>
                        )
                    ))}
                </div>

                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 border border-slate-300 rounded-lg text-slate-600 hover:bg-white hover:border-slate-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                    title="Наступна"
                >
                    <ChevronRight className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};
