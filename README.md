# CMS REST API

A production-ready REST API for a content management system built with modern TypeScript stack. Features JWT authentication, role-based access control, automated testing pipeline and continuous deployment to a live VPS.

🌐 **Live API:** `http://163.245.216.161:3000
`
📖 **Swagger Docs:** `http://163.245.216.161:3000
/docs`

## Tech Stack

![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
![Fastify](https://img.shields.io/badge/Fastify-000000?style=flat&logo=fastify&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat&logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=flat&logo=prisma&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat&logo=docker&logoColor=white)
![Vitest](https://img.shields.io/badge/Vitest-6E9F18?style=flat&logo=vitest&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-2088FF?style=flat&logo=github-actions&logoColor=white)
![Zod](https://img.shields.io/badge/Zod-3E67B1?style=flat&logo=zod&logoColor=white)

## Features

- 🔐 **JWT Authentication** — stateless auth with 7-day token expiration
- 👥 **Role-based access control** — `viewer` and `admin` roles with route-level guards
- 📝 **Full CMS functionality** — posts, categories, tags, comments with relational structure
- ✅ **Runtime validation** — all incoming data validated with Zod before hitting the database
- 🐳 **Dockerized** — entire stack runs with a single `docker compose up`
- 🧪 **Integration tests** — 82% coverage with Vitest and real database
- 🚀 **CI/CD pipeline** — automatic testing and deployment to VPS on every push to `main`
- 📖 **Swagger UI** — interactive API documentation out of the box

## Architecture Decisions

**Fastify over Express** — Fastify is significantly faster, has built-in TypeScript support, schema-based validation, and a cleaner plugin system. For a backend-focused portfolio project it was the right call.

**Prisma as ORM** — Type-safe database queries, auto-generated client from schema, and straightforward migrations. The `@prisma/adapter-pg` adapter allows using a raw `pg` connection pool for better performance.

**Zod for validation** — Unlike Fastify's built-in JSON Schema validation, Zod integrates directly with TypeScript types. One schema gives both runtime validation and static types via `z.infer`.

**Hook-based authorization** — `authenticate` and `adminAuth` hooks are composed as `preHandler` arrays. This separates authentication logic from business logic and keeps route handlers clean.

**Slug auto-generation** — Slugs are generated server-side using `slugify` on category/tag creation. Clients only send `name` — the API handles URL-friendly identifiers, reducing surface area for invalid input.

**Separate test database** — Integration tests run against a dedicated `cms_test` database, isolated from development data. `beforeEach` wipes all tables in dependency order to guarantee clean state between tests.

## Getting Started

```bash
git clone https://github.com/your_username/your_repository.git
cd your_repository
cp .env.example .env
# Fill in JWT_SECRET in .env
docker compose up
```

App will be available at `http://localhost:3000`

## Environment Variables

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | Secret key for signing JWT tokens |

## API Endpoints

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/register` | Register a new user |
| POST | `/auth/login` | Login and receive JWT token |

### Posts
| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/posts` | Get all posts | Public |
| GET | `/posts/:id` | Get post with author, category, tags, comments | Public |
| POST | `/posts` | Create a post | Authenticated |
| PUT | `/posts/:id` | Update a post | Author / Admin |
| DELETE | `/posts/:id` | Delete a post | Author / Admin |

### Categories
| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/categories` | Get all categories | Public |
| GET | `/categories/:id` | Get category with posts | Public |
| POST | `/categories` | Create a category | Admin |
| PUT | `/categories/:id` | Update a category | Admin |
| DELETE | `/categories/:id` | Delete a category | Admin |

### Tags
| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/tags` | Get all tags | Public |
| GET | `/tags/:id` | Get tag with associated posts | Public |
| POST | `/tags` | Create a tag | Admin |
| PUT | `/tags/:id` | Update a tag | Admin |
| DELETE | `/tags/:id` | Delete a tag | Admin |

### Comments
| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/comments` | Get all comments | Public |
| POST | `/comments` | Create a comment | Authenticated |
| DELETE | `/comments/:id` | Delete a comment | Author / Admin |

### Users
| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/users` | Get all users | Admin |

## Testing

```bash
# Run tests
npm run test

# Run with coverage report
npm run test:coverage
```

**Coverage: 82%** — integration tests cover authentication, authorization, CRUD operations, role-based access and edge cases (404, 403, 409 conflicts).

## CI/CD

Every push to `main` triggers a GitHub Actions pipeline:

```
push to main
    ↓
Spin up Ubuntu + PostgreSQL
    ↓
Install deps → Generate Prisma client → Run migrations → Run tests
    ↓
Tests pass → SSH into VPS → git pull → docker compose up --build
    ↓
Live in production
```

Deployment only happens if all tests pass.

## Roles

| Role | Permissions |
|---|---|
| `viewer` | Read all content, create posts and comments, delete own comments |
| `admin` | Full access — manage categories, tags, delete any post or comment |

## Project Structure

```
src/
├── hooks/
│   ├── authenticate.ts    # JWT verification preHandler
│   └── adminAuth.ts       # Role guard preHandler
├── lib/
│   └── prisma.ts          # Prisma client instance
├── routes/
│   ├── auth.ts
│   ├── posts.ts
│   ├── categories.ts
│   ├── tags.ts
│   ├── comments.ts
│   └── users.ts
├── schemas/               # Zod validation schemas
├── tests/
│   ├── setup.ts           # Global test setup
│   ├── helpers.ts         # Shared test utilities
│   ├── auth.test.ts
│   ├── posts.test.ts
│   ├── categories.test.ts
│   ├── tags.test.ts
│   └── comments.test.ts
└── app.ts
prisma/
├── schema.prisma
└── migrations/
Dockerfile
docker-compose.yml
.github/workflows/ci.yml
```