import { apiClient } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/config/api.config';
import type { LoginCredentials, RegisterData, AuthResponse } from '@/types/auth.types';
import type { ApiResponse } from '@/types/common.types';

export const authService = {
    async login(credentials: LoginCredentials): Promise<AuthResponse> {
        const response = await apiClient.post<ApiResponse<AuthResponse>>(
            API_ENDPOINTS.AUTH.LOGIN,
            credentials
        );

        // Store token in localStorage
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }

        return response.data;
    },

    async register(data: RegisterData): Promise<AuthResponse> {
        const response = await apiClient.post<ApiResponse<AuthResponse>>(
            API_ENDPOINTS.AUTH.REGISTER,
            data
        );

        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }

        return response.data;
    },

    async logout(): Promise<void> {
        await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    async getCurrentUser(): Promise<AuthResponse['user']> {
        const response = await apiClient.get<ApiResponse<AuthResponse['user']>>(
            API_ENDPOINTS.AUTH.ME
        );
        return response.data;
    },

    getStoredUser(): AuthResponse['user'] | null {
        if (typeof window !== 'undefined') {
            const user = localStorage.getItem('user');
            return user ? JSON.parse(user) : null;
        }
        return null;
    },

    getStoredToken(): string | null {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('token');
        }
        return null;
    },
};
