'use client';

import { User, Mail, Phone, Calendar, Award, Edit, Save, X, Truck, MapPin, Clock, DollarSign } from 'lucide-react';
import { useState } from 'react';

export default function DriverProfilePage() {
    const [isEditing, setIsEditing] = useState(false);

    // Recent activity
    const recentActivity = [
        {
            action: 'Завершено рейс',
            details: 'Дніпро → Запоріжжя (#RTR-28420)',
            time: '2 год тому',
            icon: '✅',
        },
        {
            action: 'Прийнято новий рейс',
            details: 'Київ → Львів (#RTR-28423)',
            time: '5 год тому',
            icon: '🚛',
        },
        {
            action: 'Оновлено статус',
            details: 'Доступний для нових рейсів',
            time: 'Вчора',
            icon: '🟢',
        },
        {
            action: 'Пройдено ТО',
            details: 'MAN TGX 18.480 (AA 1234 BC)',
            time: '3 дні тому',
            icon: '🔧',
        },
    ];

    return (
        <div className="p-8 bg-slate-50 min-h-screen">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">Мій профіль</h1>
                        <p className="text-slate-500 text-sm mt-1">Персональна інформація та налаштування облікового запису</p>
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
                                <span className="text-white font-bold text-3xl">ІП</span>
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-slate-900">Іван Петренко</h3>
                                <p className="text-slate-600">Водій-далекобійник</p>
                                <div className="flex items-center gap-2 mt-2">
                                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                                        Доступний
                                    </span>
                                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                                        Водій
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
                                        defaultValue="Іван Петренко"
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                                    />
                                ) : (
                                    <p className="font-semibold text-slate-900">Іван Петренко</p>
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
                                        defaultValue="ivan.petrenko@smartlogist.ua"
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                                    />
                                ) : (
                                    <p className="font-semibold text-slate-900">ivan.petrenko@smartlogist.ua</p>
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
                                        defaultValue="+380 67 234 5678"
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                                    />
                                ) : (
                                    <p className="font-semibold text-slate-900">+380 67 234 5678</p>
                                )}
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm text-slate-500 flex items-center gap-2">
                                    <Award className="w-4 h-4" />
                                    Посвідчення водія
                                </label>
                                <p className="font-semibold text-slate-900">АВС 123456</p>
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm text-slate-500 flex items-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    Дата прийняття
                                </label>
                                <p className="font-semibold text-slate-900">10 березня 2021</p>
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm text-slate-500 flex items-center gap-2">
                                    <Truck className="w-4 h-4" />
                                    Категорії
                                </label>
                                <p className="font-semibold text-slate-900">B, C, CE</p>
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
                                    <p className="text-sm text-slate-500 mt-1">Останнє оновлення: 2 місяці тому</p>
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
                                    <p className="text-sm text-slate-500 mt-1">1 пристрій підключений</p>
                                </div>
                                <button className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-white transition-colors">
                                    Переглянути
                                </button>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                                <div>
                                    <p className="font-semibold text-slate-900">Email для відновлення</p>
                                    <p className="text-sm text-slate-500 mt-1">ivan.petrenko@smartlogist.ua</p>
                                </div>
                                <button className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-white transition-colors">
                                    Змінити
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

                    {/* Road Conditions */}
                    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-slate-900">Стан доріг</h2>
                            <span className="text-xs text-slate-400">Оновлено 2 год тому</span>
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                                        <span className="text-white font-bold text-lg">🌧️</span>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-slate-900">Київ - Львів</p>
                                        <p className="text-xs text-slate-600">М-06 траса</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-blue-700">Дощ</p>
                                    <p className="text-xs text-slate-600">Слизько</p>
                                </div>
                            </div>

                            <div className="flex items-center justify-between p-3 bg-orange-50 border border-orange-200 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                                        <span className="text-white font-bold text-lg">⚠️</span>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-slate-900">Одеса - Харків</p>
                                        <p className="text-xs text-slate-600">М-14 траса</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-orange-700">Туман</p>
                                    <p className="text-xs text-slate-600">Обережно</p>
                                </div>
                            </div>

                            <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                                        <span className="text-white font-bold text-lg">☀️</span>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-slate-900">Дніпро - Запоріжжя</p>
                                        <p className="text-xs text-slate-600">М-04 траса</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-green-700">Ясно</p>
                                    <p className="text-xs text-slate-600">Добре</p>
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
                                <input type="checkbox" defaultChecked className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-600" />
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