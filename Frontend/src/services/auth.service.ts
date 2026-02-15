// Цей сервіс управляє процесами аутентифікації користувача, включаючи вхід, вихід та збереження даних сесії.
import { apiClient } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/config/api.config';
import type { LoginCredentials, AuthResponse } from '@/types/auth.types';
import type { ApiResponse } from '@/types/common.types';

export const authService = {
    async login(credentials: LoginCredentials): Promise<AuthResponse> {
        const response = await apiClient.post<AuthResponse>(
            API_ENDPOINTS.AUTH.LOGIN,
            credentials
        );

        // Зберегти токен у sessionStorage
        if (response.token) {
            sessionStorage.setItem('token', response.token);
            sessionStorage.setItem('user', JSON.stringify(response.user));
        }

        return response;
    },

    async logout(): Promise<void> {
        await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');
    },

    async getCurrentUser(): Promise<AuthResponse['user']> {
        const response = await apiClient.get<AuthResponse['user']>(
            API_ENDPOINTS.AUTH.ME
        );

        // Синхронізувати sessionStorage зі свіжими даними із сервера
        if (typeof window !== 'undefined') {
            sessionStorage.setItem('user', JSON.stringify(response));
        }

        return response;
    },

    async updateProfile(data: { fullName: string; email: string; phone?: string }): Promise<void> {
        await apiClient.put(API_ENDPOINTS.AUTH.PROFILE, data);

        // Оновити збережені дані користувача
        const currentUser = this.getStoredUser();
        if (currentUser) {
            const updatedUser = { ...currentUser, ...data };
            sessionStorage.setItem('user', JSON.stringify(updatedUser));
        }
    },

    getStoredUser(): AuthResponse['user'] | null {
        if (typeof window !== 'undefined') {
            const user = sessionStorage.getItem('user');
            return user ? JSON.parse(user) : null;
        }
        return null;
    },

    getStoredToken(): string | null {
        if (typeof window !== 'undefined') {
            return sessionStorage.getItem('token');
        }
        return null;
    },
};
