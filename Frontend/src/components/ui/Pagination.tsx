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
        <div className={`px-8 py-5 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6 bg-white ${className}`}>
            <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
                <p className="text-[13px] text-slate-500 font-medium order-2 sm:order-1">
                    Показано <span className="font-bold text-slate-900">{start}</span> до <span className="font-bold text-slate-900">{end}</span> з <span className="font-bold text-slate-900">{totalItems}</span> {label}
                </p>
                <div className="flex items-center gap-3 order-1 sm:order-2">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">ПО</span>
                    <select
                        value={pageSize}
                        onChange={(e) => onPageSizeChange(Number(e.target.value))}
                        className="bg-slate-50 border border-slate-200 text-slate-900 text-[13px] font-bold rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 block px-3 py-1.5 transition-all hover:bg-white focus:outline-none appearance-none cursor-pointer pr-8 bg-no-repeat bg-[right_0.5rem_center] bg-[length:1.2em_1.2em]"
                        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2364748b' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")` }}
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
                    className="w-10 h-10 flex items-center justify-center border border-slate-200 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    title="Попередня"
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-1.5">
                    {uniquePages.map((page, index) => (
                        typeof page === 'number' ? (
                            <button
                                key={index}
                                onClick={() => onPageChange(page)}
                                className={`w-10 h-10 rounded-xl text-sm font-black transition-all ${currentPage === page
                                    ? 'bg-slate-900 text-white shadow-lg shadow-slate-200 translate-y-[-1px]'
                                    : 'text-slate-500 hover:bg-slate-50 border border-transparent hover:border-slate-100'
                                    }`}
                            >
                                {page}
                            </button>
                        ) : (
                            <span key={index} className="px-1 text-slate-300 font-black">
                                {page}
                            </span>
                        )
                    ))}
                </div>

                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="w-10 h-10 flex items-center justify-center border border-slate-200 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    title="Наступна"
                >
                    <ChevronRight className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};
