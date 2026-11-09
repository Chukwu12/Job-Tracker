import { Application } from "./types";

export function daysSince(dateStr: string): number {
  const then = new Date(dateStr).getTime();
  const now = Date.now();
  return Math.floor((now - then) / (1000 * 60 * 60 * 24));
}

export function needsFollowUp(app: Application, today: string): boolean {
  if (app.status !== "Applied" && app.status !== "Screening") return false;
  if (app.followUpDate) return app.followUpDate <= today;
  return daysSince(app.dateApplied) >= 7;
}