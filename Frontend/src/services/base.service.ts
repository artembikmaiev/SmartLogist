import { apiClient } from '@/lib/api/client';

export class BaseApiService<T, TCreate = any, TUpdate = any> {
    constructor(protected readonly endpoint: string) { }

    getAll = async (): Promise<T[]> => {
        return apiClient.get<T[]>(this.endpoint);
    };

    getById = async (id: number | string): Promise<T> => {
        return apiClient.get<T>(`${this.endpoint}/${id}`);
    };

    create = async (data: TCreate): Promise<T> => {
        return apiClient.post<T>(this.endpoint, data);
    };

    update = async (id: number | string, data: TUpdate): Promise<T> => {
        return apiClient.put<T>(`${this.endpoint}/${id}`, data);
    };

    delete = async (id: number | string): Promise<void> => {
        return apiClient.delete<void>(`${this.endpoint}/${id}`);
    };
}
