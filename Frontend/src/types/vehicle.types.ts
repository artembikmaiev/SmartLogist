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
    height: number;
    width: number;
    length: number;
    weight: number;
    isHazardous: boolean;
    status: VehicleStatus;
    createdAt: string;
    assignedDriverName?: string;
    assignedDriverId?: number;
    hasPendingDeletion: boolean;
    hasPendingUpdate: boolean;
    totalMileage: number;
    mileageAtLastMaintenance: number;
    kmUntilMaintenance: number;
}

export interface CreateVehicleDto {
    model: string;
    licensePlate: string;
    type: string;
    fuelType: string;
    fuelConsumption: number;
    height: number;
    width: number;
    length: number;
    weight: number;
    isHazardous: boolean;
    status: VehicleStatus;
    totalMileage: number;
    mileageAtLastMaintenance: number;
}

export interface UpdateVehicleDto {
    model: string;
    licensePlate: string;
    type: string;
    fuelType: string;
    fuelConsumption: number;
    height: number;
    width: number;
    length: number;
    weight: number;
    isHazardous: boolean;
    status: VehicleStatus;
    totalMileage: number;
    mileageAtLastMaintenance: number;
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
