import { Status, Coordinates } from './common.types';

export interface Trip {
    id: string;
    date: string;
    route: {
        from: string;
        to: string;
        points: RoutePoint[];
    };
    driver: {
        id: string;
        name: string;
        avatar: string;
        vehicle: string;
    };
    status: Status;
    cost: number;
    distance: number;
    duration: number;
    fuelConsumption: number;
    createdAt: string;
    updatedAt: string;
}

export interface RoutePoint {
    id: string;
    address: string;
    coordinates: Coordinates;
    order: number;
    type: 'pickup' | 'delivery' | 'waypoint';
}

export interface CreateTripDto {
    route: {
        from: string;
        to: string;
        points: Omit<RoutePoint, 'id'>[];
    };
    driverId: string;
    vehicleId: string;
    scheduledDate: string;
}

export interface UpdateTripDto extends Partial<CreateTripDto> {
    status?: Status;
}
