export const memoize = <Args extends unknown[], Result>(
  fn: (...args: Args) => Result,
  keyFn: (...args: Args) => string
): ((...args: Args) => Result) => {
  const cache = new Map<string, Result>();

  return (...args: Args): Result => {
    const key = keyFn(...args);
    if (cache.has(key)) {
      return cache.get(key) as Result;
    }
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
};

export const createCacheKey = (parts: unknown[]): string =>
  JSON.stringify(parts);
