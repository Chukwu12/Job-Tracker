"use client";

import { useEffect, useState } from "react";
import AddApplicationForm from "@/components/AddApplicationForm";
import StatsRow from "@/components/StatsRow";
import ApplicationsTable from "@/components/ApplicationsTable";
import type { Application } from "@/lib/types";

export default function Dashboard() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetch("/api/applications")
      .then((res) => res.json())
      .then((data) => setApplications(data))
      .catch(() => setApplications([]))
      .finally(() => setLoading(false));
  }, []);

  function handleCreated(application: Application) {
    setApplications((prev) => [application, ...prev]);
  }

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
          onClick={() => setShowForm(true)}
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
          <ApplicationsTable
            applications={applications}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
          />
        </div>
      )}

      {showForm && (
        <AddApplicationForm onClose={() => setShowForm(false)} onCreated={handleCreated} />
      )}
    </main>
  );
}
