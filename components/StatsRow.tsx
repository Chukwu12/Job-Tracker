import type { Application } from "@/lib/types";

function daysSince(dateStr: string): number {
  const then = new Date(dateStr).getTime();
  const now = Date.now();
  return Math.floor((now - then) / (1000 * 60 * 60 * 24));
}

export default function StatsRow({ applications }: { applications: Application[] }) {
  const total = applications.length;
  const active = applications.filter(
    (a) => a.status !== "Rejected" && a.status !== "Ghosted"
  ).length;
  const inInterview = applications.filter((a) => a.status === "Interview").length;
  const needsFollowUp = applications.filter(
    (a) =>
      (a.status === "Applied" || a.status === "Screening") &&
      daysSince(a.dateApplied) >= 7
  ).length;

  const stats = [
    { label: "Total applications", value: total },
    { label: "Active", value: active },
    { label: "In interview", value: inInterview },
    { label: "Needs follow-up", value: needsFollowUp, highlight: needsFollowUp > 0 },
  ];

  return (
    <div className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-[#E2E5EA] bg-[#E2E5EA] sm:grid-cols-4">
      {stats.map((stat) => (
        <div key={stat.label} className="bg-white px-5 py-4">
          <p
            className={`font-[family-name:var(--font-display)] text-2xl font-medium ${
              stat.highlight ? "text-amber-600" : "text-[#1B1F23]"
            }`}
          >
            {stat.value}
          </p>
          <p className="mt-1 text-sm text-[#5B6472]">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}
