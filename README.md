# Mini Shop

SPA интернет-магазина на **Vue 3** (Composition API, `<script setup lang="ts">`), **TypeScript** и **Vite**. Данные товаров — публичный API **[DummyJSON](https://dummyjson.com/products)**.

## Стек

| Технология | Назначение |
|------------|------------|
| Vue 3 | UI, Composition API |
| TypeScript | типизация |
| Vue Router 4 | маршруты, lazy-loading, 404 |
| Pinia | состояние: каталог, корзина, избранное, toast, **таблица «Список товаров»** в админке (`adminProductsTable`) |
| Axios | HTTP |
| Vite 8 | dev-сервер и сборка |
| Sass (Dart) | SCSS в компонентах (например, админ-таблица) |
| Vitest + jsdom | unit-тесты |
| lucide-vue-next | иконки |

## API и прокси

- В **production** запросы идут на `https://dummyjson.com`.
- В **`npm run dev`** и **`npm run preview`** используется **прокси Vite** (`/api-dummyjson` → `dummyjson.com`), чтобы уменьшить проблемы с CORS и блокировками расширений браузера при работе с `localhost`.

Настройка: `vite.config.ts` (`server.proxy` / `preview.proxy`), базовый URL в `src/api/products.ts`.

## Маршруты

| Путь | Описание |
|------|----------|
| `/` | Каталог |
| `/product/:id` | Карточка товара |
| `/cart` | Корзина |
| `/checkout` | Оформление заказа |
| `/favorites` | Избранное |
| `/admin` | Админ-панель: таблица товаров |
| остальное | Страница 404 |

## Функционал

- **Каталог**: категории, поиск с debounce, сортировка, фильтр по цене, пагинация на клиенте.
- **Товар**: описание, рейтинг, действия (корзина / избранное).
- **Корзина**: количество, сумма, переход к оформлению; данные в `localStorage`.
- **Оформление**: форма с валидацией.
- **Избранное**: по id, синхронизация с кэшем каталога; `localStorage`.
- **Админ** (`/admin`): страница **«Список товаров»** — таблица на Pinia (данные, фильтр, сортировка по столбцам, пагинация на клиенте), разметка и стили в компоненте, SCSS.
- Toast при добавлении в корзину и избранное, skeleton каталога, переходы между страницами, адаптивная вёрстка.

## Требования

- **Node.js** 18+ (рекомендуется актуальный LTS).

## Установка и запуск

```bash
npm install
npm run dev
```

Откройте в браузере адрес из вывода Vite (обычно `http://localhost:5173`).

## Скрипты

| Команда | Действие |
|---------|----------|
| `npm run dev` | режим разработки |
| `npm run build` | проверка типов (`vue-tsc`) и production-сборка |
| `npm run preview` | локальный просмотр собранного `dist/` |
| `npm test` | однократный прогон Vitest |
| `npm run test:watch` | Vitest в watch-режиме |

## Структура (кратко)

```
src/
  api/products.ts     — клиент DummyJSON (+ полная выборка для админки)
  components/         — UI (в т.ч. AdminProductsTable, шапка, карточки)
  router/index.ts     — маршруты
  stores/             — Pinia (в т.ч. adminProductsTable — логика админ-таблицы)
  views/              — страницы маршрутов
  types.ts            — общие типы
```

## Деплой

Публичный демо-пример (если развёрнут): [mini-e-commerce-app на Vercel](https://mini-e-commerce-app-beta.vercel.app/).

После деплоя статики запросы к API идут напрямую на `https://dummyjson.com` (без Vite-прокси).
