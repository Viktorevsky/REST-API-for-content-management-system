# CMS REST API

A REST API for a content management system with JWT authentication, role-based access control, and automated deployment.

## Tech Stack

![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
![Fastify](https://img.shields.io/badge/Fastify-000000?style=flat&logo=fastify&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat&logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=flat&logo=prisma&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat&logo=docker&logoColor=white)
![Vitest](https://img.shields.io/badge/Vitest-6E9F18?style=flat&logo=vitest&logoColor=white)

## Getting Started

```bash
git clone https://github.com/your_username/your_repository.git
cd your_repository
cp .env.example .env
# Fill in JWT_SECRET in .env
docker compose up
```

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
| POST | `/auth/login` | Login |

### Posts
| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/posts` | Get all posts | Public |
| GET | `/posts/:id` | Get post by id | Public |
| POST | `/posts` | Create a post | Authenticated |
| PUT | `/posts/:id` | Update a post | Author / Admin |
| DELETE | `/posts/:id` | Delete a post | Author / Admin |

### Categories
| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/categories` | Get all categories | Public |
| GET | `/categories/:id` | Get category by id | Public |
| POST | `/categories` | Create a category | Admin |
| PUT | `/categories/:id` | Update a category | Admin |
| DELETE | `/categories/:id` | Delete a category | Admin |

### Tags
| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/tags` | Get all tags | Public |
| GET | `/tags/:id` | Get tag by id | Public |
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
npm run test
npm run test:coverage
```

Test coverage — 82%

## API Documentation

After running the app, Swagger UI is available at `http://localhost:3000/docs`

## Roles

| Role | Permissions |
|---|---|
| `viewer` | Read content, create posts and comments |
| `admin` | Full access |

## Project Structure

```
src/
├── hooks/        # authenticate, adminAuth
├── lib/          # prisma client
├── routes/       # auth, posts, categories, tags, comments, users
├── schemas/      # Zod validation schemas
├── tests/        # integration tests
└── app.ts
```