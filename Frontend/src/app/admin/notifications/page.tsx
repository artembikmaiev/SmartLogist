'use client';

import { useState, useEffect } from 'react';
import { Bell, Check, Trash2, Clock, Info, AlertCircle, X, Search } from 'lucide-react';
import { notificationsService, Notification } from '@/services/notifications.service';
import { formatDateTime } from '@/lib/utils/date.utils';
import Button from '@/components/ui/Button';

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        setIsLoading(true);
        try {
            const data = await notificationsService.getAll();
            setNotifications(data);
        } catch (err) {
            console.error('Error fetching notifications:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleMarkAsRead = async (id: number) => {
        try {
            await notificationsService.markAsRead(id);
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
        } catch (err) {
            console.error('Error marking as read:', err);
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await notificationsService.markAllAsRead();
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        } catch (err) {
            console.error('Error marking all as read:', err);
        }
    };

    const handleClearAll = async () => {
        if (!confirm('Ви впевнені, що хочете видалити всі сповіщення?')) return;
        try {
            await notificationsService.clearAll();
            setNotifications([]);
        } catch (err) {
            console.error('Error clearing notifications:', err);
        }
    };

    const filteredNotifications = notifications.filter(n =>
        n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.message.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="p-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                        <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                            <Bell className="w-6 h-6 text-purple-600" />
                        </div>
                        Історія сповіщень
                    </h1>
                    <p className="text-slate-500 mt-2">Всі системні повідомлення та оновлення статусів.</p>
                </div>

                <div className="flex gap-3">
                    <Button variant="secondary" onClick={handleMarkAllAsRead} className="flex items-center gap-2">
                        <Check className="w-4 h-4" />
                        Прочитати всі
                    </Button>
                    <Button variant="danger" onClick={handleClearAll} className="flex items-center gap-2">
                        <Trash2 className="w-4 h-4" />
                        Очистити історію
                    </Button>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-4 border-b border-slate-200 bg-slate-50/50">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Пошук у сповіщеннях за ключовим словом..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all text-sm font-medium bg-white shadow-sm"
                        />
                    </div>
                </div>

                {isLoading ? (
                    <div className="p-20 text-center flex flex-col items-center justify-center">
                        <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mb-4 shadow-sm"></div>
                        <p className="text-slate-500 font-bold">Отримання історії сповіщень...</p>
                    </div>
                ) : filteredNotifications.length > 0 ? (
                    <div className="divide-y divide-slate-100">
                        {filteredNotifications.map((notif) => (
                            <div
                                key={notif.id}
                                className={`p-6 transition-all duration-300 flex gap-4 ${notif.isRead ? 'bg-white hover:bg-slate-50' : 'bg-purple-50/50 hover:bg-purple-50/80 border-l-4 border-purple-500'}`}
                            >
                                <div className={`p-3 rounded-2xl shadow-sm h-fit ${
                                    notif.type === 'Success' ? 'bg-green-100 text-green-600' :
                                    notif.type === 'Error' ? 'bg-red-100 text-red-600' :
                                    notif.type === 'Warning' ? 'bg-amber-100 text-amber-600' :
                                    'bg-purple-100 text-purple-600'
                                }`}>
                                    {notif.type === 'Success' ? <Check className="w-6 h-6" /> :
                                     notif.type === 'Error' ? <X className="w-6 h-6" /> :
                                     notif.type === 'Warning' ? <AlertCircle className="w-6 h-6" /> :
                                     <Info className="w-6 h-6" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 mb-2">
                                        <h3 className={`text-base font-bold truncate ${notif.isRead ? 'text-slate-700' : 'text-slate-900'}`}>
                                            {notif.title}
                                        </h3>
                                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full w-fit">
                                            <Clock className="w-3 h-3" />
                                            {formatDateTime(notif.createdAt)}
                                        </div>
                                    </div>
                                    <p className="text-sm text-slate-600 leading-relaxed mb-4">
                                        {notif.message}
                                    </p>
                                    {!notif.isRead && (
                                        <button
                                            onClick={() => handleMarkAsRead(notif.id)}
                                            className="text-xs font-bold text-purple-600 hover:text-purple-800 transition-colors flex items-center gap-1.5 bg-purple-50 px-3 py-1.5 rounded-lg border border-purple-200/50 hover:bg-purple-100"
                                        >
                                            <Check className="w-4 h-4" /> Позначити як прочитане
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="p-24 text-center">
                        <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                            <Bell className="w-10 h-10 text-slate-300" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">Немає сповіщень</h3>
                        <p className="text-slate-500 max-w-sm mx-auto">
                            {searchQuery ? 'За вашим пошуковим запитом нічого не знайдено.' : 'Тут буде відображатися вся історія ваших системних сповіщень. Наразі список порожній.'}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
