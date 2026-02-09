'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Shield, Users, UserCog, Truck, MessageSquare, Bell, LogOut, Trash2, Loader2, Check, X, Info, AlertCircle, Clock } from 'lucide-react';
import { notificationsService, Notification } from '@/services/notifications.service';
import { formatDateTime } from '@/lib/utils/date.utils';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useRouter } from 'next/navigation';

function AdminLayoutContent({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();
    const { user, logout } = useAuth();
    const [unreadCount, setUnreadCount] = useState(0);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [showNotifications, setShowNotifications] = useState(false);
    const [showClearConfirm, setShowClearConfirm] = useState(false);
    const [loading, setLoading] = useState(false);

    const navigation = [
        { name: 'Менеджери', href: '/admin/managers', icon: Users },
        { name: 'Водії', href: '/admin/drivers', icon: UserCog },
        { name: 'Автопарк', href: '/admin/vehicles', icon: Truck },
        { name: 'Дозволи', href: '/admin/permissions', icon: Shield },
        { name: 'Запити', href: '/admin/requests', icon: MessageSquare },
    ];

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, []);

    const fetchNotifications = async () => {
        try {
            const [all, unread] = await Promise.all([
                notificationsService.getAll(),
                notificationsService.getUnreadCount()
            ]);
            setNotifications(all);
            setUnreadCount(unread);
        } catch (err) {
            console.error('Failed to fetch notifications:', err);
        }
    };

    const handleMarkAsRead = async (id: number) => {
        try {
            await notificationsService.markAsRead(id);
            await fetchNotifications();
        } catch (err) {
            console.error('Error marking as read:', err);
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await notificationsService.markAllAsRead();
            await fetchNotifications();
        } catch (err) {
            console.error('Error marking all as read:', err);
        }
    };

    const handleClearAll = async () => {
        try {
            setLoading(true);
            await notificationsService.clearAll();
            await fetchNotifications();
            setShowClearConfirm(false);
            setShowNotifications(false);
        } catch (err) {
            console.error('Error clearing notifications:', err);
        } finally {
            setLoading(false);
        }
    };

    const isActive = (href: string) => pathname === href;

    const handleLogout = async () => {
        await logout();
        router.push('/');
    };

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold">SL</span>
                        </div>
                        <div>
                            <span className="font-bold text-slate-900 text-lg">SmartLogist</span>
                            <span className="block text-xs text-slate-500">Адмін панель</span>
                        </div>
                    </Link>

                    {/* Navigation */}
                    <nav className="flex items-center gap-2">
                        {navigation.map((item) => {
                            const Icon = item.icon;
                            const active = isActive(item.href);

                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors relative ${active
                                        ? 'bg-purple-50 text-purple-700 font-medium'
                                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                        }`}
                                >
                                    <Icon className="w-5 h-5" />
                                    <span>{item.name}</span>
                                </Link>
                            );
                        })}
                    </nav>

                    {/* User Menu & Notifications */}
                    <div className="flex items-center gap-2">
                        {/* Notifications */}
                        <div className="relative mr-2">
                            <button
                                onClick={() => setShowNotifications(!showNotifications)}
                                className={`relative p-2 rounded-xl transition-all ${showNotifications ? 'bg-purple-50 text-purple-600' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                                    }`}
                            >
                                <Bell className="w-5 h-5" />
                                {unreadCount > 0 && (
                                    <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                                        {unreadCount > 9 ? '9+' : unreadCount}
                                    </span>
                                )}
                            </button>

                            {/* Notifications Dropdown */}
                            {showNotifications && (
                                <>
                                    <div
                                        className="fixed inset-0 z-40"
                                        onClick={() => setShowNotifications(false)}
                                    ></div>
                                    <div className="absolute right-0 mt-3 w-80 md:w-96 bg-white rounded-2xl shadow-2xl border border-slate-100 z-50 overflow-hidden animate-in fade-in zoom-in duration-200">
                                        <div className="p-4 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                                            <h3 className="font-bold text-slate-900 flex items-center gap-2">
                                                <Bell className="w-4 h-4 text-purple-600" />
                                                Сповіщення
                                            </h3>
                                            <div className="flex items-center gap-3">
                                                {unreadCount > 0 && (
                                                    <button
                                                        onClick={handleMarkAllAsRead}
                                                        className="text-xs font-bold text-purple-600 hover:text-purple-700 transition-colors"
                                                        title="Прочитати всі"
                                                    >
                                                        <Check className="w-4 h-4" />
                                                    </button>
                                                )}
                                                {notifications.length > 0 && (
                                                    <button
                                                        onClick={() => setShowClearConfirm(true)}
                                                        className="text-xs font-bold text-slate-400 hover:text-red-600 transition-colors"
                                                        title="Очистити все"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                        <div className="max-h-[400px] overflow-y-auto">
                                            {notifications.length > 0 ? (
                                                <div className="divide-y divide-slate-50">
                                                    {notifications.map((notif) => (
                                                        <div
                                                            key={notif.id}
                                                            className={`p-4 transition-colors relative group ${notif.isRead ? 'bg-white opacity-70' : 'bg-purple-50/30'}`}
                                                        >
                                                            <div className="flex gap-3">
                                                                <div className={`mt-1 p-2 rounded-lg h-fit ${notif.type === 'Success' ? 'bg-green-100 text-green-600' :
                                                                    notif.type === 'Error' ? 'bg-red-100 text-red-600' :
                                                                        notif.type === 'Warning' ? 'bg-amber-100 text-amber-600' :
                                                                            'bg-purple-100 text-purple-600'
                                                                    }`}>
                                                                    {notif.type === 'Success' ? <Check className="w-4 h-4" /> :
                                                                        notif.type === 'Error' ? <X className="w-4 h-4" /> :
                                                                            notif.type === 'Warning' ? <AlertCircle className="w-4 h-4" /> :
                                                                                <Info className="w-4 h-4" />}
                                                                </div>
                                                                <div className="flex-1 min-w-0">
                                                                    <p className={`text-sm font-bold truncate ${notif.isRead ? 'text-slate-600' : 'text-slate-900'}`}>
                                                                        {notif.title}
                                                                    </p>
                                                                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                                                                        {notif.message}
                                                                    </p>
                                                                    <div className="flex items-center gap-1 mt-2 text-[10px] text-slate-400">
                                                                        <Clock className="w-3 h-3" />
                                                                        {formatDateTime(notif.createdAt)}
                                                                    </div>
                                                                </div>
                                                                {!notif.isRead && (
                                                                    <button
                                                                        onClick={() => handleMarkAsRead(notif.id)}
                                                                        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-white rounded-md transition-all shadow-sm h-fit self-center"
                                                                        title="Позначити як прочитане"
                                                                    >
                                                                        <Check className="w-3 h-3 text-green-600" />
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="p-12 flex flex-col items-center justify-center text-slate-400">
                                                    <Bell className="w-12 h-12 text-slate-100 mb-3" />
                                                    <p className="text-sm font-medium">Немає нових сповіщень</p>
                                                </div>
                                            )}
                                        </div>

                                        <div className="p-3 border-t border-slate-50 bg-slate-50/30 text-center">
                                            <span className="text-xs font-bold text-slate-400">
                                                Всі сповіщення
                                            </span>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>

                        <Link href="/admin/profile" className="flex items-center gap-3 hover:opacity-80 transition-opacity pl-2 border-l border-slate-200">
                            <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                                <span className="text-white font-semibold text-sm">
                                    {user?.fullName ? user.fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'A'}
                                </span>
                            </div>
                            <div className="hidden md:block">
                                <p className="text-sm font-medium text-slate-900">{user?.fullName || 'Адміністратор'}</p>
                                <p className="text-xs text-slate-500">{user?.role || 'Admin'}</p>
                            </div>
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-lg transition-colors"
                        >
                            <LogOut className="w-5 h-5" />
                            <span className="hidden md:inline">Вийти</span>
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-6 py-8">
                {children}
            </main>
            {/* Clear Notifications Confirmation Modal */}
            {showClearConfirm && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-center justify-center z-[70] p-4">
                    <div className="bg-white rounded-3xl max-w-sm w-full p-8 shadow-2xl animate-in fade-in zoom-in duration-200">
                        <div className="flex flex-col items-center text-center">
                            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-6">
                                <Trash2 className="w-8 h-8 text-red-500" />
                            </div>
                            <h2 className="text-xl font-bold text-slate-900 mb-2">Очистити сповіщення?</h2>
                            <p className="text-slate-500 text-sm mb-8">
                                Ви впевнені, що хочете видалити всі сповіщення? Цю дію неможливо скасувати.
                            </p>

                            <div className="flex flex-col w-full gap-3">
                                <button
                                    onClick={handleClearAll}
                                    disabled={loading}
                                    className="w-full py-3.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-2xl transition-all shadow-lg shadow-red-100 active:scale-[0.98] flex items-center justify-center gap-2"
                                >
                                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
                                    Так, видалити все
                                </button>
                                <button
                                    onClick={() => setShowClearConfirm(false)}
                                    className="w-full py-3.5 bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold rounded-2xl transition-all"
                                >
                                    Скасувати
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ProtectedRoute>
            <AdminLayoutContent>{children}</AdminLayoutContent>
        </ProtectedRoute>
    );
}
