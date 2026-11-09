"use client";

import { useEffect, useState } from "react";
import ApplicationForm from "@/components/ApplicationForm";
import StatsRow from "@/components/StatsRow";
import ApplicationsTable from "@/components/ApplicationsTable";
import { formatDateOnly, todayDateOnly } from "@/lib/dates";
import type { Application } from "@/lib/types";

// Dashboard - Main dashboard component that displays applications, stats, and follow-ups due
export default function Dashboard() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Application | null>(null);

  useEffect(() => {
    fetch("/api/applications")
      .then((res) => res.json())
      .then((data) => setApplications(data))
      .catch(() => setApplications([]))
      .finally(() => setLoading(false));
  }, []);

  // handleSaved - Updates the applications list after saving a new or edited application
  function handleSaved(saved: Application) {
    setApplications((prev) => {
      const exists = prev.some((a) => a._id === saved._id);
      const next = exists
        ? prev.map((a) => (a._id === saved._id ? saved : a))
        : [saved, ...prev];
      // Keep the same order the API uses: most recently applied first.
      return next.sort((a, b) => b.dateApplied.localeCompare(a.dateApplied));
    });
  }

  // openAdd - Opens the form to add a new application
  function openAdd() {
    setEditing(null);
    setShowForm(true);
  }

  // openEdit - Opens the form to edit an existing application
  function openEdit(application: Application) {
    setEditing(application);
    setShowForm(true);
  }

  // closeForm - Closes the application form and resets editing state
  function closeForm() {
    setShowForm(false);
    setEditing(null);
  }

  const today = todayDateOnly();
  const dueApplications = applications
    .filter(
      (application) =>
        application.followUpDate &&
        application.followUpDate <= today &&
        application.status !== "Rejected" &&
        application.status !== "Ghosted"
    )
    .sort((a, b) => (a.followUpDate ?? "").localeCompare(b.followUpDate ?? ""));

  // handleUpdate - Updates an application field and syncs the change to the API
  async function handleUpdate(id: string, updates: Partial<Application>) {
    setApplications((prev) =>
      prev.map((a) => (a._id === id ? { ...a, ...updates } : a))
    );
    await fetch(`/api/applications/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
  }

  // handleDelete - Deletes an application from the list and the API
  async function handleDelete(id: string) {
    setApplications((prev) => prev.filter((a) => a._id !== id));
    await fetch(`/api/applications/${id}`, { method: "DELETE" });
  }

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-2xl font-medium text-[#1B1F23]">
            Pipeline
          </h1>
          <p className="mt-1 text-sm text-[#5B6472]">
            Every application, where it stands, and what is next.
          </p>
        </div>
        <button
          onClick={openAdd}
          className="rounded-md bg-[#0F5257] px-4 py-2 text-sm font-medium text-white hover:bg-[#0C4247]"
        >
          Add application
        </button>
      </div>

      {loading ? (
        <p className="text-sm text-[#5B6472]">Loading…</p>
      ) : (
        <div className="flex flex-col gap-6">
          <StatsRow applications={applications} />
          {dueApplications.length > 0 && (
            <section aria-labelledby="follow-ups-heading" className="border-y border-[#E2E5EA] py-4">
              <div className="mb-2 flex items-center justify-between">
                <h2 id="follow-ups-heading" className="font-[family-name:var(--font-display)] text-lg font-medium">
                  Follow-ups due
                </h2>
                <span className="text-sm text-[#5B6472]">{dueApplications.length}</span>
              </div>
              <ul className="divide-y divide-[#E2E5EA]">
                {dueApplications.map((application) => (
                  <li key={application._id} className="flex items-center justify-between gap-4 py-3">
                    <div className="min-w-0">
                      <p className="truncate font-medium text-[#1B1F23]">{application.company}</p>
                      <p className="truncate text-sm text-[#5B6472]">{application.role}</p>
                    </div>
                    <div className="flex shrink-0 items-center gap-4">
                      <span className={`text-sm ${application.followUpDate! < today ? "text-rose-600" : "text-amber-700"}`}>
                        {application.followUpDate! < today ? "Overdue" : "Due today"} · {formatDateOnly(application.followUpDate!)}
                      </span>
                      <button
                        onClick={() => openEdit(application)}
                        className="text-sm text-[#0F5257] hover:underline"
                      >
                        Edit
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          )}
          <ApplicationsTable
            applications={applications}
            onUpdate={handleUpdate}
            onEdit={openEdit}
            onDelete={handleDelete}
          />
        </div>
      )}

      {showForm && (
        <ApplicationForm
          key={editing?._id ?? "new"}
          application={editing ?? undefined}
          onClose={closeForm}
          onSaved={handleSaved}
        />
      )}
    </main>
  );
}
