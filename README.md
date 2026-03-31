# Current sprint EARS requirements: 

1. User Account Creation (Ubiquitous/Event-Driven)
Pattern: Event-Driven (When <trigger>, the <system> shall <response>)

Requirement: When a new user submits the registration form with a unique email and matching passwords, the system shall create a new record in the users table and redirect the user to the onboarding flow.

Requirement: When a user attempts to register with an email that already exists in the database, the system shall display an "Email already in use" error message.

2. User Login (State-Driven)
Pattern: State-Driven (While <state>, the <system> shall <action>)

Requirement: While the user is unauthenticated, the system shall restrict access to the Community Feed and Therapist Directory, redirecting any access attempts to the Login page.

Requirement: When a user provides valid credentials, the system shall transition the user to an "Authenticated" state and initiate a persistent session.

3. User Logout (Event-Driven)
Pattern: Event-Driven

Requirement: When the user selects the "Log Out" option in the navigation menu, the system shall terminate the current session and redirect the user to the landing page.

4. Landing Page (Ubiquitous)
Pattern: Ubiquitous (The <system> shall <response>)

Requirement: The system shall display a responsive landing page that includes a value proposition for faith-integrated mental health and clear call-to-action buttons for "Sign In" and "Get Started."

5. Error Handling & Robustness (Unwanted Behavior)
Pattern: Unwanted Behavior (If <trigger>, then the <system> shall <response>)

Requirement: If the database connection is unavailable during a login attempt, then the system shall display a descriptive error message to the user and log the exception details for administrative review.

Requirement: If a user submits a password that does not meet the complexity requirements (min 8 characters), then the system shall prevent form submission and highlight the specific validation failure.

# Stillwaters — Faith-Integrated Mental Health

A calming web application that connects people with faith-aware mental health support, community, and resources.

---

## App Summary

Stillwaters addresses the gap many people feel between their faith tradition and mainstream mental health care. The primary users are individuals who want therapy and community support that respects their spiritual beliefs. The product lets users browse a directory of faith-informed therapists, request sessions, participate in a supportive community feed, and manage a profile—all in one place. The app is designed to feel safe and inclusive across multiple faith traditions (Christianity, Islam, Judaism, Buddhism, Hinduism, and others). This repository contains both the frontend and backend so that anyone can run a full local copy and extend it.

---

## Working Features

The following features are currently implemented and working in the app:

- **Sign in / Create account UI** with client-side mock authentication
- **Email and password input validation** on the sign-in flow
- **Create account flow** with password confirmation validation
- **Forgot password flow** that sends a password reset request through the app API
- **Community feed** that displays seeded community posts from the database
- **Bookmark / unbookmark posts** from the community feed
- **Persistent bookmarks** saved in PostgreSQL and retained after page refresh
- **Therapists page** with a faith-informed therapist directory placeholder
- **Responsive navigation and layout improvements** for mobile and desktop screens

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

3. **Run the schema script first** (from the project root):
   ```bash
   psql -d postgres -f db/schema.sql
   ```
   This script now creates the `stillwaters` database automatically (if missing), switches into it, and creates all tables.

4. **Run the seed script:**
   ```bash
   psql -d stillwaters -f db/seed.sql
   ```
   The seed is re-runnable (it truncates and repopulates tables), so you can run it repeatedly while developing.

5. **Configure local environment variables**  
   Copy the example env file:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and set:
   ```env
   DATABASE_URL=postgresql://USER:PASSWORD@localhost:5432/stillwaters
   ```
   Replace `USER` and `PASSWORD` with your local PostgreSQL credentials. Default user is often `postgres`; port is usually `5432`.
   Optional values already documented in `.env.example`:
   - `DB_MIGRATE_URL` if you use a separate database user for migrations
   - `APP_ORIGIN` so password reset links use the correct base URL
   - `MAILGUN_API_KEY` and `MAILGUN_DOMAIN` if you want password reset emails to send

6. **Run the setup check**
   ```bash
   npm run setup:check
   ```
   This validates that the required environment variables are present and warns when optional Mailgun or origin settings are missing.

---

## Running the Application

1. **Start the Next.js dev server** (frontend and API run together):
   ```bash
   npm run dev
   ```
   The app now runs an environment check automatically before `dev`, `build`, `start`, and `migrate`.

2. **Open the app** in your browser at:
   ```
   http://localhost:3000
   ```

3. **Sign in** with the seeded test user to use the persistent bookmark feature:
   - Email: `sarah@example.com`
   - Password: `Password123!`

The backend runs inside the same Next.js process; there is no separate backend server to start.

---

## Verifying the Vertical Slice (Bookmark Button)

This section confirms that one button—the **bookmark** button on community posts—updates the database and that the change persists after refresh.

1. **Start the app** with the database configured and schema/seed applied (see above).

2. **Sign in** as `sarah@example.com` with password `Password123!`.

3. **Open the Community feed** (e.g. tap “Community” in the bottom navigation).

4. **Trigger the feature:**
   - Find any community post.
   - Click the **bookmark** icon (outline bookmark = not saved; filled/check = saved).
   - Toggle it at least once (e.g. bookmark a post, or remove a bookmark from the post that is pre-seeded as bookmarked for Sarah).

5. **Confirm the UI shows the updated value:**
   - The icon should switch immediately between “bookmark” and “bookmark check” and stay that way.

6. **Confirm persistence:**
   - Refresh the page (F5 or reload).
   - Sign in again with `sarah@example.com` if needed.
   - Go back to the Community feed.
   - The same post(s) should still show the correct bookmarked state (saved or not) as before the refresh.

7. **Optional — confirm in the database:**
   ```bash
   psql -d stillwaters -c "SELECT * FROM user_post_bookmarks;"
   ```
   You should see one row per `(user_id, post_id)` for each bookmarked post. User `1` is Sarah.

If all of the above hold, the vertical slice is working: the button triggers backend logic, updates the database, returns the updated value, and the UI reflects it and persists after refresh.

---

## Database Scripts

- **`db/schema.sql`** — Creates all current app tables, including auth/session and scheduling tables (`users`, `password_reset_tokens`, `user_sessions`, `therapists`, `therapist_specialties`, `requested_sessions`, `community_posts`, `post_comments`, `user_post_bookmarks`). Safe to re-run only if you are okay with dropping and recreating these tables.
- **`db/seed.sql`** — Inserts sample users, therapists, specialties, posts, comments, and bookmarks. Run after `schema.sql`. Seeded users can sign in with password `Password123!`.

To recreate the database from scratch:

```bash
psql -d postgres -f db/schema.sql
psql -d stillwaters -f db/seed.sql
```

### Troubleshooting local SQL setup

If `schema.sql` or `seed.sql` fails on your machine, the most common cause is running against the wrong database or user. Use this checklist:

1. Verify PostgreSQL is running: `pg_isready` (or check the service manager on your OS).
2. Verify your current DB user: `psql -d postgres -c "SELECT current_user;"`.
3. Verify the app DB exists: `psql -d postgres -c "SELECT datname FROM pg_database WHERE datname='stillwaters';"`.
4. Recreate schema + data in order:
   - `psql -d postgres -f db/schema.sql`
   - `psql -d stillwaters -f db/seed.sql`
5. Verify seeded rows: `psql -d stillwaters -c "SELECT COUNT(*) FROM community_posts;"` (should return 12 with current seed).

---

## License

Private / educational use as required by your course or organization.
