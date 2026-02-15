'use client';
// Панель управління менеджерами системи з можливістю додавання та редагування їхніх профілів.

import { Mail, Phone, Edit, Trash2, Shield, User } from 'lucide-react';
import { managersService, Manager } from '@/services/managers.service';
import useResource from '@/hooks/useResource';
import DataTable, { Column } from '@/components/ui/DataTable';
import PageHeader from '@/components/ui/PageHeader';
import FilterBar from '@/components/ui/FilterBar';
import Modal from '@/components/ui/Modal';
import Badge from '@/components/ui/Badge';
import StatCard from '@/components/ui/StatCard';
import ManagerForm from '@/components/admin/ManagerForm';
import { useNotifications } from '@/contexts/NotificationContext';

export default function AdminManagersPage() {
    const { success, error } = useNotifications();
    const {
        paginatedData: managers,
        allItems,
        isLoading,
        searchQuery,
        setSearchQuery,
        isSubmitting,
        setIsSubmitting,
        showCreateModal,
        setShowCreateModal,
        showEditModal,
        setShowEditModal,
        showDeleteModal,
        setShowDeleteModal,
        selectedItem: selectedManager,
        loadData,
        handleCreateOpen,
        handleEditOpen,
        handleDeleteOpen,
        handleDelete,
        closeModals,
        currentPage,
        setCurrentPage,
        totalPages,
        totalItems,
        pageSize,
        setPageSize
    } = useResource<Manager>({
        fetchFn: managersService.getAll,
        deleteFn: managersService.delete,
        filterFn: (m, query) =>
            m.fullName.toLowerCase().includes(query.toLowerCase()) ||
            m.email.toLowerCase().includes(query.toLowerCase())
    });

    const handleFormSubmit = async (data: any) => {
        try {
            setIsSubmitting(true);
            if (showCreateModal) {
                await managersService.create(data);
            } else if (showEditModal && selectedManager) {
                await managersService.update(selectedManager.id, data);
            }
            closeModals();
            await loadData(false);
            success(showCreateModal ? 'Менеджера успішно додано' : 'Дані менеджера оновлено');
            return true;
        } catch (err: any) {
            error(err.message || 'Помилка при збереженні');
            return false;
        } finally {
            setIsSubmitting(false);
        }
    };

    const columns: Column<Manager>[] = [
        {
            header: 'Менеджер',
            key: 'fullName',
            render: (m) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-semibold text-sm">
                            {m.fullName.split(' ').map(n => n[0]).join('')}
                        </span>
                    </div>
                    <div>
                        <p className="font-semibold text-slate-900">{m.fullName}</p>
                        <p className="text-xs text-slate-500">Створено: {new Date(m.createdAt).toLocaleDateString('uk-UA')}</p>
                    </div>
                </div>
            )
        },
        {
            header: 'Контакти',
            key: 'email',
            render: (m) => (
                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Mail className="w-4 h-4" />
                        {m.email}
                    </div>
                    {m.phone && (
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                            <Phone className="w-4 h-4" />
                            {m.phone}
                        </div>
                    )}
                </div>
            )
        },
        {
            header: 'Водії',
            key: 'activeDriversCount',
            render: (m) => <span className="text-lg font-bold text-slate-900">{m.activeDriversCount}</span>
        },
        {
            header: 'Дозволи',
            key: 'permissions',
            render: (m) => (
                <div className="flex flex-wrap gap-1">
                    {m.permissions.length > 0 ? (
                        m.permissions.slice(0, 3).map((perm) => (
                            <Badge key={perm} variant="purple">{perm}</Badge>
                        ))
                    ) : (
                        <span className="text-xs text-slate-400">Немає дозволів</span>
                    )}
                    {m.permissions.length > 3 && (
                        <Badge variant="neutral">+{m.permissions.length - 3}</Badge>
                    )}
                </div>
            )
        },
        {
            header: 'Статус',
            key: 'isActive',
            render: (m) => (
                <Badge variant={m.isActive ? 'success' : 'warning'}>
                    {m.isActive ? 'Активний' : 'Неактивний'}
                </Badge>
            )
        },
        {
            header: 'Дії',
            key: 'actions',
            headerClassName: 'text-right',
            className: 'text-right',
            render: (m) => (
                <div className="flex items-center justify-end gap-2">
                    <button onClick={() => handleEditOpen(m)} className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors">
                        <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDeleteOpen(m)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            )
        }
    ];

    const stats = [
        { label: 'Всього менеджерів', value: allItems.length, color: 'purple', icon: Shield },
        { label: 'Активних', value: allItems.filter(m => m.isActive).length, color: 'green', icon: User },
        { label: 'Водіїв під управлінням', value: allItems.reduce((sum, m) => sum + m.activeDriversCount, 0), color: 'purple', icon: Shield },
    ];

    return (
        <div className="p-8 bg-slate-50 min-h-screen">
            <PageHeader
                title="Управління менеджерами"
                description="Додавання, редагування та видалення менеджерів"
                onRefresh={() => loadData()}
                primaryAction={{
                    label: 'Додати менеджера',
                    onClick: handleCreateOpen
                }}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {stats.map((stat, idx) => (
                    <StatCard key={idx} title={stat.label} value={stat.value} color={stat.color as any} icon={stat.icon} />
                ))}
            </div>

            <FilterBar
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                searchPlaceholder="Пошук менеджерів..."
            />

            <DataTable
                data={managers}
                columns={columns}
                isLoading={isLoading}
                emptyMessage="Менеджерів не знайдено"
                pagination={{
                    currentPage,
                    totalPages,
                    totalItems,
                    pageSize,
                    onPageChange: setCurrentPage,
                    onPageSizeChange: setPageSize,
                    label: 'менеджерів'
                }}
            />

            <Modal isOpen={showCreateModal || showEditModal} onClose={closeModals} title={showCreateModal ? 'Додати менеджера' : 'Редагувати менеджера'}>
                <ManagerForm manager={selectedManager} onSubmit={handleFormSubmit} onCancel={closeModals} />
            </Modal>

            <Modal isOpen={showDeleteModal} onClose={closeModals} title="Видалити менеджера?">
                <div className="text-center p-4">
                    <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 text-red-600">
                        <Trash2 className="w-8 h-8" />
                    </div>
                    <p className="text-slate-600 mb-2">Ви впевнені що хочете видалити менеджера <strong>{selectedManager?.fullName}</strong>?</p>
                    {selectedManager && selectedManager.activeDriversCount > 0 && (
                        <p className="text-orange-600 text-sm font-bold mb-8">Увага: У цього менеджера {selectedManager.activeDriversCount} активних водіїв!</p>
                    )}
                    <div className="flex gap-3">
                        <button onClick={closeModals} className="flex-1 px-6 py-3 border border-slate-300 rounded-xl">Скасувати</button>
                        <button onClick={handleDelete} disabled={isSubmitting} className="flex-1 px-6 py-3 bg-red-600 text-white rounded-xl font-bold">
                            {isSubmitting ? 'Видалення...' : 'Видалити'}
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
