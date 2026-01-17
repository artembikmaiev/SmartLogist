'use client';

import { User, Mail, Phone, Calendar, Building, Shield, Edit, Save, X, TrendingUp, Users, Truck, Award } from 'lucide-react';
import { useState } from 'react';

export default function ManagerProfilePage() {
    const [isEditing, setIsEditing] = useState(false);

    // Manager stats
    const stats = [
        {
            title: 'Активних рейсів',
            value: '24',
            change: '+12%',
            icon: Truck,
            iconBg: 'bg-blue-100',
            iconColor: 'text-blue-600',
        },
        {
            title: 'Водіїв у команді',
            value: '48',
            change: '+4',
            icon: Users,
            iconBg: 'bg-green-100',
            iconColor: 'text-green-600',
        },
        {
            title: 'Завершено рейсів',
            value: '1,247',
            change: '+18%',
            icon: TrendingUp,
            iconBg: 'bg-purple-100',
            iconColor: 'text-purple-600',
        },
        {
            title: 'Рейтинг ефективності',
            value: '94.2%',
            subtitle: 'Відмінний показник',
            icon: Award,
            iconBg: 'bg-orange-100',
            iconColor: 'text-orange-600',
        },
    ];

    // Recent activity
    const recentActivity = [
        {
            action: 'Створено новий рейс',
            details: 'Київ → Львів (#TR-2024-045)',
            time: '15 хв тому',
            icon: '🚛',
        },
        {
            action: 'Додано нового водія',
            details: 'Олександр Коваль',
            time: '2 год тому',
            icon: '👤',
        },
        {
            action: 'Оновлено статус транспорту',
            details: 'MAN TGX 18.440 (AA 1234 BB)',
            time: '5 год тому',
            icon: '🔧',
        },
        {
            action: 'Завершено рейс',
            details: 'Одеса → Харків (#TR-2024-042)',
            time: 'Вчора',
            icon: '✅',
        },
    ];

    return (
        <div className="p-8 bg-slate-50 min-h-screen">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">Мій профіль</h1>
                    </div>
                    {!isEditing ? (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-2"
                        >
                            <Edit className="w-5 h-5" />
                            Редагувати профіль
                        </button>
                    ) : (
                        <div className="flex gap-2">
                            <button
                                onClick={() => setIsEditing(false)}
                                className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors shadow-sm flex items-center gap-2"
                            >
                                <Save className="w-5 h-5" />
                                Зберегти
                            </button>
                            <button
                                onClick={() => setIsEditing(false)}
                                className="bg-slate-200 text-slate-700 px-6 py-3 rounded-lg font-semibold hover:bg-slate-300 transition-colors shadow-sm flex items-center gap-2"
                            >
                                <X className="w-5 h-5" />
                                Скасувати
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Profile Information */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Personal Info */}
                    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                        <h2 className="text-xl font-bold text-slate-900 mb-6">Особиста інформація</h2>

                        <div className="flex items-center gap-6 mb-6 pb-6 border-b border-slate-200">
                            <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center flex-shrink-0">
                                <span className="text-white font-bold text-3xl">МЛ</span>
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-slate-900">Менеджер Логістики</h3>
                                <p className="text-slate-600">Керівник відділу логістики</p>
                                <div className="flex items-center gap-2 mt-2">
                                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                                        Менеджер
                                    </span>
                                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                                        Активний
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-1">
                                <label className="text-sm text-slate-500 flex items-center gap-2">
                                    <User className="w-4 h-4" />
                                    Повне ім'я
                                </label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        defaultValue="Менеджер Логістики"
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                                    />
                                ) : (
                                    <p className="font-semibold text-slate-900">Менеджер Логістики</p>
                                )}
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm text-slate-500 flex items-center gap-2">
                                    <Mail className="w-4 h-4" />
                                    Email
                                </label>
                                {isEditing ? (
                                    <input
                                        type="email"
                                        defaultValue="manager@smartlogist.ua"
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                                    />
                                ) : (
                                    <p className="font-semibold text-slate-900">manager@smartlogist.ua</p>
                                )}
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm text-slate-500 flex items-center gap-2">
                                    <Phone className="w-4 h-4" />
                                    Телефон
                                </label>
                                {isEditing ? (
                                    <input
                                        type="tel"
                                        defaultValue="+380 67 123 4567"
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                                    />
                                ) : (
                                    <p className="font-semibold text-slate-900">+380 67 123 4567</p>
                                )}
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm text-slate-500 flex items-center gap-2">
                                    <Building className="w-4 h-4" />
                                    Відділ
                                </label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        defaultValue="Відділ логістики"
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                                    />
                                ) : (
                                    <p className="font-semibold text-slate-900">Відділ логістики</p>
                                )}
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm text-slate-500 flex items-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    Дата прийняття
                                </label>
                                <p className="font-semibold text-slate-900">15 січня 2022</p>
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm text-slate-500 flex items-center gap-2">
                                    <Shield className="w-4 h-4" />
                                    Рівень доступу
                                </label>
                                <p className="font-semibold text-slate-900">Адміністратор</p>
                            </div>
                        </div>
                    </div>

                    {/* Security Settings */}
                    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                        <h2 className="text-xl font-bold text-slate-900 mb-6">Безпека</h2>

                        <div className="space-y-5">
                            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                                <div>
                                    <p className="font-semibold text-slate-900">Пароль</p>
                                    <p className="text-sm text-slate-500 mt-1">Останнє оновлення: 3 місяці тому</p>
                                </div>
                                <button className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-white transition-colors">
                                    Змінити пароль
                                </button>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                                <div>
                                    <p className="font-semibold text-slate-900">Двофакторна автентифікація</p>
                                    <p className="text-sm text-slate-500 mt-1">Додатковий захист облікового запису</p>
                                </div>
                                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                                    Увімкнути
                                </button>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                                <div>
                                    <p className="font-semibold text-slate-900">Активні сесії</p>
                                    <p className="text-sm text-slate-500 mt-1">2 пристрої підключені</p>
                                </div>
                                <button className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-white transition-colors">
                                    Переглянути
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Recent Activity */}
                    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                        <h2 className="text-xl font-bold text-slate-900 mb-6">Остання активність</h2>
                        <div className="space-y-4">
                            {recentActivity.map((activity, index) => (
                                <div key={index} className="flex gap-3">
                                    <div className="text-2xl flex-shrink-0">{activity.icon}</div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-slate-900 text-sm">{activity.action}</p>
                                        <p className="text-xs text-slate-600 truncate">{activity.details}</p>
                                        <p className="text-xs text-slate-400 mt-1">{activity.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Currency Rates */}
                    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-slate-900">Курси валют</h2>
                            <span className="text-xs text-slate-400">НБУ • Оновлено сьогодні</span>
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                                        <span className="text-white font-bold text-sm">$</span>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-slate-900">USD</p>
                                        <p className="text-xs text-slate-500">Долар США</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-slate-900">41.25 ₴</p>
                                    <p className="text-xs text-green-600 flex items-center gap-1 justify-end">
                                        <span>↑</span>
                                        <span>+0.15</span>
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gradient-to-br from-blue-700 to-blue-800 rounded-lg flex items-center justify-center">
                                        <span className="text-white font-bold text-sm">€</span>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-slate-900">EUR</p>
                                        <p className="text-xs text-slate-500">Євро</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-slate-900">44.80 ₴</p>
                                    <p className="text-xs text-red-600 flex items-center gap-1 justify-end">
                                        <span>↓</span>
                                        <span>-0.08</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Notifications Settings */}
                    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                        <h2 className="text-xl font-bold text-slate-900 mb-6">Сповіщення</h2>
                        <div className="space-y-3">
                            <label className="flex items-center justify-between cursor-pointer">
                                <span className="text-sm text-slate-700">Email сповіщення</span>
                                <input type="checkbox" defaultChecked className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-600" />
                            </label>
                            <label className="flex items-center justify-between cursor-pointer">
                                <span className="text-sm text-slate-700">SMS сповіщення</span>
                                <input type="checkbox" className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-600" />
                            </label>
                            <label className="flex items-center justify-between cursor-pointer">
                                <span className="text-sm text-slate-700">Push сповіщення</span>
                                <input type="checkbox" defaultChecked className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-600" />
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
