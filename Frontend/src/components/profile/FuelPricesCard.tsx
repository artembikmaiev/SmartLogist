// Віджет для відображення актуальних цін на пальне від зовнішнього сервісу.
import { FuelPrice } from '@/types/fuel.types';
import { externalService } from '@/services/external.service';
import { useState, useEffect } from 'react';
import { Fuel, TrendingUp, TrendingDown, Minus } from 'lucide-react';

export default function FuelPricesCard() {
    const [prices, setPrices] = useState<FuelPrice[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [lastUpdated, setLastUpdated] = useState<string>('');

    useEffect(() => {
        const fetchPrices = async () => {
            try {
                const data = await externalService.getFuelPrices();
                setPrices(data);
                setLastUpdated(new Date().toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' }));
            } catch (err) {
                console.error('Failed to fetch fuel prices:', err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchPrices();
    }, []);

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'Diesel': return 'from-blue-600 to-blue-700';
            case 'A95': return 'from-emerald-600 to-emerald-700';
            case 'LPG': return 'from-amber-500 to-amber-600';
            default: return 'from-slate-600 to-slate-700';
        }
    };

    const getTrendIcon = (change: number) => {
        if (change > 0) return <TrendingUp className="w-3 h-3 text-red-500" />;
        if (change < 0) return <TrendingDown className="w-3 h-3 text-emerald-500" />;
        return <Minus className="w-3 h-3 text-slate-400" />;
    };

    return (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm overflow-hidden relative group">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-blue-50 rounded-lg">
                        <Fuel className="w-5 h-5 text-blue-600" />
                    </div>
                    <h2 className="text-lg font-black text-slate-900 tracking-tight uppercase">Ціни на пальне</h2>
                </div>
                <div className="flex flex-col items-end">
                    <div className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></span>
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">UA Market</span>
                    </div>
                    {lastUpdated && (
                        <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter mt-0.5">Оновлено о {lastUpdated}</span>
                    )}
                </div>
            </div>

            <div className="space-y-3">
                {isLoading ? (
                    <div className="animate-pulse space-y-2">
                        {[1, 2, 3].map(i => <div key={i} className="h-14 bg-slate-50 rounded-xl"></div>)}
                    </div>
                ) : prices.map(fuel => (
                    <div key={fuel.type} className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-100 group hover:border-blue-200 transition-all hover:bg-white hover:shadow-md hover:scale-[1.02] duration-300">
                        <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 bg-gradient-to-br ${getTypeColor(fuel.type)} rounded-lg flex items-center justify-center text-white font-black text-xs shadow-sm`}>
                                {fuel.type === 'Diesel' ? 'ДП' : fuel.type === 'A95' ? '95' : 'ГАЗ'}
                            </div>
                            <div>
                                <p className="font-black text-slate-900 text-xs tracking-widest leading-none mb-1">{fuel.type}</p>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">{fuel.name}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="font-black text-slate-900 text-sm leading-none mb-1">
                                {fuel.price.toFixed(2)} <span className="text-[10px] text-slate-400 font-bold">₴/л</span>
                            </p>
                            <div className="flex items-center justify-end gap-1">
                                {getTrendIcon(fuel.change)}
                                <span className={`text-[9px] font-black uppercase tracking-tighter ${fuel.change > 0 ? 'text-red-500' : fuel.change < 0 ? 'text-emerald-500' : 'text-slate-400'}`}>
                                    {fuel.change !== 0 && (fuel.change > 0 ? '+' : '')}{fuel.change.toFixed(2)}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100">
                <p className="text-[9px] font-bold text-slate-400 text-center uppercase tracking-widest opacity-60">Середні ціни по АЗС України</p>
            </div>
        </div>
    );
}
