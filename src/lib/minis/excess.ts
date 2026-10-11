/** Mini: how much of a daily allowance becomes wages when it exceeds the federal rate. */
import type { MiniSpec } from '../mini-types';
import { usd, PARAMS } from './_kit';
export default function excess(): MiniSpec {
  const s = PARAMS.fiscalYears['2027'].standard;
  return {
    title: 'Allowance above the federal rate',
    cta: 'Check a full trip',
    inputs: [
      { id: 'p', label: 'Daily allowance paid', def: 225, unit: '$', max: 5000 },
      { id: 'f', label: 'Federal rate of the place', def: s.lodging + s.mie, unit: '$', max: 5000 },
      { id: 'd', label: 'Days', def: 5, max: 366 },
    ],
    run: (v) => ({ head: ['Taxable as wages', usd(Math.max(0, v.p - v.f) * v.d)], rows: [['Tax-free part', usd(Math.min(v.p, v.f) * v.d)], ['Paid in total', usd(v.p * v.d)]], note: 'Accountable plan, excess not returned (IRS Publication 463).' }),
  };
}
