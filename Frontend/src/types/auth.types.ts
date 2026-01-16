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
        id: string;
        email: string;
        name: string;
        role: 'manager' | 'driver';
    };
    token: string;
    refreshToken: string;
}

export interface AuthState {
    user: AuthResponse['user'] | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
}
