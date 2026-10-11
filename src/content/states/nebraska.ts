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
const sum = K.stateSummary('nebraska');
const ref = K.stateRef('nebraska');
const om = sum.list.find((n) => n.name === 'Omaha')!;
const omRow = T.dest[om.i].fy['2027'];
const std = sum.std, std26 = K.std(2026);
const places = (PLACES as { rows: Array<[string, string, string, number, number, number]> }).rows.filter((r) => r[1] === 'NE');
const stdPlaces = places.filter((r) => r[3] === -1).map((r) => r[0]);
const bellevue = places.find((r) => r[0] === 'Bellevue');
const ex = K.trip({ destIndex: destIndex('NE', 'Omaha'), depart: '2027-04-12', ret: '2027-04-15' });
const exStd = K.trip({ destIndex: -1, depart: '2027-04-12', ret: '2027-04-15' });
const gapNow = om.high - std.lodging, gapThen = om.prev!.high - std26.lodging;
const share = K.P.mie.partialDayShare;
const elec = K.elec('nebraska'), usElec = K.ENERGY_META.usElecCents;
const y = K.ev('2026 Tesla Model Y Long Range AWD');
const per100 = (y.kwh100 * elec) / 100, per100Us = (y.kwh100 * usElec) / 100;

export default defineState({
  slug: 'nebraska',
  dest: 'Omaha',
  title: 'Per Diem Rates Nebraska 2026-27: Omaha vs. Everywhere Else',
  description: `Nebraska per diem 2026-27: Douglas County (Omaha) is capped at ${K.usd(om.high)} a night with ${K.usd(om.mie)} M&IE in FY2027, up from ${K.usd(om.prev!.high)}; Lincoln and the rest get ${K.usd(std.lodging)} plus ${K.usd(std.mie)}.`,
  intro: `Nebraska has a single GSA area in FY2027, Douglas County, and its Omaha rate does not move from one month to the next.`,
  resume: `Nebraska per diem for FY2027 has two values only: ${K.usd(om.high)} of lodging and ${K.usd(om.mie)} of M&IE in Douglas County, which GSA labels Omaha, and the standard ${K.usd(std.lodging)} plus ${K.usd(std.mie)} in every other county of the state, Lincoln included. Both apply from October 1, 2026 through September 30, 2027, and the Omaha cap is identical in all twelve months. A three-night stay in Omaha from April 12 to 15, 2027 adds up to ${K.usd(ex.total, 2)} at the federal maximum, of which ${K.usd(ex.lodging)} is lodging and ${K.usd(ex.mie, 2)} is M&IE after the ${K.pct(share)} rule on the arrival and departure days. The same dates in Lincoln or Grand Island come to ${K.usd(exStd.total, 2)}. Lodging taxes stay outside the cap and are claimed as a separate line. Type any Nebraska city or ZIP code into the calculator above to replace Omaha.`,
  body: (h) => `
<h2>Douglas County, and nothing else on the list</h2>
<p>GSA prints a single Nebraska line for FY2027, and it covers one county. A hotel night inside Douglas County is reimbursed up to ${K.usd(om.high)}, whatever the month, and each day of meals and incidentals is worth ${K.usd(om.mie)}. Last year the same line read ${K.usd(om.prev!.high)}, so the room cap gained ${K.usd(om.high - om.prev!.high)} while the M&IE tier stayed where it was. Because the standard lodging figure moved by only ${K.usd(std.lodging - std26.lodging)}, the Omaha premium over the rest of the state widened from ${K.usd(gapThen)} to ${K.usd(gapNow)} a night.</p>
<h3>Bellevue sits across the county line</h3>
<p>${bellevue ? `Bellevue belongs to ${bellevue[2]}, not to Douglas, and GSA has no line for it.` : 'Sarpy County, just south of Omaha, has no line of its own.'} An engineer who sleeps there while working a project in the metro is paid the standard ${K.usd(std.lodging)} and ${K.usd(std.mie)}, a difference of ${K.usd(gapNow)} on the room and ${K.usd(om.mie - std.mie)} on meals each full day. Over a two-week assignment, that gap is real money. Run the work address through the ZIP search before booking, and keep the folio showing the hotel's street address with your claim.</p>
<h3>The capital and the interior on one figure</h3>
<p>Lancaster County does not appear in the GSA file, so a week of meetings in the state capital follows the same ${K.usd(std.lodging)} cap as an overnight in Kearney or Norfolk. Among the ${places.length} Nebraska places of 15,000 people or more in the Census file, ${stdPlaces.length} fall under the standard rate: ${L(stdPlaces.slice(0, 6))} among them. The quickest check is simple: if the county is not Douglas, it is standard.</p>
${h.mini('areaTrip', { area: 'Omaha, NE', lodging: omRow.lodging, mie: omRow.mie })}
<h2>Cheap kilowatt-hours for an electric fleet</h2>
<p>Nebraska households paid ${K.cents(elec)} per kilowatt-hour on average over ${K.ENERGY_META.elecPeriod}, according to the EIA, against ${K.cents(usElec)} nationally. At the EPA rating of the ${y.label} (${K.num(y.kwh100, 1)} kWh per 100 miles), home charging costs about ${K.usd(per100, 2)} per 100 miles here, ${K.usd(per100Us, 2)} at the national price. An employee who charges at home and is paid the IRS ${K.centsWord(K.irs('2026-07-01'))} a mile keeps most of the rate for depreciation and insurance. For drivers on gasoline, EIA publishes no Nebraska series, so this site uses its ${ref.gasArea} average of ${K.usd(ref.gas, 3)} for the ${h.a('gas-cost-calculator', 'gas cost calculator')}.</p>
${h.mini('evCharge', { label: 'Nebraska', cents: elec, kwh100: y.kwh100 })}
<p>Charging cost at public stations is not in the EIA series; the ${h.a('ev-charging-cost-calculator', 'EV charging calculator')} lets you type your own price per kWh.</p>
`,
  faqs: [
    { q: 'Does Bellevue, Nebraska get the Omaha per diem rate?', a: `No. Bellevue is in Sarpy County, which has no GSA line, so FY2027 travel there is paid at the standard ${K.usd(std.lodging)} for lodging and ${K.usd(std.mie)} for M&IE. The Omaha rate of ${K.usd(om.high)} and ${K.usd(om.mie)} applies to Douglas County only. Check the hotel and work address by ZIP code when you are close to the county line.` },
    { q: 'What is the Nebraska per diem for a trip to Lincoln in FY2027?', a: `Lincoln is in Lancaster County, which GSA does not list, so the standard applies: ${K.usd(std.lodging)} a night and ${K.usd(std.mie)} a day from October 1, 2026 to September 30, 2027. On the travel days you receive ${K.pct(share)} of the M&IE, which is ${K.usd(std.mie * share, 2)}. In FY2026 the lodging part was ${K.usd(std26.lodging)}.` },
    { q: 'How much did the Omaha, Nebraska rate change for FY2027?', a: `The Douglas County lodging cap went from ${K.usd(om.prev!.high)} in FY2026 to ${K.usd(om.high)} in FY2027, a rise of ${K.usd(om.high - om.prev!.high)}, and the M&IE stayed at ${K.usd(om.mie)}. The standard rate rose less, so Omaha now pays ${K.usd(gapNow)} more per night than the rest of the state instead of ${K.usd(gapThen)}.` },
  ],
  related: ['per-diem-rates', 'home', 'ev-charging-cost-calculator', 'state:iowa', 'state:kansas', 'state:south-dakota'],
});
