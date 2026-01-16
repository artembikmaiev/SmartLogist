'use client';

import { TrendingUp, TrendingDown, Clock, CheckCircle, Fuel, Truck, MapPin, Search } from 'lucide-react';

export default function ManagerTripsPage() {
  // Stats data
  const stats = [
    {
      title: 'Активні рейси',
      value: '24',
      change: '+12%',
      trend: 'up',
      subtitle: 'за тиждень',
      icon: Truck,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
    },
    {
      title: 'В очікуванні',
      value: '15',
      badge: '8 нових',
      subtitle: 'повідомлень',
      icon: Clock,
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-600',
    },
    {
      title: 'Завершено',
      value: '142',
      subtitle: 'Сьогодні',
      icon: CheckCircle,
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
    },
    {
      title: 'Витрати пального',
      value: '2,847₴',
      change: '-8%',
      trend: 'down',
      subtitle: 'економії',
      icon: Fuel,
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
    },
  ];

  // Sample trips data
  const trips = [
    {
      id: 'TR-2024-001',
      date: '15 січня, 09:30',
      route: { from: 'Київ', to: 'Львів' },
      points: '3 точки доставки',
      driver: { name: 'Іван Петренко', avatar: 'ІП', vehicle: 'AA 1234 BB' },
      status: 'active',
      cost: '4,200₴',
    },
    {
      id: 'TR-2024-002',
      date: '15 січня, 11:00',
      route: { from: 'Одеса', to: 'Харків' },
      points: '2 точки доставки',
      driver: { name: 'Олег Коваленко', avatar: 'ОК', vehicle: 'BB 5678 CC' },
      status: 'pending',
      cost: '3,800₴',
    },
    {
      id: 'TR-2024-003',
      date: '14 січня, 14:20',
      route: { from: 'Дніпро', to: 'Запоріжжя' },
      points: '1 точка доставки',
      driver: { name: 'Марія Шевченко', avatar: 'МШ', vehicle: 'CC 9012 DD' },
      status: 'completed',
      cost: '680₴',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-blue-100 text-blue-700';
      case 'completed':
        return 'bg-green-100 text-green-700';
      case 'pending':
        return 'bg-orange-100 text-orange-700';
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
      case 'pending':
        return 'Очікує';
      default:
        return status;
    }
  };

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl font-bold text-slate-900">Управління рейсами</h1>
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-2">
            <span className="text-lg">+</span>
            Створити рейс
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
                  <span className={`flex items-center gap-1 font-semibold ${stat.trend === 'up' ? 'text-green-600' : stat.trend === 'down' ? 'text-green-600' : 'text-slate-600'
                    }`}>
                    {stat.trend === 'up' && <TrendingUp className="w-4 h-4" />}
                    {stat.trend === 'down' && <TrendingDown className="w-4 h-4" />}
                    {stat.change}
                  </span>
                )}
                {stat.badge && (
                  <span className="px-2 py-0.5 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
                    {stat.badge}
                  </span>
                )}
                <span className="text-slate-500">{stat.subtitle}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Route Planning Section */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-8 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 mb-6">Планування маршруту</h2>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Map Placeholder */}
          <div className="lg:col-span-2">
            <div className="bg-slate-100 rounded-xl h-96 flex items-center justify-center border border-slate-200 relative overflow-hidden">
              {/* Map placeholder with grid pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="grid grid-cols-8 grid-rows-8 h-full w-full">
                  {[...Array(64)].map((_, i) => (
                    <div key={i} className="border border-slate-300"></div>
                  ))}
                </div>
              </div>
              <div className="text-center relative z-10">
                <MapPin className="w-16 h-16 text-slate-400 mx-auto mb-3" />
                <p className="text-slate-600 font-medium">Інтерактивна карта</p>
                <p className="text-sm text-slate-400 mt-1">OpenStreetMap</p>
              </div>
            </div>
          </div>

          {/* Route Details */}
          <div className="space-y-4">
            <div className="space-y-2">
              <button className="w-full bg-blue-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                Оптимізувати маршрут
              </button>
              <button className="w-full border border-slate-300 text-slate-700 px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">
                Очистити маршрут
              </button>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-100">
              <p className="text-xs text-slate-600 mb-1">Відстань</p>
              <p className="text-2xl font-bold text-slate-900 mb-3">342 км</p>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-white/60 rounded-lg p-2">
                  <p className="text-xs text-slate-500">Пальне</p>
                  <p className="font-semibold text-slate-900">28.4 л</p>
                </div>
                <div className="bg-white/60 rounded-lg p-2">
                  <p className="text-xs text-slate-500">Час</p>
                  <p className="font-semibold text-slate-900">~4 год</p>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium text-slate-700">Точки маршруту</p>
                <button className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Додати
                </button>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <div className="w-7 h-7 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">A</div>
                  <span className="text-sm text-slate-900 font-medium flex-1">Київ</span>
                  <button className="text-slate-400 hover:text-red-600 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <div className="w-7 h-7 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">B</div>
                  <span className="text-sm text-slate-900 font-medium flex-1">Львів</span>
                  <button className="text-slate-400 hover:text-red-600 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trips Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900">Список рейсів</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Пошук рейсів..."
                className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium shadow-sm">
              Всі рейси
            </button>
            <button className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors">
              Сьогодні
            </button>
            <button className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors">
              Цей тиждень
            </button>
            <button className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors">
              Цей місяць
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">ID Рейсу</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Маршрут</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Водій</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Статус</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Вартість</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Дії</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {trips.map((trip) => (
                <tr key={trip.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{trip.id}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{trip.date}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-medium text-slate-900">
                        {trip.route.from} → {trip.route.to}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">{trip.points}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                        {trip.driver.avatar}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900">{trip.driver.name}</p>
                        <p className="text-xs text-slate-500">{trip.driver.vehicle}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(trip.status)}`}>
                      {getStatusText(trip.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-bold text-slate-900">{trip.cost}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <button className="text-slate-400 hover:text-blue-600 transition-colors" title="Переглянути на карті">
                        <MapPin className="w-5 h-5" />
                      </button>
                      <button className="text-slate-400 hover:text-slate-600 transition-colors" title="Редагувати">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
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
          <p className="text-sm text-slate-600">Показано <span className="font-medium">1-3</span> з <span className="font-medium">3</span> рейсів</p>
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
