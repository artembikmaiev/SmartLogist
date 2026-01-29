import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    color: 'blue' | 'purple' | 'green' | 'amber' | 'red';
    trend?: {
        value: string;
        isPositive: boolean;
    };
}

const StatCard: React.FC<StatCardProps> = ({
    title,
    value,
    icon: Icon,
    color,
    trend
}) => {
    const colors = {
        blue: {
            bg: 'bg-blue-50',
            icon: 'text-blue-600',
            shadow: 'shadow-blue-100'
        },
        purple: {
            bg: 'bg-purple-50',
            icon: 'text-purple-600',
            shadow: 'shadow-purple-100'
        },
        green: {
            bg: 'bg-green-50',
            icon: 'text-green-600',
            shadow: 'shadow-green-100'
        },
        amber: {
            bg: 'bg-amber-50',
            icon: 'text-amber-600',
            shadow: 'shadow-amber-100'
        },
        red: {
            bg: 'bg-red-50',
            icon: 'text-red-600',
            shadow: 'shadow-red-50'
        }
    };

    return (
        <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-md transition-all group">
            <div className="flex items-center justify-between mb-4">
                <div className={`p-4 ${colors[color].bg} rounded-2xl ${colors[color].shadow} transition-transform group-hover:scale-110`}>
                    <Icon className={`w-6 h-6 ${colors[color].icon}`} />
                </div>
                {trend && (
                    <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-lg ${trend.isPositive ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                        {trend.value}
                    </div>
                )}
            </div>
            <div>
                <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">{title}</p>
                <h3 className="text-3xl font-black text-slate-900 font-sans tracking-tight">{value}</h3>
            </div>
        </div>
    );
};

export default StatCard;
