"use client";

import { useState } from "react";
import { STATUS_OPTIONS, SOURCE_OPTIONS, type Application } from "@/lib/types";

interface AddApplicationFormProps {
  onClose: () => void;
  onCreated: (application: Application) => void;
}

const today = () => new Date().toISOString().slice(0, 10);

export default function AddApplicationForm({ onClose, onCreated }: AddApplicationFormProps) {
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState(STATUS_OPTIONS[0]);
  const [dateApplied, setDateApplied] = useState(today());
  const [salaryRange, setSalaryRange] = useState("");
  const [source, setSource] = useState(SOURCE_OPTIONS[0]);
  const [url, setUrl] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!company.trim() || !role.trim()) {
      setError("Company and role are required.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ company, role, status, dateApplied, salaryRange, source, url, notes }),
      });

      if (!res.ok) throw new Error("Request failed");

      const created = await res.json();
      onCreated(created);
      onClose();
    } catch {
      setError("Couldn't save that application. Try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/20" onClick={onClose}>
      <div
        className="h-full w-full max-w-md overflow-y-auto bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-[#E2E5EA] px-6 py-5">
          <h2 className="font-[family-name:var(--font-display)] text-lg font-medium">
            Add application
          </h2>
          <button
            onClick={onClose}
            className="text-sm text-[#5B6472] hover:text-[#1B1F23]"
            aria-label="Close"
          >
            Close
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 px-6 py-6">
          <div>
            <label className="mb-1 block text-sm font-medium text-[#1B1F23]">Company</label>
            <input
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="Horizon Media"
              className="w-full rounded-md border border-[#E2E5EA] px-3 py-2 text-sm focus:border-[#0F5257] focus:outline-none focus:ring-1 focus:ring-[#0F5257]"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-[#1B1F23]">Role</label>
            <input
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="Fullstack Engineer"
              className="w-full rounded-md border border-[#E2E5EA] px-3 py-2 text-sm focus:border-[#0F5257] focus:outline-none focus:ring-1 focus:ring-[#0F5257]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-[#1B1F23]">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as typeof status)}
                className="w-full rounded-md border border-[#E2E5EA] px-3 py-2 text-sm focus:border-[#0F5257] focus:outline-none focus:ring-1 focus:ring-[#0F5257]"
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-[#1B1F23]">Date applied</label>
              <input
                type="date"
                value={dateApplied}
                onChange={(e) => setDateApplied(e.target.value)}
                className="w-full rounded-md border border-[#E2E5EA] px-3 py-2 text-sm focus:border-[#0F5257] focus:outline-none focus:ring-1 focus:ring-[#0F5257]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-[#1B1F23]">Salary range</label>
              <input
                value={salaryRange}
                onChange={(e) => setSalaryRange(e.target.value)}
                placeholder="$90k–$100k"
                className="w-full rounded-md border border-[#E2E5EA] px-3 py-2 text-sm focus:border-[#0F5257] focus:outline-none focus:ring-1 focus:ring-[#0F5257]"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-[#1B1F23]">Source</label>
              <select
                value={source}
                onChange={(e) => setSource(e.target.value as typeof source)}
                className="w-full rounded-md border border-[#E2E5EA] px-3 py-2 text-sm focus:border-[#0F5257] focus:outline-none focus:ring-1 focus:ring-[#0F5257]"
              >
                {SOURCE_OPTIONS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-[#1B1F23]">Job posting URL</label>
            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://..."
              className="w-full rounded-md border border-[#E2E5EA] px-3 py-2 text-sm focus:border-[#0F5257] focus:outline-none focus:ring-1 focus:ring-[#0F5257]"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-[#1B1F23]">Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Recruiter name, interview details, anything worth remembering"
              className="w-full rounded-md border border-[#E2E5EA] px-3 py-2 text-sm focus:border-[#0F5257] focus:outline-none focus:ring-1 focus:ring-[#0F5257]"
            />
          </div>

          {error && <p className="text-sm text-rose-600">{error}</p>}

          <div className="mt-2 flex gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="rounded-md bg-[#0F5257] px-4 py-2 text-sm font-medium text-white hover:bg-[#0C4247] disabled:opacity-60"
            >
              {submitting ? "Saving…" : "Save application"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-md px-4 py-2 text-sm font-medium text-[#5B6472] hover:text-[#1B1F23]"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
