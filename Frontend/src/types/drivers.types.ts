export interface Driver {
    id: number;
    email: string;
    fullName: string;
    phone?: string;
    licenseNumber?: string;
    status: DriverStatus;
    isActive: boolean;
    managerId?: number;
    managerName?: string;
    assignedVehicle?: AssignedVehicle;
    createdAt: string;
    totalTrips: number;
    rating?: number;
    hasPendingDeletion: boolean;
    hasPendingUpdate: boolean;
}

export interface AssignedVehicle {
    vehicleId: number;
    model: string;
    licensePlate: string;
    isPrimary: boolean;
}

export interface CreateDriverData {
    email: string;
    fullName: string;
    password: string;
    phone?: string;
    licenseNumber?: string;
}

export interface UpdateDriverData {
    fullName: string;
    phone?: string;
    licenseNumber?: string;
    status: DriverStatus;
    isActive: boolean;
}

export interface DriverStats {
    totalDrivers: number;
    availableDrivers: number;
    onTripDrivers: number;
    offlineDrivers: number;
}

// Цей файл містить описи інтерфейсів для водіїв, їхньої статистики та станів доступності.
export enum DriverStatus {
    Available = 'Available',
    OnTrip = 'OnTrip',
    Offline = 'Offline',
    OnBreak = 'OnBreak'
}

export const DriverStatusLabels: Record<DriverStatus, string> = {
    [DriverStatus.Available]: 'Вільний',
    [DriverStatus.OnTrip]: 'На маршруті',
    [DriverStatus.Offline]: 'Офлайн',
    [DriverStatus.OnBreak]: 'На перерві'
};
