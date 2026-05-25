# CMS REST API

REST API для системы управления контентом с JWT авторизацией, ролевой моделью доступа и автоматическим деплоем.

## Стек

![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
![Fastify](https://img.shields.io/badge/Fastify-000000?style=flat&logo=fastify&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat&logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=flat&logo=prisma&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat&logo=docker&logoColor=white)
![Vitest](https://img.shields.io/badge/Vitest-6E9F18?style=flat&logo=vitest&logoColor=white)

## Запуск

```bash
git clone https://github.com/твой_юзернейм/твой_репозиторий.git
cd твой_репозиторий
cp .env.example .env
# Заполни JWT_SECRET в .env
docker compose up
```

## Переменные окружения

| Переменная | Описание |
|---|---|
| `DATABASE_URL` | Строка подключения к PostgreSQL |
| `JWT_SECRET` | Секрет для подписи JWT токенов |

## API

### Auth
| Метод | Endpoint | Описание |
|---|---|---|
| POST | `/auth/register` | Регистрация |
| POST | `/auth/login` | Вход |

### Posts
| Метод | Endpoint | Описание | Доступ |
|---|---|---|---|
| GET | `/posts` | Все посты | Публичный |
| GET | `/posts/:id` | Пост по id | Публичный |
| POST | `/posts` | Создать пост | Авторизован |
| PUT | `/posts/:id` | Обновить пост | Автор / Admin |
| DELETE | `/posts/:id` | Удалить пост | Автор / Admin |

### Categories
| Метод | Endpoint | Описание | Доступ |
|---|---|---|---|
| GET | `/categories` | Все категории | Публичный |
| GET | `/categories/:id` | Категория по id | Публичный |
| POST | `/categories` | Создать категорию | Admin |
| PUT | `/categories/:id` | Обновить категорию | Admin |
| DELETE | `/categories/:id` | Удалить категорию | Admin |

### Tags
| Метод | Endpoint | Описание | Доступ |
|---|---|---|---|
| GET | `/tags` | Все теги | Публичный |
| GET | `/tags/:id` | Тег по id | Публичный |
| POST | `/tags` | Создать тег | Admin |
| PUT | `/tags/:id` | Обновить тег | Admin |
| DELETE | `/tags/:id` | Удалить тег | Admin |

### Comments
| Метод | Endpoint | Описание | Доступ |
|---|---|---|---|
| GET | `/comments` | Все комментарии | Публичный |
| POST | `/comments` | Создать комментарий | Авторизован |
| DELETE | `/comments/:id` | Удалить комментарий | Автор / Admin |

### Users
| Метод | Endpoint | Описание | Доступ |
|---|---|---|---|
| GET | `/users` | Все пользователи | Admin |

## Тесты

```bash
npm run test
npm run test:coverage
```

Покрытие — 82%

## Документация

После запуска доступна по адресу `http://localhost:3000/docs`

## Роли

| Роль | Возможности |
|---|---|
| `viewer` | Чтение, создание постов и комментариев |
| `admin` | Полный доступ |

## Структура проекта

```
src/
├── hooks/        # authenticate, adminAuth
├── lib/          # prisma client
├── routes/       # auth, posts, categories, tags, comments, users
├── schemas/      # Zod схемы валидации
├── tests/        # тесты
└── app.ts
```