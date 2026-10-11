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
const sum = K.stateSummary('oregon');
const ref = K.stateRef('oregon');
const at = (name: string) => sum.list.find((n) => n.name === name)!;
const sea = at('Seaside'), eug = at('Eugene / Florence'), bend = at('Bend'), lc = at('Lincoln City'), pdx = at('Portland'), bvt = at('Beaverton'), clk = at('Clackamas');
const lcRow = T.dest[lc.i].fy['2027'], bendRow = T.dest[bend.i].fy['2027'];
const bendShoulder = bendRow.lodging[0];
const bendShoulderMonths = K.MONTHS_FY.filter((_, m) => bendRow.lodging[m] === bendShoulder);
const std = sum.std;
const places = (PLACES as { rows: Array<[string, string, string, number, number, number]> }).rows.filter((r) => r[1] === 'OR');
const stdRows = places.filter((r) => r[3] === -1);
const salem = places.find((r) => r[0] === 'Salem');
const ex = K.trip({ destIndex: destIndex('OR', 'Portland'), depart: '2026-11-16', ret: '2026-11-19' });
const lcAug = K.trip({ destIndex: destIndex('OR', 'Lincoln City'), depart: '2027-08-09', ret: '2027-08-12' });
const share = K.P.mie.partialDayShare;
const lcT = K.tier(lc.mie), pdxT = K.tier(pdx.mie);
const lcBelow = K.MONTHS_FY.filter((_, m) => lcRow.lodging[m] < pdx.high).length;
const seaOff = 12 - sea.highMonths.length;
const sameMonths = (a: string[], b: string[]) => a.length === b.length && a.every((m) => b.includes(m));

export default defineState({
  slug: 'oregon',
  dest: 'Portland',
  title: 'Per Diem Rates Oregon 2026-27: Portland, Coast and Bend',
  description: `Oregon per diem 2026-27: ${sum.count} GSA areas in FY2027; Portland ${K.usd(pdx.high)} a night all year, Seaside up to ${K.usd(sea.high)} in summer, Lincoln City on the ${K.usd(lc.mie)} M&IE tier; standard ${K.usd(std.lodging)}.`,
  intro: `Lincoln City is the only Oregon area on the top ${K.usd(lc.mie)} meal tier, even though its rooms are capped below Portland's for ${lcBelow} months of FY2027.`,
  resume: `Oregon per diem for FY2027 covers ${sum.count} GSA areas. Multnomah County (Portland) caps lodging at ${K.usd(pdx.high)} in every month with ${K.usd(pdx.mie)} of M&IE, while Washington County (Beaverton) and Clackamas County pay ${K.usd(bvt.high)} and ${K.usd(clk.high)} with ${K.usd(bvt.mie)}. Four areas are seasonal: Seaside reaches ${K.usd(sea.high)} in ${L(sea.highMonths)}, Eugene and Florence ${K.usd(eug.high)} in ${L(eug.highMonths)}, Bend ${K.usd(bend.high)} in ${L(bend.highMonths)}, and Lincoln City ${K.usd(lc.high)} in ${L(lc.highMonths)}. Salem, Medford and other unlisted counties take ${K.usd(std.lodging)} and ${K.usd(std.mie)}. Three nights in Portland from November 16 to 19, 2026 come to ${K.usd(ex.total, 2)} at the federal maximum, ${K.usd(ex.lodging)} of it for the hotel. All figures run from October 1, 2026 to September 30, 2027. The calculator above starts on Portland; type an Oregon town or ZIP code to change it.`,
  body: (h) => `
<h2>Lincoln City's ${K.usd(lc.mie)} meal allowance</h2>
<p>GSA puts Lincoln County on the highest of its ${K.P.mie.tiers.length} CONUS meal tiers, ${K.usd(lc.mie)} a day, a notch above Portland's ${K.usd(pdx.mie)}. The lodging tells another story: ${K.usd(lc.low)} for most of the year and ${K.usd(lc.high)} only in ${L(lc.highMonths)}. Per meal, the tier pays ${K.usd(lcT.breakfast)} for breakfast, ${K.usd(lcT.lunch)} for lunch and ${K.usd(lcT.dinner)} for dinner, against ${K.usd(pdxT.breakfast)}, ${K.usd(pdxT.lunch)} and ${K.usd(pdxT.dinner)} in Multnomah County. A three-night inspection in Lincoln City from August 9 to 12, 2027 totals ${K.usd(lcAug.total, 2)}. The peak cap also climbed from ${K.usd(lc.prev!.high)} last year.</p>
${h.mini('areaTrip', { area: 'Lincoln City, OR', lodging: lcRow.lodging, mie: lcRow.mie })}
<h3>The coast peaks later than Eugene</h3>
<p>Clatsop County (Seaside) and Lincoln County both peak in ${L(sea.highMonths)}${sameMonths(sea.highMonths, lc.highMonths) ? '' : ' and ' + L(lc.highMonths)}. Lane County, which pairs Eugene with Florence, peaks in ${L(eug.highMonths)} and is back to ${K.usd(eug.low)} by August. Seaside's spread is the widest in Oregon: ${K.usd(sea.low)} to ${K.usd(sea.high)}, a ${K.usd(sea.high - sea.low)} jump that applies to two months only.</p>
<h3>Bend's three levels</h3>
<p>Deschutes County has ${K.usd(bend.high)} in ${L(bend.highMonths)}, ${K.usd(bendShoulder)} in ${L(bendShoulderMonths)} and ${K.usd(bend.low)} from ${bend.lowMonths[0]} to ${bend.lowMonths[bend.lowMonths.length - 1]}. Its floor slipped from ${K.usd(bend.prev!.low)} in FY2026 to ${K.usd(bend.low)}, the only cut to any floor in the Oregon table, while its peak rose from ${K.usd(bend.prev!.high)}.</p>
<h2>Salem, Medford and Corvallis at the standard rate</h2>
<p>${salem ? `The capital sits in ${salem[2]}, which GSA does not list,` : 'Marion County is not listed,'} so an agency visit in Salem is paid at ${K.usd(std.lodging)} and ${K.usd(std.mie)}, ${K.usd(pdx.high - std.lodging)} a night below Portland. In the Census file, ${stdRows.length} of the ${places.length} Oregon places above 15,000 residents are in the same position, from ${L(stdRows.slice(1, 4).map((r) => `${r[0]} (${r[2]})`))} on down. Clackamas County, next to Portland, gained only ${K.usd(clk.high - clk.prev!.high)} this year.</p>
<p>For driving, EIA groups Oregon in its ${ref.gasArea} series, ${K.usd(ref.gas, 3)} a gallon in the week of ${K.day(K.ENERGY_META.gasWeek)}. Oregon homes paid ${K.cents(ref.elecCents)} per kWh over ${K.ENERGY_META.elecPeriod}; the ${h.a('tesla-charging-cost', 'Tesla charging cost page')} turns a price like that into dollars per charge.</p>
`,
  faqs: [
    { q: 'Why does Lincoln City, Oregon have a higher M&IE than Portland?', a: `GSA sets the meal tier separately from lodging. For FY2027 Lincoln County is on the ${K.usd(lc.mie)} tier and Multnomah County on ${K.usd(pdx.mie)}, even though Lincoln City's room cap is ${K.usd(lc.low)} for most of the year against ${K.usd(pdx.high)} in Portland. On travel days the Lincoln City M&IE is ${K.usd(lc.mie * share, 2)}.` },
    { q: 'When is the Seaside, Oregon per diem highest in FY2027?', a: `In ${L(sea.highMonths)}, when Clatsop County lodging is capped at ${K.usd(sea.high)} a night. In the other ${seaOff} months the cap is ${K.usd(sea.low)}. The M&IE stays at ${K.usd(sea.mie)} all year. A stay that starts in late June and runs into July is paid at two different caps, night by night.` },
    { q: 'Does Salem, Oregon have a GSA per diem rate?', a: `Not its own. Marion County is not a non-standard area in FY2027, so a trip to Salem is reimbursed at the standard ${K.usd(std.lodging)} for lodging and ${K.usd(std.mie)} for M&IE, from October 1, 2026 to September 30, 2027. On the first and last day the M&IE is ${K.usd(std.mie * share, 2)}, and the cap does not change by month.` },
  ],
  related: ['per-diem-rates', 'home', 'tesla-charging-cost', 'state:washington', 'state:california', 'state:idaho'],
});
