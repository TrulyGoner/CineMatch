export const localStorageManager = {
    get(key) {
        try {
            const raw = localStorage.getItem(key);
            if (!raw)
                return null;
            return JSON.parse(raw);
        }
        catch {
            return null;
        }
    },
    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        }
        catch {
            // quota exceeded — silent fail
        }
    },
    remove(key) {
        localStorage.removeItem(key);
    },
};
