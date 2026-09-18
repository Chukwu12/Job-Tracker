"use client";

import { useState } from "react";
import { STATUS_OPTIONS, type Application, type ApplicationStatus } from "@/lib/types";

function daysSince(dateStr: string): number {
  const then = new Date(dateStr).getTime();
  const now = Date.now();
  return Math.floor((now - then) / (1000 * 60 * 60 * 24));
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

interface ApplicationsTableProps {
  applications: Application[];
  onUpdate: (id: string, updates: Partial<Application>) => void;
  onDelete: (id: string) => void;
}

export default function ApplicationsTable({
  applications,
  onUpdate,
  onDelete,
}: ApplicationsTableProps) {
  const [filter, setFilter] = useState<ApplicationStatus | "All">("All");

  const filtered =
    filter === "All" ? applications : applications.filter((a) => a.status === filter);

  if (applications.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-[#E2E5EA] px-6 py-16 text-center">
        <p className="font-[family-name:var(--font-display)] text-lg text-[#1B1F23]">
          Nothing tracked yet
        </p>
        <p className="mt-1 text-sm text-[#5B6472]">
          Add your first application to start building your pipeline.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-3 flex flex-wrap gap-2">
        {(["All", ...STATUS_OPTIONS] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`rounded-full border px-3 py-1 text-sm transition-colors ${
              filter === s
                ? "border-[#0F5257] bg-[#0F5257] text-white"
                : "border-[#E2E5EA] text-[#5B6472] hover:border-[#0F5257] hover:text-[#0F5257]"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded-lg border border-[#E2E5EA] bg-white">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-[#E2E5EA] text-[#5B6472]">
              <th className="px-5 py-3 font-medium">Company</th>
              <th className="px-5 py-3 font-medium">Role</th>
              <th className="px-5 py-3 font-medium">Applied</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium">Salary</th>
              <th className="px-5 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((app) => {
              const stale =
                (app.status === "Applied" || app.status === "Screening") &&
                daysSince(app.dateApplied) >= 7;

              return (
                <tr
                  key={app._id}
                  className="border-b border-[#E2E5EA] last:border-0 hover:bg-[#F7F8FA]"
                >
                  <td className="px-5 py-3 font-medium text-[#1B1F23]">
                    {app.url ? (
                      <a
                        href={app.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-[#0F5257] hover:underline"
                      >
                        {app.company}
                      </a>
                    ) : (
                      app.company
                    )}
                  </td>
                  <td className="px-5 py-3 text-[#5B6472]">{app.role}</td>
                  <td className="px-5 py-3 text-[#5B6472]">
                    {formatDate(app.dateApplied)}
                    {stale && (
                      <span className="ml-2 text-amber-600" title="No update in 7+ days">
                        ●
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3">
                    <select
                      value={app.status}
                      onChange={(e) =>
                        app._id &&
                        onUpdate(app._id, { status: e.target.value as ApplicationStatus })
                      }
                      className="cursor-pointer rounded border-none bg-transparent text-sm focus:outline-none"
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-5 py-3 text-[#5B6472]">{app.salaryRange || "—"}</td>
                  <td className="px-5 py-3 text-right">
                    <button
                      onClick={() => app._id && onDelete(app._id)}
                      className="text-[#5B6472] hover:text-rose-600"
                      aria-label={`Delete ${app.company} application`}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
