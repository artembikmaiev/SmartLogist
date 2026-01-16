export interface AnalyticsStats {
    activeTrips: {
        value: number;
        change: number;
        total: number;
    };
    activeDrivers: {
        value: number;
        change: number;
        total: number;
    };
    activeVehicles: {
        value: number;
        utilizationRate: number;
    };
    totalDistance: {
        value: number;
        change: number;
        period: string;
    };
    averageTripCost: {
        value: number;
        change: number;
    };
    fleetEfficiency: {
        value: number;
        status: 'excellent' | 'good' | 'average' | 'poor';
    };
    onTimeDelivery: {
        value: number;
        completed: number;
        total: number;
    };
}

export interface FuelConsumptionData {
    month: string;
    consumption: number;
    cost: number;
}

export interface CostAnalysisData {
    category: string;
    amount: number;
    percentage: number;
}
