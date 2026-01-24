'use client';

import { useState, useEffect } from 'react';
import { Shield, Users, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { managersService, Manager } from '@/services/managers.service';
import { permissionsService, Permission } from '@/services/permissions.service';

export default function AdminPermissionsPage() {
    const [managers, setManagers] = useState<Manager[]>([]);
    const [selectedManager, setSelectedManager] = useState<Manager | null>(null);
    const [allPermissions, setAllPermissions] = useState<Permission[]>([]);
    const [managerPermissions, setManagerPermissions] = useState<Permission[]>([]);
    const [loading, setLoading] = useState(true);
    const [permissionsLoading, setPermissionsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [actionLoading, setActionLoading] = useState<number | null>(null);

    // Load managers and all permissions on mount
    useEffect(() => {
        loadInitialData();
    }, []);

    // Load manager's permissions when selected manager changes
    useEffect(() => {
        if (selectedManager) {
            loadManagerPermissions(selectedManager.id);
        }
    }, [selectedManager]);

    const loadInitialData = async () => {
        try {
            setLoading(true);
            setError(null);
            const [managersData, permissionsData] = await Promise.all([
                managersService.getAll(),
                permissionsService.getAll()
            ]);
            setManagers(managersData);
            setAllPermissions(permissionsData);

            // Auto-select first manager if available
            if (managersData.length > 0) {
                setSelectedManager(managersData[0]);
            }
        } catch (err) {
            setError('Помилка завантаження даних');
            console.error('Error loading data:', err);
        } finally {
            setLoading(false);
        }
    };

    const loadManagerPermissions = async (managerId: number) => {
        try {
            setPermissionsLoading(true);
            const permissions = await permissionsService.getManagerPermissions(managerId);
            setManagerPermissions(permissions);
        } catch (err) {
            console.error('Error loading manager permissions:', err);
        } finally {
            setPermissionsLoading(false);
        }
    };

    const handleTogglePermission = async (permissionId: number, hasPermission: boolean) => {
        if (!selectedManager) return;

        try {
            setActionLoading(permissionId);

            if (hasPermission) {
                await permissionsService.revokePermission(selectedManager.id, permissionId);
            } else {
                await permissionsService.grantPermission(selectedManager.id, permissionId);
            }

            // Reload manager permissions and managers list
            await Promise.all([
                loadManagerPermissions(selectedManager.id),
                loadInitialData()
            ]);
        } catch (err) {
            console.error('Error toggling permission:', err);
            setError('Помилка зміни дозволу');
        } finally {
            setActionLoading(null);
        }
    };

    const hasPermission = (permissionId: number): boolean => {
        return managerPermissions.some(p => p.id === permissionId);
    };

    // Group permissions by category
    const groupedPermissions = allPermissions.reduce((acc, permission) => {
        if (!acc[permission.category]) {
            acc[permission.category] = [];
        }
        acc[permission.category].push(permission);
        return acc;
    }, {} as Record<string, Permission[]>);

    const categoryNames: Record<string, string> = {
        'trips': 'Рейси',
        'drivers': 'Водії',
        'vehicles': 'Транспорт',
        'analytics': 'Аналітика'
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 text-purple-600 animate-spin mx-auto mb-4" />
                    <p className="text-slate-600">Завантаження...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg">
                            <Shield className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-slate-800">Управління дозволами</h1>
                            <p className="text-slate-600">Налаштування прав доступу для менеджерів</p>
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Managers List */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
                            <div className="p-6 bg-gradient-to-r from-purple-50 to-purple-100 border-b border-purple-200">
                                <div className="flex items-center gap-2">
                                    <Users className="w-5 h-5 text-purple-600" />
                                    <h2 className="text-lg font-semibold text-slate-800">Менеджери</h2>
                                </div>
                                <p className="text-sm text-slate-600 mt-1">Всього: {managers.length}</p>
                            </div>
                            <div className="divide-y divide-slate-100 max-h-[600px] overflow-y-auto">
                                {managers.map((manager) => (
                                    <button
                                        key={manager.id}
                                        onClick={() => setSelectedManager(manager)}
                                        className={`w-full p-4 text-left transition-all ${selectedManager?.id === manager.id
                                            ? 'bg-purple-50 border-l-4 border-purple-600'
                                            : 'hover:bg-slate-50'
                                            }`}
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-slate-800">{manager.fullName}</h3>
                                                <p className="text-sm text-slate-600">{manager.email}</p>
                                                <div className="flex items-center gap-2 mt-2">
                                                    <span className="text-xs text-slate-500">
                                                        {manager.permissions.length} дозволів
                                                    </span>
                                                    <span
                                                        className={`px-2 py-0.5 rounded-full text-xs font-semibold ${manager.isActive
                                                            ? 'bg-green-100 text-green-700'
                                                            : 'bg-orange-100 text-orange-700'
                                                            }`}
                                                    >
                                                        {manager.isActive ? 'Активний' : 'Неактивний'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Permissions Panel */}
                    <div className="lg:col-span-2">
                        {selectedManager ? (
                            <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
                                <div className="p-6 bg-gradient-to-r from-purple-50 to-purple-100 border-b border-purple-200">
                                    <h2 className="text-xl font-semibold text-slate-800 mb-1">
                                        Дозволи для {selectedManager.fullName}
                                    </h2>
                                    <p className="text-sm text-slate-600">{selectedManager.email}</p>
                                    <div className="mt-4 flex items-center gap-4">
                                        <div className="flex items-center gap-2">
                                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                                            <span className="text-sm font-medium text-slate-700">
                                                Активних: {managerPermissions.length}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <XCircle className="w-4 h-4 text-slate-400" />
                                            <span className="text-sm font-medium text-slate-700">
                                                Доступно: {allPermissions.length}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {permissionsLoading ? (
                                    <div className="p-12 text-center">
                                        <Loader2 className="w-8 h-8 text-purple-600 animate-spin mx-auto mb-2" />
                                        <p className="text-slate-600">Завантаження дозволів...</p>
                                    </div>
                                ) : (
                                    <div className="p-6 space-y-6">
                                        {Object.entries(groupedPermissions).map(([category, permissions]) => (
                                            <div key={category} className="space-y-3">
                                                <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                                                    <div className="w-1 h-6 bg-purple-600 rounded-full"></div>
                                                    {categoryNames[category] || category}
                                                </h3>
                                                <div className="space-y-2">
                                                    {permissions.map((permission) => {
                                                        const isGranted = hasPermission(permission.id);
                                                        const isLoading = actionLoading === permission.id;

                                                        return (
                                                            <div
                                                                key={permission.id}
                                                                className={`p-4 rounded-xl border-2 transition-all ${isGranted
                                                                    ? 'bg-green-50 border-green-200'
                                                                    : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                                                                    }`}
                                                            >
                                                                <div className="flex items-start justify-between">
                                                                    <div className="flex-1">
                                                                        <div className="flex items-center gap-2">
                                                                            <h4 className="font-semibold text-slate-800">
                                                                                {permission.name}
                                                                            </h4>
                                                                            {isGranted && (
                                                                                <CheckCircle2 className="w-4 h-4 text-green-600" />
                                                                            )}
                                                                        </div>
                                                                        {permission.description && (
                                                                            <p className="text-sm text-slate-600 mt-1">
                                                                                {permission.description}
                                                                            </p>
                                                                        )}
                                                                    </div>
                                                                    <button
                                                                        onClick={() =>
                                                                            handleTogglePermission(permission.id, isGranted)
                                                                        }
                                                                        disabled={isLoading}
                                                                        className={`ml-4 px-4 py-2 rounded-lg font-semibold transition-all ${isGranted
                                                                            ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                                                            : 'bg-purple-600 text-white hover:bg-purple-700'
                                                                            } disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2`}
                                                                    >
                                                                        {isLoading && (
                                                                            <Loader2 className="w-4 h-4 animate-spin" />
                                                                        )}
                                                                        {isGranted ? 'Відібрати' : 'Надати'}
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-12 text-center">
                                <Shield className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold text-slate-800 mb-2">
                                    Оберіть менеджера
                                </h3>
                                <p className="text-slate-600">
                                    Виберіть менеджера зі списку ліворуч для управління його дозволами
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
