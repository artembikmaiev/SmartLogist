// Application Routes
export const ROUTES = {
    HOME: '/',

    // Auth
    AUTH: {
        MANAGER: '/auth/manager',
        DRIVER: '/auth/driver',
    },

    // Manager
    MANAGER: {
        HOME: '/manager',
        TRIPS: '/manager/trips',
        DRIVERS: '/manager/drivers',
        VEHICLES: '/manager/vehicles',
        ANALYTICS: '/manager/analytics',
    },

    // Driver
    DRIVER: {
        HOME: '/driver',
        TRIPS: '/driver/trips',
        PROFILE: '/driver/profile',
    },
} as const;
