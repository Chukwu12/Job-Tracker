export type ApplicationStatus =
  | "Applied"
  | "Screening"
  | "Interview"
  | "Offer"
  | "Rejected"
  | "Ghosted";

export type ApplicationSource = "Referral" | "Recruiter" | "Cold Apply" | "Job Board" | "Other";

export interface Application {
  _id?: string;
  company: string;
  role: string;
  status: ApplicationStatus;
  dateApplied: string; // ISO date string, e.g. "2026-09-14"
  salaryRange?: string;
  source?: ApplicationSource;
  contactEmail?: string;
  url?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export const STATUS_OPTIONS: ApplicationStatus[] = [
  "Applied",
  "Screening",
  "Interview",
  "Offer",
  "Rejected",
  "Ghosted",
];

export const SOURCE_OPTIONS: ApplicationSource[] = [
  "Job Board",
  "Referral",
  "Recruiter",
  "Cold Apply",
  "Other",
];

// Colors per status, used consistently across the dashboard's badges.
export const STATUS_STYLES: Record<ApplicationStatus, string> = {
  Applied: "bg-slate-100 text-slate-700 border-slate-200",
  Screening: "bg-amber-50 text-amber-700 border-amber-200",
  Interview: "bg-blue-50 text-blue-700 border-blue-200",
  Offer: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Rejected: "bg-rose-50 text-rose-700 border-rose-200",
  Ghosted: "bg-zinc-100 text-zinc-500 border-zinc-200",
};
