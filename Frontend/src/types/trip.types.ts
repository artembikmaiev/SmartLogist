export interface Trip {
    id: number;
    originCity: string;
    originAddress: string;
    destinationCity: string;
    destinationAddress: string;
    scheduledDeparture: string;
    scheduledArrival: string;
    actualDeparture?: string;
    actualArrival?: string;
    paymentAmount: number;
    currency: string;
    distanceKm: number;
    status: string;
    notes?: string;
    managerId: number;
    managerName: string;
    driverId: number;
    driverName?: string;
    vehicleId?: number;
    vehicleModel?: string;
    vehicleLicensePlate?: string;

    // ETS info
    cargoName?: string;
    cargoType?: string;
    cargoWeight?: number;
    expectedProfit?: number;
    estimatedFuelCost?: number;
    routeGeometry?: string;
    hasPendingDeletion?: boolean;
    driverEarnings?: number;
    actualFuelConsumption?: number;
    rating?: number;
    managerReview?: string;
}

export interface DriverStatsSummary {
    currentTripsCount: number;
    completedTripsCount: number;
    totalDistance: number;
    totalEarnings: number;
    earningsSubtitle: string;
}

export interface CreateTripDto {
    originCity: string;
    originAddress: string;
    destinationCity: string;
    destinationAddress: string;
    scheduledDeparture: string;
    scheduledArrival: string;
    paymentAmount: number;
    currency: string;
    distanceKm: number;
    driverId: number;
    vehicleId?: number;
    notes?: string;

    // ETS info
    cargoName: string;
    cargoType: number;
    cargoWeight: number;
    expectedProfit: number;
    estimatedFuelCost: number;
    routeGeometry: string;
}

export interface UpdateTripDto extends Partial<CreateTripDto> {
    status?: string;
    actualFuelConsumption?: number;
    rating?: number;
    managerReview?: string;
}
