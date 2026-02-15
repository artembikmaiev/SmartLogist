// Валідація електронної пошти
export const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// Валідація телефону (український формат)
export const isValidPhone = (phone: string): boolean => {
    const phoneRegex = /^\+380\d{9}$/;
    return phoneRegex.test(phone);
};

// Валідація пароля
export const isValidPassword = (password: string): boolean => {
    // Принаймні 8 символів, 1 велика літера, 1 мала літера, 1 цифра
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
};

// Валідація номерного знака (український формат)
export const isValidLicensePlate = (plate: string): boolean => {
    const plateRegex = /^[A-Z]{2}\s?\d{4}\s?[A-Z]{2}$/;
    return plateRegex.test(plate);
};

// Валідація обов'язкового поля
export const isRequired = (value: string | number | null | undefined): boolean => {
    if (value === null || value === undefined) return false;
    if (typeof value === 'string') return value.trim().length > 0;
    return true;
};

// Валідація мінімальної довжини
export const minLength = (value: string, min: number): boolean => {
    return value.length >= min;
};

// Валідація максимальної довжини
export const maxLength = (value: string, max: number): boolean => {
    return value.length <= max;
};

// Валідація діапазону чисел
export const inRange = (value: number, min: number, max: number): boolean => {
    return value >= min && value <= max;
};
