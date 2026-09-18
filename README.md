# Pipeline — Job Application Tracker

A personal dashboard for tracking job applications, statuses, and follow-ups.

## Stack
- Next.js 15 (App Router) + TypeScript
- MongoDB (Atlas free tier recommended)
- Tailwind CSS

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a free MongoDB Atlas cluster at https://www.mongodb.com/cloud/atlas/register
   (M0 free tier, 512MB — plenty for this).

3. Copy the env template and fill in your connection string:
   ```bash
   cp .env.local.example .env.local
   ```
   Then edit `.env.local` with your actual `MONGODB_URI` from Atlas (Database → Connect → Drivers).

4. Run the dev server:
   ```bash
   npm run dev
   ```
   Open http://localhost:3000

## What's here (Phase 1)
- `Application` data model (`lib/types.ts`)
- API routes: list/create (`app/api/applications/route.ts`), get/update/delete by id
  (`app/api/applications/[id]/route.ts`)
- Dashboard: stats row, filterable table, inline status editing, add-application form

## Not yet built (Phase 2/3 ideas)
- Follow-up reminders beyond the visual "stale" flag (e.g. email/notification)
- Quick-add via pasting a job posting URL
- AI-powered job description categorization (extract tech stack, level, salary, red flags)
- Edit existing application details beyond status (currently: change status inline, or delete and re-add)

## Deploying
Push to GitHub, then import the repo into Vercel (https://vercel.com/new). Add the same
`MONGODB_URI` and `MONGODB_DB` as environment variables in the Vercel project settings.
