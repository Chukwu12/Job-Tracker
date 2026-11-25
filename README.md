# Pipeline — Job Application Tracker

A personal dashboard for tracking job applications, statuses, and follow-ups.

## Stack
- **Framework:** Next.js 16 (App Router) + React 19 + TypeScript
- **Database:** MongoDB (Atlas free tier recommended)
- **Styling:** Tailwind CSS 4
- **Runtime:** Node.js 20+

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
   
   Optional: Set `MONGODB_DB_NAME` to specify a custom database name (defaults to `job_tracker`).

4. Run the dev server:
   ```bash
   npm run dev
   ```
   Open http://localhost:3000

## Available Commands
- `npm run dev` — Start development server
- `npm run build` — Build for production
- `npm start` — Start production server
- `npm run lint` — Run ESLint checks

## Features (Implemented)
### Core Application Tracking
- **Data Model:** Full `Application` schema with company, role, status, dates, salary, and notes
- **Dashboard:** Overview with stats, filterable/sortable table, and quick actions
- **Status Management:** 6-status workflow (Applied → Screening → Interview → Offer / Rejected / Ghosted)
- **Status History:** Track status changes over time with timestamps
- **Application Sources:** Tag applications by source (Job Board, Referral, Recruiter, Cold Apply, Other)

### Application Management
- **Add/Edit Applications:** Slide-over form for creating and editing full details
- **Inline Editing:** Quick status updates directly from the table
- **Soft Deletes:** Applications are marked as deleted but can be restored via the restore endpoint
- **Restore Capability:** `POST /api/applications/[id]/restore` to restore soft-deleted applications

### Follow-up Tracking
- **Follow-up Dates:** Set custom follow-up dates for each application
- **Auto-follow-up Detection:** Automatic reminders for Applied/Screening status after 7 days
- **Due Applications Widget:** Shows all overdue follow-ups at a glance
- **Status-aware Follow-ups:** Follow-ups ignored for Rejected and Ghosted statuses

### Rich Application Details
- **Contact Information:** Store recruiter/hiring manager email
- **Job URL:** Link to the original job posting
- **Salary Range:** Track salary expectations or offers
- **Notes:** Free-form notes and observations per application

### UI/UX
- **Status Badges:** Color-coded status badges for visual scanning
- **Responsive Design:** Works on desktop and mobile
- **Error Handling:** User-friendly error messages and retry options
- **Undo for Deletes:** Toast notification with undo capability for deleted applications

## API Endpoints
- `GET /api/applications` — List all applications
- `POST /api/applications` — Create a new application
- `GET /api/applications/[id]` — Get a single application
- `PUT /api/applications/[id]` — Update an application
- `DELETE /api/applications/[id]` — Soft-delete an application
- `POST /api/applications/[id]/restore` — Restore a soft-deleted application

## Data Schema
```typescript
interface Application {
  _id?: string;
  company: string;
  role: string;
  status: "Applied" | "Screening" | "Interview" | "Offer" | "Rejected" | "Ghosted";
  dateApplied: string; // ISO date string (YYYY-MM-DD)
  lastContact?: string;
  history?: Array<{ status: string; date: string }>;
  followUpDate?: string;
  salaryRange?: string;
  source?: "Job Board" | "Referral" | "Recruiter" | "Cold Apply" | "Other";
  contactEmail?: string;
  url?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}
```

## Planned Features (Phase 2/3)
- Email or push notifications for follow-up reminders
- Quick-add via pasting a job posting URL
- AI-powered job description categorization (extract tech stack, level, salary, red flags)
- Application analytics and dashboards
- Interview preparation notes and resources

## Deploying to Vercel
1. Push your code to GitHub
2. Import the repo into Vercel: https://vercel.com/new
3. Add environment variables in Vercel project settings:
   - `MONGODB_URI` — Your MongoDB connection string
   - `MONGODB_DB_NAME` — (Optional) Database name, defaults to `job_tracker`
4. Deploy!

## Project Structure
```
├── app/                      # Next.js App Router
│   ├── api/applications/     # API endpoints
│   ├── applications/[id]/    # Application detail page (if needed)
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Dashboard page
├── components/               # React components
│   ├── ApplicationForm.tsx   # Add/edit form
│   ├── ApplicationsTable.tsx # Main table
│   ├── StatsRow.tsx          # Statistics widget
│   └── StatusBadge.tsx       # Status badge component
├── lib/                      # Utilities and helpers
│   ├── mongodb.ts            # Database connection
│   ├── dates.ts              # Date utilities
│   ├── followUp.ts           # Follow-up logic
│   └── types.ts              # TypeScript interfaces
└── public/                   # Static assets
```
