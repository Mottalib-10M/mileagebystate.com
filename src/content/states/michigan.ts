import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import { destIndex, T } from '../../lib/data';
import PLACES from '../../data/places.json';

const sum = K.stateSummary('michigan');
const ref = K.stateRef('michigan');
const area = (name: string) => K.nsas('MI').find((n) => n.name === name)!;
const before = (name: string) => K.nsas('MI', 2026).find((n) => n.name === name)!;
const row = (name: string, fy = '2027') => T.dest[destIndex('MI', name)].fy[fy];
const aa = area('Ann Arbor'), aaPrev = before('Ann Arbor');
const det = area('Detroit'), gr = area('Grand Rapids'), pon = area('Pontiac / Auburn Hills'), mid = area('Midland'), tc = area('Traverse City');
const tcRow = row('Traverse City'), tcPrevRow = row('Traverse City', '2026');
const shoulder = ['Traverse City', 'Mackinac Island', 'Petoskey'].map((n) => ({ n, now: row(n).lodging[0], then: row(n, '2026').lodging[0] }));
type Place = [string, string, string, number, number, number];
const rows = (PLACES as { rows: Place[] }).rows.filter((r) => r[1] === 'MI');
const macomb = rows.filter((r) => r[2] === 'Macomb County' && r[3] === -1).slice(0, 3).map((r) => r[0]);
const stdOther = rows.filter((r) => r[3] === -1 && r[2] !== 'Macomb County').slice(0, 3);
const share = K.P.mie.partialDayShare;
const detT = K.trip({ destIndex: destIndex('MI', 'Detroit'), depart: '2027-05-10', ret: '2027-05-13' });
const grT = K.trip({ destIndex: destIndex('MI', 'Grand Rapids'), depart: '2027-05-10', ret: '2027-05-13' });
const gas = K.gas('michigan');

export default defineState({
  slug: 'michigan',
  dest: 'Detroit',
  title: 'Per Diem Rates Michigan 2026-27: Detroit and Traverse City',
  description: `Michigan per diem rates 2026-27: ${sum.count} GSA areas, Detroit at ${K.usd(det.high)} with ${K.usd(det.mie)} M&IE, Traverse City up to ${K.usd(tc.high)} in summer; Ann Arbor is now flat at ${K.usd(aa.high)} all year.`,
  intro: `Michigan's ${sum.count} GSA areas mix summer-peak rates with flat year-round rates, and one area switched from the first kind to the second this year.`,
  resume: `Michigan per diem in FY2027 runs from the standard ${K.usd(sum.std.lodging)} and ${K.usd(sum.std.mie)} up to ${K.usd(tc.high)} a night in Traverse City in ${K.listOf(tc.highMonths)}. Detroit (Wayne County) is flat at ${K.usd(det.high)} with ${K.usd(det.mie)} of M&IE; Grand Rapids and Pontiac / Auburn Hills are both at ${K.usd(gr.high)} with ${K.usd(gr.mie)}. ${sum.seasonalCount} of the ${sum.count} areas change price by month, and the rates cover October 1, 2026 to September 30, 2027. The meal tiers do not follow the room rates: three nights in Detroit from May 10 to 13, 2027 are worth ${K.usd(detT.total, 2)} at the federal maximum, ${K.usd(detT.lodging - grT.lodging)} more on lodging than Grand Rapids but ${K.usd(grT.mie - detT.mie, 2)} less on meals, for ${K.usd(grT.total, 2)} there. Lodging taxes are claimed separately from these caps. The calculator above starts on Detroit; enter any Michigan city or ZIP code to change it.`,
  body: (h) => `
<h2>Ann Arbor drops its summer rate</h2>
<p>Washtenaw County was a seasonal area in FY2026: ${K.usd(aaPrev.high)} in ${K.listOf(aaPrev.highMonths)} and ${K.usd(aaPrev.low)} the rest of the year. The FY2027 file replaces both with a single ${K.usd(aa.high)}. Winter and autumn visits gain ${K.usd(aa.high - aaPrev.low)} a night; a stay between ${aaPrev.highMonths[0]} and ${aaPrev.highMonths[aaPrev.highMonths.length - 1]} loses ${K.usd(aaPrev.high - aa.high)}. The M&IE stays at ${K.usd(aa.mie)}. Anyone who copied a summer 2026 Ann Arbor claim as a template for 2027 will overstate the room by that amount. Midland made the largest jump of any Michigan area, from ${K.usd(mid.prev!.high)} to ${K.usd(mid.high)}, and now pays more than Grand Rapids.</p>
<h2>Detroit's room is dear, its meal allowance is not</h2>
<p>Wayne County has the highest flat lodging line in the state at ${K.usd(det.high)}, but its M&IE is ${K.usd(det.mie)}, one tier below Grand Rapids, Pontiac and Ann Arbor. On a five-day trip the meal gap is ${K.usd((gr.mie - det.mie) * (2 * share + 3), 2)}. Oakland County (Pontiac / Auburn Hills) and Kent County (Grand Rapids) share the same ${K.usd(pon.high)} and ${K.usd(pon.mie)}. Macomb County has no line: ${K.listOf(macomb)} take the standard ${K.usd(sum.std.lodging)} and ${K.usd(sum.std.mie)}, as do ${K.listOf(stdOther.map((r) => `${r[0]} (${r[2]})`))}. A metro-area project with sites in several counties can therefore carry three different daily maximums.</p>
<h3>Traverse City, Petoskey and Mackinac Island: dearer autumns</h3>
<p>These three seasonal areas kept their summer peaks almost unchanged but raised October and September. ${shoulder.map((x) => `${x.n} went from ${K.usd(x.then)} to ${K.usd(x.now)}`).join(', ')} in those two months. Traverse City's July and August maximum stays at ${K.usd(tc.high)}, the same as in FY2026, and its winter floor at ${K.usd(tc.low)}${tcPrevRow.lodging[0] === tc.low ? ', so last year October was billed like January' : ''}. Muskegon and South Haven sit on the base ${K.usd(area('Muskegon').mie)} meal tier with summer rooms at ${K.usd(area('Muskegon').high)} and ${K.usd(area('South Haven').high)}.</p>
${h.mini('areaTrip', { area: 'Traverse City, MI', lodging: tcRow.lodging, mie: tcRow.mie })}
<p>Gasoline in Michigan is reported in the EIA ${ref.gasArea} series: ${K.usd(gas, 3)} a gallon of regular in the week of ${K.day(K.ENERGY_META.gasWeek)}, against ${K.usd(K.ENERGY_META.usGas, 3)} nationally. The ${h.a('cost-per-mile-calculator', 'cost per mile calculator')} compares that with the IRS ${K.centsWord(K.irs('2026-10-01'))}.</p>
`,
  faqs: [
    { q: 'Is the Ann Arbor, Michigan per diem still seasonal in FY2027?', a: `No. In FY2026 Washtenaw County paid ${K.usd(aaPrev.high)} in ${K.listOf(aaPrev.highMonths)} and ${K.usd(aaPrev.low)} otherwise. From October 1, 2026 the lodging maximum is ${K.usd(aa.high)} in every month, with ${K.usd(aa.mie)} of M&IE. Summer stays are capped lower than a year ago, the rest of the year higher.` },
    { q: 'Why is Detroit M&IE lower than Grand Rapids in Michigan?', a: `GSA sets lodging and meals separately. For FY2027 Wayne County is on the ${K.usd(det.mie)} M&IE tier and Kent County on ${K.usd(gr.mie)}, even though Detroit's lodging maximum (${K.usd(det.high)}) is above Grand Rapids' (${K.usd(gr.high)}). On travel days the Detroit M&IE is ${K.usd(det.mie * share, 2)}, Grand Rapids ${K.usd(gr.mie * share, 2)}. Each figure follows the duty location, not the airport.` },
    { q: `Do ${macomb[0]} and ${macomb[1]}, Michigan have their own per diem?`, a: `No. Macomb County is not a GSA area, so ${K.listOf(macomb)} use the standard CONUS rate of ${K.usd(sum.std.lodging)} for lodging and ${K.usd(sum.std.mie)} for M&IE in FY2027. Wayne County (Detroit) and Oakland County (Pontiac / Auburn Hills) do have lines, at ${K.usd(det.high)} and ${K.usd(pon.high)} a night.` },
  ],
  related: ['per-diem-rates', 'home', 'cost-per-mile-calculator', 'state:ohio', 'state:indiana', 'state:wisconsin'],
});
