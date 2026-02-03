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

export interface Permission {
    id: number;
    code: string;
    name: string;
    description?: string;
    category?: string;
}

export interface AuthState {
    user: AuthResponse['user'] | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
}
