/**
 * Mini: one CONUS trip under the high-low method (Notice 2026-60) against the regular federal per diem of the
 * place, both as the tax-free ceiling of a lodging + M&IE allowance.
 */
import type { MiniSpec } from '../mini-types';
import { usd, PARAMS, yesNo } from './_kit';
export default function pdHighLow(): MiniSpec {
  const y = PARAMS.highLow['2027']; const s = PARAMS.fiscalYears['2027'].standard;
  return {
    title: 'High-low or the city rate?',
    cta: 'Count a year of trips',
    inputs: [
      { id: 'n', label: 'Full days in the place', def: 4, max: 366 },
      { id: 'r', label: 'GSA lodging + M&IE of the place', def: s.lodging + s.mie, unit: '$', max: 3000 },
      { id: 'h', label: 'On the high-cost list for those dates?', def: 0, options: yesNo },
    ],
    run: (v) => {
      const n = Math.max(0, Math.round(v.n)); const hl = (v.h ? y.high : y.low) * n; const reg = v.r * n;
      return { head: ['High-low ceiling', usd(hl)], rows: [[`${n} × ${usd(v.h ? y.high : y.low)} (${y.notice})`, usd(hl)], [`${n} × ${usd(v.r)} at the GSA rate`, usd(reg)], [hl >= reg ? 'High-low pays more by' : 'GSA rate pays more by', usd(Math.abs(hl - reg))]], note: 'An employer must keep one method for an employee for the whole calendar year.' };
    },
  };
}
