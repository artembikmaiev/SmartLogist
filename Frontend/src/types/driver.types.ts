export interface Driver {
    id: string;
    name: string;
    email: string;
    phone: string;
    avatar?: string;
    status: 'available' | 'on-route' | 'busy' | 'offline';
    vehicle?: {
        id: string;
        model: string;
        plate: string;
    };
    rating: number;
    totalTrips: number;
    reviews: number;
    createdAt: string;
}

export interface CreateDriverDto {
    name: string;
    email: string;
    phone: string;
    licenseNumber: string;
}

export interface UpdateDriverDto extends Partial<CreateDriverDto> {
    status?: Driver['status'];
    vehicleId?: string;
}
