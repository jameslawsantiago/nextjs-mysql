# Notes App v2 (Next.js + Prisma + MySQL)

Full-stack CRUD with Next.js (Pages Router), Prisma ORM, and MySQL.

## Prerequisites
- Node.js 18+ (works on Node 18 and 20)
- MySQL running locally (or remote)

## Setup

1) Install deps:
```bash
npm install
```

2) Configure database:
- Copy `.env.example` to `.env` and set `DATABASE_URL`

3) Initialize Prisma & DB:
```bash
npx prisma generate
npx prisma migrate dev --name init
```

4) Run:
```bash
npm run dev
```

Visit http://localhost:3000

## API
- GET    /api/notes           -> list notes
- POST   /api/notes           -> create note { title, content }
- GET    /api/notes/:id       -> get one
- PUT    /api/notes/:id       -> update { title, content }
- DELETE /api/notes/:id       -> delete
