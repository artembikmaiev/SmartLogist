'use client';

import { Users, CheckCircle, Truck, Moon, Search, Filter, Calendar, ArrowUpDown, Star, Trash2, Edit, MapPin } from 'lucide-react';

export default function DriversPage() {
    // Stats data
    const stats = [
        {
            title: 'Всього водіїв',
            value: '48',
            change: '+4',
            subtitle: 'цього місяця',
            icon: Users,
            iconBg: 'bg-blue-100',
            iconColor: 'text-blue-600',
        },
        {
            title: 'Активні',
            value: '32',
            subtitle: '66.7% від загальної кількості',
            icon: CheckCircle,
            iconBg: 'bg-green-100',
            iconColor: 'text-green-600',
        },
        {
            title: 'На маршруті',
            value: '24',
            subtitle: '50% від загальної кількості',
            icon: Truck,
            iconBg: 'bg-orange-100',
            iconColor: 'text-orange-600',
        },
        {
            title: 'Офлайн',
            value: '16',
            subtitle: '33.3% від загальної кількості',
            icon: Moon,
            iconBg: 'bg-slate-100',
            iconColor: 'text-slate-600',
        },
    ];

    // Sample drivers data
    const drivers = [
        {
            id: '#DRV-1234',
            name: 'Іван Петренко',
            avatar: 'ІП',
            status: 'on-route',
            vehicle: { model: 'MAN TGX', plate: 'AA 1234 BB' },
            phone: '+380 67 123 4567',
            rating: 4.8,
            reviews: 124,
            trips: 342,
        },
        {
            id: '#DRV-1235',
            name: 'Олег Коваленко',
            avatar: 'ОК',
            status: 'available',
            vehicle: { model: 'Volvo FH16', plate: 'BB 5678 CC' },
            phone: '+380 50 987 6543',
            rating: 4.9,
            reviews: 98,
            trips: 256,
        },
        {
            id: '#DRV-1236',
            name: 'Марія Шевченко',
            avatar: 'МШ',
            status: 'busy',
            vehicle: { model: 'Mercedes Actros', plate: 'CC 9012 DD' },
            phone: '+380 63 456 7890',
            rating: 4.7,
            reviews: 156,
            trips: 289,
        },
        {
            id: '#DRV-1237',
            name: 'Андрій Мельник',
            avatar: 'АМ',
            status: 'offline',
            vehicle: { model: 'Scania R450', plate: 'DD 3456 EE' },
            phone: '+380 99 234 5678',
            rating: 4.6,
            reviews: 87,
            trips: 198,
        },
        {
            id: '#DRV-1238',
            name: 'Тарас Бондаренко',
            avatar: 'ТБ',
            status: 'on-route',
            vehicle: { model: 'DAF XF', plate: 'EE 7890 FF' },
            phone: '+380 68 345 6789',
            rating: 4.9,
            reviews: 203,
            trips: 412,
        },
        {
            id: '#DRV-1239',
            name: 'Наталія Ковальчук',
            avatar: 'НК',
            status: 'available',
            vehicle: { model: 'Iveco Stralis', plate: 'FF 2345 GG' },
            phone: '+380 95 567 8901',
            rating: 4.8,
            reviews: 145,
            trips: 267,
        },
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'on-route':
                return 'bg-green-100 text-green-700';
            case 'available':
                return 'bg-blue-100 text-blue-700';
            case 'busy':
                return 'bg-orange-100 text-orange-700';
            case 'offline':
                return 'bg-slate-100 text-slate-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'on-route':
                return 'На маршруті';
            case 'available':
                return 'Вільний';
            case 'busy':
                return 'Зайнятий';
            case 'offline':
                return 'Офлайн';
            default:
                return status;
        }
    };

    const getStatusDotColor = (status: string) => {
        switch (status) {
            case 'on-route':
                return 'bg-green-500';
            case 'available':
                return 'bg-blue-500';
            case 'busy':
                return 'bg-orange-500';
            case 'offline':
                return 'bg-slate-400';
            default:
                return 'bg-gray-500';
        }
    };

    return (
        <div className="p-8 bg-slate-50 min-h-screen">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-2">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">Водії</h1>
                    </div>
                    <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-2">
                        <span className="text-lg">+</span>
                        Додати водія
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
                            placeholder="Пошук водія за ім'ям, телефоном або авто..."
                            className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                        />
                    </div>

                    {/* Filter Buttons */}
                    <div className="flex gap-2">
                        <button className="px-4 py-2.5 border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors flex items-center gap-2">
                            <Filter className="w-4 h-4" />
                            Статус
                        </button>
                        <button className="px-4 py-2.5 border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            Дата
                        </button>
                        <button className="px-4 py-2.5 border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors flex items-center gap-2">
                            <ArrowUpDown className="w-4 h-4" />
                            Сортування
                        </button>
                    </div>
                </div>
            </div>

            {/* Drivers Table */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Водій</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Статус</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Транспорт</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Телефон</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Рейтинг</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Поїздки</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Дії</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 bg-white">
                            {drivers.map((driver) => (
                                <tr key={driver.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                                                {driver.avatar}
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-slate-900">{driver.name}</p>
                                                <p className="text-xs text-slate-500">{driver.id}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(driver.status)}`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${getStatusDotColor(driver.status)}`}></span>
                                            {getStatusText(driver.status)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div>
                                            <p className="text-sm font-medium text-slate-900">{driver.vehicle.model}</p>
                                            <p className="text-xs text-slate-500">{driver.vehicle.plate}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm text-slate-700">{driver.phone}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1">
                                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                            <span className="text-sm font-semibold text-slate-900">{driver.rating}</span>
                                            <span className="text-xs text-slate-500">({driver.reviews})</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm font-semibold text-slate-900">{driver.trips}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <button className="text-slate-400 hover:text-blue-600 transition-colors" title="Відстежити">
                                                <MapPin className="w-5 h-5" />
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
                    <p className="text-sm text-slate-600">Показано <span className="font-medium">1-6</span> з <span className="font-medium">48</span> водіїв</p>
                    <div className="flex items-center gap-2">
                        <button className="px-3 py-1.5 border border-slate-300 text-slate-700 rounded-md text-sm font-medium hover:bg-slate-50 transition-colors">
                            Попередня
                        </button>
                        <div className="flex gap-1">
                            <button className="px-3 py-1.5 bg-blue-600 text-white rounded-md text-sm font-medium shadow-sm">1</button>
                            <button className="px-3 py-1.5 bg-white border border-slate-300 text-slate-700 rounded-md text-sm font-medium hover:bg-slate-50 transition-colors">2</button>
                            <button className="px-3 py-1.5 bg-white border border-slate-300 text-slate-700 rounded-md text-sm font-medium hover:bg-slate-50 transition-colors">3</button>
                            <span className="px-3 py-1.5 text-slate-400">...</span>
                            <button className="px-3 py-1.5 bg-white border border-slate-300 text-slate-700 rounded-md text-sm font-medium hover:bg-slate-50 transition-colors">8</button>
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