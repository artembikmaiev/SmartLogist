// Цей файл містить визначення типів для аналітичних звітів, графіків та статистичних даних.
export interface AnalyticsSummary {
    totalRevenue: number;
    totalProfit: number;
    totalDistance: number;
    totalTrips: number;
    averageRating: number;
    fuelSpend: number;
    avgFuelEfficiency: number;
    profitMargin: number;
}

export interface MonthlyTrend {
    month: string;
    revenue: number;
    profit: number;
    tripCount: number;
}

export interface DriverPerformance {
    driverId: number;
    fullName: string;
    efficiencyScore: number;
    avgRating: number;
    completedTrips: number;
    totalProfitGenerated: number;
}

export interface CargoTypeAnalytics {
    cargoType: string;
    count: number;
    totalProfit: number;
    averageWeight: number;
}
