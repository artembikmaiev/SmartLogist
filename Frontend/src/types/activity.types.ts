export interface ActivityLog {
    id: number;
    action: string;
    details?: string;
    entityType?: string;
    entityId?: string;
    createdAt: string;
}
