import { vi } from 'vitest';

vi.mock('@/shared/config/i18n', () => ({
  default: {
    language: 'en',
    t: (key: string) => key,
    changeLanguage: vi.fn(),
    on: vi.fn(),
  },
  tmdbLocale: () => 'en-US',
}));
