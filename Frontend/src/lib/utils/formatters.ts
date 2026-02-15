// Утиліти для форматування дат
export const formatDate = (date: string | Date): string => {
    const d = new Date(date);
    return d.toLocaleDateString('uk-UA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
};

export const formatDateTime = (date: string | Date): string => {
    const d = new Date(date);
    return d.toLocaleString('uk-UA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

export const formatTime = (date: string | Date): string => {
    const d = new Date(date);
    return d.toLocaleTimeString('uk-UA', {
        hour: '2-digit',
        minute: '2-digit',
    });
};

// Форматування валюти
export const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('uk-UA', {
        style: 'currency',
        currency: 'UAH',
        minimumFractionDigits: 0,
    }).format(amount);
};

// Форматування відстані
export const formatDistance = (km: number): string => {
    if (km < 1) {
        return `${Math.round(km * 1000)} м`;
    }
    return `${km.toFixed(1)} км`;
};

// Форматування тривалості
export const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    if (hours === 0) {
        return `${mins} хв`;
    }

    if (mins === 0) {
        return `${hours} год`;
    }

    return `${hours} год ${mins} хв`;
};

// Форматування чисел
export const formatNumber = (num: number): string => {
    return new Intl.NumberFormat('uk-UA').format(num);
};

// Форматування відсотків
export const formatPercentage = (value: number, decimals: number = 1): string => {
    return `${value.toFixed(decimals)}%`;
};
