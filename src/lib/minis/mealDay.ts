/** Mini: M&IE left for one day after provided meals, at a chosen tier, full day or travel day. */
import type { MiniSpec } from '../mini-types';
import { usd, TIERS, yesNo, PARAMS } from './_kit';
export default function mealDay(): MiniSpec {
  const share = PARAMS.mie.partialDayShare;
  return {
    title: 'One day of M&IE with meals provided',
    cta: 'Price a whole trip',
    inputs: [
      { id: 't', label: 'M&IE tier', def: 80, options: PARAMS.mie.tiers.map((t) => ({ value: String(t), label: `$${t}` })) },
      { id: 'd', label: 'First or last day of travel?', def: 0, options: yesNo },
      { id: 'l', label: 'Lunch provided?', def: 1, options: yesNo },
      { id: 'n', label: 'Dinner provided?', def: 0, options: yesNo },
    ],
    run: (v) => {
      const t = TIERS[String(v.t)] ?? TIERS['80']; const allowed = v.t * (v.d ? share : 1);
      const off = (v.l ? t[1] : 0) + (v.n ? t[2] : 0); const net = Math.max(Math.min(t[3], allowed), allowed - off);
      return { head: ['M&IE paid for that day', usd(net, 2)], rows: [['Before meal deductions', usd(allowed, 2)], ['Lunch value', usd(t[1])], ['Dinner value', usd(t[2])], ['Floor: incidental expenses', usd(t[3])]] };
    },
  };
}
