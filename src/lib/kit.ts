/**
 * Writing kit for page files (CONTRIBUTING-PAGES.md): every figure a page prints is read here, from the
 * data files and params-2026.json, never typed. Import as `KIT as K`, or use `h` inside body().
 */
import { P, T, STATE_LIST, ENERGY_META, VEH, OCONUS_TABLE, stateRef, destsOf, destIndex, CURRENT_FY, PREVIOUS_FY, ZIP_COUNT, PLACE_COUNT } from './data';
import { trip, rateOn, tier, oconusSplit, type TripInput } from './engine/perdiem';
import { irsRate, povRate, splitValue, reimbursement, type Purpose } from './engine/mileage';
import { fuelTrip, evTrip } from './engine/vehicle';
import { usd, num, pct, day, month, listOf, cents } from './fmt';

const MONTHS_FY = ['October', 'November', 'December', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September'];
export interface NsaSummary { i: number; name: string; counties: string; mie: number; low: number; high: number; highMonths: string[]; lowMonths: string[]; total: number; seasonal: boolean; prev?: { mie: number; low: number; high: number } }
/** Every non-standard area of a state in a fiscal year, with its lodging range over the year. */
function nsas(abbr: string, fy = CURRENT_FY): NsaSummary[] {
  return destsOf(abbr, fy).map(({ i, d }) => {
    const r = d.fy[String(fy)]; const lo = Math.min(...r.lodging), hi = Math.max(...r.lodging);
    const p = d.fy[String(fy - 1)];
    return { i, name: d.name, counties: d.counties, mie: r.mie, low: lo, high: hi, highMonths: MONTHS_FY.filter((_, m) => r.lodging[m] === hi), lowMonths: MONTHS_FY.filter((_, m) => r.lodging[m] === lo), total: hi + r.mie, seasonal: lo !== hi,
      prev: p ? { mie: p.mie, low: Math.min(...p.lodging), high: Math.max(...p.lodging) } : undefined };
  }).sort((a, b) => b.high - a.high);
}
function stateSummary(slug: string, fy = CURRENT_FY) {
  const s = stateRef(slug); const list = nsas(s.abbr, fy); const std = P.fiscalYears[String(fy) as '2027'].standard;
  const prevList = nsas(s.abbr, fy - 1);
  return { s, list, count: list.length, prevCount: prevList.length, std, top: list[0], cheapest: list.length ? list[list.length - 1] : undefined, seasonalCount: list.filter((x) => x.seasonal).length,
    mieTiers: [...new Set(list.map((x) => x.mie))].sort((a, b) => a - b), dropped: prevList.filter((p) => !list.some((x) => x.name === p.name)).map((p) => p.name), added: list.filter((x) => !prevList.some((p) => p.name === x.name)).map((x) => x.name) };
}
export const KIT = {
  P, T, STATE_LIST, ENERGY_META, VEH, OCONUS_TABLE, CURRENT_FY, PREVIOUS_FY, MONTHS_FY, ZIP_COUNT, PLACE_COUNT,
  usd, num, pct, day, month, listOf, cents,
  /** "$0.76" style for per-mile rates: three decimals only when the rate has them (0.235). */
  rate: (x: number) => (Math.round(x * 1000) % 10 ? usd(x, 3) : usd(x, 2)),
  /** "76 cents" from 0.76; "23.5 cents" from 0.235. */
  centsWord: (x: number) => `${num(x * 100, Math.round(x * 1000) % 10 ? 1 : 0)} cents`,
  stateRef, destsOf, destIndex, nsas, stateSummary,
  std: (fy = CURRENT_FY) => P.fiscalYears[String(fy) as '2027'].standard,
  fy: (fy = CURRENT_FY) => P.fiscalYears[String(fy) as '2027'],
  tier: (mie: number) => tier(T, mie),
  rateOn: (destI: number | Record<string, number>, date: string) => rateOn(T, destI, date),
  trip: (x: TripInput) => trip(T, P.mie, x),
  irs: (date: string, purpose: Purpose = 'business') => irsRate(P.mileage.irs, date, purpose),
  pov: (date: string, kind: 'automobile' | 'govCarAvailable' | 'motorcycle' | 'airplane' = 'automobile') => povRate(P.mileage.gsaPov, date, kind),
  splitValue: (before: number, after: number, purpose: Purpose = 'business') => splitValue(P.mileage.irs, before, after, purpose),
  reimbursement,
  fuelTrip, evTrip,
  oconus: (mie: number) => oconusSplit(mie, OCONUS_TABLE, P.mie.oconusSplit),
  gas: (slug: string) => stateRef(slug).gas,
  elec: (slug: string) => stateRef(slug).elecCents,
  ev: (labelStart: string) => { const e = VEH.ev.find((x) => x.label.includes(labelStart)); if (!e) throw new Error(`No EPA EV ${labelStart}`); return e; },
  car: (labelStart: string) => { const c = VEH.gas.find((x) => x.label.includes(labelStart)); if (!c) throw new Error(`No EPA car ${labelStart}`); return c; },
};
export type Kit = typeof KIT;
