export const TRIP_STATUS_LABELS: Record<string, string> = {
    Pending: 'Очікує',
    Accepted: 'Прийнято',
    InTransit: 'В дорозі',
    Arrived: 'Прибув',
    Completed: 'Завершено',
    Declined: 'Відхилено',
    Cancelled: 'Скасовано'
};

export const TRIP_STATUS_VARIANTS: Record<string, 'info' | 'purple' | 'success' | 'warning' | 'error' | 'neutral'> = {
    Accepted: 'info',
    InTransit: 'info',
    Arrived: 'purple',
    Completed: 'success',
    Pending: 'warning',
    Cancelled: 'error',
    Declined: 'error'
};

export const CARGO_TYPE_LABELS: Record<number, string> = {
    0: 'Стандартний',
    1: 'Крихкий',
    2: 'Небезпечний',
    3: 'Швидкопсувний', // Refrigerated
    4: 'Терміновий',     // Urgent
    5: 'Великогабаритний' // Heavy
};
