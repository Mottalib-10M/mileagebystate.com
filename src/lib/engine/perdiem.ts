/**
 * Federal per diem for a trip in the continental U.S. (CONUS), as the Federal Travel Regulation applies it
 * since FTR Case 2025-05 (90 FR 56893, December 8, 2025):
 *  - lodging: each night up to the maximum of the month of that night (GSA monthly columns), § 301-11.19;
 *  - M&IE: 75% on the day of departure and the last day, 100% on full days; a trip of more than 12 but
 *    less than 24 hours gets 75% of one day, 12 hours or less gets nothing (§ 301-11.1(c), § 301-11.20);
 *  - meals provided by the government or in a registration fee are deducted at the GSA breakdown amount,
 *    in full even on the 75% days, never leaving less than the incidental expenses (§ 301-11.21(b));
 *  - the rate is that of the fiscal year of each calendar day: a trip across September 30 changes table.
 */
import { addDays, daysBetween, fiscalYear, fiscalMonth } from './dates';

export interface FyRate { mie: number; lodging: number[] }
export interface Dest { st: string; name: string; counties: string; slug: string; fy: Record<string, FyRate> }
export interface Tier { breakfast: number; lunch: number; dinner: number; incidentals: number }
export interface Tables { standard: Record<string, { lodging: number; mie: number }>; tiers: Record<string, Tier>; dest: Dest[] }
export interface Rules { partialDayShare: number; travelMinHours: number }

/** Rate of a destination (index, or -1 for the standard CONUS rate) on a date. A destination absent from
 *  that fiscal year's table (Allentown, PA in FY2027) falls back to the standard rate, as GSA does. */
export type DestRef = number | Record<string, number>;
export function rateOn(T: Tables, dest: DestRef, date: string) {
  const fy = String(fiscalYear(date));
  const destIndex = typeof dest === 'number' ? dest : (dest[fy] ?? -1);
  const std = T.standard[fy] ?? T.standard[Object.keys(T.standard).sort().pop()!];
  const r = destIndex >= 0 ? T.dest[destIndex]?.fy[fy] : undefined;
  if (!r) return { fy: Number(fy), lodging: std.lodging, mie: std.mie, standard: true };
  return { fy: Number(fy), lodging: r.lodging[fiscalMonth(date)], mie: r.mie, standard: false };
}

export function tier(T: Tables, mie: number): Tier {
  const t = T.tiers[String(mie)];
  if (!t) throw new Error(`No GSA breakdown for an M&IE of $${mie}`);
  return t;
}

export interface Meals { breakfast: number; lunch: number; dinner: number }
export interface TripInput {
  /** GSA destination index (-1 standard), or one index per fiscal year ({ '2027': i, '2026': j }). */
  destIndex: DestRef;
  depart: string;
  ret: string;
  /** Same-day trip only: hours in travel status. */
  hours?: number;
  /** Meals provided over the whole trip (government or registration fee), by type. */
  meals?: Meals;
  /** Meals provided on the first or last day: these are deducted from the reduced 75% amount. */
  mealsOnTravelDays?: Meals;
  /** Nightly room cost actually paid (0 = assume the full lodging maximum). */
  roomCost?: number;
}
export interface DayLine { date: string; fy: number; kind: 'first' | 'last' | 'full' | 'single'; share: number; mie: number; mieAllowed: number; deduction: number; mieNet: number; lodgingMax: number; lodging: number }
export interface TripResult { days: DayLine[]; nights: number; lodging: number; lodgingMax: number; mieGross: number; deductions: number; mie: number; total: number; crossesFy: boolean; eligible: boolean }

/** Spreads provided meals over the days: travel-day meals on the first/last day, the rest on full days. */
export function trip(T: Tables, R: Rules, x: TripInput): TripResult {
  const n = Math.max(0, daysBetween(x.depart, x.ret));
  const days: DayLine[] = [];
  const room = x.roomCost && x.roomCost > 0 ? x.roomCost : 0;
  const zero: Meals = { breakfast: 0, lunch: 0, dinner: 0 };
  const left = { ...zero, ...(x.meals ?? {}) };
  const travelLeft = { ...zero, ...(x.mealsOnTravelDays ?? {}) };
  let eligible = true;
  for (let i = 0; i <= n; i++) {
    const date = addDays(x.depart, i);
    const r = rateOn(T, x.destIndex, date);
    const t = tier(T, r.mie);
    const kind: DayLine['kind'] = n === 0 ? 'single' : i === 0 ? 'first' : i === n ? 'last' : 'full';
    let share = kind === 'full' ? 1 : R.partialDayShare;
    if (kind === 'single' && (x.hours ?? 0) <= R.travelMinHours) { share = 0; eligible = false; }
    const mieAllowed = r.mie * share;
    // Meals of this day: travel-day meals first on the first/last day, other meals on full days.
    const take = (pool: Meals) => { const d = { ...zero }; for (const k of ['breakfast', 'lunch', 'dinner'] as const) if (pool[k] > 0) { d[k] = 1; pool[k] -= 1; } return d; };
    const eaten = kind === 'full' ? take(left) : take(travelLeft);
    const raw = eaten.breakfast * t.breakfast + eaten.lunch * t.lunch + eaten.dinner * t.dinner;
    const floor = share > 0 ? Math.min(t.incidentals, mieAllowed) : 0;
    const mieNet = Math.max(floor, mieAllowed - raw);
    const deduction = mieAllowed - mieNet;
    const night = i < n;
    const lodgingMax = night ? r.lodging : 0;
    const lodging = night ? (room ? Math.min(room, r.lodging) : r.lodging) : 0;
    days.push({ date, fy: r.fy, kind, share, mie: r.mie, mieAllowed, deduction, mieNet, lodgingMax, lodging });
  }
  const sum = (f: (d: DayLine) => number) => days.reduce((s, d) => s + f(d), 0);
  const lodging = sum((d) => d.lodging), mie = sum((d) => d.mieNet);
  return { days, nights: n, lodging, lodgingMax: sum((d) => d.lodgingMax), mieGross: sum((d) => d.mieAllowed), deductions: sum((d) => d.deduction), mie, total: lodging + mie, crossesFy: new Set(days.map((d) => d.fy)).size > 1, eligible };
}

/** OCONUS breakdown (GSA M&IE breakdowns page): the GSA table for rates of $1 to $265; above $265,
 *  15% breakfast, 25% lunch, 40% dinner and the remainder to incidentals. */
export function oconusSplit(mie: number, table: Record<string, number[]>, split: { breakfast: number; lunch: number; dinner: number }) {
  const r = Math.round(mie);
  const row = table[String(r)];
  if (row) return { breakfast: row[0], lunch: row[1], dinner: row[2], incidentals: row[3], fromTable: true };
  const b = Math.round(r * split.breakfast), l = Math.round(r * split.lunch), d = Math.round(r * split.dinner);
  return { breakfast: b, lunch: l, dinner: d, incidentals: r - b - l - d, fromTable: false };
}

/** Simple per diem for a number of nights at given rates (used by OCONUS and quick tools). */
export function flatTrip(lodgingRate: number, mieRate: number, nights: number, share: number) {
  const days = nights + 1;
  const mie = nights === 0 ? 0 : mieRate * share * 2 + mieRate * Math.max(0, days - 2);
  return { lodging: lodgingRate * nights, mie, total: lodgingRate * nights + mie, days };
}
