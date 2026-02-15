// Цей файл описує структуру даних для записів про активність користувачів у системі.
export interface ActivityLog {
    id: number;
    action: string;
    details?: string;
    entityType?: string;
    entityId?: string;
    createdAt: string;
}
