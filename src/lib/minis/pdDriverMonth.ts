/**
 * Mini: the periodic rule for transportation industry per diem (Rev. Proc. 2019-48, 4.04(4)): a month of
 * allowance against days away × the special CONUS rate of Notice 2026-60; the rest is W-2 wages.
 */
import type { MiniSpec } from '../mini-types';
import { usd, PARAMS, money } from './_kit';
export default function pdDriverMonth(): MiniSpec {
  const r = PARAMS.transportation.conus; const share = PARAMS.mie.partialDayShare;
  return {
    title: 'A month of driver per diem, checked',
    cta: 'Count the whole year',
    inputs: [
      { id: 'p', label: 'Per diem paid for the month', def: 1500, unit: '$', max: 100000 },
      { id: 'f', label: 'Full days away from home', def: 16, max: 31 },
      { id: 'd', label: 'Departure and return days', def: 4, max: 31 },
    ],
    run: (v) => {
      const cap = Math.max(0, v.f) * r + Math.max(0, v.d) * r * share; const ok = Math.min(v.p, cap);
      return { head: ['Tax-free for the month', money(ok)], rows: [[`Ceiling: ${usd(r)} a day, 75% on travel days`, money(cap)], ['Above the ceiling: wages on the W-2', money(Math.max(0, v.p - cap))]], note: 'Partial days at 75% here; a payor may prorate by another consistent method.' };
    },
  };
}
