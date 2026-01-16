// App-wide constants

// Status colors
export const STATUS_COLORS = {
    active: 'bg-blue-100 text-blue-700',
    pending: 'bg-orange-100 text-orange-700',
    completed: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
    available: 'bg-blue-100 text-blue-700',
    'on-route': 'bg-green-100 text-green-700',
    busy: 'bg-orange-100 text-orange-700',
    offline: 'bg-slate-100 text-slate-700',
    'in-route': 'bg-green-100 text-green-700',
    maintenance: 'bg-orange-100 text-orange-700',
} as const;

// Pagination
export const DEFAULT_PAGE_SIZE = 10;
export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

// Date formats
export const DATE_FORMAT = 'dd.MM.yyyy';
export const DATETIME_FORMAT = 'dd.MM.yyyy HH:mm';
export const TIME_FORMAT = 'HH:mm';

// Fuel types
export const FUEL_TYPES = ['diesel', 'petrol', 'electric'] as const;

// Vehicle types
export const VEHICLE_TYPES = ['truck', 'van', 'car'] as const;

// User roles
export const USER_ROLES = ['manager', 'driver'] as const;

// Trip statuses
export const TRIP_STATUSES = ['active', 'pending', 'completed', 'cancelled'] as const;

// Driver statuses
export const DRIVER_STATUSES = ['available', 'on-route', 'busy', 'offline'] as const;

// Vehicle statuses
export const VEHICLE_STATUSES = ['available', 'in-route', 'maintenance'] as const;
