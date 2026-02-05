export interface FuelPrice {
    type: 'Diesel' | 'A95' | 'LPG';
    name: string;
    price: number;
    change: number;
}
