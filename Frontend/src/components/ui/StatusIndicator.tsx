import React from 'react';
import Badge from './Badge';

interface StatusIndicatorProps {
    status: string | number;
    type: 'driver' | 'vehicle';
}

const StatusIndicator: React.FC<StatusIndicatorProps> = ({ status, type }) => {
    const s = String(status);

    const driverStatuses: Record<string, { label: string; variant: any }> = {
        '1': { label: 'Доступний', variant: 'success' },
        'Available': { label: 'Доступний', variant: 'success' },
        '2': { label: 'На рейсі', variant: 'info' },
        'OnTrip': { label: 'На рейсі', variant: 'info' },
        '3': { label: 'Офлайн', variant: 'neutral' },
        'Offline': { label: 'Офлайн', variant: 'neutral' },
        '4': { label: 'Перерва', variant: 'warning' },
        'OnBreak': { label: 'Перерва', variant: 'warning' }
    };

    const vehicleStatuses: Record<string, { label: string; variant: any }> = {
        '1': { label: 'Доступний', variant: 'success' },
        'Available': { label: 'Доступний', variant: 'success' },
        '2': { label: 'В дорозі', variant: 'info' },
        'InUse': { label: 'В дорозі', variant: 'info' },
        '3': { label: 'Обслуговування', variant: 'warning' },
        'Maintenance': { label: 'Обслуговування', variant: 'warning' },
        '4': { label: 'Неактивний', variant: 'neutral' },
        'Inactive': { label: 'Неактивний', variant: 'neutral' },
        'Pending': { label: 'Очікує', variant: 'warning' }
    };

    const config = type === 'driver' ? driverStatuses[s] : vehicleStatuses[s];

    if (!config) return <Badge>{s}</Badge>;

    return <Badge variant={config.variant}>{config.label}</Badge>;
};

export default StatusIndicator;
