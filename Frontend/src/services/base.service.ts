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

    protected get = async <R = any>(url: string): Promise<R> => {
        return apiClient.get<R>(url);
    };

    protected post = async <R = any>(url: string, data: any): Promise<R> => {
        return apiClient.post<R>(url, data);
    };

    protected put = async <R = any>(url: string, data: any): Promise<R> => {
        return apiClient.put<R>(url, data);
    };

    protected patch = async <R = any>(url: string, data: any): Promise<R> => {
        return apiClient.patch<R>(url, data);
    };
}
