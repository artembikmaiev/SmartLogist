export enum VehicleStatus {
    Available = 'Available',
    InUse = 'InUse',
    Maintenance = 'Maintenance',
    Inactive = 'Inactive'
}

export interface Vehicle {
    id: number;
    model: string;
    licensePlate: string;
    type: string;
    fuelType: string;
    fuelConsumption: number;
    status: VehicleStatus;
    createdAt: string;
    assignedDriverName?: string;
    assignedDriverId?: number;
    hasPendingDeletion: boolean;
    hasPendingUpdate: boolean;
}

export interface CreateVehicleDto {
    model: string;
    licensePlate: string;
    type: string;
    fuelType: string;
    fuelConsumption: number;
    status: VehicleStatus;
}

export interface UpdateVehicleDto {
    model: string;
    licensePlate: string;
    type: string;
    fuelType: string;
    fuelConsumption: number;
    status: VehicleStatus;
}

export interface AssignVehicleDto {
    driverId: number;
    isPrimary: boolean;
}

export interface VehicleStats {
    totalVehicles: number;
    addedThisMonth: number;
    inUseCount: number;
    availableCount: number;
    maintenanceCount: number;
}
