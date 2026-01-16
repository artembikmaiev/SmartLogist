export interface Vehicle {
    id: string;
    model: string;
    plate: string;
    type: 'truck' | 'van' | 'car';
    fuel: 'diesel' | 'petrol' | 'electric';
    fuelConsumption: number; // liters per 100km
    status: 'available' | 'in-route' | 'maintenance';
    driver?: {
        id: string;
        name: string;
    };
    capacity: {
        weight: number; // kg
        volume: number; // m³
    };
    year: number;
    createdAt: string;
}

export interface CreateVehicleDto {
    model: string;
    plate: string;
    type: Vehicle['type'];
    fuel: Vehicle['fuel'];
    fuelConsumption: number;
    capacity: Vehicle['capacity'];
    year: number;
}

export interface UpdateVehicleDto extends Partial<CreateVehicleDto> {
    status?: Vehicle['status'];
    driverId?: string;
}
