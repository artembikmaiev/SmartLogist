/**
 * Utility for consistent date formatting across the application.
 * Handles UTC-to-Local conversion by ensuring 'Z' suffix.
 */
export const formatDate = (dateString: string | undefined, options?: Intl.DateTimeFormatOptions): string => {
    if (!dateString) return '—';

    let normalizedDate = dateString;
    if (!normalizedDate.endsWith('Z') && !normalizedDate.includes('+')) {
        normalizedDate += 'Z';
    }

    const date = new Date(normalizedDate);
    if (isNaN(date.getTime())) return dateString;

    if (options) {
        return date.toLocaleDateString('uk-UA', options);
    }

    return `${date.toLocaleDateString()} o ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
};

export const formatDateTime = (dateString: string | undefined): string => {
    if (!dateString) return '—';

    let normalizedDate = dateString;
    if (!normalizedDate.endsWith('Z') && !normalizedDate.includes('+')) {
        normalizedDate += 'Z';
    }

    return new Date(normalizedDate).toLocaleString();
};
