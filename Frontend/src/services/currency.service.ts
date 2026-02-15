// Сервіс для отримання актуальних курсів валют та конвертації грошових сум.
import { apiClient } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/config/api.config';
import { CurrencyRate } from '@/types/currency.types';

export const currencyService = {
    async getRates(): Promise<CurrencyRate[]> {
        return await apiClient.get<CurrencyRate[]>(API_ENDPOINTS.EXTERNAL.CURRENCY);
    }
};
