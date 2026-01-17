'use client';

import { useState } from 'react';
import { Shield, Check, X } from 'lucide-react';

export default function AdminPermissionsPage() {
    const [selectedManager, setSelectedManager] = useState<number | null>(1);

    // Mock data
    const managers = [
        { id: 1, name: 'Олена Коваль', email: 'olena.koval@smartlogist.ua' },
        { id: 2, name: 'Андрій Мельник', email: 'andriy.melnyk@smartlogist.ua' },
        { id: 3, name: 'Марія Шевченко', email: 'maria.shevchenko@smartlogist.ua' },
    ];

    const permissions = [
        {
            category: 'Рейси',
            items: [
                { id: 'trips.view', name: 'Перегляд рейсів', description: 'Можливість переглядати список рейсів' },
                { id: 'trips.create', name: 'Створення рейсів', description: 'Можливість створювати нові рейси' },
                { id: 'trips.edit', name: 'Редагування рейсів', description: 'Можливість редагувати існуючі рейси' },
                { id: 'trips.delete', name: 'Видалення рейсів', description: 'Можливість видаляти рейси' },
                { id: 'trips.assign', name: 'Призначення рейсів', description: 'Можливість призначати рейси водіям' },
            ],
        },
        {
            category: 'Водії',
            items: [
                { id: 'drivers.view', name: 'Перегляд водіїв', description: 'Можливість переглядати список водіїв' },
                { id: 'drivers.create', name: 'Додавання водіїв', description: 'Можливість додавати нових водіїв' },
                { id: 'drivers.edit', name: 'Редагування водіїв', description: 'Можливість редагувати дані водіїв' },
                { id: 'drivers.delete', name: 'Видалення водіїв', description: 'Можливість видаляти водіїв' },
            ],
        },
        {
            category: 'Транспорт',
            items: [
                { id: 'vehicles.view', name: 'Перегляд транспорту', description: 'Можливість переглядати список транспорту' },
                { id: 'vehicles.create', name: 'Додавання транспорту', description: 'Можливість додавати новий транспорт' },
                { id: 'vehicles.edit', name: 'Редагування транспорту', description: 'Можливість редагувати дані транспорту' },
                { id: 'vehicles.delete', name: 'Видалення транспорту', description: 'Можливість видаляти транспорт' },
            ],
        },
        {
            category: 'Аналітика',
            items: [
                { id: 'analytics.view', name: 'Перегляд аналітики', description: 'Доступ до звітів та аналітики' },
                { id: 'analytics.export', name: 'Експорт даних', description: 'Можливість експортувати дані' },
            ],
        },
    ];

    // Mock permissions state
    const [managerPermissions, setManagerPermissions] = useState<Record<number, string[]>>({
        1: ['trips.view', 'trips.create', 'trips.edit', 'trips.assign', 'drivers.view', 'drivers.edit', 'vehicles.view', 'analytics.view'],
        2: ['trips.view', 'trips.create', 'drivers.view', 'vehicles.view'],
        3: ['trips.view', 'analytics.view'],
    });

    const hasPermission = (permissionId: string) => {
        if (!selectedManager) return false;
        return managerPermissions[selectedManager]?.includes(permissionId) || false;
    };

    const togglePermission = (permissionId: string) => {
        if (!selectedManager) return;

        setManagerPermissions(prev => {
            const current = prev[selectedManager] || [];
            const updated = current.includes(permissionId)
                ? current.filter(p => p !== permissionId)
                : [...current, permissionId];

            return {
                ...prev,
                [selectedManager]: updated,
            };
        });
    };

    const selectedManagerData = managers.find(m => m.id === selectedManager);

    return (
        <div className="p-8 bg-slate-50 min-h-screen">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900">Управління дозволами</h1>
                <p className="text-slate-600 mt-1">Налаштування прав доступу для менеджерів</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Managers List */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                    <h2 className="text-lg font-bold text-slate-900 mb-4">Менеджери</h2>
                    <div className="space-y-2">
                        {managers.map((manager) => (
                            <button
                                key={manager.id}
                                onClick={() => setSelectedManager(manager.id)}
                                className={`w-full text-left p-3 rounded-lg transition-colors ${selectedManager === manager.id
                                        ? 'bg-purple-50 border-2 border-purple-600'
                                        : 'bg-slate-50 border-2 border-transparent hover:bg-slate-100'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                                        <span className="text-white font-semibold text-sm">
                                            {manager.name.split(' ').map(n => n[0]).join('')}
                                        </span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-slate-900 truncate">{manager.name}</p>
                                        <p className="text-xs text-slate-500 truncate">{manager.email}</p>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Permissions Panel */}
                <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                    {selectedManagerData ? (
                        <>
                            <div className="mb-6 pb-6 border-b border-slate-200">
                                <h2 className="text-xl font-bold text-slate-900 mb-2">
                                    Дозволи для {selectedManagerData.name}
                                </h2>
                                <p className="text-sm text-slate-600">{selectedManagerData.email}</p>
                                <div className="mt-4 flex items-center gap-2">
                                    <Shield className="w-5 h-5 text-purple-600" />
                                    <span className="text-sm font-medium text-slate-700">
                                        Активних дозволів: {managerPermissions[selectedManager!]?.length || 0}
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-6">
                                {permissions.map((category) => (
                                    <div key={category.category}>
                                        <h3 className="text-lg font-bold text-slate-900 mb-4">{category.category}</h3>
                                        <div className="space-y-3">
                                            {category.items.map((permission) => {
                                                const isGranted = hasPermission(permission.id);
                                                return (
                                                    <div
                                                        key={permission.id}
                                                        className={`p-4 rounded-lg border-2 transition-all ${isGranted
                                                                ? 'bg-purple-50 border-purple-200'
                                                                : 'bg-slate-50 border-slate-200'
                                                            }`}
                                                    >
                                                        <div className="flex items-start justify-between gap-4">
                                                            <div className="flex-1">
                                                                <div className="flex items-center gap-2 mb-1">
                                                                    <p className="font-semibold text-slate-900">{permission.name}</p>
                                                                    {isGranted && (
                                                                        <span className="px-2 py-0.5 bg-purple-600 text-white rounded-full text-xs font-semibold">
                                                                            Активно
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                <p className="text-sm text-slate-600">{permission.description}</p>
                                                            </div>
                                                            <button
                                                                onClick={() => togglePermission(permission.id)}
                                                                className={`flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center transition-colors ${isGranted
                                                                        ? 'bg-purple-600 hover:bg-purple-700'
                                                                        : 'bg-slate-200 hover:bg-slate-300'
                                                                    }`}
                                                            >
                                                                {isGranted ? (
                                                                    <Check className="w-6 h-6 text-white" />
                                                                ) : (
                                                                    <X className="w-6 h-6 text-slate-600" />
                                                                )}
                                                            </button>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-8 pt-6 border-t border-slate-200">
                                <button className="w-full px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors">
                                    Зберегти зміни
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-12">
                            <Shield className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                            <p className="text-slate-500">Виберіть менеджера для налаштування дозволів</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
