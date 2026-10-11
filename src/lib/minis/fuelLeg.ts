/** Mini: fuel for a drive at a given MPG and price (arg = { label, price } from the page, EIA figure). */
import type { MiniSpec } from '../mini-types';
import { usd, num, rate, parseArg, PARAMS } from './_kit';
interface Arg { label: string; price: number }
export default function fuelLeg(arg?: string): MiniSpec {
  const a = parseArg<Arg>(arg, { label: 'U.S. regular', price: 4 });
  const irs = PARAMS.mileage.irs[0].business;
  return {
    title: `Fuel for a drive at ${a.label} prices`,
    cta: 'Open the fuel cost calculator',
    inputs: [
      { id: 'm', label: 'Miles', def: 300, unit: 'mi', max: 20000 },
      { id: 'g', label: 'MPG', def: 28, unit: 'mpg', max: 150, decimals: 1 },
    ],
    run: (v) => {
      const gal = v.g > 0 ? v.m / v.g : 0;
      return { head: ['Fuel cost', usd(gal * a.price, 2)], rows: [[`${num(gal, 1)} gal × ${rate(a.price)}`, usd(gal * a.price, 2)], ['Per mile', rate(v.g > 0 ? a.price / v.g : 0)], [`Same miles at the IRS rate (${rate(irs)})`, usd(v.m * irs, 2)]] };
    },
  };
}
