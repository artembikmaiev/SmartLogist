import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    color: 'blue' | 'purple' | 'green' | 'amber' | 'red' | 'orange';
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
            icon: 'text-blue-600'
        },
        purple: {
            bg: 'bg-purple-50',
            icon: 'text-purple-600'
        },
        green: {
            bg: 'bg-green-50',
            icon: 'text-green-600'
        },
        amber: {
            bg: 'bg-amber-50',
            icon: 'text-amber-600'
        },
        orange: {
            bg: 'bg-orange-50',
            icon: 'text-orange-600'
        },
        red: {
            bg: 'bg-red-50',
            icon: 'text-red-600'
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
            <div className="flex items-center justify-between mb-4">
                <div className={`p-3 ${colors[color].bg} rounded-xl transition-transform group-hover:scale-105`}>
                    <Icon className={`w-5 h-5 ${colors[color].icon}`} />
                </div>
                {trend && (
                    <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-lg ${trend.isPositive ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                        {trend.value}
                    </div>
                )}
            </div>
            <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{title}</p>
                <h3 className="text-2xl font-bold text-slate-900 tracking-tight">{value}</h3>
            </div>
        </div>
    );
};

export default StatCard;
