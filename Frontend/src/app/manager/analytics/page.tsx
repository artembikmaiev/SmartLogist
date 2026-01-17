'use client';

import { Truck, Users, Car, MapPin, TrendingUp, TrendingDown, ChevronDown, Search, Filter, BarChart3, PieChart } from 'lucide-react';

export default function AnalyticsPage() {
    // Main KPI data
    const mainKPIs = [
        {
            title: 'Активні рейси',
            value: '24',
            subtitle: 'З 142 загальних',
            change: '+12%',
            trend: 'up',
            icon: Truck,
            iconBg: 'bg-blue-100',
            iconColor: 'text-blue-600',
        },
        {
            title: 'Водії на маршруті',
            value: '15',
            subtitle: 'З 28 доступних',
            change: '+3',
            trend: 'up',
            icon: Users,
            iconBg: 'bg-yellow-100',
            iconColor: 'text-yellow-600',
        },
        {
            title: 'Активний транспорт',
            value: '142',
            subtitle: 'Коефіцієнт використання',
            change: '94%',
            trend: 'up',
            icon: Car,
            iconBg: 'bg-green-100',
            iconColor: 'text-green-600',
        },
        {
            title: 'Загальна відстань',
            value: '2,847',
            subtitle: 'км за цей період',
            change: '-8%',
            trend: 'down',
            icon: MapPin,
            iconBg: 'bg-purple-100',
            iconColor: 'text-purple-600',
        },
    ];

    // Secondary metrics
    const secondaryMetrics = [
        {
            title: 'Середня вартість рейсу',
            value: '3,850₴',
            change: '+5.2%',
            trend: 'up',
        },
        {
            title: 'Ефективність парку',
            value: '87.5%',
            subtitle: 'Відмінний показник',
        },
        {
            title: 'Доставка вчасно',
            value: '94.2%',
            subtitle: '136 з 144 рейсів',
        },
    ];

    // Recent trips data
    const recentTrips = [
        {
            id: 'TR-2024-001',
            date: '15 січня, 2024',
            route: 'Київ → Львів',
            driver: 'Іван Петренко',
            status: 'completed',
            distance: '540 км',
            cost: '4,200₴',
        },
        {
            id: 'TR-2024-002',
            date: '15 січня, 2024',
            route: 'Одеса → Харків',
            driver: 'Олег Коваленко',
            status: 'active',
            distance: '480 км',
            cost: '3,800₴',
        },
        {
            id: 'TR-2024-003',
            date: '14 січня, 2024',
            route: 'Дніпро → Запоріжжя',
            driver: 'Марія Шевченко',
            status: 'planned',
            distance: '85 км',
            cost: '680₴',
        },
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active':
                return 'bg-blue-100 text-blue-700';
            case 'completed':
                return 'bg-green-100 text-green-700';
            case 'planned':
                return 'bg-slate-100 text-slate-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'active':
                return 'В дорозі';
            case 'completed':
                return 'Завершено';
            case 'planned':
                return 'Заплановано';
            default:
                return status;
        }
    };

    return (
        <div className="p-8 bg-slate-50 min-h-screen">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-2">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">Аналітика</h1>  
                    </div>
                    <div className="relative">
                        <select className="appearance-none px-4 py-2.5 pr-10 border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors bg-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-600">
                            <option>Останні 30 днів</option>
                            <option>Останні 7 днів</option>
                            <option>Цей місяць</option>
                            <option>Минулий місяць</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    </div>
                </div>
            </div>

            {/* Main KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {mainKPIs.map((kpi, index) => {
                    const Icon = kpi.icon;
                    return (
                        <div
                            key={index}
                            className="bg-white border border-slate-200 rounded-2xl p-6 transition-all hover:shadow-md"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <p className="text-sm text-slate-500 mb-2">{kpi.title}</p>
                                    <p className="text-3xl font-bold text-slate-900">{kpi.value}</p>
                                </div>
                                <div className={`w-12 h-12 ${kpi.iconBg} rounded-xl flex items-center justify-center`}>
                                    <Icon className={`w-6 h-6 ${kpi.iconColor}`} />
                                </div>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <span className={`flex items-center gap-1 font-semibold ${kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'
                                    }`}>
                                    {kpi.trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                                    {kpi.change}
                                </span>
                                <span className="text-slate-500">{kpi.subtitle}</span>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Fuel Consumption Chart */}
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                    <div className="flex items-start justify-between mb-6">
                        <div>
                            <h2 className="text-lg font-bold text-slate-900">Витрати пального</h2>
                            <p className="text-sm text-slate-500 mt-1">Динаміка споживання по місяцях</p>
                        </div>
                        <div className="text-right">
                            <p className="text-2xl font-bold text-slate-900">342 км</p>
                            <p className="text-sm text-red-600 flex items-center gap-1 justify-end">
                                <TrendingDown className="w-4 h-4" />
                                4.2% менше
                            </p>
                        </div>
                    </div>
                    <div className="h-64 bg-slate-50 rounded-lg flex items-center justify-center border border-slate-200">
                        <div className="text-center">
                            <BarChart3 className="w-16 h-16 text-slate-400 mx-auto mb-3" />
                            <p className="text-slate-600 font-medium">Графік витрат пального</p>
                            <p className="text-sm text-slate-400 mt-1">Інтеграція з Chart.js</p>
                        </div>
                    </div>
                </div>

                {/* Cost Analysis Chart */}
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                    <div className="flex items-start justify-between mb-6">
                        <div>
                            <h2 className="text-lg font-bold text-slate-900">Аналіз витрат</h2>
                            <p className="text-sm text-slate-500 mt-1">Розподіл за категоріями</p>
                        </div>
                        <div className="text-right">
                            <p className="text-2xl font-bold text-slate-900">28.4 л</p>
                            <p className="text-sm text-slate-500">середнє споживання</p>
                        </div>
                    </div>
                    <div className="h-64 bg-slate-50 rounded-lg flex items-center justify-center border border-slate-200">
                        <div className="text-center">
                            <PieChart className="w-16 h-16 text-slate-400 mx-auto mb-3" />
                            <p className="text-slate-600 font-medium">Діаграма витрат</p>
                            <p className="text-sm text-slate-400 mt-1">Інтеграція з Chart.js</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Secondary Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {secondaryMetrics.map((metric, index) => (
                    <div
                        key={index}
                        className="bg-white border border-slate-200 rounded-2xl p-6 transition-all hover:shadow-md"
                    >
                        <p className="text-sm text-slate-500 mb-2">{metric.title}</p>
                        <p className="text-2xl font-bold text-slate-900 mb-2">{metric.value}</p>
                        {metric.change && (
                            <p className={`text-sm font-semibold flex items-center gap-1 ${metric.trend === 'up' ? 'text-green-600' : 'text-slate-500'
                                }`}>
                                {metric.trend === 'up' && <TrendingUp className="w-4 h-4" />}
                                {metric.change}
                            </p>
                        )}
                        {metric.subtitle && (
                            <p className="text-sm text-slate-500">{metric.subtitle}</p>
                        )}
                    </div>
                ))}
            </div>

            {/* Recent Trips Table */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="p-6 border-b border-slate-200">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-slate-900">Останні рейси</h2>
                        <div className="flex gap-2">
                            <button className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors flex items-center gap-2">
                                <Search className="w-4 h-4" />
                                Пошук
                            </button>
                            <button className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors flex items-center gap-2">
                                <Filter className="w-4 h-4" />
                                Фільтри
                            </button>
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">ID Рейсу</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Дата</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Маршрут</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Водій</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Статус</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Відстань</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Вартість</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 bg-white">
                            {recentTrips.map((trip) => (
                                <tr key={trip.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <span className="text-sm font-semibold text-slate-900">{trip.id}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm text-slate-700">{trip.date}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm font-medium text-slate-900">{trip.route}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm text-slate-700">{trip.driver}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(trip.status)}`}>
                                            {getStatusText(trip.status)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm text-slate-700">{trip.distance}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm font-bold text-slate-900">{trip.cost}</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between bg-slate-50">
                    <p className="text-sm text-slate-600">Показано <span className="font-medium">1-3</span> з <span className="font-medium">144</span> рейсів</p>
                    <div className="flex gap-1">
                        <button className="px-3 py-1.5 bg-slate-900 text-white rounded-md text-sm font-medium shadow-sm">1</button>
                        <button className="px-3 py-1.5 bg-white border border-slate-300 text-slate-700 rounded-md text-sm font-medium hover:bg-slate-50 transition-colors">2</button>
                        <button className="px-3 py-1.5 bg-white border border-slate-300 text-slate-700 rounded-md text-sm font-medium hover:bg-slate-50 transition-colors">3</button>
                    </div>
                </div>
            </div>
        </div>
    );
}