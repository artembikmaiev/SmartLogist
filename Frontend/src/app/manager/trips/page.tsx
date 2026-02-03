"use client";

import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Clock, CheckCircle, Fuel, Truck, MapPin, Search, AlertCircle, Trash, Navigation } from 'lucide-react';
import { tripsService } from '@/services/trips.service';
import StatCard from '@/components/ui/StatCard';
import { useNotifications } from '@/contexts/NotificationContext';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import DataTable, { Column } from '@/components/ui/DataTable';
import Badge from '@/components/ui/Badge';
import ConfirmModal from '@/components/ui/ConfirmModal';
import { CreateTripModal } from '@/components/trips';
import TripDetailsModal from '@/components/trips/TripDetailsModal';
import { formatDate } from '@/lib/utils/date.utils';
import type { Trip } from '@/types/trip.types';

export default function ManagerTripsPage() {
  const { success: notifySuccess, error: notifyError } = useNotifications();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Delete modal state
  const [tripToDelete, setTripToDelete] = useState<number | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [tripsData, statsData] = await Promise.all([
        tripsService.getManagerTrips(),
        tripsService.getManagerStats()
      ]);
      setTrips(tripsData);
      setStats(statsData);
    } catch (err) {
      console.error('Failed to fetch data', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDeleteTrip = (id: number) => {
    setTripToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteTrip = async () => {
    if (!tripToDelete) return;

    setIsDeleting(true);
    try {
      await tripsService.deleteTrip(tripToDelete);
      setIsDeleteModalOpen(false);
      setTripToDelete(null);
      notifySuccess('Запит на видалення відправлено адміністратору');
      await fetchData();
    } catch (err: any) {
      notifyError(err.message || 'Не вдалося видалити рейс');
    } finally {
      setIsDeleting(false);
    }
  };

  const getStatusVariant = (status: string): any => {
    switch (status) {
      case 'Accepted':
      case 'InTransit': return 'info';
      case 'Arrived': return 'purple';
      case 'Completed': return 'success';
      case 'Pending': return 'warning';
      case 'Cancelled':
      case 'Declined': return 'danger';
      default: return 'neutral';
    }
  };

  const statusLabels: Record<string, string> = {
    Pending: 'Очікує',
    Accepted: 'Прийнято',
    InTransit: 'В дорозі',
    Arrived: 'Прибув',
    Completed: 'Завершено',
    Declined: 'Відхилено',
    Cancelled: 'Скасовано'
  };

  const columns: Column<Trip>[] = [
    {
      header: 'ID Рейсу',
      key: 'id',
      render: (trip) => (
        <div className="py-1">
          <p className="text-sm font-black text-slate-900 leading-none">#{trip.id}</p>
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
            <span className="text-[9px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded font-black uppercase tracking-widest border border-blue-100">
              {trip.cargoType}
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
          <Badge variant={getStatusVariant(trip.status)}>
            {statusLabels[trip.status] || trip.status}
          </Badge>
          {trip.hasPendingDeletion && (
            <Badge variant="warning" pulse>
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
          <p className="text-sm font-black text-slate-900">
            {trip.paymentAmount.toLocaleString()} <span className="text-[10px] text-slate-500 ml-0.5">UAH</span>
          </p>
          <p className={`text-[10px] font-black mt-1 ${(trip.expectedProfit || 0) >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
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
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteTrip(trip.id);
            }}
            disabled={trip.hasPendingDeletion}
            className={`${trip.hasPendingDeletion ? 'text-slate-300' : 'text-red-500 hover:bg-red-50'}`}
            title={trip.hasPendingDeletion ? "Запит на видалення вже на розгляді" : "Видалити"}
          >
            <Trash className="w-4 h-4" />
          </Button>
        </div>
      )
    }
  ];

  const filteredTrips = trips.filter(t =>
    t.originCity.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.destinationCity.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (t.driverName && t.driverName.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const totalPages = Math.ceil(filteredTrips.length / pageSize);
  const paginatedTrips = filteredTrips.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl font-bold text-slate-900">Управління рейсами</h1>
          <Button onClick={() => setIsCreateModalOpen(true)} icon={<span className="text-lg">+</span>}>
            Створити рейс
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Активні рейси"
          value={stats?.activeTripsCount || '0'}
          icon={Truck}
          color="blue"
        />
        <StatCard
          title="В очікуванні"
          value={stats?.pendingTripsCount || '0'}
          icon={Clock}
          color="amber"
        />
        <StatCard
          title="Завершено сьогодні"
          value={stats?.completedTripsTodayCount || '0'}
          icon={CheckCircle}
          color="green"
        />
      </div>


      {/* Trips Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-8 pb-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Список рейсів</h2>
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
              <input
                type="text"
                placeholder="Пошук рейсів..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-[300px] pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500/50 transition-all placeholder:text-slate-400"
              />
            </div>
          </div>
        </div>

        <DataTable
          data={paginatedTrips}
          columns={columns}
          isLoading={isLoading}
          emptyMessage="Рейсів не знайдено"
          onRowClick={(trip) => {
            setSelectedTrip(trip);
            setIsDetailsOpen(true);
          }}
          className="border-none shadow-none rounded-none"
          pagination={{
            currentPage,
            totalPages,
            totalItems: filteredTrips.length,
            pageSize,
            onPageChange: setCurrentPage,
            onPageSizeChange: setPageSize,
            label: 'рейсів'
          }}
        />
      </div>

      {/* Details Modal */}
      <TripDetailsModal
        isOpen={isDetailsOpen}
        onClose={() => {
          setIsDetailsOpen(false);
          setSelectedTrip(null);
        }}
        trip={selectedTrip}
        onStatusUpdate={async (id, status, additionalData) => {
          try {
            await tripsService.updateTrip(id, { status, ...additionalData });
            await fetchData();
          } catch (err: any) {
            notifyError(`Не вдалося оновити статус: ${err.message}`);
          }
        }}
        showActions={true}
      />

      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Створити новий рейс"
        maxWidth="7xl"
      >
        <CreateTripModal
          onSuccess={() => {
            setIsCreateModalOpen(false);
            fetchData();
          }}
          onCancel={() => setIsCreateModalOpen(false)}
        />
      </Modal>

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDeleteTrip}
        isLoading={isDeleting}
        title="Видалити рейс?"
        message={
          <>
            Ви впевнені, що хочете видалити рейс <span className="font-bold text-slate-900">#{tripToDelete}</span>?
            <br />
            Це створить запит до адміністратора на розгляд.
          </>
        }
        confirmText="Надіслати запит"
        variant="danger"
      />
    </div>
  );
}
