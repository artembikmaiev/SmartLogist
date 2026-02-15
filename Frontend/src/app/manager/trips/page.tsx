'use client';

// Сторінка менеджера для моніторингу та управління рейсами, призначеними йому для контролю.
import { useState } from 'react';
import { Clock, CheckCircle, Truck, Search, Trash } from 'lucide-react';
import StatCard from '@/components/ui/StatCard';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import DataTable, { Column } from '@/components/ui/DataTable';
import Badge from '@/components/ui/Badge';
import ConfirmModal from '@/components/ui/ConfirmModal';
import { CreateTripModal } from '@/components/trips';
import TripDetailsModal from '@/components/trips/TripDetailsModal';
import { formatDate } from '@/lib/utils/date.utils';
import { TRIP_STATUS_LABELS, TRIP_STATUS_VARIANTS, CARGO_TYPE_LABELS } from '@/lib/constants/trip.constants';
import { useTrips } from '@/hooks/useTrips';
import type { Trip } from '@/types/trip.types';
import { AccessDenied } from '@/components/ui/AccessDenied';

export default function ManagerTripsPage() {
  const {
    paginatedData,
    isLoading,
    searchQuery,
    setSearchQuery,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    totalPages,
    totalItems,
    stats,
    handleDelete,
    showDeleteModal,
    setShowDeleteModal,
    selectedItem,
    setSelectedItem,
    loadData,
    updateTripStatus,
    isSubmitting,
    permissions
  } = useTrips('manager');

  // Need to import AccessDenied and use it, but useTrips does not expose permissions directly?
  // Checking useTrips hook implementation might be needed if I don't see permissions here.
  // Wait, I don't see permissions in the destructured object.
  // I will check useTrips hook first.

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const columns: Column<Trip>[] = [
    {
      header: 'ID Рейсу',
      key: 'id',
      render: (trip) => (
        <div className="py-1">
          <p className="text-sm font-bold text-slate-900 leading-none">#{trip.id}</p>
          <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-tighter">
            {formatDate(trip.scheduledDeparture).split(',')[0]} о {formatDate(trip.scheduledDeparture).split(',')[1]?.trim()}
          </p>
        </div>
      )
    },
    {
      header: 'Маршрут',
      key: 'originCity',
      render: (trip) => (
        <div className="py-1">
          <p className="text-sm font-bold text-slate-900">
            {trip.originCity} <span className="text-slate-400 mx-1">→</span> {trip.destinationCity}
          </p>
          <p className="text-[10px] font-medium text-slate-500 mt-1 line-clamp-1 max-w-[200px]">
            {trip.originAddress}
          </p>
        </div>
      )
    },
    {
      header: 'Вантаж',
      key: 'cargoName',
      render: (trip) => (
        <div className="py-1">
          <p className="text-sm font-bold text-slate-900">{trip.cargoName || '—'}</p>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="text-[9px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded font-bold uppercase tracking-widest border border-blue-100">
              {CARGO_TYPE_LABELS[parseInt(trip.cargoType as unknown as string)] || trip.cargoType}
            </span>
            <span className="text-[10px] text-slate-400 font-bold">
              {trip.cargoWeight} т
            </span>
          </div>
        </div>
      )
    },
    {
      header: 'Водій',
      key: 'driverName',
      render: (trip) => (
        <div className="py-1">
          <p className="text-sm font-bold text-slate-900">{trip.driverName || 'Не призначено'}</p>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{trip.vehicleModel || 'MAN'}</p>
        </div>
      )
    },
    {
      header: 'Статус',
      key: 'status',
      render: (trip) => (
        <div className="flex flex-col gap-1 py-1">
          <Badge variant={TRIP_STATUS_VARIANTS[trip.status] || 'neutral'}>
            {TRIP_STATUS_LABELS[trip.status] || trip.status}
          </Badge>
          {trip.hasPendingDeletion && (
            <Badge variant="error" pulse>
              <Trash className="w-2.5 h-2.5 mr-1" />
              Запит на видалення
            </Badge>
          )}
        </div>
      )
    },
    {
      header: 'Вартість',
      key: 'paymentAmount',
      render: (trip) => (
        <div className="text-right py-1">
          <p className="text-sm font-bold text-slate-900">
            {trip.paymentAmount.toLocaleString()} <span className="text-[10px] text-slate-500 ml-0.5">UAH</span>
          </p>
          <p className={`text-[10px] font-bold mt-1 ${(trip.expectedProfit || 0) >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
            Прибуток: {trip.expectedProfit?.toLocaleString() || 0} ₴
          </p>
        </div>
      )
    },
    {
      header: 'Дії',
      key: 'actions',
      render: (trip) => (
        <div className="flex justify-end items-center py-1">
          {permissions?.delete && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedItem(trip);
                setShowDeleteModal(true);
              }}
              disabled={trip.hasPendingDeletion}
              className={`${trip.hasPendingDeletion ? 'text-slate-300' : 'text-red-500 hover:bg-red-50'}`}
              title={trip.hasPendingDeletion ? "Запит на видалення вже на розгляді" : "Видалити"}
            >
              <Trash className="w-4 h-4" />
            </Button>
          )}
        </div>
      )
    }
  ];

  if (permissions && !permissions.view && !isLoading) {
    return <AccessDenied resourceName="перегляд списку рейсів" />;
  }

  return (
    <div className="p-8 bg-slate-50 min-h-screen animate-in fade-in duration-500">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Управління рейсами</h1>
        {permissions?.create && (
          <Button onClick={() => setIsCreateOpen(true)} icon={<span className="text-lg">+</span>}>
            Створити рейс
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatCard title="Активні рейси" value={stats?.activeTripsCount || '0'} icon={Truck} color="blue" />
        <StatCard title="В очікуванні" value={stats?.pendingTripsCount || '0'} icon={Clock} color="amber" />
        <StatCard title="Завершено сьогодні" value={stats?.completedTripsTodayCount || '0'} icon={CheckCircle} color="green" />
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-8 pb-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Список рейсів</h2>
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
            <input
              type="text"
              placeholder="Пошук рейсів..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-[300px] pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500/50 transition-all font-bold"
            />
          </div>
        </div>

        <DataTable
          data={paginatedData}
          columns={columns}
          isLoading={isLoading}
          onRowClick={(trip) => {
            setSelectedItem(trip);
            setIsDetailsOpen(true);
          }}
          pagination={{
            currentPage,
            totalPages,
            totalItems,
            pageSize,
            onPageChange: setCurrentPage,
            onPageSizeChange: setPageSize,
            label: 'рейсів'
          }}
          className="border-none shadow-none rounded-none"
        />
      </div>

      <TripDetailsModal
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        trip={selectedItem}
        onStatusUpdate={updateTripStatus}
        showActions={true}
      />

      <Modal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} title="Створити новий рейс" maxWidth="7xl">
        <CreateTripModal onSuccess={() => { setIsCreateOpen(false); loadData(); }} onCancel={() => setIsCreateOpen(false)} />
      </Modal>

      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        isLoading={isSubmitting}
        title="Видалити рейс?"
        message={<>Ви впевнені, що хочете видалити рейс <span className="font-bold">#{selectedItem?.id}</span>?</>}
        variant="danger"
        confirmText="Надіслати запит"
      />
    </div>
  );
}
