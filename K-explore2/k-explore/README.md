# K Explore

**Discover. Experience. Register.**

K Explore is a responsive event management website. Visitors can browse upcoming events, search and filter them, read full event details, and register through a validated form. It ships with dark/light mode, live countdown timers, animations and registration data that persists between visits.

- **Live site:** _add your Vercel URL here_
- **Repository:** _add your GitHub URL here_

## Features

**Core requirements**

- Hero carousel introducing featured events, followed by trending and upcoming sections
- Event cards showing image, title, date, venue, price and a short description
- Browse, search (with suggestions) and filter by category, date range and price, with sorting
- Event detail page with description, highlights, venue, date, seats remaining and a register button
- Registration form collecting name, email, mobile number and the selected event, with JavaScript validation (valid email, 10-digit Indian mobile number, required fields) and inline error messages
- Confirmation screen with a registration ID after a successful submission
- Fully responsive across mobile, tablet and desktop

**Bonus challenges**

- Dark and light mode, remembered between visits
- Countdown timer on every event page
- Animations and transitions (page transitions, hero crossfade, scroll reveals, toasts)
- Registration data management: registrations, favourites and contact messages are stored in Supabase, or in `localStorage` when Supabase is not configured

**Extras**

- My Registrations page with cancel support
- Favourites (save events with the heart icon)
- Duplicate-email, registration-deadline and seat-capacity checks
- Loading skeletons, empty states, error states and accessible markup (labels, ARIA, focus rings, reduced-motion support)

## Tech stack

HTML5 · CSS3 (Tailwind CSS) · TypeScript · React 18 · React Router · Vite · Motion · Lucide icons · Supabase (optional)

## Getting started

```bash
npm install
npm run dev
```

Open the local URL that Vite prints. Other scripts:

```bash
npm run build       # production build into dist/
npm run preview     # serve the production build locally
npm run typecheck   # TypeScript check
npm run lint        # ESLint
```

### Environment variables (optional)

The app works out of the box in **local mode**, storing data in the browser. To use Supabase instead:

1. Create a Supabase project.
2. Run the SQL in `supabase/migrations/` in the Supabase SQL editor.
3. Copy `.env.example` to `.env` and fill in `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.

The anon key is designed to be public. All access goes through database functions that check an anonymous per-browser token, deadlines, capacity and duplicate emails; row level security blocks direct table access.

## Deployment (Vercel)

1. Push this repository to GitHub.
2. In Vercel, choose **Add New → Project** and import the repository. Vite is detected automatically.
3. Under **Settings → Environment Variables**, add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` (skip this to run in local mode).
4. Deploy. `vercel.json` rewrites all routes to `index.html`, so refreshing or sharing a deep link such as `/event/evt-01` works.

Environment variables are baked in at build time, so redeploy after changing them.

## Project structure

```
src/
  components/   Reusable UI (EventCard, Hero, Navbar, forms, modal, toast...)
  pages/        One file per route
  hooks/        Theme, toast, favourites, seat counts, my registrations
  services/     Data access (Supabase with localStorage fallback)
  lib/          Validation, formatting, filtering, storage helpers
  data/         Sample events and categories
  types/        Shared TypeScript types
supabase/
  migrations/   Database schema and functions
```

## Routes

| Path | Page |
| --- | --- |
| `/` | Home |
| `/explore` | Browse, search and filter |
| `/event/:id` | Event details |
| `/register/:id` | Registration form |
| `/my-registrations` | Your registrations |
| `/favourites` | Saved events |
| `/about`, `/contact` | Information and contact form |

## Notes

Event data is sample content defined in `src/data/events.ts`. Images are loaded from Pexels. No payments are processed.
