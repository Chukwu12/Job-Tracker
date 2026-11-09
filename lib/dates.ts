// todayDateOnly - Returns today's date in ISO format (YYYY-MM-DD)
export function todayDateOnly(): string {
  const now = new Date();
  const localDate = new Date(now.getTime() - now.getTimezoneOffset() * 60_000);
  return localDate.toISOString().slice(0, 10);
}

// formatDateOnly - Formats a date string (YYYY-MM-DD) to a readable format (e.g., "Jan 15")
export function formatDateOnly(value: string): string {
  return new Date(`${value}T00:00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

// isValidDateOnly - Validates if a string is a valid date in YYYY-MM-DD format
export function isValidDateOnly(value: unknown): value is string {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const parsed = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
}