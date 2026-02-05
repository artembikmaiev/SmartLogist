import { Trash2, RefreshCcw, Info, Truck, CheckCircle, AlertCircle } from 'lucide-react';
import { formatDate } from '@/lib/utils/date.utils';
import type { ActivityLog } from '@/types/activity.types';

interface ActivitySidebarProps {
    activities: ActivityLog[];
    isLoading: boolean;
}

export default function ActivitySidebar({ activities, isLoading }: ActivitySidebarProps) {
    const getActivityIcon = (action: string) => {
        if (action.includes('Завершено') || action.includes('Успішно')) return <CheckCircle className="w-4 h-4 text-green-500" />;
        if (action.includes('Створено') || action.includes('Додано')) return <RefreshCcw className="w-4 h-4 text-blue-500" />;
        if (action.includes('Оновлено') || action.includes('Змінено')) return <Info className="w-4 h-4 text-blue-400" />;
        if (action.includes('Видалено') || action.includes('Відхилено')) return <Trash2 className="w-4 h-4 text-red-500" />;
        if (action.includes('Призначено') || action.includes('Транспорт')) return <Truck className="w-4 h-4 text-purple-500" />;
        return <AlertCircle className="w-4 h-4 text-slate-400" />;
    };

    return (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Остання активність</h2>
            <div className="space-y-4">
                {isLoading ? (
                    <div className="flex justify-center p-4">
                        <RefreshCcw className="w-5 h-5 text-slate-400 animate-spin" />
                    </div>
                ) : activities.length > 0 ? (
                    activities.map((activity) => (
                        <div key={activity.id} className="flex gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors">
                            <div className="flex-shrink-0 mt-0.5">{getActivityIcon(activity.action)}</div>
                            <div className="flex-1 min-w-0">
                                <p className="font-bold text-slate-900 text-sm">{activity.action}</p>
                                <p className="text-[10px] text-slate-500 font-bold truncate">{activity.details}</p>
                                <p className="text-[10px] text-slate-400 mt-1 font-black uppercase tracking-tighter">{formatDate(activity.createdAt)}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-xs text-slate-400 italic text-center py-4">Активності відсутні</p>
                )}
            </div>
        </div>
    );
}
