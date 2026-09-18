import type { ApplicationStatus } from "@/lib/types";

const DOT_COLORS: Record<ApplicationStatus, string> = {
  Applied: "bg-slate-400",
  Screening: "bg-amber-500",
  Interview: "bg-blue-500",
  Offer: "bg-emerald-500",
  Rejected: "bg-rose-500",
  Ghosted: "bg-zinc-300",
};

const TEXT_COLORS: Record<ApplicationStatus, string> = {
  Applied: "text-slate-600",
  Screening: "text-amber-700",
  Interview: "text-blue-700",
  Offer: "text-emerald-700",
  Rejected: "text-rose-600",
  Ghosted: "text-zinc-400",
};

export default function StatusBadge({ status }: { status: ApplicationStatus }) {
  return (
    <span className={`inline-flex items-center gap-2 text-sm font-medium ${TEXT_COLORS[status]}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${DOT_COLORS[status]}`} aria-hidden="true" />
      {status}
    </span>
  );
}
