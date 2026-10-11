/**
 * Mini: per diem for N nights in one GSA area (lodging of a chosen month, M&IE with 75% travel days).
 * arg = { area, lodging: [12 monthly maximums Oct..Sep], mie } from the page (kit), default standard CONUS.
 */
import type { MiniSpec } from '../mini-types';
import { usd, parseArg, PARAMS, money } from './_kit';
const MONTHS = ['October', 'November', 'December', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September'];
interface Arg { area: string; lodging: number[]; mie: number }
export default function areaTrip(arg?: string): MiniSpec {
  const s = PARAMS.fiscalYears['2027'].standard;
  const a = parseArg<Arg>(arg, { area: 'Standard CONUS rate', lodging: Array(12).fill(s.lodging), mie: s.mie });
  const share = PARAMS.mie.partialDayShare;
  return {
    title: `${a.area}: per diem for a stay`,
    cta: 'Open the full trip calculator',
    inputs: [
      { id: 'n', label: 'Nights', def: 3, max: 60 },
      { id: 'm', label: 'Month of the stay (FY2027)', def: 1, options: MONTHS.map((m, i) => ({ value: String(i), label: m })) },
    ],
    run: (v) => {
      const n = Math.max(0, Math.round(v.n)); const lod = a.lodging[Math.min(11, Math.max(0, v.m))] ?? a.lodging[0];
      const mie = n === 0 ? 0 : a.mie * share * 2 + a.mie * Math.max(0, n - 1);
      return { head: ['Lodging + M&IE at the federal maximum', money(lod * n + mie)], rows: [[`Lodging: ${n} × ${usd(lod)}`, usd(lod * n)], [`M&IE: 2 travel days at ${money(a.mie * share)}`, money(n === 0 ? 0 : a.mie * share * 2)], [`M&IE: ${Math.max(0, n - 1)} full day${n === 2 ? '' : 's'} at ${usd(a.mie)}`, usd(a.mie * Math.max(0, n - 1))]], note: 'Lodging taxes on top; provided meals are deducted in the full calculator.' };
    },
  };
}
