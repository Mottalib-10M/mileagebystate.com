/**
 * Mini: a per diem advance under an accountable plan (Rev. Proc. 2019-48, 7.02): days not substantiated are
 * returned, the part above the federal rate on substantiated days stays with the employee as W-2 wages.
 */
import type { MiniSpec } from '../mini-types';
import { usd, PARAMS, money } from './_kit';
export default function pdAccountable(): MiniSpec {
  const s = PARAMS.fiscalYears['2027'].standard;
  return {
    title: 'A per diem advance, settled',
    cta: 'Check the excess over a trip',
    inputs: [
      { id: 'p', label: 'Advance per day', def: 200, unit: '$', max: 5000 },
      { id: 'a', label: 'Days advanced', def: 5, max: 366 },
      { id: 's', label: 'Days actually substantiated', def: 3, max: 366 },
      { id: 'f', label: 'Federal rate of the place per day', def: s.lodging + s.mie, unit: '$', max: 5000 },
    ],
    run: (v) => {
      const s2 = Math.min(Math.max(0, Math.round(v.s)), Math.max(0, Math.round(v.a))); const back = v.p * (Math.max(0, Math.round(v.a)) - s2);
      const free = Math.min(v.p, v.f) * s2; const wages = Math.max(0, v.p - v.f) * s2;
      return { head: ['To return to the employer', money(back)], rows: [['Kept tax-free (up to the federal rate)', money(free)], ['Kept, but taxed as wages', money(wages)], ['Advance paid', usd(v.p * Math.max(0, Math.round(v.a)), 2)]], note: 'The return must happen within a reasonable period (120-day safe harbor).' };
    },
  };
}
