# Content Recommendation Platform

Платформа персонализированных рекомендаций контента на базе TMDB API.

**Стек:** React 18+, TypeScript (strict), SCSS, Redux Toolkit, Recharts, Feature-Sliced Design.

## Быстрый старт

```bash
cd content-recommendation-platform
npm install
cp .env.example .env
# Добавьте VITE_TMDB_API_KEY в .env (опционально — без ключа работают мок-данные)
npm run dev
```

## Переменные окружения

| Переменная | Описание |
|---|---|
| `VITE_TMDB_API_KEY` | API-ключ TMDB. Получить: https://www.themoviedb.org/settings/api |

Без ключа приложение использует встроенный мок-каталог из 12 фильмов/сериалов.

## Фичи

- **Движок рекомендаций** — скоринг по жанрам, актуальности (+20% для свежего) и популярности
- **Отслеживание поведения** — клики, просмотры (Intersection Observer), поиск/фильтры; debounce 300ms
- **Хранение** — localStorage + IndexedDB для событий
- **Дашборд** — график вовлечённости (Recharts), тепловая карта жанров, оценка персонализации
- **Прозрачность** — `WhyRecommended` показывает причину рекомендации
- **A/B тест** — персонализированные vs случайные рекомендации
- **Веса** — слайдеры жанр / актуальность / популярность с пересчётом в реальном времени
- **Производительность** — React.memo, useMemo, code-splitting дашборда, AbortController, кэш рекомендаций

## Структура (FSD)

```
src/
├── app/          # providers, store, App
├── pages/        # home, dashboard, content, settings
├── widgets/      # recommendation-feed, content-grid, navbar, user-dashboard
├── features/     # recommendation-engine, user-behavior-tracking, content-discovery, ...
├── entities/     # content, user, recommendation, analytics
└── shared/       # api, storage, ui, lib, config
```

## Скрипты

| Команда | Описание |
|---|---|
| `npm run dev` | Dev-сервер |
| `npm run build` | Production-сборка |
| `npx tsc --noEmit` | Проверка типов |
