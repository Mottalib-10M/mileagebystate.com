/**
 * Mini: M&IE of a trip under the three-quarter rule (FTR § 301-11.20) against every calendar day paid in full,
 * the gap a payor's own consistent method could close (Rev. Proc. 2019-48, 6.04(2)).
 */
import type { MiniSpec } from '../mini-types';
import { usd, PARAMS, money } from './_kit';
export default function pdTravelDays(): MiniSpec {
  const share = PARAMS.mie.partialDayShare;
  return {
    title: 'What the 75% travel-day rule costs',
    cta: 'Check a whole trip',
    inputs: [
      { id: 't', label: 'M&IE rate', def: 74, options: PARAMS.mie.tiers.map((t) => ({ value: String(t), label: `$${t}` })) },
      { id: 'd', label: 'Calendar days, departure and return included', def: 3, max: 365 },
    ],
    run: (v) => {
      const d = Math.max(1, Math.round(v.d)); const fed = d === 1 ? v.t * share : v.t * share * 2 + v.t * (d - 2);
      return { head: ['M&IE under the federal rule', money(fed)], rows: [[`${d === 1 ? 'One day over 12 hours' : '2 travel days'} at ${money(v.t * share)}`, money(d === 1 ? fed : v.t * share * 2)], [`Every day at ${usd(v.t)}`, usd(v.t * d)], ['Gap', money(v.t * d - fed)]], note: 'A deduction must use 75%; a payor may use another method applied consistently.' };
    },
  };
}
