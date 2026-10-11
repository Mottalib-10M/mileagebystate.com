/**
 * Mini: a stay that crosses September 30, nights before October 1 at the FY2026 lodging maximum of September,
 * nights after at the FY2027 maximum of October, M&IE of each fiscal year with 75% on the travel days.
 * arg = { area, sep, oct, mie26, mie27 } from the page (kit); default standard CONUS rate.
 */
import type { MiniSpec } from '../mini-types';
import { usd, parseArg, PARAMS, money } from './_kit';
interface Arg { area: string; sep: number; oct: number; mie26: number; mie27: number }
export default function pdSeptCross(arg?: string): MiniSpec {
  const s26 = PARAMS.fiscalYears['2026'].standard, s27 = PARAMS.fiscalYears['2027'].standard;
  const a = parseArg<Arg>(arg, { area: 'Standard CONUS rate', sep: s26.lodging, oct: s27.lodging, mie26: s26.mie, mie27: s27.mie });
  const share = PARAMS.mie.partialDayShare;
  return {
    title: `${a.area}: a stay across September 30`,
    cta: 'Price the trip day by day',
    inputs: [
      { id: 'b', label: 'Nights before October 1', def: 2, max: 60 },
      { id: 'f', label: 'Nights from October 1', def: 2, max: 60 },
    ],
    run: (v) => {
      const b = Math.max(0, Math.round(v.b)), f = Math.max(0, Math.round(v.f)); const n = b + f;
      let mie26 = 0, mie27 = 0;
      for (let i = 0; i <= n && n > 0; i++) {
        const s = i === 0 || i === n ? share : 1;
        if (i < b) mie26 += a.mie26 * s; else mie27 += a.mie27 * s;
      }
      const lod26 = b * a.sep, lod27 = f * a.oct;
      return { head: ['Per diem at the federal maximum', money(lod26 + lod27 + mie26 + mie27)], rows: [[`FY2026 lodging: ${b} × ${usd(a.sep)}`, usd(lod26)], [`FY2027 lodging: ${f} × ${usd(a.oct)}`, usd(lod27)], ['M&IE, FY2026 days', money(mie26)], ['M&IE, FY2027 days', money(mie27)]], note: 'Each night and each day takes the table of its own date.' };
    },
  };
}
