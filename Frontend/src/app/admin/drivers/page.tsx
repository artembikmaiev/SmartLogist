'use client';

import { useState } from 'react';
import { Plus, Search, Edit, Trash2, UserCog, Link as LinkIcon } from 'lucide-react';

export default function AdminDriversPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [selectedDriver, setSelectedDriver] = useState<number | null>(null);

    // Mock data
    const drivers = [
        {
            id: 1,
            name: 'Іван Петренко',
            email: 'ivan.petrenko@smartlogist.ua',
            phone: '+380 67 234 5678',
            license: 'АВС 123456',
            manager: 'Олена Коваль',
            managerId: 1,
            tripsCount: 142,
            status: 'available',
            vehicle: 'MAN TGX 18.480 (AA 1234 BC)',
        },
        {
            id: 2,
            name: 'Петро Сидоренко',
            email: 'petro.sydorenko@smartlogist.ua',
            phone: '+380 50 345 6789',
            license: 'DEF 234567',
            manager: 'Андрій Мельник',
            managerId: 2,
            tripsCount: 98,
            status: 'on-trip',
            vehicle: 'Volvo FH16 750 (BB 5678 CD)',
        },
        {
            id: 3,
            name: 'Олександр Коваленко',
            email: 'oleksandr.kovalenko@smartlogist.ua',
            phone: '+380 63 456 7890',
            license: 'GHI 345678',
            manager: null,
            managerId: null,
            tripsCount: 67,
            status: 'available',
            vehicle: 'Scania R450 (CC 9012 EF)',
        },
    ];

    const managers = [
        { id: 1, name: 'Олена Коваль' },
        { id: 2, name: 'Андрій Мельник' },
        { id: 3, name: 'Марія Шевченко' },
    ];

    const stats = [
        { label: 'Всього водіїв', value: '3', color: 'purple' },
        { label: 'Доступні', value: '2', color: 'green' },
        { label: 'На рейсі', value: '1', color: 'blue' },
        { label: 'Без менеджера', value: '1', color: 'orange' },
    ];

    const handleAssignManager = (driverId: number) => {
        setSelectedDriver(driverId);
        setShowAssignModal(true);
    };

    return (
        <div className="p-8 bg-slate-50 min-h-screen">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900">Управління водіями</h1>
                <p className="text-slate-600 mt-1">Прив'язка водіїв до менеджерів та управління</p>
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
                            placeholder="Пошук водіїв..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                        />
                    </div>
                    <select className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600">
                        <option value="">Всі менеджери</option>
                        {managers.map((manager) => (
                            <option key={manager.id} value={manager.id}>
                                {manager.name}
                            </option>
                        ))}
                        <option value="unassigned">Без менеджера</option>
                    </select>
                </div>
            </div>

            {/* Drivers Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="text-left p-4 text-sm font-semibold text-slate-700">Водій</th>
                                <th className="text-left p-4 text-sm font-semibold text-slate-700">Контакти</th>
                                <th className="text-left p-4 text-sm font-semibold text-slate-700">Посвідчення</th>
                                <th className="text-left p-4 text-sm font-semibold text-slate-700">Менеджер</th>
                                <th className="text-left p-4 text-sm font-semibold text-slate-700">Транспорт</th>
                                <th className="text-left p-4 text-sm font-semibold text-slate-700">Рейси</th>
                                <th className="text-left p-4 text-sm font-semibold text-slate-700">Статус</th>
                                <th className="text-left p-4 text-sm font-semibold text-slate-700">Дії</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {drivers.map((driver) => (
                                <tr key={driver.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                                                <span className="text-white font-semibold text-sm">
                                                    {driver.name.split(' ').map(n => n[0]).join('')}
                                                </span>
                                            </div>
                                            <div>
                                                <p className="font-semibold text-slate-900">{driver.name}</p>
                                                <p className="text-xs text-slate-500">{driver.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <p className="text-sm text-slate-600">{driver.phone}</p>
                                    </td>
                                    <td className="p-4">
                                        <p className="font-mono text-sm text-slate-900">{driver.license}</p>
                                    </td>
                                    <td className="p-4">
                                        {driver.manager ? (
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                                                    <UserCog className="w-4 h-4 text-purple-600" />
                                                </div>
                                                <span className="text-sm font-medium text-slate-900">{driver.manager}</span>
                                            </div>
                                        ) : (
                                            <span className="text-sm text-orange-600 font-medium">Не призначено</span>
                                        )}
                                    </td>
                                    <td className="p-4">
                                        <p className="text-sm text-slate-600">{driver.vehicle}</p>
                                    </td>
                                    <td className="p-4">
                                        <span className="text-lg font-bold text-slate-900">{driver.tripsCount}</span>
                                    </td>
                                    <td className="p-4">
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-semibold ${driver.status === 'available'
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-blue-100 text-blue-700'
                                                }`}
                                        >
                                            {driver.status === 'available' ? 'Доступний' : 'На рейсі'}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleAssignManager(driver.id)}
                                                className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                                                title="Призначити менеджера"
                                            >
                                                <LinkIcon className="w-4 h-4" />
                                            </button>
                                            <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                                <Edit className="w-4 h-4" />
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

            {/* Assign Manager Modal */}
            {showAssignModal && selectedDriver && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-md w-full p-8">
                        <h2 className="text-2xl font-bold text-slate-900 mb-6">Призначити менеджера</h2>

                        <div className="mb-6">
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Водій: <span className="font-bold">{drivers.find(d => d.id === selectedDriver)?.name}</span>
                            </label>
                            <label className="block text-sm font-medium text-slate-700 mb-2 mt-4">Виберіть менеджера</label>
                            <select className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600">
                                <option value="">-- Виберіть менеджера --</option>
                                {managers.map((manager) => (
                                    <option key={manager.id} value={manager.id}>
                                        {manager.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => {
                                    setShowAssignModal(false);
                                    setSelectedDriver(null);
                                }}
                                className="flex-1 px-6 py-3 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors"
                            >
                                Скасувати
                            </button>
                            <button
                                onClick={() => {
                                    setShowAssignModal(false);
                                    setSelectedDriver(null);
                                }}
                                className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
                            >
                                Призначити
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
