'use client';

import { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Mail, Phone, Calendar } from 'lucide-react';
import { managersService, Manager } from '@/services/managers.service';

export default function AdminManagersPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [managers, setManagers] = useState<Manager[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadManagers();
    }, []);

    const loadManagers = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await managersService.getAll();
            setManagers(data);
        } catch (err) {
            setError('Помилка завантаження даних');
            console.error('Error loading managers:', err);
        } finally {
            setLoading(false);
        }
    };

    // Form state
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        fullName: '',
        phone: ''
    });
    const [formError, setFormError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleCreateManager = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError(null);
        setIsSubmitting(true);

        try {
            await managersService.create(formData);

            // Reset form
            setFormData({ email: '', password: '', fullName: '', phone: '' });
            setShowAddModal(false);

            // Reload managers list
            await loadManagers();
        } catch (err: any) {
            setFormError(err.message || 'Помилка створення менеджера');
            console.error('Error creating manager:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Edit state
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingManager, setEditingManager] = useState<Manager | null>(null);
    const [editFormData, setEditFormData] = useState({
        fullName: '',
        phone: '',
        isActive: true
    });

    const handleEditClick = (manager: Manager) => {
        setEditingManager(manager);
        setEditFormData({
            fullName: manager.fullName,
            phone: manager.phone || '',
            isActive: manager.isActive
        });
        setShowEditModal(true);
    };

    const handleUpdateManager = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingManager) return;

        setFormError(null);
        setIsSubmitting(true);

        try {
            await managersService.update(editingManager.id, editFormData);

            setShowEditModal(false);
            setEditingManager(null);
            await loadManagers();

            // Notify other tabs to sync
            const authChannel = new BroadcastChannel('auth_sync');
            authChannel.postMessage('sync');
            authChannel.close();
        } catch (err: any) {
            setFormError(err.message || 'Помилка оновлення менеджера');
            console.error('Error updating manager:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Delete state
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deletingManager, setDeletingManager] = useState<Manager | null>(null);

    const handleDeleteClick = (manager: Manager) => {
        setDeletingManager(manager);
        setShowDeleteModal(true);
    };

    const handleDeleteManager = async () => {
        if (!deletingManager) return;

        setIsSubmitting(true);
        setFormError(null);

        try {
            await managersService.delete(deletingManager.id);
            setShowDeleteModal(false);
            setDeletingManager(null);
            await loadManagers();
        } catch (err: any) {
            setFormError(err.message || 'Помилка видалення менеджера');
            console.error('Error deleting manager:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const filteredManagers = (managers || []).filter(manager =>
        manager.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        manager.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const stats = [
        { label: 'Всього менеджерів', value: (managers?.length || 0).toString(), color: 'purple' },
        { label: 'Активних', value: (managers?.filter(m => m.isActive).length || 0).toString(), color: 'green' },
        { label: 'Неактивних', value: (managers?.filter(m => !m.isActive).length || 0).toString(), color: 'orange' },
        { label: 'Водіїв під управлінням', value: (managers?.reduce((sum, m) => sum + m.activeDriversCount, 0) || 0).toString(), color: 'blue' },
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
                            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 text-slate-900 placeholder:text-slate-600"
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
                {loading ? (
                    <div className="p-12 text-center">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                        <p className="mt-4 text-slate-600">Завантаження...</p>
                    </div>
                ) : error ? (
                    <div className="p-12 text-center">
                        <p className="text-red-600 font-medium">{error}</p>
                        <button
                            onClick={loadManagers}
                            className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                        >
                            Спробувати знову
                        </button>
                    </div>
                ) : filteredManagers.length === 0 ? (
                    <div className="p-12 text-center">
                        <p className="text-slate-500 text-lg font-medium">Менеджерів не знайдено</p>
                        <p className="text-slate-400 mt-2">Спробуйте змінити пошуковий запит або додати нового менеджера.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="text-left p-4 text-sm font-semibold text-slate-700">Менеджер</th>
                                    <th className="text-left p-4 text-sm font-semibold text-slate-700">Контакти</th>
                                    <th className="text-left p-4 text-sm font-semibold text-slate-700">Водії</th>
                                    <th className="text-left p-4 text-sm font-semibold text-slate-700">Дозволи</th>
                                    <th className="text-left p-4 text-sm font-semibold text-slate-700">Статус</th>
                                    <th className="text-left p-4 text-sm font-semibold text-slate-700">Дії</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200">
                                {filteredManagers.map((manager) => (
                                    <tr key={manager.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                                                    <span className="text-white font-semibold text-sm">
                                                        {manager.fullName.split(' ').map(n => n[0]).join('')}
                                                    </span>
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-slate-900">{manager.fullName}</p>
                                                    <p className="text-xs text-slate-500">
                                                        Створено: {new Date(manager.createdAt).toLocaleDateString('uk-UA')}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2 text-sm text-slate-600">
                                                    <Mail className="w-4 h-4" />
                                                    {manager.email}
                                                </div>
                                                {manager.phone && (
                                                    <div className="flex items-center gap-2 text-sm text-slate-600">
                                                        <Phone className="w-4 h-4" />
                                                        {manager.phone}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className="text-lg font-bold text-slate-900">{manager.activeDriversCount}</span>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex flex-wrap gap-1">
                                                {manager.permissions.length > 0 ? (
                                                    manager.permissions.slice(0, 3).map((perm) => (
                                                        <span
                                                            key={perm}
                                                            className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-medium"
                                                        >
                                                            {perm}
                                                        </span>
                                                    ))
                                                ) : (
                                                    <span className="text-xs text-slate-400">Немає дозволів</span>
                                                )}
                                                {manager.permissions.length > 3 && (
                                                    <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs font-medium">
                                                        +{manager.permissions.length - 3}
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-semibold ${manager.isActive
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-orange-100 text-orange-700'
                                                    }`}
                                            >
                                                {manager.isActive ? 'Активний' : 'Неактивний'}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => handleEditClick(manager)}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="Редагувати"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteClick(manager)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Видалити"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Add Manager Modal */}
            {showAddModal && (
                <div className="fixed inset-0 backdrop-blur-[3px] flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-2xl w-full p-8">
                        <h2 className="text-2xl font-bold text-slate-900 mb-6">Додати нового менеджера</h2>

                        <form onSubmit={handleCreateManager} className="space-y-4 mb-6">
                            {formError && (
                                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                                    {formError}
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Повне ім'я <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.fullName}
                                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 text-slate-900 placeholder:text-slate-600"
                                    placeholder="Іван Іванов"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Email <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 text-slate-900 placeholder:text-slate-600"
                                    placeholder="ivan@smartlogist.ua"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Пароль <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="password"
                                    required
                                    minLength={8}
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 text-slate-900 placeholder:text-slate-600"
                                    placeholder="Мінімум 8 символів"
                                />
                                <p className="text-xs text-slate-500 mt-1">
                                    Мінімум 8 символів, велика літера, мала літера, цифра
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Телефон
                                </label>
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 text-slate-900 placeholder:text-slate-600"
                                    placeholder="+380671234567"
                                />
                                <p className="text-xs text-slate-500 mt-1">
                                    Формат: +380XXXXXXXXX
                                </p>
                            </div>

                            <div className="flex gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowAddModal(false);
                                        setFormData({ email: '', password: '', fullName: '', phone: '' });
                                        setFormError(null);
                                    }}
                                    disabled={isSubmitting}
                                    className="flex-1 px-6 py-3 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors disabled:opacity-50"
                                >
                                    Скасувати
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? 'Створення...' : 'Додати менеджера'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Manager Modal */}
            {showEditModal && editingManager && (
                <div className="fixed inset-0 backdrop-blur-[3px] flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-2xl w-full p-8">
                        <h2 className="text-2xl font-bold text-slate-900 mb-6">Редагувати менеджера</h2>

                        <form onSubmit={handleUpdateManager} className="space-y-4 mb-6">
                            {formError && (
                                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                                    {formError}
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Email (не можна змінити)
                                </label>
                                <input
                                    type="email"
                                    disabled
                                    value={editingManager.email}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-slate-100 text-slate-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Повне ім'я <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={editFormData.fullName}
                                    onChange={(e) => setEditFormData({ ...editFormData, fullName: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 text-slate-900"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Телефон
                                </label>
                                <input
                                    type="tel"
                                    value={editFormData.phone}
                                    onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 text-slate-900 placeholder:text-slate-600"
                                    placeholder="+380671234567"
                                />
                            </div>

                            <div>
                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={editFormData.isActive}
                                        onChange={(e) => setEditFormData({ ...editFormData, isActive: e.target.checked })}
                                        className="w-4 h-4 text-purple-600 rounded"
                                    />
                                    <span className="text-sm font-medium text-slate-700">Активний</span>
                                </label>
                            </div>

                            <div className="flex gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowEditModal(false);
                                        setEditingManager(null);
                                        setFormError(null);
                                    }}
                                    disabled={isSubmitting}
                                    className="flex-1 px-6 py-3 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors disabled:opacity-50"
                                >
                                    Скасувати
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? 'Збереження...' : 'Зберегти зміни'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && deletingManager && (
                <div className="fixed inset-0 backdrop-blur-[3px] flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-md w-full p-8">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">Видалити менеджера?</h2>

                        {formError && (
                            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm mb-4">
                                {formError}
                            </div>
                        )}

                        <p className="text-slate-600 mb-6">
                            Ви впевнені що хочете видалити менеджера <strong>{deletingManager.fullName}</strong>?
                            {deletingManager.activeDriversCount > 0 && (
                                <span className="block mt-2 text-orange-600 font-medium">
                                    Увага: У цього менеджера {deletingManager.activeDriversCount} активних водіїв!
                                </span>
                            )}
                        </p>

                        <div className="flex gap-3">
                            <button
                                onClick={() => {
                                    setShowDeleteModal(false);
                                    setDeletingManager(null);
                                    setFormError(null);
                                }}
                                disabled={isSubmitting}
                                className="flex-1 px-6 py-3 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors disabled:opacity-50"
                            >
                                Скасувати
                            </button>
                            <button
                                onClick={handleDeleteManager}
                                disabled={isSubmitting}
                                className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? 'Видалення...' : 'Видалити'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
