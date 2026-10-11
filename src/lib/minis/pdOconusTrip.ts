/**
 * Mini: a trip at a DoD or State Department rate, with the lodging tax claimed on top only outside foreign
 * areas (FTR § 301-11.16: foreign rates already include it).
 */
import type { MiniSpec } from '../mini-types';
import { usd, PARAMS, money } from './_kit';
export default function pdOconusTrip(): MiniSpec {
  const share = PARAMS.mie.partialDayShare;
  return {
    title: 'An OCONUS trip with or without lodging tax',
    cta: 'Open the OCONUS calculator',
    inputs: [
      { id: 'l', label: 'Lodging rate', def: 250, unit: '$', max: 5000 },
      { id: 'm', label: 'M&IE rate', def: 120, unit: '$', max: 2000 },
      { id: 'n', label: 'Nights', def: 4, max: 365 },
      { id: 'w', label: 'Where', def: 1, options: [{ value: '1', label: 'Alaska, Hawaii or a U.S. territory' }, { value: '0', label: 'A foreign country' }] },
      { id: 'x', label: 'Lodging tax rate', def: 10, unit: '%', max: 50, decimals: 1 },
    ],
    run: (v) => {
      const n = Math.max(0, Math.round(v.n)); const lod = v.l * n; const mie = n === 0 ? 0 : v.m * share * 2 + v.m * Math.max(0, n - 1);
      const tax = v.w ? lod * v.x / 100 : 0;
      return { head: ['Lodging, M&IE and tax', money(lod + mie + tax)], rows: [[`Lodging: ${n} × ${usd(v.l)}`, usd(lod)], ['M&IE, 75% on travel days', money(mie)], [v.w ? 'Lodging tax claimed apart' : 'Lodging tax (already in the rate)', money(tax)]], note: 'Tax counts only on the room cost up to the lodging rate.' };
    },
  };
}
