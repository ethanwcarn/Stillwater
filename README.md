# Stillwaters — Faith-Integrated Mental Health

A calming web application that connects people with faith-aware mental health support, community, and resources.

---

## App Summary

Stillwaters addresses the gap many people feel between their faith tradition and mainstream mental health care. The primary users are individuals who want therapy and community support that respects their spiritual beliefs. The product lets users browse a directory of faith-informed therapists, request sessions, participate in a supportive community feed, and manage a profile—all in one place. The app is designed to feel safe and inclusive across multiple faith traditions (Christianity, Islam, Judaism, Buddhism, Hinduism, and others). This repository contains both the frontend and backend so that anyone can run a full local copy and extend it.

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS, Radix UI–based components |
| **Backend** | Next.js Route Handlers (API routes in `app/api/`) |
| **Database** | PostgreSQL (with `pg` in Node) |
| **Auth** | Client-side mock auth (no external service; ready for future integration) |
| **External services** | None currently |

---

## Architecture Diagram

```
┌─────────────┐     HTTP/HTTPS      ┌─────────────────────────────────────┐
│   User      │ ◄─────────────────► │  Frontend (Next.js + React)         │
│   Browser   │                     │  - Pages, components, client state │
└─────────────┘                     └─────────────────┬───────────────────┘
                                                      │
                                                      │ fetch /api/...
                                                      ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  Backend (Next.js API Routes)                                            │
│  - GET  /api/posts?userEmail=...   → list posts + bookmarked for user    │
│  - POST /api/posts/[id]/bookmark   → toggle bookmark, return new state  │
└─────────────────────────────────────────────────────────────────────────┬┘
                                                                          │
                                                                          │ SQL (pg)
                                                                          ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  PostgreSQL Database                                                     │
│  - users, therapists, therapist_specialties, community_posts,          │
│    post_comments, user_post_bookmarks                                    │
└─────────────────────────────────────────────────────────────────────────┘
```

- **User ↔ Frontend:** The user interacts with the app in the browser; the frontend sends requests to the backend and updates the UI from responses.
- **Frontend ↔ Backend:** The frontend calls API routes (e.g. `fetch('/api/posts')`, `fetch('/api/posts/1/bookmark', { method: 'POST', body: ... })`).
- **Backend ↔ Database:** The API routes use the `pg` client and SQL to read and update the database.

---

## Prerequisites

- **Node.js** (v18 or v20 recommended)  
  - Install: [https://nodejs.org/](https://nodejs.org/)  
  - Verify: `node -v` and `npm -v`

- **PostgreSQL** (15 recommended)  
  - Install: [https://www.postgresql.org/download/](https://www.postgresql.org/download/)  
  - Verify: `psql --version` and that the PostgreSQL server is running

- **psql** (included with PostgreSQL)  
  - Ensure `psql` is on your system PATH. On Windows, PostgreSQL is often at `C:\Program Files\PostgreSQL\<version>\bin`—add this to your PATH, or use the full path (e.g. `& "C:\Program Files\PostgreSQL\15\bin\psql.exe"`).

---

## Installation and Setup

1. **Clone the repository** (or download and extract the code).

2. **Install Node dependencies:**
   ```bash
   npm install
   ```
   (This project includes `.npmrc` with `legacy-peer-deps=true` to resolve peer dependency conflicts.)

3. **Create the PostgreSQL database:**
   ```bash
   createdb stillwaters
   ```
   On Windows, if `createdb` is not in PATH, use the full path (e.g. `& "C:\Program Files\PostgreSQL\15\bin\createdb.exe" stillwaters`) or create the database via pgAdmin.

4. **Run the schema and seed scripts** (from the project root):
   ```bash
   psql -d stillwaters -f db/schema.sql
   psql -d stillwaters -f db/seed.sql
   ```
   This creates the tables and inserts sample data, including a test user and community posts.

5. **Configure the database URL**  
   Copy the example env file and set your connection string:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and set:
   ```env
   DATABASE_URL=postgresql://USER:PASSWORD@localhost:5432/stillwaters
   ```
   Replace `USER` and `PASSWORD` with your local PostgreSQL credentials. Default user is often `postgres`; port is usually `5432`.

---

## Running the Application

1. **Start the Next.js dev server** (frontend and API run together):
   ```bash
   npm run dev
   ```

2. **Open the app** in your browser at:
   ```
   http://localhost:3000
   ```

3. **Sign in** with the seeded test user to use the persistent bookmark feature:
   - Email: `sarah@example.com`
   - Password: any (mock auth accepts any password)

The backend runs inside the same Next.js process; there is no separate backend server to start.

---

## Verifying the Vertical Slice (Bookmark Button)

This section confirms that one button—the **bookmark** button on community posts—updates the database and that the change persists after refresh.

1. **Start the app** with the database configured and schema/seed applied (see above).

2. **Sign in** as `sarah@example.com` (any password).

3. **Open the Community feed** (e.g. tap “Community” in the bottom navigation).

4. **Trigger the feature:**
   - Find any community post.
   - Click the **bookmark** icon (outline bookmark = not saved; filled/check = saved).
   - Toggle it at least once (e.g. bookmark a post, or remove a bookmark from the post that is pre-seeded as bookmarked for Sarah).

5. **Confirm the UI shows the updated value:**
   - The icon should switch immediately between “bookmark” and “bookmark check” and stay that way.

6. **Confirm persistence:**
   - Refresh the page (F5 or reload).
   - Sign in again with `sarah@example.com` if the mock auth resets.
   - Go back to the Community feed.
   - The same post(s) should still show the correct bookmarked state (saved or not) as before the refresh.

7. **Optional — confirm in the database:**
   ```bash
   psql -d stillwaters -c "SELECT * FROM user_post_bookmarks;"
   ```
   You should see one row per (user_id, post_id) for each bookmarked post. User 1 is Sarah; post IDs 1–4 correspond to the four seeded posts.

If all of the above hold, the vertical slice is working: the button triggers backend logic, updates the database, returns the updated value, and the UI reflects it and persists after refresh.

---

## Database Scripts

- **`db/schema.sql`** — Creates all tables (users, therapists, therapist_specialties, community_posts, post_comments, user_post_bookmarks). Safe to re-run only if you are okay with dropping and recreating these tables.
- **`db/seed.sql`** — Inserts sample users, therapists, specialties, posts, comments, and one sample bookmark. Run after `schema.sql`.

To recreate the database from scratch:

```bash
psql -d stillwaters -f db/schema.sql
psql -d stillwaters -f db/seed.sql
```

---

## License

Private / educational use as required by your course or organization.
