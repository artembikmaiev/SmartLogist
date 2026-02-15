// Цей файл описує типи даних для роботи з валютними курсами та фінансовими показниками.
export interface CurrencyRate {
    code: string;
    name: string;
    rate: number;
    change: number;
    date: string;
}
