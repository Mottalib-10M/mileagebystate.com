/** Mini: charging cost of a drive (arg = { label, cents } from the page: EIA residential price). */
import type { MiniSpec } from '../mini-types';
import { usd, num, rate, parseArg } from './_kit';
interface Arg { label: string; cents: number; kwh100?: number }
export default function evCharge(arg?: string): MiniSpec {
  const a = parseArg<Arg>(arg, { label: 'U.S. average', cents: 17, kwh100: 28 });
  return {
    title: `Charging at ${a.label} residential prices`,
    cta: 'Open the EV charging calculator',
    inputs: [
      { id: 'm', label: 'Miles', def: 1000, unit: 'mi', max: 100000 },
      { id: 'k', label: 'Consumption', def: a.kwh100 ?? 28, unit: 'kWh/100', max: 100, decimals: 1 },
    ],
    run: (v) => {
      const kwh = (v.m * v.k) / 100; const cost = (kwh * a.cents) / 100;
      return { head: ['Electricity cost', usd(cost, 2)], rows: [['Energy from the outlet', `${num(kwh)} kWh`], [`Price: ${num(a.cents, 2)}¢ per kWh`, usd(cost, 2)], ['Per mile', rate(v.m > 0 ? cost / v.m : 0)]] };
    },
  };
}
