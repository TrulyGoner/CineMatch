export const debounce = (fn, delay = 300) => {
    let timeoutId;
    return (...args) => {
        if (timeoutId !== undefined) {
            clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(() => fn(...args), delay);
    };
};
