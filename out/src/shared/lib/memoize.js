export const memoize = (fn, keyFn) => {
    const cache = new Map();
    return (...args) => {
        const key = keyFn(...args);
        if (cache.has(key)) {
            return cache.get(key);
        }
        const result = fn(...args);
        cache.set(key, result);
        return result;
    };
};
export const createCacheKey = (parts) => JSON.stringify(parts);
