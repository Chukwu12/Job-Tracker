# Job Application Tracker

A minimal job application tracker built with:

- Next.js (App Router) + TypeScript
- MongoDB (Atlas-compatible)
- Tailwind CSS

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create an environment file:

   ```bash
   cp .env.example .env.local
   ```

3. Set your MongoDB connection values in `.env.local`:

   ```env
   MONGODB_URI=your_mongodb_connection_string
   MONGODB_DB_NAME=job_tracker
   ```

4. Run the app:

   ```bash
   npm run dev
   ```

Open `http://localhost:3000` to use the tracker.

## Deployment

Deploy on Vercel and configure the same environment variables:

- `MONGODB_URI`
- `MONGODB_DB_NAME`
