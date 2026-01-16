// Email validation
export const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// Phone validation (Ukrainian format)
export const isValidPhone = (phone: string): boolean => {
    const phoneRegex = /^\+380\d{9}$/;
    return phoneRegex.test(phone);
};

// Password validation
export const isValidPassword = (password: string): boolean => {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
};

// License plate validation (Ukrainian format)
export const isValidLicensePlate = (plate: string): boolean => {
    const plateRegex = /^[A-Z]{2}\s?\d{4}\s?[A-Z]{2}$/;
    return plateRegex.test(plate);
};

// Required field validation
export const isRequired = (value: string | number | null | undefined): boolean => {
    if (value === null || value === undefined) return false;
    if (typeof value === 'string') return value.trim().length > 0;
    return true;
};

// Min length validation
export const minLength = (value: string, min: number): boolean => {
    return value.length >= min;
};

// Max length validation
export const maxLength = (value: string, max: number): boolean => {
    return value.length <= max;
};

// Number range validation
export const inRange = (value: number, min: number, max: number): boolean => {
    return value >= min && value <= max;
};
