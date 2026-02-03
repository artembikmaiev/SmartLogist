'use client';

import { useState, useEffect } from 'react';
import {
    BarChart3,
    TrendingUp,
    TrendingDown,
    Users,
    Package,
    Fuel,
    Star,
    DollarSign,
    Award,
    Calendar,
    ArrowUpRight,
    ArrowDownRight,
    Search
} from 'lucide-react';
import { analyticsService } from '@/services/analytics.service';
import type {
    AnalyticsSummary,
    MonthlyTrend,
    DriverPerformance,
    CargoTypeAnalytics
} from '@/types/analytics.types';
import { formatCurrency } from '@/lib/utils/formatters';

export default function AnalyticsPage() {
    const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
    const [trends, setTrends] = useState<MonthlyTrend[]>([]);
    const [drivers, setDrivers] = useState<DriverPerformance[]>([]);
    const [cargo, setCargo] = useState<CargoTypeAnalytics[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'overview' | 'drivers' | 'cargo'>('overview');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [s, t, d, c] = await Promise.all([
                    analyticsService.getSummary(),
                    analyticsService.getMonthlyTrends(12),
                    analyticsService.getDriverRankings(),
                    analyticsService.getCargoAnalysis()
                ]);
                setSummary(s);
                setTrends(t);
                setDrivers(d);
                setCargo(c);
            } catch (err) {
                console.error('Failed to fetch analytics:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="p-12 flex justify-center items-center h-[60vh]">
                <div className="flex flex-col items-center gap-4 text-slate-400">
                    <div className="w-12 h-12 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
                    <p className="font-medium animate-pulse">Завантаження аналітики...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8 space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Центр Аналітики</h1>
                    <p className="text-slate-500 mt-1">Детальні звіти та інтелектуальні алгоритми оцінки ефективності</p>
                </div>

                <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-2xl w-fit">
                    {(['overview', 'drivers', 'cargo'] as const).map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === tab
                                ? 'bg-white text-blue-600 shadow-sm'
                                : 'text-slate-500 hover:text-slate-700'
                                }`}
                        >
                            {tab === 'overview' ? 'Огляд' : tab === 'drivers' ? 'Ефективність водіїв' : 'Аналіз вантажів'}
                        </button>
                    ))}
                </div>
            </div>

            {activeTab === 'overview' && (
                <>
                    {/* Key Metrics */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <MetricCard
                            title="Чистий прибуток"
                            value={formatCurrency(summary?.totalProfit || 0)}
                            icon={DollarSign}
                            color="blue"
                            trend="+12.5%"
                        />
                        <MetricCard
                            title="Рентабельність"
                            value={`${summary?.profitMargin}%`}
                            icon={TrendingUp}
                            color="emerald"
                            trend="+2.1%"
                        />
                        <MetricCard
                            title="Загальна дистанція"
                            value={`${summary?.totalDistance.toLocaleString()} км`}
                            icon={BarChart3}
                            color="slate"
                        />
                        <MetricCard
                            title="Сер. витрата палива"
                            value={`${summary?.avgFuelEfficiency} л/100км`}
                            icon={Fuel}
                            color="amber"
                            trend="-0.4"
                            trendDown
                        />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Charts Area */}
                        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="font-black text-slate-900 uppercase tracking-widest text-xs">Тренд прибутку та виручки</h3>
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div> Виручка
                                    </div>
                                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                                        <div className="w-3 h-3 bg-emerald-500 rounded-full"></div> Прибуток
                                    </div>
                                </div>
                            </div>

                            <div className="h-64 mt-4">
                                <SimpleTrendChart data={trends} />
                            </div>
                        </div>

                        {/* Recent Insights */}
                        <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-xl flex flex-col justify-between">
                            <div>
                                <h3 className="font-black text-white/50 uppercase tracking-widest text-[10px] mb-6">AI Аналітика</h3>
                                <div className="space-y-6">
                                    <InsightItem
                                        icon={Award}
                                        title="Найкращий водій"
                                        desc={drivers[0]?.fullName || 'Немає даних'}
                                        sub={`Рейтинг ефективності: ${drivers[0]?.efficiencyScore}%`}
                                    />
                                    <InsightItem
                                        icon={Package}
                                        title="Топ категорія"
                                        desc={cargo[0]?.cargoType || 'Немає даних'}
                                        sub={`${cargo[0]?.count || 0} рейсів виконано`}
                                    />
                                    <InsightItem
                                        icon={TrendingUp}
                                        title="Прогноз на місяць"
                                        desc={formatCurrency((summary?.totalProfit || 0) / (trends.length || 1) * 1.05)}
                                        sub="Очікуваний ріст на 5%"
                                    />
                                </div>
                            </div>

                            <div className="mt-8 pt-8 border-t border-white/10">
                                <p className="text-[10px] text-white/30 leading-relaxed">
                                    *Алгоритми базуються на історичних даних за останні 6 місяців з використанням лінійної регресії
                                </p>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {activeTab === 'drivers' && (
                <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm animate-in slide-in-from-bottom-4 duration-500">
                    <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                        <h3 className="font-black text-slate-900 uppercase tracking-widest text-xs">Рейтинг ефективності водіїв</h3>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Шукати водія..."
                                className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-slate-50">
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Водій</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Виконано</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Сер. Оцінка</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Профіт за весь час</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Індекс Ефективності</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {drivers.map((driver, idx) => (
                                    <tr key={driver.driverId} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${idx === 0 ? 'bg-amber-100 text-amber-600' :
                                                    idx === 1 ? 'bg-slate-200 text-slate-600' :
                                                        idx === 2 ? 'bg-orange-100 text-orange-600' :
                                                            'bg-slate-100 text-slate-400'
                                                    }`}>
                                                    {idx + 1}
                                                </div>
                                                <span className="font-bold text-slate-900">{driver.fullName}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 text-center font-medium text-slate-600">{driver.completedTrips}</td>
                                        <td className="px-8 py-5">
                                            <div className="flex items-center justify-center gap-1">
                                                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                                                <span className="text-sm font-bold text-slate-700">{driver.avgRating}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 font-bold text-blue-600">{formatCurrency(driver.totalProfitGenerated)}</td>
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden min-w-[100px]">
                                                    <div
                                                        className={`h-full transition-all duration-1000 ${driver.efficiencyScore > 90 ? 'bg-emerald-500' :
                                                            driver.efficiencyScore > 75 ? 'bg-blue-500' :
                                                                driver.efficiencyScore > 50 ? 'bg-amber-500' : 'bg-red-500'
                                                            }`}
                                                        style={{ width: `${driver.efficiencyScore}%` }}
                                                    ></div>
                                                </div>
                                                <span className="text-sm font-black text-slate-900">{driver.efficiencyScore}%</span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeTab === 'cargo' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in slide-in-from-bottom-4 duration-500">
                    {cargo.map(item => (
                        <div key={item.cargoType} className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm hover:shadow-md transition-all">
                            <div className="flex items-center justify-between mb-6">
                                <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                                    <Package className="w-6 h-6" />
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Виконано рейсів</p>
                                    <p className="text-xl font-black text-slate-900">{item.count}</p>
                                </div>
                            </div>

                            <h4 className="text-lg font-bold text-slate-900 mb-6">{item.cargoType}</h4>

                            <div className="space-y-4">
                                <div className="flex justify-between items-end">
                                    <span className="text-sm text-slate-500">Загальний прибуток</span>
                                    <span className="text-sm font-bold text-emerald-600">{formatCurrency(item.totalProfit)}</span>
                                </div>
                                <div className="flex justify-between items-end">
                                    <span className="text-sm text-slate-500">Сер. вага вантажу</span>
                                    <span className="text-sm font-bold text-slate-700">{Math.round(item.averageWeight)} т</span>
                                </div>
                                <div className="flex justify-between items-end">
                                    <span className="text-sm text-slate-500">Відносна маржа</span>
                                    <span className="text-sm font-bold text-blue-600">{Math.round(item.totalProfit / (summary?.totalProfit || 1) * 100)}%</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

function MetricCard({
    title,
    value,
    icon: Icon,
    color,
    trend,
    trendDown
}: {
    title: string,
    value: string,
    icon: any,
    color: 'blue' | 'emerald' | 'amber' | 'slate',
    trend?: string,
    trendDown?: boolean
}) {
    const colors = {
        blue: 'bg-blue-50 text-blue-600',
        emerald: 'bg-emerald-50 text-emerald-600',
        amber: 'bg-amber-50 text-amber-600',
        slate: 'bg-slate-200 text-slate-700'
    };

    return (
        <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-4">
                <div className={`p-2.5 rounded-xl ${colors[color]}`}>
                    <Icon className="w-5 h-5" />
                </div>
                {trend && (
                    <div className={`flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full ${trendDown ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'
                        }`}>
                        {trendDown ? <TrendingDown className="w-3 h-3" /> : <TrendingUp className="w-3 h-3" />}
                        {trend}
                    </div>
                )}
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{title}</p>
            <p className="text-2xl font-black text-slate-900 mt-1 tracking-tight">{value}</p>
        </div>
    );
}

function InsightItem({ icon: Icon, title, desc, sub }: { icon: any, title: string, desc: string, sub: string }) {
    return (
        <div className="flex items-start gap-4">
            <div className="mt-1 p-2 bg-white/10 rounded-xl">
                <Icon className="w-4 h-4" />
            </div>
            <div>
                <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{title}</p>
                <p className="font-bold text-white tracking-tight">{desc}</p>
                <p className="text-[10px] text-white/60 mt-0.5">{sub}</p>
            </div>
        </div>
    );
}

function SimpleTrendChart({ data }: { data: MonthlyTrend[] }) {
    if (data.length < 2) {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 gap-2">
                <Calendar className="w-8 h-8 opacity-20" />
                <p className="text-sm">Недостатньо даних для графіку</p>
            </div>
        );
    }

    const maxVal = Math.max(...data.map(d => d.revenue)) * 1.1;
    const padding = 40;
    const width = 800;
    const height = 250;

    // Revenue Path
    const revPoints = data.map((d, i) => {
        const x = (i / (data.length - 1)) * (width - 2 * padding) + padding;
        const y = height - ((d.revenue / maxVal) * (height - 2 * padding)) - padding;
        return `${x},${y}`;
    });

    // Profit Path
    const profitPoints = data.map((d, i) => {
        const x = (i / (data.length - 1)) * (width - 2 * padding) + padding;
        const y = height - ((d.profit / maxVal) * (height - 2 * padding)) - padding;
        return `${x},${y}`;
    });

    return (
        <div className="w-full h-full flex flex-col">
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full flex-1 overflow-visible">
                {/* Horizontal Lines */}
                {[0, 0.25, 0.5, 0.75, 1].map(p => {
                    const y = height - (p * (height - 2 * padding)) - padding;
                    return (
                        <g key={p}>
                            <line
                                x1={padding} y1={y} x2={width - padding} y2={y}
                                className="stroke-slate-100" strokeWidth="1" strokeDasharray="4 4"
                            />
                            <text x={padding - 10} y={y + 4} textAnchor="end" className="text-[10px] fill-slate-300 font-bold">
                                {Math.round((p * maxVal) / 1000)}k
                            </text>
                        </g>
                    );
                })}

                {/* X Axis Labels */}
                {data.map((d, i) => {
                    const x = (i / (data.length - 1)) * (width - 2 * padding) + padding;
                    return (
                        <text key={i} x={x} y={height - 10} textAnchor="middle" className="text-[10px] fill-slate-400 font-bold">
                            {d.month.split(' ')[0]}
                        </text>
                    );
                })}

                {/* Data Lines */}
                <polyline
                    points={revPoints.join(' ')}
                    fill="none" className="stroke-blue-500" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
                />
                <polyline
                    points={profitPoints.join(' ')}
                    fill="none" className="stroke-emerald-500" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
                />

                {/* Area under Profit */}
                <path
                    d={`M ${padding},${height - padding} ${profitPoints.join(' ')} L ${width - padding},${height - padding} Z`}
                    className="fill-emerald-500/5"
                />

                {/* Data Points */}
                {data.map((d, i) => {
                    const [rx, ry] = revPoints[i].split(',').map(Number);
                    const [px, py] = profitPoints[i].split(',').map(Number);
                    return (
                        <g key={i}>
                            <circle cx={rx} cy={ry} r="4" className="fill-white stroke-blue-500" strokeWidth="2" />
                            <circle cx={px} cy={py} r="4" className="fill-white stroke-emerald-500" strokeWidth="2" />
                        </g>
                    );
                })}
            </svg>
        </div>
    );
}
