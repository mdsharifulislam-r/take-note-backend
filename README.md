# Secure Note-Taking REST API

A production-ready Express.js + TypeScript + MongoDB REST API with JWT authentication, RBAC, pagination, file uploads, and MongoDB aggregation pipelines.

## Tech Stack

- **Runtime:** Node.js + Express.js
- **Language:** TypeScript
- **Database:** MongoDB + Mongoose
- **Auth:** JWT + bcrypt password hashing
- **Validation:** Zod

## Project Structure

```
note-taker-backend/
├── uploads/                         # Uploaded files (profiles, notes)
├── src/
│   ├── config/                      # DB & env configuration
│   ├── middlewares/                   # Auth, RBAC, Zod validate, global error handler
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.interface.ts
│   │   │   ├── auth.service.ts      # Business logic
│   │   │   ├── auth.controller.ts   # Request handling only
│   │   │   ├── auth.validation.ts
│   │   │   └── auth.route.ts
│   │   ├── note/
│   │   │   ├── note.model.ts
│   │   │   ├── note.interface.ts
│   │   │   ├── note.service.ts
│   │   │   ├── note.controller.ts
│   │   │   ├── note.validation.ts
│   │   │   └── note.route.ts
│   │   ├── user/
│   │   │   ├── user.model.ts
│   │   │   ├── post.model.ts
│   │   │   ├── user.interface.ts
│   │   │   ├── user.service.ts
│   │   │   ├── user.controller.ts
│   │   │   ├── user.validation.ts
│   │   │   └── user.route.ts
│   │   └── admin/
│   │       ├── admin.service.ts
│   │       ├── admin.controller.ts
│   │       ├── admin.validation.ts
│   │       └── admin.route.ts
│   ├── routes/index.ts              # Aggregates all module routes
│   ├── types/                       # Shared TypeScript types
│   ├── validations/common.validation.ts
│   ├── utils/
│   ├── scripts/seed.ts
│   ├── app.ts
│   └── server.ts
├── .env.example
├── package.json
└── tsconfig.json
```

## Quick Start

### 1. Prerequisites

- Node.js 18+
- MongoDB running locally (or a MongoDB Atlas URI)

### 2. Install & Configure

```bash
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
```

### 3. Seed Sample Data (optional)

```bash
npm run seed
```

This creates:
| Role        | Email                    | Password                          |
|-------------|--------------------------|-----------------------------------|
| Super Admin | from `SUPER_ADMIN_EMAIL` | from `SUPER_ADMIN_PASSWORD` (.env)|
| Admin       | admin@example.com        | admin123                          |
| User        | alice@example.com        | user123                           |
| User        | bob@example.com          | user123                           |

### 4. Run

```bash
# Development (hot reload)
npm run dev

# Production
npm run build && npm start
```

API available at **http://localhost:5000/api**

---

## API Endpoints

### Auth

| Method | Endpoint           | Access | Description        |
|--------|--------------------|--------|--------------------|
| POST   | /api/auth/signup   | Public | Register new user  |
| POST   | /api/auth/login    | Public | Login, get JWT     |
| GET    | /api/auth/profile  | Auth   | View own profile   |

### Notes

| Method | Endpoint           | Access      | Description              |
|--------|--------------------|-------------|--------------------------|
| POST   | /api/notes         | User        | Create a note            |
| GET    | /api/notes         | User        | List own notes (paginated)|
| GET    | /api/notes/all     | Admin       | List all notes (paginated)|
| GET    | /api/notes/:id     | User/Admin  | Get single note          |
| PUT    | /api/notes/:id     | User (own)  | Update own note          |
| DELETE | /api/notes/:id     | User (own)  | Delete own note          |

### User

| Method | Endpoint           | Access | Description        |
|--------|--------------------|--------|--------------------|
| POST   | /api/users/posts   | Auth   | Create a post      |

### User Management (Admin only)

| Method | Endpoint           | Description              |
|--------|--------------------|--------------------------|
| POST   | /api/users         | Create user              |
| GET    | /api/users         | List users (paginated)   |
| GET    | /api/users/:id     | Get user by ID           |
| PUT    | /api/users/:id     | Update user              |
| DELETE | /api/users/:id     | Delete user              |

### Admin (Admin only)

| Method | Endpoint                           | Description                    |
|--------|------------------------------------|--------------------------------|
| GET    | /api/admin/users-by-interests      | Group users by interests       |
| GET    | /api/admin/users/:userId/posts     | User posts via `$lookup`       |

### Pagination

All list endpoints accept `?page=1&limit=10` query parameters.

---

## Schema Indexes

All indexes are defined explicitly via `schema.index()` in each model:

### User
| Index              | Purpose                                    |
|--------------------|--------------------------------------------|
| `{ email: 1 }`     | Login/signup lookup (unique)               |
| `{ interests: 1 }` | `$unwind` in interests aggregation         |
| `{ createdAt: -1 }`| Paginated admin user list                  |

### Note
| Index                        | Purpose                          |
|------------------------------|----------------------------------|
| `{ author: 1, createdAt: -1 }`| Paginated user notes list        |
| `{ createdAt: -1 }`          | Paginated admin all-notes list   |

### Post
| Index           | Purpose                    |
|-----------------|----------------------------|
| `{ author: 1 }` | `$lookup` in user posts    |

---

## Roles & Permissions

| Permission              | User | Admin |
|-------------------------|------|-------|
| Signup / Login / Profile| ✅   | ✅    |
| CRUD own notes          | ✅   | ✅    |
| View all notes          | ❌   | ✅    |
| User management CRUD    | ❌   | ✅    |
| Admin analytics         | ❌   | ✅    |

---
