import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import { destIndex, T } from '../../lib/data';
import PLACES from '../../data/places.json';

const sum = K.stateSummary('kentucky');
const ref = K.stateRef('kentucky');
const area = (name: string) => K.nsas('KY').find((n) => n.name === name)!;
const lou = area('Louisville'), ken = area('Kenton'), boo = area('Boone'), lex = area('Lexington');
const louPrev = K.nsas('KY', 2026).find((n) => n.name === 'Louisville')!;
const louRow = T.dest[destIndex('KY', 'Louisville')].fy['2027'];
const louPrevRow = T.dest[destIndex('KY', 'Louisville')].fy['2026'];
const springJump = lou.high - Math.max(...louPrevRow.lodging.filter((_, m) => lou.highMonths.includes(K.MONTHS_FY[m])));
type Place = [string, string, string, number, number, number];
const rows = (PLACES as { rows: Place[] }).rows.filter((r) => r[1] === 'KY');
const town = (county: string) => rows.filter((r) => r[2] === `${county} County`).map((r) => r[0]);
const stdRows = rows.filter((r) => r[3] === -1);
const share = K.P.mie.partialDayShare;
const apr = K.trip({ destIndex: destIndex('KY', 'Louisville'), depart: '2027-04-12', ret: '2027-04-15' });
const dec = K.trip({ destIndex: destIndex('KY', 'Louisville'), depart: '2026-12-07', ret: '2026-12-10' });
const gas = K.gas('kentucky');

export default defineState({
  slug: 'kentucky',
  dest: 'Louisville',
  title: 'Per Diem Rates Kentucky 2026-27: Louisville by the Month',
  description: `Kentucky per diem rates for 2026-27: Louisville ranges from ${K.usd(lou.low)} to ${K.usd(lou.high)} a night by month, ${sum.count} GSA areas on ${sum.mieTiers.length} M&IE tiers, and ${K.usd(sum.std.lodging)} plus ${K.usd(sum.std.mie)} everywhere else.`,
  intro: `Kentucky's ${sum.count} GSA areas use ${sum.mieTiers.length} different meal tiers, and Louisville is the only one whose room rate moves during the year.`,
  resume: `Kentucky per diem in FY2027 peaks at ${K.usd(lou.high)} a night in Louisville (Jefferson County) in ${K.listOf(lou.highMonths)}, falls to ${K.usd(lou.low)} in ${K.listOf(lou.lowMonths)}, and carries ${K.usd(lou.mie)} of M&IE all year. Kenton County pays ${K.usd(ken.high)} with ${K.usd(ken.mie)} of M&IE, Lexington ${K.usd(lex.high)}, Boone County ${K.usd(boo.high)} with the base ${K.usd(boo.mie)} meal rate, and every other county the standard ${K.usd(sum.std.lodging)} and ${K.usd(sum.std.mie)}. These rates run from October 1, 2026 to September 30, 2027. Timing changes the bill more than anywhere else in the state: three nights in Louisville from April 12 to 15, 2027 come to ${K.usd(apr.total, 2)} at the federal maximum, while the same stay from December 7 to 10, 2026 is worth ${K.usd(dec.total, 2)}. The calculator above is set on Louisville; pick your own dates to see the month that applies to each night.`,
  body: (h) => `
<h2>Louisville now peaks in spring, not in autumn</h2>
<p>In FY2026 the dearest Louisville months were ${K.listOf(louPrev.highMonths)}, at ${K.usd(louPrev.high)}. The FY2027 file moves the top of the scale to ${K.listOf(lou.highMonths)}, at ${K.usd(lou.high)}, which is ${K.usd(springJump)} more than the same months paid a year earlier. October and September still sit near the top at ${K.usd(louRow.lodging[0])}, June to August at ${K.usd(louRow.lodging[8])}, and the winter floor rose from ${K.usd(louPrev.low)} to ${K.usd(lou.low)}. Four price levels in one year means a long assignment can cross three of them, and a booking made in winter for a spring meeting should be checked against the spring figure, not the one on the day you reserve; the federal rule pays each night at the maximum of its own month, and the M&IE stays at ${K.usd(lou.mie)} throughout.</p>
${h.mini('areaTrip', { area: 'Louisville, KY', lodging: louRow.lodging, mie: louRow.mie })}
<h2>Kenton and Boone counties, ${K.usd(ken.mie - boo.mie)} apart on meals</h2>
<p>Two of the four Kentucky areas are single counties with very different meal allowances. Kenton County, home to ${K.listOf(town('Kenton').slice(0, 3))}, is on the ${K.usd(ken.mie)} tier, the highest in the state. Boone County, where ${K.listOf(town('Boone').slice(0, 1))} is the largest Census place, stays on ${K.usd(boo.mie)}, the same meal amount as a county with no listing at all. Its lodging line is only ${K.usd(boo.high - sum.std.lodging)} above the standard. On a four-day trip the gap in M&IE alone is ${K.usd((ken.mie - boo.mie) * (2 * share + 2), 2)}, so the county of the work site, not the nearest big city, decides the claim. GSA's ${h.src('gsa_mie', 'M&IE breakdown')} splits each tier into breakfast, lunch, dinner and incidentals, which is what you deduct when a meal is provided.</p>
<h3>Lexington and the standard-rate cities</h3>
<p>Fayette County (Lexington) is flat at ${K.usd(lex.high)}, up from ${K.usd(lex.prev!.high)}. ${K.listOf(stdRows.slice(0, 4).map((r) => r[0]))} have no area of their own and take ${K.usd(sum.std.lodging)} and ${K.usd(sum.std.mie)}. Fuel is a small mercy for drivers: Kentucky falls in the EIA ${ref.gasArea} series, ${K.usd(gas, 3)} a gallon of regular in the week of ${K.day(K.ENERGY_META.gasWeek)}, under the U.S. average of ${K.usd(K.ENERGY_META.usGas, 3)}. The ${h.a('road-trip-cost-calculator', 'road trip cost calculator')} adds fuel to the per diem for a full itinerary.</p>
`,
  faqs: [
    { q: 'When is the Louisville, Kentucky per diem highest in FY2027?', a: `In ${K.listOf(lou.highMonths)} 2027, when the lodging maximum is ${K.usd(lou.high)} a night. It is lowest in ${K.listOf(lou.lowMonths)} at ${K.usd(lou.low)}. The ${K.usd(lou.mie)} M&IE does not change by month. A stay that runs from late January into February is paid at two different maximums, each night at its own month.` },
    { q: 'Why does Kenton County, Kentucky get more M&IE than Boone County?', a: `GSA places every non-standard area on one of ${K.P.mie.tiers.length} meal tiers, from ${K.usd(K.P.mie.tiers[0])} to ${K.usd(K.P.mie.tiers[K.P.mie.tiers.length - 1])}. For FY2027 Kenton County is on ${K.usd(ken.mie)} a day and Boone County on ${K.usd(boo.mie)}, the base tier. The two lodging maximums are ${K.usd(ken.high)} and ${K.usd(boo.high)}. Check the county of the duty station, since nearby cities can sit in either one.` },
    { q: `What per diem applies in ${stdRows[0][0]}, Kentucky?`, a: `${stdRows[0][2]} has no GSA listing, so ${stdRows[0][0]} uses the standard CONUS rate: ${K.usd(sum.std.lodging)} of lodging and ${K.usd(sum.std.mie)} of M&IE a day from October 1, 2026 to September 30, 2027. On travel days the M&IE is ${K.usd(sum.std.mie * share, 2)}. ${K.listOf(stdRows.slice(1, 3).map((r) => r[0]))} are in the same situation.` },
    { q: 'How many per diem areas does Kentucky have in FY2027?', a: `Kentucky has ${sum.count} areas, ${sum.count === sum.prevCount ? 'the same number as in FY2026' : `against ${sum.prevCount} in FY2026`}: ${K.listOf(sum.list.map((n) => n.name))}. ${sum.added.length + sum.dropped.length === 0 ? 'No area joined or left the list this year.' : 'The list changed this year.'} Their M&IE ranges from ${K.usd(sum.mieTiers[0])} to ${K.usd(sum.mieTiers[sum.mieTiers.length - 1])}, and only Louisville is seasonal. A county left off that list takes the national standard ${K.usd(sum.std.lodging)} and ${K.usd(sum.std.mie)}.` },
  ],
  related: ['per-diem-rates', 'home', 'road-trip-cost-calculator', 'meals-and-incidental-expenses', 'state:tennessee', 'state:ohio'],
});
