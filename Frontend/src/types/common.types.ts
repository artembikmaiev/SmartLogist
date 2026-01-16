// Common types used across the application
export interface User {
    id: string;
    email: string;
    name: string;
    role: 'manager' | 'driver';
}

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
