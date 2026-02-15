// Загальні типи, що використовуються в усьому додатку
export interface User {
    id: string;
    email: string;
    name: string;
    role: 'manager' | 'driver';
}

// Цей файл визначає загальні типи та структури даних, що використовуються в декількох модулях фронтенд-додатка.
export interface ApiResponse<T> {
    data: T;
    message?: string;
    success: boolean;
}

export interface PaginationParams {
    page: number;
    limit: number;
}

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    totalPages: number;
}

export type Status = 'active' | 'pending' | 'completed' | 'cancelled';

export interface Coordinates {
    lat: number;
    lng: number;
}

export interface Permission {
    id: number;
    code: string;
    name: string;
    description: string | null;
    category: string;
}
