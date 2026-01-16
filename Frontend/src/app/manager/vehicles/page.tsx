'use client';

import { Truck, CheckCircle, Settings, CircleCheck, Search, Filter, ChevronDown, Eye, Edit, Trash2 } from 'lucide-react';

export default function VehiclesPage() {
    // Stats data
    const stats = [
        {
            title: 'Всього транспорту',
            value: '24',
            change: '+2',
            subtitle: 'цього місяця',
            icon: Truck,
            iconBg: 'bg-blue-100',
            iconColor: 'text-blue-600',
        },
        {
            title: 'В дорозі',
            value: '18',
            subtitle: '75% від загальної кількості',
            icon: CheckCircle,
            iconBg: 'bg-green-100',
            iconColor: 'text-green-600',
        },
        {
            title: 'На обслуговуванні',
            value: '3',
            badge: 'Потрібна увага',
            icon: Settings,
            iconBg: 'bg-orange-100',
            iconColor: 'text-orange-600',
        },
        {
            title: 'Доступні',
            value: '3',
            subtitle: 'Готові до рейсу',
            icon: CircleCheck,
            iconBg: 'bg-purple-100',
            iconColor: 'text-purple-600',
        },
    ];

    // Sample vehicles data
    const vehicles = [
        {
            id: 1,
            model: 'MAN TGX 18.440',
            plate: 'AA 1234 BB',
            type: 'Вантажівка',
            fuel: 'Дизель',
            consumption: '28.5',
            driver: 'Іван Петренко',
            status: 'in-route',
        },
        {
            id: 2,
            model: 'Volvo FH16 750',
            plate: 'BB 5678 CC',
            type: 'Вантажівка',
            fuel: 'Дизель',
            consumption: '32.1',
            driver: 'Олег Коваленко',
            status: 'in-route',
        },
        {
            id: 3,
            model: 'Mercedes Actros',
            plate: 'CC 9012 DD',
            type: 'Вантажівка',
            fuel: 'Дизель',
            consumption: '29.8',
            driver: '—',
            status: 'maintenance',
        },
        {
            id: 4,
            model: 'Scania R450',
            plate: 'DD 3456 EE',
            type: 'Вантажівка',
            fuel: 'Дизель',
            consumption: '27.3',
            driver: 'Андрій Мельник',
            status: 'in-route',
        },
        {
            id: 5,
            model: 'DAF XF 480',
            plate: 'EE 7890 FF',
            type: 'Фургон',
            fuel: 'Дизель',
            consumption: '24.6',
            driver: '—',
            status: 'available',
        },
        {
            id: 6,
            model: 'Iveco Stralis',
            plate: 'FF 2345 GG',
            type: 'Вантажівка',
            fuel: 'Дизель',
            consumption: '30.2',
            driver: 'Наталія Ковальчук',
            status: 'in-route',
        },
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'in-route':
                return 'bg-green-100 text-green-700';
            case 'maintenance':
                return 'bg-orange-100 text-orange-700';
            case 'available':
                return 'bg-blue-100 text-blue-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'in-route':
                return 'В дорозі';
            case 'maintenance':
                return 'Обслуговування';
            case 'available':
                return 'Доступний';
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
                        <h1 className="text-3xl font-bold text-slate-900">Транспорт</h1>
                        <p className="text-slate-500 text-sm mt-1">Управління автопарком компанії</p>
                    </div>
                    <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-2">
                        <span className="text-lg">+</span>
                        Додати транспорт
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <div
                            key={index}
                            className="bg-white border border-slate-200 rounded-2xl p-6 transition-all hover:shadow-md"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <p className="text-sm text-slate-500 mb-2">{stat.title}</p>
                                    <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
                                </div>
                                <div className={`w-12 h-12 ${stat.iconBg} rounded-xl flex items-center justify-center`}>
                                    <Icon className={`w-6 h-6 ${stat.iconColor}`} />
                                </div>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                {stat.change && (
                                    <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                                        {stat.change}
                                    </span>
                                )}
                                {stat.badge && (
                                    <span className="px-2 py-0.5 bg-orange-100 text-orange-700 rounded-full text-xs font-semibold">
                                        {stat.badge}
                                    </span>
                                )}
                                <span className="text-slate-500">{stat.subtitle}</span>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Search and Filters */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6 shadow-sm">
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Search */}
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Пошук за номером, маркою або моделлю..."
                            className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                        />
                    </div>

                    {/* Filter Dropdowns */}
                    <div className="flex gap-2">
                        <div className="relative">
                            <select className="appearance-none px-4 py-2.5 pr-10 border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors bg-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-600">
                                <option>Всі статуси</option>
                                <option>В дорозі</option>
                                <option>Обслуговування</option>
                                <option>Доступний</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                        </div>

                        <div className="relative">
                            <select className="appearance-none px-4 py-2.5 pr-10 border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors bg-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-600">
                                <option>Всі типи</option>
                                <option>Вантажівка</option>
                                <option>Фургон</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                        </div>

                        <button className="px-4 py-2.5 border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors flex items-center gap-2">
                            <Filter className="w-4 h-4" />
                            Фільтри
                        </button>
                    </div>
                </div>
            </div>

            {/* Vehicles Table */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Транспорт</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Тип</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Паливо</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Витрата л/100км</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Водій</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Статус</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Дії</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 bg-white">
                            {vehicles.map((vehicle) => (
                                <tr key={vehicle.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div>
                                            <p className="text-sm font-semibold text-slate-900">{vehicle.model}</p>
                                            <p className="text-xs text-slate-500">{vehicle.plate}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm text-slate-700">{vehicle.type}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm text-slate-700">{vehicle.fuel}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm font-semibold text-slate-900">{vehicle.consumption}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm text-slate-700">{vehicle.driver}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(vehicle.status)}`}>
                                            {getStatusText(vehicle.status)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <button className="text-slate-400 hover:text-blue-600 transition-colors" title="Переглянути">
                                                <Eye className="w-5 h-5" />
                                            </button>
                                            <button className="text-slate-400 hover:text-slate-600 transition-colors" title="Редагувати">
                                                <Edit className="w-5 h-5" />
                                            </button>
                                            <button className="text-slate-400 hover:text-red-600 transition-colors" title="Видалити">
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between bg-slate-50">
                    <p className="text-sm text-slate-600">Показано <span className="font-medium">1</span> до <span className="font-medium">6</span> з <span className="font-medium">24</span> транспортних засобів</p>
                    <div className="flex items-center gap-2">
                        <button className="px-3 py-1.5 border border-slate-300 text-slate-700 rounded-md text-sm font-medium hover:bg-slate-50 transition-colors">
                            Попередня
                        </button>
                        <div className="flex gap-1">
                            <button className="px-3 py-1.5 bg-slate-900 text-white rounded-md text-sm font-medium shadow-sm">1</button>
                            <button className="px-3 py-1.5 bg-white border border-slate-300 text-slate-700 rounded-md text-sm font-medium hover:bg-slate-50 transition-colors">2</button>
                            <button className="px-3 py-1.5 bg-white border border-slate-300 text-slate-700 rounded-md text-sm font-medium hover:bg-slate-50 transition-colors">3</button>
                            <button className="px-3 py-1.5 bg-white border border-slate-300 text-slate-700 rounded-md text-sm font-medium hover:bg-slate-50 transition-colors">4</button>
                        </div>
                        <button className="px-3 py-1.5 border border-slate-300 text-slate-700 rounded-md text-sm font-medium hover:bg-slate-50 transition-colors">
                            Наступна
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}