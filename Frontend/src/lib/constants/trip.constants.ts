export const TRIP_STATUS_LABELS: Record<string, string> = {
    Pending: 'Очікує',
    Accepted: 'Прийнято',
    InTransit: 'В дорозі',
    Arrived: 'Прибув',
    Completed: 'Завершено',
    Declined: 'Відхилено',
    Cancelled: 'Скасовано'
};

export const TRIP_STATUS_VARIANTS: Record<string, 'info' | 'purple' | 'success' | 'warning' | 'danger' | 'neutral'> = {
    Accepted: 'info',
    InTransit: 'info',
    Arrived: 'purple',
    Completed: 'success',
    Pending: 'warning',
    Cancelled: 'danger',
    Declined: 'danger'
};

export const CARGO_TYPE_LABELS: Record<number, string> = {
    0: 'Стандартний',
    1: 'Крихкий',
    2: 'Небезпечний',
    3: 'Швидкопсувний',
    4: 'Великогабаритний'
};
