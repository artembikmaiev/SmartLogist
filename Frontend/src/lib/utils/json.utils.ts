/**
 * Utility for safe JSON parsing, including double-encoded strings from backend.
 */
export const safeJsonParse = (jsonString: string | null | undefined): any => {
    if (!jsonString) return null;

    try {
        let data = JSON.parse(jsonString);

        // Handle double-encoded JSON if necessary
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
