import i18n from '@/shared/config/i18n';

export const formatDate = (iso: string): string => {
  const date = new Date(iso);
  const locale = i18n.language === 'ru' ? 'ru-RU' : 'en-US';
  return date.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatPercent = (value: number): string =>
  `${Math.round(Math.min(100, Math.max(0, value)))}%`;

export const formatDuration = (ms: number): string => {
  const seconds = Math.floor(ms / 1000);
  if (seconds < 60) return `${seconds}${i18n.language === 'ru' ? 'с' : 's'}`;
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (i18n.language === 'ru') return `${minutes}м ${secs}с`;
  return `${minutes}m ${secs}s`;
};
