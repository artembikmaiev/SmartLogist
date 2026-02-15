// Цей файл містить налаштований клієнт для здійснення HTTP-запитів до API з автоматичною обробкою токенів.
import { API_CONFIG } from '@/config/api.config';

class ApiClient {
    private baseURL: string;
    private headers: Record<string, string>;

    constructor() {
        this.baseURL = API_CONFIG.BASE_URL;
        this.headers = { ...API_CONFIG.HEADERS };
    }

    private getAuthToken(): string | null {
        if (typeof window !== 'undefined') {
            return sessionStorage.getItem('token');
        }
        return null;
    }

    private async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<T> {
        const token = this.getAuthToken();
        const headers = {
            ...this.headers,
            ...(token && { Authorization: `Bearer ${token}` }),
            ...options.headers,
        };

        const config: RequestInit = {
            ...options,
            headers,
        };

        try {
            const response = await fetch(`${this.baseURL}${endpoint}`, config);

            if (!response.ok) {
                // Спочатку прочитайте текст відповіді
                const responseText = await response.text();
                let errorMessage = `HTTP ${response.status}: ${response.statusText}`;

                // Спробуйте розпарсити як JSON
                if (responseText) {
                    try {
                        const errorData = JSON.parse(responseText);
                        errorMessage = errorData.message || errorData.Message || responseText;
                    } catch {
                        // Якщо це не JSON, використовуйте текст безпосередньо
                        errorMessage = responseText;
                    }
                }

                throw new Error(errorMessage);
            }

            // Обробка відповідей 204 No Content
            if (response.status === 204 || response.headers.get('content-length') === '0') {
                return undefined as T;
            }

            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    async get<T>(endpoint: string): Promise<T> {
        return this.request<T>(endpoint, { method: 'GET' });
    }

    async post<T>(endpoint: string, data?: unknown): Promise<T> {
        return this.request<T>(endpoint, {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async put<T>(endpoint: string, data?: unknown): Promise<T> {
        return this.request<T>(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    async delete<T>(endpoint: string): Promise<T> {
        return this.request<T>(endpoint, { method: 'DELETE' });
    }

    async patch<T>(endpoint: string, data?: unknown): Promise<T> {
        return this.request<T>(endpoint, {
            method: 'PATCH',
            body: JSON.stringify(data),
        });
    }
}

export const apiClient = new ApiClient();
