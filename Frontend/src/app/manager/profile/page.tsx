'use client';

import { useState, useEffect } from 'react';
import { User, Mail, Phone, Calendar, Building, Shield, Edit, Save, X, TrendingUp, Users, Truck, Award } from 'lucide-react';
import { authService } from '@/services/auth.service';
import { activitiesService } from '@/services/activities.service';
import { currencyService } from '@/services/currency.service';
import { CurrencyRate } from '@/types/currency.types';
import { useAuth } from '@/contexts/AuthContext';

export default function ManagerProfilePage() {
    const { user } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        department: 'Відділ логістики'
    });

    useEffect(() => {
        if (user) {
            setFormData({
                fullName: user.fullName || '',
                email: user.email || '',
                phone: user.phone || '',
                department: 'Відділ логістики'
            });
        }
    }, [user]);

    const handleSave = async () => {
        try {
            setIsLoading(true);
            setError('');
            await authService.updateProfile({
                fullName: formData.fullName,
                email: formData.email,
                phone: formData.phone
            });

            setSuccessMessage('Профіль успішно оновлено');
            setIsEditing(false);
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (err: any) {
            setError(err.response?.data?.message || err.message || 'Помилка при оновленні профілю');
        } finally {
            setIsLoading(false);
        }
    };

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

    const [activities, setActivities] = useState<any[]>([]);
    const [rates, setRates] = useState<CurrencyRate[]>([]);

    useEffect(() => {
        const fetchActivities = async () => {
            try {
                const data = await activitiesService.getRecent(4);
                setActivities(data);
            } catch (err) {
                console.error('Failed to fetch activities:', err);
            }
        };

        const fetchRates = async () => {
            try {
                const data = await currencyService.getRates();
                setRates(data);
            } catch (err) {
                console.error('Failed to fetch rates:', err);
            }
        };

        if (user) {
            fetchActivities();
            fetchRates();
        }
    }, [user]);

    const getActivityIcon = (action: string) => {
        if (action.includes('транспорт')) return '🚛';
        if (action.includes('водія')) return '👤';
        if (action.includes('рейс')) return '📦';
        if (action.includes('Статус')) return '🔧';
        return '📝';
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / 60000);

        if (diffInMinutes < 1) return 'щойно';
        if (diffInMinutes < 60) return `${diffInMinutes} хв тому`;

        const diffInHours = Math.floor(diffInMinutes / 60);
        if (diffInHours < 24) return `${diffInHours} год тому`;

        return date.toLocaleDateString('uk-UA');
    };

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
                                onClick={handleSave}
                                disabled={isLoading}
                                className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 transition-colors shadow-sm flex items-center gap-2"
                            >
                                {isLoading ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                ) : (
                                    <Save className="w-5 h-5" />
                                )}
                                {isLoading ? 'Збереження...' : 'Зберегти'}
                            </button>
                            <button
                                onClick={() => {
                                    setIsEditing(false);
                                    if (user) {
                                        setFormData({
                                            fullName: user.fullName || '',
                                            email: user.email || '',
                                            phone: user.phone || '',
                                            department: 'Відділ логістики'
                                        });
                                    }
                                }}
                                disabled={isLoading}
                                className="bg-slate-200 text-slate-700 px-6 py-3 rounded-lg font-semibold hover:bg-slate-300 disabled:opacity-50 transition-colors shadow-sm flex items-center gap-2"
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
                    {/* Notifications */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl flex justify-between items-center transition-all animate-in fade-in slide-in-from-top-4 shadow-sm">
                            <span>{error}</span>
                            <button onClick={() => setError('')}><X className="w-5 h-5" /></button>
                        </div>
                    )}
                    {successMessage && (
                        <div className="bg-green-50 border border-green-200 text-green-700 px-6 py-4 rounded-xl flex justify-between items-center transition-all animate-in fade-in slide-in-from-top-4 shadow-sm">
                            <span>{successMessage}</span>
                            <button onClick={() => setSuccessMessage('')}><X className="w-5 h-5" /></button>
                        </div>
                    )}

                    {/* Personal Info */}
                    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                        <h2 className="text-xl font-bold text-slate-900 mb-6">Особиста інформація</h2>

                        <div className="flex items-center gap-6 mb-6 pb-6 border-b border-slate-200">
                            <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                                <span className="text-white font-bold text-3xl">
                                    {formData.fullName.split(' ').map((n: string) => n[0]).join('').toUpperCase().substring(0, 2) || '??'}
                                </span>
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-slate-900">{formData.fullName}</h3>
                                <p className="text-slate-600">{formData.department}</p>
                                <div className="flex items-center gap-2 mt-2">
                                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold capitalize">
                                        {user?.role}
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
                                        value={formData.fullName}
                                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20 transition-all shadow-sm"
                                    />
                                ) : (
                                    <p className="font-semibold text-slate-900">{formData.fullName}</p>
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
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20 transition-all shadow-sm"
                                    />
                                ) : (
                                    <p className="font-semibold text-slate-900">{formData.email}</p>
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
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20 transition-all shadow-sm"
                                    />
                                ) : (
                                    <p className="font-semibold text-slate-900">{formData.phone || 'Не вказано'}</p>
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
                                        value={formData.department}
                                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20 transition-all shadow-sm"
                                    />
                                ) : (
                                    <p className="font-semibold text-slate-900">{formData.department}</p>
                                )}
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm text-slate-500 flex items-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    Дата прийняття
                                </label>
                                <p className="font-semibold text-slate-900">
                                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('uk-UA', { day: 'numeric', month: 'long', year: 'numeric' }) : '15 січня 2022'}
                                </p>
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm text-slate-500 flex items-center gap-2">
                                    <Shield className="w-4 h-4" />
                                    Рівень доступу
                                </label>
                                <p className="font-semibold text-slate-900 capitalize">{user?.role === 'admin' ? 'Адміністратор' : 'Менеджер'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Security Settings */}
                    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                        <h2 className="text-xl font-bold text-slate-900 mb-6">Безпека</h2>

                        <div className="space-y-5">
                            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100">
                                <div>
                                    <p className="font-semibold text-slate-900">Пароль</p>
                                    <p className="text-sm text-slate-500 mt-1">Останнє оновлення: 3 місяці тому</p>
                                </div>
                                <button className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-white transition-colors">
                                    Змінити пароль
                                </button>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100">
                                <div>
                                    <p className="font-semibold text-slate-900">Двофакторна автентифікація</p>
                                    <p className="text-sm text-slate-500 mt-1">Додатковий захист облікового запису</p>
                                </div>
                                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm">
                                    Увімкнути
                                </button>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100">
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
                            {activities.length > 0 ? (
                                activities.map((activity, index) => (
                                    <div key={index} className="flex gap-3 items-start p-2 rounded-lg hover:bg-slate-50 transition-colors">
                                        <div className="text-2xl flex-shrink-0 bg-slate-100 w-10 h-10 flex items-center justify-center rounded-lg">
                                            {getActivityIcon(activity.action)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-slate-900 text-sm">{activity.action}</p>
                                            <p className="text-xs text-slate-600 truncate">{activity.details}</p>
                                            <p className="text-xs text-slate-400 mt-1 font-medium">{formatTime(activity.createdAt)}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-slate-500 text-center py-4">Активність поки що відсутня</p>
                            )}
                        </div>
                    </div>

                    {/* Currency Rates */}
                    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-slate-900">Курси валют</h2>
                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                                НБУ • {rates.length > 0 ? `Оновлено ${rates[0].date}` : 'Оновлення...'}
                            </span>
                        </div>
                        <div className="space-y-3">
                            {rates.length > 0 ? (
                                rates.map((rate) => (
                                    <div key={rate.code} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100 hover:border-blue-200 transition-colors group">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 bg-gradient-to-br ${rate.code === 'USD' ? 'from-blue-500 to-blue-600' : 'from-blue-700 to-blue-800'} rounded-lg flex items-center justify-center shadow-sm`}>
                                                <span className="text-white font-bold text-sm">{rate.code === 'USD' ? '$' : '€'}</span>
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-900 text-sm">{rate.code}</p>
                                                <p className="text-[10px] text-slate-500 font-medium">{rate.name}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-slate-900 text-sm">{rate.rate.toFixed(2)} ₴</p>
                                            <p className="text-[10px] text-slate-400 font-bold">Офіційний курс</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-slate-500 text-center py-4">Завантаження курсів...</p>
                            )}
                        </div>
                    </div>

                    {/* Notifications Settings */}
                    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                        <h2 className="text-xl font-bold text-slate-900 mb-6">Сповіщення</h2>
                        <div className="space-y-4">
                            <label className="flex items-center justify-between cursor-pointer group">
                                <span className="text-sm text-slate-700 font-medium group-hover:text-slate-900 transition-colors">Email сповіщення</span>
                                <div className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" defaultChecked className="sr-only peer" />
                                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                </div>
                            </label>
                            <label className="flex items-center justify-between cursor-pointer group">
                                <span className="text-sm text-slate-700 font-medium group-hover:text-slate-900 transition-colors">SMS сповіщення</span>
                                <div className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" />
                                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                </div>
                            </label>
                            <label className="flex items-center justify-between cursor-pointer group">
                                <span className="text-sm text-slate-700 font-medium group-hover:text-slate-900 transition-colors">Push сповіщення</span>
                                <div className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" defaultChecked className="sr-only peer" />
                                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                </div>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
