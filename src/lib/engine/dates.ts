/** Calendar helpers in UTC: a travel day is a calendar date, never a time zone guess. */
export const toDate = (iso: string) => new Date(`${iso.slice(0, 10)}T00:00:00Z`);
export const iso = (d: Date) => d.toISOString().slice(0, 10);
export const addDays = (isoDate: string, n: number) => { const d = toDate(isoDate); d.setUTCDate(d.getUTCDate() + n); return iso(d); };
export const daysBetween = (a: string, b: string) => Math.round((toDate(b).getTime() - toDate(a).getTime()) / 86400000);
/** Federal fiscal year: October 1 starts the next year (October 1, 2026 is in FY2027). */
export const fiscalYear = (isoDate: string) => { const d = toDate(isoDate); return d.getUTCMonth() >= 9 ? d.getUTCFullYear() + 1 : d.getUTCFullYear(); };
/** Index of the month in a fiscal year, October = 0 … September = 11 (order of the GSA monthly columns). */
export const fiscalMonth = (isoDate: string) => (toDate(isoDate).getUTCMonth() + 3) % 12;
