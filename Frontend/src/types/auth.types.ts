export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterData extends LoginCredentials {
    name: string;
    role: 'manager' | 'driver';
}

export interface AuthResponse {
    user: {
        id: number;
        email: string;
        fullName: string;
        phone?: string;
        role: 'admin' | 'manager' | 'driver';
        licenseNumber?: string;
        status?: string;
        assignedVehicle?: {
            vehicleId: number;
            model: string;
            licensePlate: string;
            kmUntilMaintenance: number;
        };
        createdAt: string;
        permissions?: Permission[];
    };
    token: string;
}

import { Permission } from './common.types';

export interface AuthState {
    user: AuthResponse['user'] | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
}
