export const formatDate = (iso) => {
    const date = new Date(iso);
    return date.toLocaleDateString('ru-RU', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
};
export const formatPercent = (value) => `${Math.round(Math.min(100, Math.max(0, value)))}%`;
export const formatDuration = (ms) => {
    const seconds = Math.floor(ms / 1000);
    if (seconds < 60)
        return `${seconds}с`;
    const minutes = Math.floor(seconds / 60);
    return `${minutes}м ${seconds % 60}с`;
};
