'use client';

import { useState } from 'react';
import { Plus, Search, Edit, Trash2, Shield, Mail, Phone, Calendar } from 'lucide-react';

export default function AdminManagersPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);

    // Mock data
    const managers = [
        {
            id: 1,
            name: 'Олена Коваль',
            email: 'olena.koval@smartlogist.ua',
            phone: '+380 67 123 4567',
            driversCount: 12,
            tripsCount: 45,
            status: 'active',
            permissions: ['trips', 'drivers', 'vehicles'],
            createdAt: '10.01.2024',
        },
        {
            id: 2,
            name: 'Андрій Мельник',
            email: 'andriy.melnyk@smartlogist.ua',
            phone: '+380 50 234 5678',
            driversCount: 8,
            tripsCount: 32,
            status: 'active',
            permissions: ['trips', 'drivers'],
            createdAt: '15.02.2024',
        },
        {
            id: 3,
            name: 'Марія Шевченко',
            email: 'maria.shevchenko@smartlogist.ua',
            phone: '+380 63 345 6789',
            driversCount: 15,
            tripsCount: 58,
            status: 'inactive',
            permissions: ['trips'],
            createdAt: '20.03.2024',
        },
    ];

    const stats = [
        { label: 'Всього менеджерів', value: '3', color: 'purple' },
        { label: 'Активних', value: '2', color: 'green' },
        { label: 'Неактивних', value: '1', color: 'orange' },
        { label: 'Водіїв під управлінням', value: '35', color: 'blue' },
    ];

    return (
        <div className="p-8 bg-slate-50 min-h-screen">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900">Управління менеджерами</h1>
                <p className="text-slate-600 mt-1">Додавання, редагування та видалення менеджерів</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, index) => {
                    const colorClasses: Record<string, string> = {
                        purple: 'bg-purple-100 text-purple-600',
                        green: 'bg-green-100 text-green-600',
                        orange: 'bg-orange-100 text-orange-600',
                        blue: 'bg-blue-100 text-blue-600',
                    };
                    return (
                        <div key={index} className="bg-white border border-slate-200 rounded-2xl p-6">
                            <p className="text-sm text-slate-500 mb-2">{stat.label}</p>
                            <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
                        </div>
                    );
                })}
            </div>

            {/* Actions Bar */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6 shadow-sm">
                <div className="flex items-center justify-between gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Пошук менеджерів..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                        />
                    </div>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="bg-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors flex items-center gap-2"
                    >
                        <Plus className="w-5 h-5" />
                        Додати менеджера
                    </button>
                </div>
            </div>

            {/* Managers Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="text-left p-4 text-sm font-semibold text-slate-700">Менеджер</th>
                                <th className="text-left p-4 text-sm font-semibold text-slate-700">Контакти</th>
                                <th className="text-left p-4 text-sm font-semibold text-slate-700">Водії</th>
                                <th className="text-left p-4 text-sm font-semibold text-slate-700">Рейси</th>
                                <th className="text-left p-4 text-sm font-semibold text-slate-700">Дозволи</th>
                                <th className="text-left p-4 text-sm font-semibold text-slate-700">Статус</th>
                                <th className="text-left p-4 text-sm font-semibold text-slate-700">Дії</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {managers.map((manager) => (
                                <tr key={manager.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                                                <span className="text-white font-semibold text-sm">
                                                    {manager.name.split(' ').map(n => n[0]).join('')}
                                                </span>
                                            </div>
                                            <div>
                                                <p className="font-semibold text-slate-900">{manager.name}</p>
                                                <p className="text-xs text-slate-500">Створено: {manager.createdAt}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2 text-sm text-slate-600">
                                                <Mail className="w-4 h-4" />
                                                {manager.email}
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-slate-600">
                                                <Phone className="w-4 h-4" />
                                                {manager.phone}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className="text-lg font-bold text-slate-900">{manager.driversCount}</span>
                                    </td>
                                    <td className="p-4">
                                        <span className="text-lg font-bold text-slate-900">{manager.tripsCount}</span>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex flex-wrap gap-1">
                                            {manager.permissions.map((perm) => (
                                                <span
                                                    key={perm}
                                                    className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-medium"
                                                >
                                                    {perm}
                                                </span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-semibold ${manager.status === 'active'
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-orange-100 text-orange-700'
                                                }`}
                                        >
                                            {manager.status === 'active' ? 'Активний' : 'Неактивний'}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2">
                                            <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors">
                                                <Shield className="w-4 h-4" />
                                            </button>
                                            <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add Manager Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-2xl w-full p-8">
                        <h2 className="text-2xl font-bold text-slate-900 mb-6">Додати нового менеджера</h2>

                        <div className="space-y-4 mb-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Повне ім'я</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                                    placeholder="Іван Іванов"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                                <input
                                    type="email"
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                                    placeholder="ivan@smartlogist.ua"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Телефон</label>
                                <input
                                    type="tel"
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                                    placeholder="+380 67 123 4567"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Дозволи</label>
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2">
                                        <input type="checkbox" className="w-4 h-4 text-purple-600 rounded" />
                                        <span className="text-sm text-slate-700">Управління рейсами</span>
                                    </label>
                                    <label className="flex items-center gap-2">
                                        <input type="checkbox" className="w-4 h-4 text-purple-600 rounded" />
                                        <span className="text-sm text-slate-700">Управління водіями</span>
                                    </label>
                                    <label className="flex items-center gap-2">
                                        <input type="checkbox" className="w-4 h-4 text-purple-600 rounded" />
                                        <span className="text-sm text-slate-700">Управління транспортом</span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="flex-1 px-6 py-3 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors"
                            >
                                Скасувати
                            </button>
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
                            >
                                Додати менеджера
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
