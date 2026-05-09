# HireFlow — Backend

> RESTful API server for the HireFlow job platform. Built with Node.js, Express, Prisma, and PostgreSQL. Handles authentication, job management, applications, AI feature routing, and image uploads.

**Live URL:** [hireflow-backend-r8d0.onrender.com](https://hireflow-backend-r8d0.onrender.com)  
**Frontend Repo:** [HireFlow Frontend](https://github.com/sadiq1020/HireFlow-Frontend)

---

## Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [API Reference](#api-reference)
- [AI Features](#ai-features)
- [Advanced Engineering](#advanced-engineering)
- [Setup Instructions](#setup-instructions)
- [Environment Variables](#environment-variables)
- [Database Schema](#database-schema)
- [Demo Credentials](#demo-credentials)

---

## Project Overview

HireFlow Backend is a production-grade Express API that powers the HireFlow job platform. It provides:

- **Authentication** — email/password + Google OAuth via Better Auth
- **Role-Based Access** — three roles: `SEEKER`, `COMPANY`, `ADMIN` with route-level guards
- **Job Management** — full CRUD for job listings with filtering, sorting, and pagination
- **Application Pipeline** — seekers apply to jobs; companies review and update status through a 5-stage pipeline
- **Company Approval** — admin manually approves company accounts before they can post jobs
- **Image Uploads** — Cloudinary integration for company logos and user avatars
- **AI Routing** — proxies AI requests from the frontend to Google Gemini with structured prompts
- **Caching** — in-memory TTL cache for expensive read queries (categories, public company listings)
- **Rate Limiting** — IP-based limits on all routes and stricter limits on auth endpoints
- **Logging** — Winston logger writing to console and rotating log files

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Runtime** | Node.js 18+ |
| **Framework** | Express v5 |
| **Language** | TypeScript |
| **ORM** | Prisma v7 |
| **Database** | PostgreSQL (Neon / Render) |
| **Authentication** | Better Auth (email + Google OAuth) |
| **Image Storage** | Cloudinary |
| **AI** | Google Gemini 2.5 Flash (`@google/generative-ai`) |
| **Validation** | Zod |
| **Logging** | Winston |
| **Rate Limiting** | express-rate-limit |
| **File Uploads** | Multer |
| **Deployment** | Render |

---

## Architecture

```
src/
├── app.ts                  # Express app setup, middleware, route mounting
├── server.ts               # HTTP server entry point
├── config/
│   ├── cache.ts            # In-memory TTL cache implementation
│   ├── cloudinary.ts       # Cloudinary SDK configuration
│   ├── logger.ts           # Winston logger (console + file transports)
│   └── rateLimiter.ts      # Global + auth-specific rate limiters
├── lib/
│   ├── auth.ts             # Better Auth configuration (Google OAuth, roles)
│   └── prisma.ts           # Prisma client singleton
├── modules/
│   ├── admin/              # Admin-only operations (approve companies, manage users)
│   ├── application/        # Job applications CRUD + status updates
│   ├── category/           # Job categories management
│   ├── company/            # Company profile CRUD + public listing
│   ├── job/                # Job listings CRUD + search/filter/pagination
│   ├── saved-job/          # Seeker saved jobs
│   └── user/               # User profile management
├── shared/
│   ├── appError.ts         # Custom AppError class
│   ├── globalErrorHandler.ts # Express error middleware
│   ├── response.ts         # Standardised API response helper
│   └── verifyAuth.ts       # Better Auth session verification middleware
└── types/                  # Shared TypeScript interfaces
```

Each module follows a consistent 4-file pattern:
```
module/
├── module.controller.ts    # Request/response handling
├── module.service.ts       # Business logic + Prisma queries
├── module.route.ts         # Express router + middleware
├── module.validation.ts    # Zod schemas
└── module.interface.ts     # TypeScript types
```

---

## API Reference

### Base URL
```
Local:      http://localhost:5000/
Production: https://hireflow-backend-r8d0.onrender.com/
```

### Auth (Better Auth)
```
POST   /api/auth/sign-up/email     Register with email
POST   /api/auth/sign-in/email     Login with email
POST   /api/auth/sign-in/social    Google OAuth
POST   /api/auth/sign-out          Logout
GET    /api/auth/get-session       Get current session
```

### Users
```
GET    /api/v1/users/profile       Get my profile (auth required)
PUT    /api/v1/users/profile       Update my profile
```

### Jobs
```
GET    /api/v1/jobs                List jobs (public) — supports ?search, ?location, ?type, ?categoryId, ?sortBy, ?sortOrder, ?page, ?limit
GET    /api/v1/jobs/:id            Get job detail (public)
POST   /api/v1/jobs                Create job (COMPANY)
PUT    /api/v1/jobs/:id            Update job (COMPANY — own jobs only)
DELETE /api/v1/jobs/:id            Delete job (COMPANY — own jobs only)
```

### Companies
```
GET    /api/v1/company/public      List approved companies (public)
GET    /api/v1/company/public/:id  Get company detail (public)
GET    /api/v1/company/profile     Get my company profile (COMPANY)
POST   /api/v1/company/profile     Create company profile (COMPANY)
PUT    /api/v1/company/profile     Update company profile (COMPANY)
```

### Applications
```
POST   /api/v1/applications                     Apply to a job (SEEKER)
GET    /api/v1/applications/my                  My applications (SEEKER)
GET    /api/v1/applications/company             Applications for my company's jobs (COMPANY)
PATCH  /api/v1/applications/:id/status          Update application status (COMPANY)
```

### Saved Jobs
```
POST   /api/v1/saved-jobs          Save a job (SEEKER)
GET    /api/v1/saved-jobs/my       Get my saved jobs (SEEKER)
DELETE /api/v1/saved-jobs/:jobId   Unsave a job (SEEKER)
```

### Categories
```
GET    /api/v1/categories          List all categories (public, cached)
POST   /api/v1/categories          Create category (ADMIN)
PUT    /api/v1/categories/:id      Update category (ADMIN)
DELETE /api/v1/categories/:id      Delete category (ADMIN)
```

### Admin
```
GET    /api/v1/admin/users                        List all users (ADMIN)
PATCH  /api/v1/admin/users/:id/toggle             Activate/deactivate user (ADMIN)
GET    /api/v1/admin/companies                    List all companies (ADMIN)
PATCH  /api/v1/admin/companies/:id/approval       Approve/reject company (ADMIN)
GET    /api/v1/admin/stats                        Platform statistics (ADMIN)
GET    /api/v1/admin/jobs                         All jobs (ADMIN)
```

### Standard Response Format

All endpoints return a consistent envelope:

```json
{
  "success": true,
  "message": "Operation successful",
  "data": { },
  "meta": {
    "page": 1,
    "limit": 12,
    "total": 47,
    "totalPages": 4
  }
}
```

Errors:
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": []
}
```

---

## AI Features

The backend handles all AI-related requests via dedicated service functions using the `@google/generative-ai` SDK with **Gemini 2.5 Flash**.

### AI Chat
Receives conversation history from the frontend, prepends a career-assistant system prompt, and returns a contextual response. Stateless — full history is sent on each request.

### AI Job Recommendations
Receives the seeker's application history and a pool of available jobs. Returns a ranked JSON array of job IDs with match scores (0–100) and match reasons. Strict JSON-only output enforced via system prompt.

### AI Cover Letter Generator
Receives job details and applicant context. Returns a 200–250 word, 3-paragraph cover letter tailored to the specified tone (Professional / Confident / Enthusiastic / Concise).

### AI Job Description Generator
Receives job title, type, location, category, seniority level, and company tone. Returns a JSON object with `description` (250–350 word prose) and `requirements` (6–9 bullet points). Used in the company job creation form.

---

## Advanced Engineering

### Rate Limiting (`src/config/rateLimiter.ts`)
```
Global:  100 requests / 15 minutes / IP
Auth:    200 requests / 15 minutes / IP
```

### Logging (`src/config/logger.ts`)
Winston logger with two transport levels:
- **Development:** colorized console output with metadata
- **Production:** JSON format to console + rotating files (`logs/error.log`, `logs/combined.log`)

Log level auto-switches based on `NODE_ENV`.

### In-Memory Cache (`src/config/cache.ts`)
Custom `InMemoryCache` class with TTL expiry, prefix-based invalidation, and debug logging. Used for:
- Category listings (long TTL — rarely changes)
- Public company listings (medium TTL)

Cache is automatically invalidated on write operations via `deleteByPrefix()`.

### Input Validation
All incoming request bodies are validated with Zod schemas before reaching the service layer. Validation errors are caught by the global error handler and returned with descriptive messages.

### Global Error Handler (`src/shared/globalErrorHandler.ts`)
Catches all unhandled errors from the route chain. Handles:
- Custom `AppError` instances (known errors with status codes)
- Prisma errors (unique constraint violations, not found)
- Zod validation errors
- Generic 500 fallback

---

## Setup Instructions

### Prerequisites

- Node.js 18+
- PostgreSQL database (local, Neon, or Render)
- npm

### 1. Clone the repository

```bash
git clone https://github.com/sadiq1020/HireFlow-Backend.git
cd HireFlow-Backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the root:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/hireflow

# Server
PORT=5000
NODE_ENV=development

# Frontend URL (used for CORS + Better Auth trusted origins)
APP_URL=http://localhost:3000

# Better Auth
BETTER_AUTH_SECRET=your_secret_here_min_32_chars
BETTER_AUTH_URL=http://localhost:3000/api/auth

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Admin seed credentials
ADMIN_EMAIL=admin@hireflow.com
ADMIN_PASSWORD=admin1234
ADMIN_NAME=Admin HireFlow
```

### 4. Run database migrations

```bash
npx prisma migrate dev
```

### 5. Seed the database

Creates the admin account and default job categories:

```bash
npm run seed
```

### 6. Start the development server

```bash
npm run dev
```

Server starts at [http://localhost:5000](http://localhost:5000)

### 7. Verify it's running

```bash
curl http://localhost:5000/api/v1/categories
```

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | ✅ | PostgreSQL connection string |
| `PORT` | ✅ | Server port (default: 5000) |
| `NODE_ENV` | ✅ | `development` or `production` |
| `APP_URL` | ✅ | Frontend URL for CORS whitelist |
| `BETTER_AUTH_SECRET` | ✅ | Random secret, min 32 chars — must match frontend |
| `BETTER_AUTH_URL` | ✅ | Frontend auth URL (e.g. `https://hire-flow-frontend-five.vercel.app/api/auth`) |
| `GOOGLE_CLIENT_ID` | ✅ | From Google Cloud Console OAuth credentials |
| `GOOGLE_CLIENT_SECRET` | ✅ | From Google Cloud Console OAuth credentials |
| `CLOUDINARY_CLOUD_NAME` | ✅ | Cloudinary account cloud name |
| `CLOUDINARY_API_KEY` | ✅ | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | ✅ | Cloudinary API secret |
| `ADMIN_EMAIL` | ✅ | Seed script admin email |
| `ADMIN_PASSWORD` | ✅ | Seed script admin password |
| `ADMIN_NAME` | ✅ | Seed script admin display name |

---

## Database Schema

### Core Models

```
User              — Auth user with role (SEEKER | COMPANY | ADMIN)
Session           — Better Auth session tokens
Account           — OAuth account links (Google)
CompanyProfile    — Company details linked 1:1 to User
Job               — Job listings linked to CompanyProfile + Category
Category          — Job categories (Engineering, Design, etc.)
Application       — Job applications (Seeker → Job)
SavedJob          — Bookmarked jobs (Seeker → Job)
```

### Application Status Pipeline

```
PENDING → REVIEWED → SHORTLISTED → HIRED
                   ↘ REJECTED
```

### Company Approval Flow

```
PENDING → APPROVED  (can post jobs)
        → REJECTED  (cannot post jobs, shown reason)
```

---

## Demo Credentials

| Role | Email | Password |
|---|---|---|
| **Admin** | `admin@hireflow.com` | `admin1234` |

> Company and Seeker demo accounts can be created via the registration page.

---

## Deployment Notes

This backend is deployed on **Render** as a Web Service.

**Important Render settings:**
- Build Command: `npm install && npx prisma generate`
- Start Command: `npm run start`
- `NODE_ENV` must be set to `production`
- `APP_URL` must be set to `https://hire-flow-frontend-five.vercel.app`
- `BETTER_AUTH_URL` must be set to `https://hire-flow-frontend-five.vercel.app/api/auth`

After any schema changes, run migrations manually via the Render Shell:
```bash
npx prisma migrate deploy
```
