'use client';

import { useState, useEffect, useMemo } from 'react';
import { Bell, Check, X, Clock, User, MessageSquare, UserMinus, RotateCcw, Trash2, Truck, Edit } from 'lucide-react';
import { requestsService, AdminRequest, RequestStatus, RequestType } from '@/services/requests.service';
import { driversService } from '@/services/drivers.service';
import { vehiclesService } from '@/services/vehicles.service';
import { Driver } from '@/types/drivers.types';
import { Vehicle } from '@/types/vehicle.types';
import { formatDate } from '@/lib/utils/date.utils';
import useResource from '@/hooks/useResource';
import PageHeader from '@/components/ui/PageHeader';
import FilterBar from '@/components/ui/FilterBar';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import RequestChangePreview from '@/components/admin/RequestChangePreview';
import { Pagination } from '@/components/ui/Pagination';
import { useNotifications } from '@/contexts/NotificationContext';
import Select from '@/components/ui/Select';
import FormField from '@/components/ui/FormField';
import TextArea from '@/components/ui/TextArea';

export default function AdminRequestsPage() {
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [drivers, setDrivers] = useState<Driver[]>([]);
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const { success, error } = useNotifications();

    const filterFn = useMemo(() => (req: AdminRequest, query: string) => {
        const matchesSearch =
            req.targetName.toLowerCase().includes(query.toLowerCase()) ||
            req.requesterName.toLowerCase().includes(query.toLowerCase()) ||
            req.comment.toLowerCase().includes(query.toLowerCase());

        const matchesStatus = statusFilter === 'all' || req.status === statusFilter;
        return !!(matchesSearch && matchesStatus);
    }, [statusFilter]);

    const initialSort = useMemo(() => (a: AdminRequest, b: AdminRequest) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        , []);

    const {
        paginatedData: requests,
        allItems,
        isLoading,
        searchQuery,
        setSearchQuery,
        isSubmitting,
        setIsSubmitting,
        showEditModal: showProcessModal,
        setShowEditModal: setShowProcessModal,
        showDeleteModal: showClearConfirmModal,
        setShowDeleteModal: setShowClearConfirmModal,
        selectedItem: selectedRequest,
        loadData,
        handleEditOpen: handleProcessOpen,
        handleDeleteOpen: handleClearOpen,
        closeModals,
        currentPage,
        setCurrentPage,
        totalPages,
        totalItems,
        pageSize,
        setPageSize
    } = useResource<AdminRequest>({
        fetchFn: requestsService.getAll,
        filterFn,
        initialSort
    });

    const [processData, setProcessData] = useState({ approved: true, response: '' });

    useEffect(() => {
        const loadDependencies = async () => {
            try {
                const [driversData, vehiclesData] = await Promise.all([
                    driversService.getAllAdmin(),
                    vehiclesService.getAllAdmin()
                ]);
                setDrivers(driversData);
                setVehicles(vehiclesData);
            } catch (err) {
                console.error('Error loading dependencies:', err);
            }
        };
        loadDependencies();
    }, []);

    const handleProcessRequest = async () => {
        if (!selectedRequest) return;
        try {
            setIsSubmitting(true);
            await requestsService.processRequest(selectedRequest.id, processData);
            closeModals();
            setProcessData({ approved: true, response: '' });
            await loadData(false);
            success(processData.approved ? 'Запит схвалено' : 'Запит відхилено');
        } catch (err: any) {
            error(err.message || 'Помилка при обробці запиту');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClearProcessed = async () => {
        try {
            setIsSubmitting(true);
            await requestsService.clearProcessed();
            await loadData(false);
            closeModals();
            success('Історію очищено');
        } catch (err: any) {
            error(err.message || 'Помилка при очищенні історії');
        } finally {
            setIsSubmitting(false);
        }
    };

    const getStatusStyle = (status: RequestStatus) => {
        switch (status) {
            case RequestStatus.Pending: return 'bg-amber-100 text-amber-700 border-amber-200';
            case RequestStatus.Approved: return 'bg-green-100 text-green-700 border-green-200';
            case RequestStatus.Rejected: return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-slate-100 text-slate-700 border-slate-200';
        }
    };

    const getStatusLabel = (status: RequestStatus) => {
        switch (status) {
            case RequestStatus.Pending: return 'Очікує';
            case RequestStatus.Approved: return 'Схвалено';
            case RequestStatus.Rejected: return 'Відхилено';
            default: return status;
        }
    };

    const getTypeConfig = (type: RequestType) => {
        const t = String(type);
        if (type === RequestType.DriverDeletion || t === '1') return { label: 'Видалення водія', icon: <UserMinus className="w-6 h-6" />, color: 'bg-red-50 text-red-600' };
        if (type === RequestType.DriverUpdate || t === '2') return { label: 'Оновлення водія', icon: <Edit className="w-6 h-6" />, color: 'bg-blue-50 text-blue-600' };
        if (type === RequestType.DriverCreation || t === '5') return { label: 'Додавання водія', icon: <Bell className="w-6 h-6" />, color: 'bg-purple-50 text-purple-600' };
        if (type === RequestType.VehicleDeletion || t === '3') return { label: 'Видалення транспорту', icon: <Trash2 className="w-6 h-6" />, color: 'bg-red-50 text-red-600' };
        if (type === RequestType.VehicleUpdate || t === '4') return { label: 'Оновлення транспорту', icon: <Truck className="w-6 h-6" />, color: 'bg-blue-50 text-blue-600' };
        if (type === RequestType.VehicleCreation || t === '6') return { label: 'Додавання транспорту', icon: <Bell className="w-6 h-6" />, color: 'bg-purple-50 text-purple-600' };
        return { label: 'Запит', icon: <Bell className="w-6 h-6" />, color: 'bg-slate-50 text-slate-600' };
    };

    return (
        <div className="p-8 bg-slate-50 min-h-screen">
            <PageHeader
                title="Запити на розгляд"
                description="Керування запитами від менеджерів на делікатні операції"
                onRefresh={() => loadData()}
                primaryAction={allItems.some((r: AdminRequest) => r.status !== RequestStatus.Pending) ? {
                    label: 'Очистити історію',
                    onClick: () => handleClearOpen(allItems.find(r => r.status !== RequestStatus.Pending)!),
                    icon: <Trash2 className="w-5 h-5" />
                } : undefined}
            />

            <FilterBar searchQuery={searchQuery} onSearchChange={setSearchQuery} searchPlaceholder="Пошук за водієм, менеджером або коментарем...">
                <Select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-48"
                >
                    <option value="all">Усі статуси</option>
                    <option value={RequestStatus.Pending}>Очікують</option>
                    <option value={RequestStatus.Approved}>Схвалені</option>
                    <option value={RequestStatus.Rejected}>Відхилені</option>
                </Select>
            </FilterBar>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {isLoading ? (
                    <div className="col-span-full py-20 flex justify-center"><RotateCcw className="w-10 h-10 text-purple-600 animate-spin" /></div>
                ) : requests.length > 0 ? (
                    requests.map((request: AdminRequest) => {
                        const config = getTypeConfig(request.type);
                        return (
                            <div key={request.id} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow relative flex flex-col">
                                <div className={`absolute top-0 right-0 px-4 py-1 text-xs font-bold border-b border-l rounded-bl-xl ${getStatusStyle(request.status)}`}>
                                    {getStatusLabel(request.status)}
                                </div>
                                <div className="flex items-start gap-4 mb-6">
                                    <div className={`p-3 rounded-xl shadow-sm h-fit ${config.color}`}>{config.icon}</div>
                                    <div>
                                        <div className="text-xs text-slate-500 font-bold uppercase mb-1">{config.label}</div>
                                        <h3 className="text-xl font-bold text-slate-900 leading-tight">{request.targetName}</h3>
                                        <div className="flex items-center gap-2 mt-1 text-sm text-slate-600">
                                            <User className="w-4 h-4" />
                                            <span>від: <span className="font-semibold text-slate-900">{request.requesterName}</span></span>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-slate-50 rounded-xl p-4 mb-6 flex-grow">
                                    <RequestChangePreview request={request} drivers={drivers} vehicles={vehicles} />
                                </div>
                                <div className="flex items-center justify-between mt-auto pt-6 border-t border-slate-100">
                                    <div className="flex items-center gap-2 text-xs text-slate-500">
                                        <Clock className="w-4 h-4" />
                                        <span>{formatDate(request.createdAt)}</span>
                                    </div>
                                    {request.status === RequestStatus.Pending && (
                                        <Button variant="purple" size="sm" onClick={() => { setProcessData({ approved: true, response: '' }); handleProcessOpen(request); }}>
                                            Розглянути
                                        </Button>
                                    )}
                                </div>
                                {request.status !== RequestStatus.Pending && request.adminResponse && (
                                    <div className="mt-4 pt-4 border-t border-dashed border-slate-200">
                                        <div className="text-xs font-bold text-slate-400 uppercase mb-1">Відповідь адміністратора</div>
                                        <p className="text-sm text-slate-600 font-medium">{request.adminResponse}</p>
                                        <div className="text-[10px] text-slate-400 mt-1 italic">Оброблено: {request.processedBy}</div>
                                    </div>
                                )}
                            </div>
                        );
                    })
                ) : (
                    <div className="col-span-full py-20 bg-white rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400">
                        <Bell className="w-16 h-16 mb-4 opacity-20" />
                        <p className="text-lg font-medium">Запитів не знайдено</p>
                    </div>
                )}
            </div>

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalItems}
                pageSize={pageSize}
                onPageChange={setCurrentPage}
                onPageSizeChange={setPageSize}
                label="запитів"
                className="mt-8 rounded-2xl shadow-sm border border-slate-200"
            />

            <Modal isOpen={showProcessModal} onClose={closeModals} title="Розгляд запиту">
                {selectedRequest && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                onClick={() => setProcessData({ ...processData, approved: true })}
                                className={`flex items-center justify-center gap-2 p-4 rounded-2xl border-2 transition-all font-bold ${processData.approved ? 'bg-green-50 border-green-500 text-green-700' : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'}`}
                            >
                                <Check className="w-5 h-5" /> Схвалити
                            </button>
                            <button
                                onClick={() => setProcessData({ ...processData, approved: false })}
                                className={`flex items-center justify-center gap-2 p-4 rounded-2xl border-2 transition-all font-bold ${!processData.approved ? 'bg-red-50 border-red-500 text-red-700' : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'}`}
                            >
                                <X className="w-5 h-5" /> Відхилити
                            </button>
                        </div>

                        <FormField label="Коментар до відповіді" id="response">
                            <TextArea
                                id="response"
                                value={processData.response}
                                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setProcessData({ ...processData, response: e.target.value })}
                                placeholder="Поясніть причину вашого рішення..."
                                className="h-32"
                            />
                        </FormField>

                        <Button
                            onClick={handleProcessRequest}
                            isLoading={isSubmitting}
                            variant={processData.approved ? 'success' : 'danger'}
                            className="w-full py-4 text-lg"
                        >
                            Підтвердити рішення
                        </Button>
                    </div>
                )}
            </Modal>

            <Modal isOpen={showClearConfirmModal} onClose={closeModals} title="Очистити історію?">
                <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6"><Trash2 className="w-8 h-8 text-red-600" /></div>
                    <p className="text-slate-500 mb-8">Ви впевнені, що хочете видалити всю історію оброблених запитів? Цю дію неможливо скасувати.</p>
                    <div className="flex flex-col w-full gap-3">
                        <Button variant="danger" onClick={handleClearProcessed} isLoading={isSubmitting} className="w-full py-3">Так, видалити все</Button>
                        <Button variant="secondary" onClick={closeModals} className="w-full py-3">Скасувати</Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
