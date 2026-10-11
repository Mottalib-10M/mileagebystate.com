import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import { destIndex, T } from '../../lib/data';
import PLACES from '../../data/places.json';

const CAL = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
/** Months listed as they run on the calendar, starting after a gap (Nov., Dec., Jan.); other lists keep their order. */
const L = (xs: string[]) => {
  if (!xs.length || !xs.every((x) => CAL.includes(x))) return K.listOf(xs);
  const has = (i: number) => xs.includes(CAL[(i + 12) % 12]);
  const start = CAL.findIndex((_, i) => has(i) && !has(i - 1));
  return K.listOf(start < 0 ? CAL : Array.from({ length: 12 }, (_, k) => CAL[(start + k) % 12]).filter((m) => xs.includes(m)));
};
const sum = K.stateSummary('new-york');
const ref = K.stateRef('new-york');
const at = (name: string) => sum.list.find((n) => n.name === name)!;
const nyc = at('New York City'), wch = at('Tarrytown / White Plains / New Rochelle'), nas = at('Floral Park / Garden City / Great Neck'), suf = at('Riverhead / Ronkonkoma / Melville');
const lp = at('Lake Placid'), sar = at('Saratoga Springs / Schenectady'), gf = at('Glens Falls'), alb = at('Albany'), buf = at('Buffalo'), bing = at('Binghamton');
const nycRow = T.dest[nyc.i].fy['2027'], sarRow = T.dest[sar.i].fy['2027'];
// The distinct New York City caps, highest first, each with its months.
const steps = [...new Set(nycRow.lodging)].sort((a, b) => b - a).map((v) => ({ v, months: K.MONTHS_FY.filter((_, m) => nycRow.lodging[m] === v) }));
const std = sum.std;
const places = (PLACES as { rows: Array<[string, string, string, number, number, number]> }).rows.filter((r) => r[1] === 'NY');
const stdPlaces = places.filter((r) => r[3] === -1).map((r) => r[0]);
const oct = K.trip({ destIndex: destIndex('NY', 'New York City'), depart: '2026-10-19', ret: '2026-10-22' });
const jan = K.trip({ destIndex: destIndex('NY', 'New York City'), depart: '2027-01-25', ret: '2027-01-28' });
const share = K.P.mie.partialDayShare;
const flatRises = sum.list.filter((n) => !n.seasonal && n.prev && !(n.prev.low !== n.prev.high)).map((n) => ({ n, d: n.high - n.prev!.high })).sort((a, b) => b.d - a.d);
const big = flatRises[0];
const gas = ref.gas, usGas = K.ENERGY_META.usGas;

export default defineState({
  slug: 'new-york',
  dest: 'New York City',
  title: 'Per Diem Rates New York 2026-27: NYC, Long Island, Upstate',
  description: `New York per diem 2026-27: ${sum.count} GSA areas, NYC lodging from ${K.usd(nyc.low)} to ${K.usd(nyc.high)} by month with ${K.usd(nyc.mie)} M&IE in FY2027; Westchester ${K.usd(wch.high)}, standard ${K.usd(std.lodging)} in unlisted counties.`,
  intro: `New York City's FY2027 lodging cap takes ${steps.length} different values over the year, and the gap between its cheapest and dearest month is ${K.usd(nyc.high - nyc.low)}.`,
  resume: `Per diem in New York for FY2027 covers ${sum.count} GSA areas on ${sum.mieTiers.length} M&IE tiers, from ${K.usd(sum.mieTiers[0])} to ${K.usd(sum.mieTiers[sum.mieTiers.length - 1])}. The five boroughs form one area with ${K.usd(nyc.mie)} of M&IE and a lodging cap of ${K.usd(nyc.high)} in ${L(nyc.highMonths)}, falling to ${K.usd(nyc.low)} in ${L(nyc.lowMonths)}. Westchester pays ${K.usd(wch.high)}, Nassau ${K.usd(nas.high)} and Suffolk ${K.usd(suf.high)}, all flat. Upstate, Saratoga Springs, Glens Falls and Lake Placid spike in ${L(sar.highMonths)}. Counties not on the list take the standard ${K.usd(std.lodging)} and ${K.usd(std.mie)}. Three nights in Manhattan from October 19 to 22, 2026 reach ${K.usd(oct.total, 2)} at the federal maximum; the same three nights from January 25 to 28, 2027 reach ${K.usd(jan.total, 2)}, a difference of ${K.usd(oct.total - jan.total, 2)} caused by the room cap alone. The calculator above opens on New York City; search any New York town or ZIP code to change it.`,
  body: (h) => `
<h2>Four price steps inside the five boroughs</h2>
<p>The Bronx, Brooklyn, Manhattan, Queens and Staten Island share one GSA line, but its lodging cap is anything but steady. FY2027 sets it at ${steps.map((s) => `${K.usd(s.v)} in ${L(s.months)}`).join('; ')}. A traveler booked for the third week of October is allowed ${K.usd(nyc.high - nyc.low)} more per night than one booked in late January. Last year the range was ${K.usd(nyc.prev!.low)} to ${K.usd(nyc.prev!.high)}, so both ends moved up. When a stay straddles February 28 and March 1, the calculator above applies two caps to the same reservation, which is exactly how the GSA rule reads.</p>
${h.mini('areaTrip', { area: 'New York City, NY', lodging: nycRow.lodging, mie: nycRow.mie })}
<h3>Westchester eats like Manhattan</h3>
<p>Only two New York areas are on the top ${K.usd(nyc.mie)} M&IE tier: the city and Westchester County (Tarrytown, White Plains, New Rochelle). Westchester's room cap is a flat ${K.usd(wch.high)}, lower than any month in the boroughs, yet its daily meal allowance is identical. Nassau (${K.usd(nas.high)}) and Suffolk (${K.usd(suf.high)}) sit one tier lower at ${K.usd(nas.mie)}. Binghamton is alone at the bottom, on ${K.usd(bing.mie)}.</p>
<h2>Upstate lines that spike in ${L(sar.highMonths)}</h2>
<p>Three upstate lines jump in ${L(sar.highMonths)} and nowhere else. Saratoga Springs and Schenectady go from ${K.usd(sar.low)} to ${K.usd(sar.high)}, Glens Falls from ${K.usd(gf.low)} to ${K.usd(gf.high)}. Lake Placid has a third level: ${K.usd(lp.high)} in its peak, ${K.usd(lp.low)} in ${L(lp.lowMonths)}, and ${K.usd(T.dest[lp.i].fy['2027'].lodging[0])} in the remaining months. It is also the one New York area whose top cap went down, from ${K.usd(lp.prev!.high)} to ${K.usd(lp.high)}.</p>
<h3>Albany and Buffalo after the update</h3>
<p>Among the areas that kept a single year-round cap in both years, ${big.n.name} gained the most: ${K.usd(big.n.prev!.high)} to ${K.usd(big.n.high)}. Buffalo changed shape rather than level; it had two values in FY2026 (${K.usd(buf.prev!.low)} and ${K.usd(buf.prev!.high)}) and now has one, ${K.usd(buf.high)}. Utica, Rome, Jamestown and Elmira, like ${stdPlaces.length} of the state's larger Census places, are outside every area and use the standard rate.</p>
<h2>New York's own gasoline series</h2>
<p>EIA publishes a weekly gasoline price for New York State itself, so this page does not have to borrow a regional average. Regular averaged ${K.usd(gas, 3)} in the week of ${K.day(K.ENERGY_META.gasWeek)}, ${gas >= usGas ? `${K.usd(gas - usGas, 3)} above` : `${K.usd(usGas - gas, 3)} below`} the U.S. average of ${K.usd(usGas, 3)}. Diesel has no state series and comes from the ${ref.dieselArea} figure. The ${h.a('gas-cost-calculator', 'fuel cost calculator')} reads the New York number by default.</p>
`,
  faqs: [
    { q: 'What is the cheapest month for New York City per diem in FY2027?', a: `${L(nyc.lowMonths)}, when the lodging cap in the five boroughs is ${K.usd(nyc.low)} a night. The highest cap, ${K.usd(nyc.high)}, applies in ${L(nyc.highMonths)}. The M&IE of ${K.usd(nyc.mie)} stays the same all year, with ${K.usd(nyc.mie * share, 2)} on the first and last day of a New York trip.` },
    { q: 'Is the Westchester County, New York per diem the same as NYC?', a: `Only for meals. Westchester (Tarrytown, White Plains, New Rochelle) has ${K.usd(wch.mie)} of M&IE in FY2027, the same top tier as New York City, but its lodging cap is a flat ${K.usd(wch.high)} instead of the city's ${K.usd(nyc.low)} to ${K.usd(nyc.high)}. The rate applies to the whole county from October 1, 2026.` },
    { q: 'When is the Saratoga Springs, New York per diem highest?', a: `In ${L(sar.highMonths)}. The Saratoga Springs / Schenectady area caps lodging at ${K.usd(sar.high)} in those two months and ${K.usd(sar.low)} the rest of FY2027, with ${K.usd(sar.mie)} of M&IE. A three-night stay in that window carries ${K.usd(3 * (sar.high - sar.low))} more lodging allowance than the same stay in June, when the lower cap is back.` },
    { q: 'How did the Albany, New York per diem change for FY2027?', a: `Albany County went from ${K.usd(alb.prev!.high)} to ${K.usd(alb.high)} a night, a rise of ${K.usd(alb.high - alb.prev!.high)}, and kept its ${K.usd(alb.mie)} M&IE, a tier above Rochester and Buffalo at ${K.usd(buf.mie)}. Among New York lines that were flat in both years, no other rose as much. The cap is the same in every month from October 1, 2026 to September 30, 2027.` },
  ],
  related: ['per-diem-rates', 'home', 'gas-cost-calculator', 'state:new-jersey', 'state:pennsylvania', 'state:connecticut'],
});
