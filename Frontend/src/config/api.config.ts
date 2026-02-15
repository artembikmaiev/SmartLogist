// Цей файл містить основні налаштування API та шляхи до кінцевих точок для всього фронтенд-додатка.
// API Configuration
export const API_CONFIG = {
    BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5094/api',
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
        PROFILE: '/auth/profile',
    },
    TRIPS: {
        BASE: '/trips',
        BY_ID: (id: string | number) => `/trips/${id}`,
        MY: '/trips/my',
        DRIVER_STATS: '/trips/driver-stats',
        MANAGER: '/trips/manager',
        MANAGER_STATS: '/trips/manager-stats',
        ACCEPT: (id: number) => `/trips/${id}/accept`,
        DECLINE: (id: number) => `/trips/${id}/decline`,
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
        SUMMARY: '/analytics/summary',
        TRENDS: '/analytics/trends',
        DRIVERS: '/analytics/drivers',
        CARGO: '/analytics/cargo',
    },
    ACTIVITIES: {
        RECENT: '/activity-logs/recent',
    },
    EXTERNAL: {
        CURRENCY: '/external/currency',
    },
    ROADS: {
        ROUTE: '/roads/route',
        CONDITIONS: '/roads/conditions',
    },
};
