/** Mini: the same miles before and after July 1, 2026 (IRS Announcement 2026-11), for a purpose. */
import type { MiniSpec } from '../mini-types';
import { usd, num, rate, PARAMS, money } from './_kit';
export default function mileSplit(): MiniSpec {
  const [after, before] = PARAMS.mileage.irs;
  const P = [['business', 'Business'], ['medical', 'Medical'], ['moving', 'Military move'], ['charity', 'Charity']] as const;
  return {
    title: 'What a mile is worth in 2026',
    cta: 'Open the mileage calculator',
    inputs: [
      { id: 'm', label: 'Miles', def: 500, unit: 'mi', max: 200000 },
      { id: 'p', label: 'Purpose', def: 0, options: P.map(([, l], i) => ({ value: String(i), label: l })) },
    ],
    run: (v) => {
      const k = P[Math.min(3, Math.max(0, Math.round(v.p)))][0];
      const a = before[k], b = after[k];
      return { head: ['Value from July 1, 2026', money(v.m * b)], rows: [[`${num(v.m)} mi × ${rate(b)} (from July 1)`, money(v.m * b)], [`${num(v.m)} mi × ${rate(a)} (Jan. 1 to June 30)`, money(v.m * a)], ['Difference', money(v.m * (b - a))]] };
    },
  };
}
