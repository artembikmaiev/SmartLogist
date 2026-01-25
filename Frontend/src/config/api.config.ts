// API Configuration
export const API_CONFIG = {
    BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5094/api',
    TIMEOUT: 30000,
    HEADERS: {
        'Content-Type': 'application/json',
    },
};

// API Endpoints
export const API_ENDPOINTS = {
    AUTH: {
        LOGIN: '/auth/login',
        REGISTER: '/auth/register',
        LOGOUT: '/auth/logout',
        REFRESH: '/auth/refresh',
        ME: '/auth/me',
    },
    TRIPS: {
        BASE: '/trips',
        BY_ID: (id: string) => `/trips/${id}`,
        STATS: '/trips/stats',
    },
    DRIVERS: {
        LIST: '/drivers',
        BASE: '/drivers',
        BY_ID: (id: string) => `/drivers/${id}`,
        STATS: '/drivers/stats',
    },
    VEHICLES: {
        LIST: '/vehicles',
        BASE: '/vehicles',
        BY_ID: (id: string | number) => `/vehicles/${id}`,
        STATS: '/vehicles/stats',
        ASSIGN: (id: string | number) => `/vehicles/${id}/assign`,
        UNASSIGN: (id: string | number, driverId: string | number) => `/vehicles/${id}/unassign/${driverId}`,
    },
    ANALYTICS: {
        STATS: '/analytics/stats',
        FUEL: '/analytics/fuel',
        COSTS: '/analytics/costs',
    },
};
