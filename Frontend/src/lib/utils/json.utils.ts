// Ця утиліта забезпечує безпечне парсинг JSON-рядків та обробку спеціальних випадків кодування.
/**
 * Утиліта для безпечного парсингу JSON, включаючи рядки з подвійним кодуванням від бекенда.
 */
export const safeJsonParse = (jsonString: string | null | undefined): any => {
    if (!jsonString) return null;

    try {
        let data = JSON.parse(jsonString);

        // При необхідності обробіть JSON з подвійним кодуванням
        if (typeof data === 'string') {
            try {
                data = JSON.parse(data);
            } catch {
                return data;
            }
        }

        return data;
    } catch {
        return null;
    }
};
