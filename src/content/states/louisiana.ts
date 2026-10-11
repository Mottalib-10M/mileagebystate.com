import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import { destIndex, T } from '../../lib/data';
import PLACES from '../../data/places.json';

const sum = K.stateSummary('louisiana');
const ref = K.stateRef('louisiana');
const area = (name: string) => K.nsas('LA').find((n) => n.name === name)!;
const nola = area('New Orleans'), alex = area('Alexandria / Leesville / Natchitoches');
const nolaRow = T.dest[destIndex('LA', 'New Orleans')].fy['2027'];
const mid = nolaRow.lodging[0];
type Place = [string, string, string, number, number, number];
const rows = (PLACES as { rows: Place[] }).rows.filter((r) => r[1] === 'LA');
const stdRows = rows.filter((r) => r[3] === -1);
const parishes = alex.counties.replace(' Parishes', '').split(' / ');
const share = K.P.mie.partialDayShare;
const nolaParishes = nola.counties.replace(' Parishes', '').split(' / ').length;
const mar = K.trip({ destIndex: destIndex('LA', 'New Orleans'), depart: '2027-03-15', ret: '2027-03-19' });
const jul = K.trip({ destIndex: destIndex('LA', 'New Orleans'), depart: '2027-07-12', ret: '2027-07-16' });
const gas = K.gas('louisiana'), diesel = ref.diesel;

export default defineState({
  slug: 'louisiana',
  dest: 'New Orleans',
  title: 'Per Diem Rates Louisiana 2026-27: New Orleans and Parishes',
  description: `Louisiana per diem for 2026-27: New Orleans runs ${K.usd(nola.low)} to ${K.usd(nola.high)} a night with ${K.usd(nola.mie)} M&IE, the Alexandria area ${K.usd(alex.high)} in ${parishes.length} parishes, and ${K.usd(sum.std.lodging)} in all other parishes.`,
  intro: `Louisiana counts parishes rather than counties, and only ${nolaParishes + parishes.length} of them appear in the FY2027 GSA file, split between two areas.`,
  resume: `Louisiana per diem in FY2027 tops out at ${K.usd(nola.high)} a night in New Orleans (Orleans and Jefferson parishes) in ${K.listOf(nola.highMonths)}, drops to ${K.usd(nola.low)} in ${K.listOf(nola.lowMonths)}, and sits at ${K.usd(mid)} the rest of the year, always with ${K.usd(nola.mie)} of M&IE. The area of Alexandria, Leesville and Natchitoches pays ${K.usd(alex.high)} with the base ${K.usd(alex.mie)} meal rate. Every other parish takes the standard ${K.usd(sum.std.lodging)} and ${K.usd(sum.std.mie)}. The figures apply from October 1, 2026 to September 30, 2027. Picking the month matters in New Orleans: four nights from March 15 to 19, 2027 are worth ${K.usd(mar.total, 2)} at the federal cap, the same four nights from July 12 to 16 only ${K.usd(jul.total, 2)}, a gap of ${K.usd(mar.total - jul.total, 2)}. The calculator above opens on New Orleans; enter a Louisiana city or ZIP code to switch.`,
  body: (h) => `
<h2>Parishes in the GSA file</h2>
<p>GSA writes Louisiana locations as parishes, and the ZIP file follows the same boundaries. New Orleans means ${nola.counties.replace(' Parishes', '').split(' / ').join(' and ')} parishes together, so ${K.listOf(rows.filter((r) => r[3] === nola.i).map((r) => r[0]).filter((n) => n !== 'New Orleans').slice(0, 2))} carry the city rate as well. The second area stretches across ${parishes.length} parishes: ${K.listOf(parishes)}. It is the cheaper of the two on the voucher, ${K.usd(alex.high)} a night all year, up from ${K.usd(alex.prev!.high)} in FY2026, and its ${K.usd(alex.mie)} M&IE is the same as a parish with no listing. A traveler bound for a site in Vernon or Allen Parish therefore gains ${K.usd(alex.high - sum.std.lodging)} a night over the standard and nothing on meals.</p>
<h2>New Orleans: costly in spring, softest in summer</h2>
<p>The New Orleans year has three steps. ${K.listOf(nola.highMonths)} pay ${K.usd(nola.high)}, up from ${K.usd(nola.prev!.high)} in FY2026. ${K.listOf(nola.lowMonths)} fall to ${K.usd(nola.low)}. October to January and September sit in between at ${K.usd(mid)}. Here the low season is the middle of summer, so an employer with a flexible training calendar saves most by scheduling it in ${nola.lowMonths[0]}. The day-by-day table of the calculator shows the step when a stay runs from ${nola.lowMonths[nola.lowMonths.length - 1]} into September.</p>
${h.mini('areaTrip', { area: 'New Orleans, LA', lodging: nolaRow.lodging, mie: nolaRow.mie })}
<h3>${K.listOf(stdRows.slice(0, 3).map((r) => r[0]))} on the base rate</h3>
<p>The large cities outside these ${nolaParishes + parishes.length} parishes have no line of their own: ${K.listOf(stdRows.slice(0, 5).map((r) => `${r[0]} (${r[2]})`))} all take ${K.usd(sum.std.lodging)} and ${K.usd(sum.std.mie)}, with ${K.usd(sum.std.mie * share, 2)} of M&IE on the first and last day. Fuel is cheaper than the national figure: the EIA ${ref.gasArea} average was ${K.usd(gas, 3)} a gallon of regular in the week of ${K.day(K.ENERGY_META.gasWeek)}, against ${K.usd(K.ENERGY_META.usGas, 3)} nationally, and diesel ${K.usd(diesel, 3)}. At the IRS rate of ${K.centsWord(K.irs('2026-10-01'))} a mile, a driver with an efficient car keeps a wider margin over fuel here than in a state with dearer gasoline.</p>
${h.mini('fuelLeg', { label: `${ref.gasArea} (Louisiana)`, price: gas })}
<p>The ${h.a('gas-cost-calculator', 'gas cost calculator')} works out the fuel for any trip at this price.</p>
`,
  faqs: [
    { q: 'What is the cheapest month for New Orleans per diem in Louisiana?', a: `${K.listOf(nola.lowMonths)}. In those three months of FY2027 the New Orleans lodging maximum is ${K.usd(nola.low)} a night, against ${K.usd(nola.high)} in ${K.listOf(nola.highMonths)} and ${K.usd(mid)} in the other months. The M&IE stays at ${K.usd(nola.mie)} a day all year, ${K.usd(nola.mie * share, 2)} on the travel days.` },
    { q: 'Does Baton Rouge, Louisiana have a higher per diem than the standard rate?', a: `No. ${stdRows[0][2]} is not a GSA area in FY2027, so ${stdRows[0][0]} pays the standard ${K.usd(sum.std.lodging)} for lodging and ${K.usd(sum.std.mie)} for M&IE. Only Orleans and Jefferson parishes (New Orleans) and the ${parishes.length} parishes around Alexandria, Leesville and Natchitoches are above it. A hotel that costs more needs actual-expense approval.` },
    { q: 'Which Louisiana parishes are in the Alexandria per diem area?', a: `${K.listOf(parishes)} parishes form the area named Alexandria / Leesville / Natchitoches. In FY2027 it pays ${K.usd(alex.high)} a night every month and ${K.usd(alex.mie)} of M&IE, up from ${K.usd(alex.prev!.high)} of lodging in FY2026. A site in any other parish falls back to the standard ${K.usd(sum.std.lodging)}.` },
  ],
  related: ['per-diem-rates', 'home', 'gas-cost-calculator', 'state:mississippi', 'state:texas', 'state:arkansas'],
});
