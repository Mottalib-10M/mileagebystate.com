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
const sum = K.stateSummary('north-carolina');
const ref = K.stateRef('north-carolina');
const at = (name: string) => sum.list.find((n) => n.name === name)!;
const kdh = at('Kill Devil Hills'), mc = at('Atlantic Beach / Morehead City'), wil = at('Wilmington'), chh = at('Chapel Hill'), ash = at('Asheville');
const clt = at('Charlotte'), ral = at('Raleigh'), fay = at('Fayetteville'), dur = at('Durham');
const kdhRow = T.dest[kdh.i].fy['2027'];
const kdhSteps = [...new Set(kdhRow.lodging)].sort((a, b) => a - b).map((v) => ({ v, months: K.MONTHS_FY.filter((_, m) => kdhRow.lodging[m] === v) }));
const std = sum.std;
const places = (PLACES as { rows: Array<[string, string, string, number, number, number]> }).rows.filter((r) => r[1] === 'NC');
const stdPlaces = places.filter((r) => r[3] === -1).map((r) => r[0]);
const summer = K.trip({ destIndex: destIndex('NC', 'Kill Devil Hills'), depart: '2027-07-12', ret: '2027-07-16' });
const winter = K.trip({ destIndex: destIndex('NC', 'Kill Devil Hills'), depart: '2027-01-11', ret: '2027-01-15' });
const share = K.P.mie.partialDayShare;
const fayT = K.tier(fay.mie), cltT = K.tier(clt.mie);

export default defineState({
  slug: 'north-carolina',
  dest: 'Kill Devil Hills',
  title: 'Per Diem Rates NC 2026-27: Outer Banks, Charlotte, Raleigh',
  description: `North Carolina per diem 2026-27: ${sum.count} GSA areas; Kill Devil Hills swings from ${K.usd(kdh.low)} to ${K.usd(kdh.high)} a night, Charlotte ${K.usd(clt.high)}, Raleigh ${K.usd(ral.high)}; standard ${K.usd(std.lodging)} elsewhere.`,
  intro: `Dare County's FY2027 lodging cap goes through ${kdhSteps.length} levels in one year, the widest swing of any North Carolina area.`,
  resume: `North Carolina has ${sum.count} GSA per diem areas in FY2027, on M&IE tiers of ${L(sum.mieTiers.map((x) => K.usd(x)))}. The coast moves with the calendar: Kill Devil Hills (Dare County) caps lodging at ${K.usd(kdh.high)} in ${L(kdh.highMonths)} and ${K.usd(kdh.low)} from ${kdh.lowMonths[0]} to ${kdh.lowMonths[kdh.lowMonths.length - 1]}, Wilmington ranges from ${K.usd(wil.low)} to ${K.usd(wil.high)}. Inland, Chapel Hill (${K.usd(chh.high)}), Charlotte (${K.usd(clt.high)}) and Raleigh (${K.usd(ral.high)}) hold one value all year. Unlisted counties use ${K.usd(std.lodging)} and ${K.usd(std.mie)}. Four nights in Kill Devil Hills from July 12 to 16, 2027 are worth ${K.usd(summer.total, 2)} at the federal maximum; the same four nights from January 11 to 15, 2027 are worth ${K.usd(winter.total, 2)}, with the whole gap on the lodging line. The calculator above opens on Kill Devil Hills; type a North Carolina city or ZIP code to move it.`,
  body: (h) => `
<h2>Dare County's four-step year</h2>
<p>No other North Carolina line swings as far. The Kill Devil Hills cap reads ${kdhSteps.map((s) => `${K.usd(s.v)} in ${L(s.months)}`).join(', ')}. The top went up from ${K.usd(kdh.prev!.high)} in FY2026, but the bottom went down, from ${K.usd(kdh.prev!.low)} to ${K.usd(kdh.low)}: GSA widened the spread at both ends. A field inspector who can choose the month of a site visit to Dare County controls ${K.usd(kdh.high - kdh.low)} a night of allowance just by the date.</p>
${h.mini('areaTrip', { area: 'Kill Devil Hills, NC', lodging: kdhRow.lodging, mie: kdhRow.mie })}
<h3>Carteret unchanged, Wilmington lifted</h3>
<p>Atlantic Beach and Morehead City kept exactly the range they had last year, ${K.usd(mc.low)} to ${K.usd(mc.high)}, peaking in ${L(mc.highMonths)}. New Hanover County moved more: Wilmington's top cap rose from ${K.usd(wil.prev!.high)} to ${K.usd(wil.high)}, reached in ${L(wil.highMonths)} only. Its lowest months, ${L(wil.lowMonths)}, pay ${K.usd(wil.low)}${wil.low === std.lodging ? ', exactly the national standard, so a winter trip to Wilmington earns its listing only through the M&IE' : ''}.</p>
<h2>Fayetteville: a better room, the base meal rate</h2>
<p>Cumberland County is the only North Carolina area left on the base ${K.usd(fay.mie)} M&IE tier. Its room cap of ${K.usd(fay.high)} beats the standard by ${K.usd(fay.high - std.lodging)}, yet meals pay the same as in any unlisted county. When a lunch is provided at a training session, the deduction there is ${K.usd(fayT.lunch)}, against ${K.usd(cltT.lunch)} in Charlotte, where the tier is ${K.usd(clt.mie)}.</p>
<h3>Raleigh against Charlotte</h3>
<p>The Charlotte and Raleigh rates sit ${K.usd(clt.high - ral.high)} apart on lodging but ${K.usd(clt.mie - ral.mie)} apart on M&IE: Wake County is on ${K.usd(ral.mie)}, Mecklenburg on ${K.usd(clt.mie)}. Orange County (Chapel Hill) has the highest flat cap in the state at ${K.usd(chh.high)}, while neighboring Durham County is at ${K.usd(dur.high)}. Asheville is dearest in ${L(ash.highMonths)} at ${K.usd(ash.high)}, then ${K.usd(ash.low)} for the rest of the year. Winston-Salem, Concord, Greenville and Gastonia are among ${stdPlaces.length} larger Census places on the standard rate.</p>
<p>Regular gasoline on the EIA ${ref.gasArea} series cost ${K.usd(ref.gas, 3)} in the week of ${K.day(K.ENERGY_META.gasWeek)}; the ${h.a('mileage-calculator', 'mileage calculator')} turns a route into a claim at the IRS rate.</p>
`,
  faqs: [
    { q: 'When is the Outer Banks per diem cheapest in North Carolina?', a: `Kill Devil Hills, the GSA area for Dare County, has its lowest FY2027 cap of ${K.usd(kdh.low)} a night in ${L(kdh.lowMonths)}. It rises to ${K.usd(kdhRow.lodging[6])} in ${L(kdhSteps.find((s) => s.v === kdhRow.lodging[6])!.months)} and peaks at ${K.usd(kdh.high)} in ${L(kdh.highMonths)}. The M&IE is ${K.usd(kdh.mie)} in every month.` },
    { q: 'Why is the Fayetteville, North Carolina M&IE lower than its neighbors?', a: `Cumberland County is on the ${K.usd(fay.mie)} M&IE tier in FY2027, the same as the standard rate, even though its lodging cap is ${K.usd(fay.high)}. GSA sets lodging and the meal tier separately. Raleigh is on ${K.usd(ral.mie)} and Charlotte on ${K.usd(clt.mie)}. On travel days Fayetteville pays ${K.usd(fay.mie * share, 2)} for meals.` },
    { q: 'What is the per diem for Chapel Hill, North Carolina in FY2027?', a: `Orange County, listed as Chapel Hill, has a lodging cap of ${K.usd(chh.high)} in every month and ${K.usd(chh.mie)} of M&IE, from October 1, 2026 to September 30, 2027. It was ${K.usd(chh.prev!.high)} in FY2026. It is the highest year-round cap in North Carolina and ${K.usd(chh.high - dur.high)} above Durham County next door.` },
  ],
  related: ['per-diem-rates', 'home', 'mileage-calculator', 'state:virginia', 'state:south-carolina', 'state:tennessee'],
});
