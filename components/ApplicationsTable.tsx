"use client";

import { useState } from "react";
import { formatDateOnly, todayDateOnly } from "@/lib/dates";
import { needsFollowUp } from "@/lib/followUp";
import { STATUS_OPTIONS, type Application, type ApplicationStatus } from "@/lib/types";
import StatusBadge from "./StatusBadge";

interface ApplicationsTableProps {
  applications: Application[];
  onUpdate: (id: string, updates: Partial<Application>) => void;
  onEdit: (application: Application) => void;
  onDelete: (id: string) => void;
}

// ApplicationsTable - Displays a table of job applications with filtering, status changes, and edit/delete actions
export default function ApplicationsTable({
  applications,
  onUpdate,
  onEdit,
  onDelete,
}: ApplicationsTableProps) {
  const [filter, setFilter] = useState<ApplicationStatus | "All">("All");
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<"dateApplied" | "company" | "status" | "followUpDate">("dateApplied");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const today = todayDateOnly();

  // toggleSort - Toggles sort direction if same column is clicked, otherwise switches to new column
  function toggleSort(key: typeof sortKey) {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  const q = query.trim().toLowerCase();

  const filtered = applications.filter((a) => {
    const matchesStatus = filter === "All" || a.status === filter;
    const matchesSearch =
      !q ||
      a.company.toLowerCase().includes(q) ||
      a.role.toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  // Sort a copy of filtered array based on sortKey and sortDir
  const sorted = [...filtered].sort((a, b) => {
    let comparison = 0;

    if (sortKey === "company") {
      comparison = a.company.localeCompare(b.company);
    } else if (sortKey === "dateApplied") {
      comparison = a.dateApplied.localeCompare(b.dateApplied);
    } else if (sortKey === "followUpDate") {
      const aDate = a.followUpDate || "";
      const bDate = b.followUpDate || "";
      comparison = aDate.localeCompare(bDate);
    } else if (sortKey === "status") {
      comparison = STATUS_OPTIONS.indexOf(a.status) - STATUS_OPTIONS.indexOf(b.status);
    }

    return sortDir === "desc" ? -comparison : comparison;
  });

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
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search company or role"
        aria-label="Search applications"
        className="mb-3 w-full rounded-md border border-[#E2E5EA] px-3 py-2 text-sm focus:border-[#0F5257] focus:outline-none focus:ring-1 focus:ring-[#0F5257] sm:max-w-xs"
      />

      <div className="mb-3 flex flex-wrap gap-2">
        {(["All", ...STATUS_OPTIONS] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`rounded-full border px-3 py-1 text-sm transition-colors ${filter === s
              ? "border-[#0F5257] bg-[#0F5257] text-white"
              : "border-[#E2E5EA] text-[#5B6472] hover:border-[#0F5257] hover:text-[#0F5257]"
              }`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto rounded-lg border border-[#E2E5EA] bg-white">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead>
            <tr className="border-b border-[#E2E5EA] text-[#5B6472]">
              <th className="px-5 py-3 font-medium">
                <button
                  onClick={() => toggleSort("company")}
                  className={`hover:text-[#0F5257] ${sortKey === "company" ? "text-[#0F5257] font-semibold" : ""}`}
                >
                  Company {sortKey === "company" && (sortDir === "asc" ? "↑" : "↓")}
                </button>
              </th>
              <th className="px-5 py-3 font-medium">Role</th>
              <th className="px-5 py-3 font-medium">
                <button
                  onClick={() => toggleSort("dateApplied")}
                  className={`hover:text-[#0F5257] ${sortKey === "dateApplied" ? "text-[#0F5257] font-semibold" : ""}`}
                >
                  Applied {sortKey === "dateApplied" && (sortDir === "asc" ? "↑" : "↓")}
                </button>
              </th>
              <th className="px-5 py-3 font-medium">
                <button
                  onClick={() => toggleSort("followUpDate")}
                  className={`hover:text-[#0F5257] ${sortKey === "followUpDate" ? "text-[#0F5257] font-semibold" : ""}`}
                >
                  Follow-up {sortKey === "followUpDate" && (sortDir === "asc" ? "↑" : "↓")}
                </button>
              </th>
              <th className="px-5 py-3 font-medium">
                <button
                  onClick={() => toggleSort("status")}
                  className={`hover:text-[#0F5257] ${sortKey === "status" ? "text-[#0F5257] font-semibold" : ""}`}
                >
                  Status {sortKey === "status" && (sortDir === "asc" ? "↑" : "↓")}
                </button>
              </th>
              <th className="px-5 py-3 font-medium">Salary</th>
              <th className="px-5 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((app) => {
              const stale = needsFollowUp(app, today);

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
                    {formatDateOnly(app.dateApplied)}
                    {stale && (
                      <span className="ml-2 text-amber-600" title="No update in 7+ days">
                        ●
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3 text-[#5B6472]">
                    {app.status === "Rejected" || app.status === "Ghosted" ? (
                      "—"
                    ) : app.followUpDate ? (
                      <span className={app.followUpDate < today ? "text-rose-600" : ""}>
                        {app.followUpDate < today
                          ? `Overdue · ${formatDateOnly(app.followUpDate)}`
                          : app.followUpDate === today
                            ? "Today"
                            : formatDateOnly(app.followUpDate)}
                      </span>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="px-5 py-3">
                    <div className="group relative inline-block">
                      <StatusBadge status={app.status} />
                      <select
                        value={app.status}
                        onChange={(e) =>
                          app._id &&
                          onUpdate(app._id, { status: e.target.value as ApplicationStatus })
                        }
                        className="absolute inset-0 h-full w-full cursor-pointer rounded border-none bg-transparent text-sm opacity-0 focus:outline-none"
                        aria-label="Change application status"
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-[#5B6472]">{app.salaryRange || "—"}</td>
                  <td className="whitespace-nowrap px-5 py-3 text-right">
                    <button
                      onClick={() => onEdit(app)}
                      className="mr-4 text-[#5B6472] hover:text-[#0F5257]"
                      aria-label={`Edit ${app.company} application`}
                    >
                      Edit
                    </button>
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
        {sorted.length === 0 && (
          <p className="px-5 py-6 text-center text-sm text-[#5B6472]">
            {q
              ? `No applications match "${query.trim()}".`
              : `No applications with status "${filter}".`}
          </p>
        )}
      </div>
    </div>
  );
}
