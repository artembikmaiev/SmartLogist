// Картка з інформацією про поточні дорожні умови та можливі затримки на рейсах.
import { RoadCondition, externalService } from '@/services/external.service';
import { useState, useEffect } from 'react';
import { MapPin, RefreshCcw, Info, CloudRain, Sun, Snowflake, Wind, AlertTriangle } from 'lucide-react';

export default function RoadConditionsCard() {
    const [conditions, setConditions] = useState<RoadCondition[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [lastUpdated, setLastUpdated] = useState<string>('');

    useEffect(() => {
        const fetchConditions = async () => {
            try {
                const data = await externalService.getRoadConditions();
                setConditions(data);
                setLastUpdated(new Date().toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' }));
            } catch (err) {
                console.error('Failed to fetch road conditions:', err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchConditions();
    }, []);

    const getStatusStyles = (color: string) => {
        switch (color) {
            case 'green': return 'bg-emerald-50 border-emerald-100 text-emerald-700';
            case 'orange': return 'bg-amber-50 border-amber-100 text-amber-700';
            case 'red': return 'bg-red-50 border-red-100 text-red-700';
            default: return 'bg-blue-50 border-blue-100 text-blue-700';
        }
    };

    const getIcon = (iconStr: string) => {
        switch (iconStr) {
            case '☀️': return <Sun className="w-5 h-5 text-amber-500" />;
            case '🌧️': return <CloudRain className="w-5 h-5 text-blue-500" />;
            case '❄️': return <Snowflake className="w-5 h-5 text-cyan-400" />;
            case '💨': return <Wind className="w-5 h-5 text-slate-400" />;
            default: return <Info className="w-5 h-5 text-blue-500" />;
        }
    };

    return (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm overflow-hidden relative group">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-emerald-50 rounded-lg">
                        <MapPin className="w-5 h-5 text-emerald-600" />
                    </div>
                    <h2 className="text-lg font-black text-slate-900 tracking-tight uppercase">Стан доріг</h2>
                </div>
                <div className="flex flex-col items-end">
                    <div className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Live Updates</span>
                    </div>
                    {lastUpdated && (
                        <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter mt-0.5">Оновлено о {lastUpdated}</span>
                    )}
                </div>
            </div>

            <div className="space-y-3">
                {isLoading ? (
                    <div className="animate-pulse space-y-2">
                        {[1, 2, 3].map(i => <div key={i} className="h-20 bg-slate-50 rounded-xl"></div>)}
                    </div>
                ) : conditions.length > 0 ? (
                    conditions.map((road, idx) => (
                        <div key={idx} className={`p-4 rounded-xl border transition-all hover:shadow-md hover:scale-[1.01] duration-300 ${getStatusStyles(road.statusColor)}`}>
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm border border-inherit">
                                        {getIcon(road.icon)}
                                    </div>
                                    <div>
                                        <p className="font-black text-slate-900 text-xs tracking-widest uppercase">{road.route}</p>
                                        <p className="text-[10px] font-bold opacity-70 uppercase tracking-tighter">{road.roadName}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-black text-sm uppercase tracking-tight">{road.condition}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-1.5 mt-2 pt-2 border-t border-inherit border-opacity-30">
                                <AlertTriangle className="w-3 h-3 flex-shrink-0 mt-0.5 opacity-60" />
                                <p className="text-[10px] font-medium leading-tight opacity-80">{road.description}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-xs text-slate-400 italic text-center py-8">Дані про стан доріг відсутні</p>
                )}
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100">
                <p className="text-[9px] font-bold text-slate-400 text-center uppercase tracking-widest opacity-60">За даними Укравтодору</p>
            </div>
        </div>
    );
}
