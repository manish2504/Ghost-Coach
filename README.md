# Ghost Coach 👻🏏

**Ghost Coach** is a full-stack AI sports coaching application focused on cricket batting stance analysis. Upload a stance photo, receive personalized AI coaching feedback powered by Gemini Vision, track your progress over time, and chat with your AI coach for follow-up guidance.

![Tech Stack](https://img.shields.io/badge/React-Vite-61DAFB?style=flat-square)
![Node](https://img.shields.io/badge/Node-Express-339933?style=flat-square)
![AI](https://img.shields.io/badge/Gemini-1.5_Flash-4285F4?style=flat-square)
![Database](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=flat-square)

---

## Features

- **Player Authentication** — JWT-based register/login with persistent sessions
- **Stance Image Upload** — Drag-and-drop upload with preview (JPEG/PNG, max 5MB)
- **AI Coaching Feedback** — Gemini Vision analyzes balance, grip, elbow, head, feet, and bat position
- **Session History** — Responsive cards with expandable detail modals
- **AI Coach Chat** — Contextual follow-up coaching per session
- **Progress Tracking** — Recharts score trend, average, best score, total sessions
- **Visual Annotations** — Coaching overlay markers on stance images
- **Mobile Responsive** — Polished UI across all screen sizes

---

## Architecture

```
Ghost Coach/
├── backend/                 # Node.js + Express API
│   ├── config/              # Supabase & Gemini clients
│   ├── controllers/         # Request handlers
│   ├── middleware/          # Auth, upload, validation, errors
│   ├── routes/              # API route definitions
│   ├── services/            # Business logic layer
│   ├── utils/               # Prompt builder, parsers, responses
│   └── uploads/             # Temporary multer storage
├── frontend/                # React + Vite SPA
│   └── src/
│       ├── components/      # Reusable UI components
│       ├── context/         # Auth context (Context API)
│       ├── layouts/         # Auth & dashboard layouts
│       ├── pages/           # Route pages
│       ├── services/        # Axios API client
│       └── utils/           # Score helpers
└── supabase/                # SQL schema & storage setup
```

### API Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new player |
| POST | `/api/auth/login` | Login & receive JWT |
| GET | `/api/auth/me` | Get current user (protected) |
| POST | `/api/sessions/upload` | Upload & analyze stance (protected) |
| GET | `/api/sessions` | List sessions + progress stats (protected) |
| GET | `/api/sessions/:id` | Get single session (protected) |
| GET | `/api/chat/:sessionId` | Get chat history (protected) |
| POST | `/api/chat/:sessionId` | Send chat message (protected) |

---

## Why Supabase?

Supabase was chosen as the data layer because it provides:

1. **Managed PostgreSQL** — Full relational database with JSONB support for AI feedback arrays
2. **Built-in Storage** — S3-compatible object storage for stance images with public URL generation
3. **Rapid Setup** — SQL editor, dashboard, and service role key for secure backend access
4. **Scalability** — Handles growth from MVP to production without infrastructure changes
5. **Free Tier** — Ideal for development and demo deployments

The Express backend uses the **service role key** to bypass RLS, keeping all data access server-side and secure.

---

## AI Prompt Engineering

### Stance Analysis

The `promptBuilder.js` utility constructs personalized prompts that:

- Adapt language complexity to the player's experience level (Beginner/Intermediate/Advanced)
- Reference the player's name, role, and sport
- Request analysis of 6 specific technical elements
- Enforce strict JSON output schema for reliable parsing
- Maintain an encouraging, specific coaching tone

### Chat Follow-ups

Chat prompts inject:

- Full player profile
- Complete session analysis (scores, strengths, areas, drills)
- Prior conversation history
- Natural language responses (not JSON)

### Response Parsing

`parseAiResponse.js` strips markdown fences if present, validates all required fields, and normalizes the confidence level.

---

## Prerequisites

- **Node.js** 18+
- **npm** 9+
- **Supabase** account ([supabase.com](https://supabase.com))
- **Google AI Studio** API key for Gemini ([aistudio.google.com](https://aistudio.google.com))

---

## Setup Instructions

### 1. Clone & Install

```bash
cd "Ghost Coach"

# Backend
cd backend
npm install
cp .env.example .env

# Frontend
cd ../frontend
npm install
cp .env.example .env
```

### 2. Supabase Database

1. Create a new Supabase project
2. Open **SQL Editor** and run `supabase/schema.sql`
3. Create a storage bucket named `stance-images` (set to **public**)
4. Run `supabase/storage-setup.sql` for storage policies

### 3. Environment Variables

**Backend** (`backend/.env`):

```env
PORT=5000
JWT_SECRET=your_super_secret_jwt_key_change_in_production
GEMINI_API_KEY=your_gemini_api_key
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your_supabase_service_role_key
FRONTEND_URL=http://localhost:5173
```

**Frontend** (`frontend/.env`):

```env
VITE_API_URL=http://localhost:5000/api
```

> Get your Supabase URL and service role key from **Project Settings → API**.

### 4. Run Locally

```bash
# Terminal 1 — Backend
cd backend
npm run dev

# Terminal 2 — Frontend
cd frontend
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## Local Development

| Service | URL | Command |
|---------|-----|---------|
| Frontend | http://localhost:5173 | `npm run dev` |
| Backend | http://localhost:5000 | `npm run dev` |
| Health Check | http://localhost:5000/api/health | — |

The Vite dev server proxies `/api` requests to the backend automatically.

---

## Deployment Guide

### Frontend → Vercel

1. Push code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Set root directory to `frontend`
4. Add environment variable: `VITE_API_URL=https://your-api.onrender.com/api`
5. Deploy

### Backend → Render

1. Create a new **Web Service** on [Render](https://render.com)
2. Connect your GitHub repo, set root to `backend`
3. Build command: `npm install`
4. Start command: `npm start`
5. Add all environment variables from `backend/.env.example`
6. Set `FRONTEND_URL` to your Vercel domain

### Database → Supabase

Already hosted — no additional deployment needed. Ensure production environment variables point to your Supabase project.

---

## Future Improvements

- [ ] Real computer vision pose detection (MediaPipe) for accurate overlay positions
- [ ] Video stance analysis (frame extraction + multi-frame AI)
- [ ] Team/coach dashboard for managing multiple players
- [ ] Push notifications for practice reminders
- [ ] Comparison view (before/after stance sessions)
- [ ] OAuth social login (Google, Apple)
- [ ] Multi-sport support (tennis, golf, baseball)
- [ ] Offline mode with service workers
- [ ] Rate limiting and API usage analytics

---

## License

MIT — Built as an engineering assignment MVP for Ghost Coach.
