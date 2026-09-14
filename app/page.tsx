"use client";

import { FormEvent, useEffect, useState } from "react";

const STATUSES = ["Applied", "Interviewing", "Offer", "Rejected"] as const;

type Application = {
  id: string;
  company: string;
  role: string;
  status: (typeof STATUSES)[number];
  notes: string;
  createdAt: string;
};

export default function Home() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState<(typeof STATUSES)[number]>("Applied");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    fetch("/api/applications")
      .then((response) => response.json())
      .then((data: Application[]) => {
        if (!cancelled) {
          setApplications(data);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError("Unable to load applications.");
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ company, role, status, notes }),
      });

      if (!response.ok) {
        const data = (await response.json()) as { error?: string };
        setError(data.error || "Unable to save application.");
        return;
      }

      const data = (await response.json()) as Application;
      setApplications((current) => [data, ...current]);

      setCompany("");
      setRole("");
      setStatus("Applied");
      setNotes("");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-col gap-8 p-6 md:p-10">
      <header>
        <h1 className="text-3xl font-semibold">Job Application Tracker</h1>
        <p className="mt-2 text-sm text-zinc-600">
          Track companies, application statuses, and notes in one place.
        </p>
      </header>

      <form onSubmit={onSubmit} className="grid gap-4 rounded-lg border p-4">
        <label className="grid gap-1">
          <span className="text-sm font-medium">Company *</span>
          <input
            className="rounded border p-2"
            value={company}
            onChange={(event) => setCompany(event.target.value)}
            required
          />
        </label>

        <label className="grid gap-1">
          <span className="text-sm font-medium">Role</span>
          <input
            className="rounded border p-2"
            value={role}
            onChange={(event) => setRole(event.target.value)}
          />
        </label>

        <label className="grid gap-1">
          <span className="text-sm font-medium">Status *</span>
          <select
            className="rounded border p-2"
            value={status}
            onChange={(event) =>
              setStatus(event.target.value as (typeof STATUSES)[number])
            }
          >
            {STATUSES.map((statusOption) => (
              <option key={statusOption} value={statusOption}>
                {statusOption}
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-1">
          <span className="text-sm font-medium">Notes</span>
          <textarea
            className="min-h-24 rounded border p-2"
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
          />
        </label>

        {error ? <p className="text-sm text-red-600">{error}</p> : null}

        <button
          type="submit"
          disabled={submitting}
          className="rounded bg-black px-4 py-2 text-white disabled:opacity-60"
        >
          {submitting ? "Saving..." : "Add Application"}
        </button>
      </form>

      <section className="grid gap-3">
        <h2 className="text-xl font-semibold">Applications</h2>
        {applications.length === 0 ? (
          <p className="text-sm text-zinc-600">No applications yet.</p>
        ) : (
          applications.map((application) => (
            <article key={application.id} className="rounded-lg border p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-lg font-medium">{application.company}</h3>
                <span className="rounded bg-zinc-100 px-2 py-1 text-xs">
                  {application.status}
                </span>
              </div>
              {application.role ? (
                <p className="mt-1 text-sm">{application.role}</p>
              ) : null}
              {application.notes ? (
                <p className="mt-2 text-sm text-zinc-700">{application.notes}</p>
              ) : null}
              <p className="mt-2 text-xs text-zinc-500">
                Added {new Date(application.createdAt).toLocaleDateString()}
              </p>
            </article>
          ))
        )}
      </section>
    </main>
  );
}
