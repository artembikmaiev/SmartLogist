// Універсальний компонент таблиці для відображення структурованих даних з підтримкою кастомних стовпців.
import React from 'react';
import { Pagination, PaginationProps } from './Pagination';
import TableSkeleton from './TableSkeleton';

export interface Column<T> {
    header: string;
    key: keyof T | string;
    render?: (item: T) => React.ReactNode;
    className?: string;
    headerClassName?: string;
}

interface DataTableProps<T> {
    data: T[];
    columns: Column<T>[];
    isLoading?: boolean;
    onRowClick?: (item: T) => void;
    emptyMessage?: string;
    keyExtractor?: (item: T) => string | number;
    className?: string;
    pagination?: PaginationProps;
}

export default function DataTable<T>({
    data,
    columns,
    isLoading,
    onRowClick,
    emptyMessage = 'Дані не знайдено',
    keyExtractor,
    className = '',
    pagination
}: DataTableProps<T>) {
    if (isLoading) {
        return <TableSkeleton columns={columns.length} />;
    }

    return (
        <div className={`bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden ${className}`}>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-200">
                            {columns.map((column, index) => (
                                <th
                                    key={index}
                                    className={`px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider ${column.headerClassName || ''}`}
                                >
                                    {column.header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {data.length > 0 ? (
                            data.map((item, rowIndex) => (
                                <tr
                                    key={keyExtractor ? keyExtractor(item) : rowIndex}
                                    onClick={() => onRowClick && onRowClick(item)}
                                    className={`transition-colors group ${onRowClick ? 'cursor-pointer hover:bg-slate-50' : 'hover:bg-slate-50/50'}`}
                                >
                                    {columns.map((column, colIndex) => (
                                        <td key={colIndex} className={`px-6 py-4 ${column.className || ''}`}>
                                            {column.render ? column.render(item) : (item[column.key as keyof T] as any)}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={columns.length} className="px-6 py-12 text-center text-slate-500 italic font-medium">
                                    {emptyMessage}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            {pagination && (
                <Pagination
                    {...pagination}
                />
            )}
        </div>
    );
}
