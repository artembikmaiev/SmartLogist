// Цей файл містить описи типів для даних про споживання палива та пов'язану статистику.
export interface FuelStat {
    type: 'Diesel' | 'A95' | 'LPG';
    name: string;
    price: number;
    change: number;
}

export interface FuelPrice {
    type: 'Diesel' | 'A95' | 'LPG';
    name: string;
    price: number;
    change: number;
}
