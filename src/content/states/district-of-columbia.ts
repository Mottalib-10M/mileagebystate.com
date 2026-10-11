import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import { destIndex, T } from '../../lib/data';

const sum = K.stateSummary('district-of-columbia');
const dc = K.nsas('DC')[0];
const d = T.dest[dc.i];
const L27 = d.fy['2027'].lodging, L26 = d.fy['2026'].lodging;
const twins = (['MD', 'VA'] as const).filter((st) => { const i = destIndex(st, dc.name); return i >= 0 && T.dest[i].fy['2027'].lodging.join() === L27.join() && T.dest[i].fy['2027'].mie === dc.mie; });
const winter = L27[1];
const winterMonths = K.MONTHS_FY.filter((_, m) => L27[m] === winter);
const fall = L27[0];
const fallMonths = K.MONTHS_FY.filter((_, m) => L27[m] === fall);
const m = (x: number) => K.usd(x, x % 1 ? 2 : 0);
const share = K.P.mie.partialDayShare;
const gas = K.gas('district-of-columbia');
const elec = K.elec('district-of-columbia');
const apr = K.trip({ destIndex: dc.i, depart: '2027-04-12', ret: '2027-04-15' });
const aug = K.trip({ destIndex: dc.i, depart: '2027-08-09', ret: '2027-08-12' });
const cross = K.trip({ destIndex: dc.i, depart: '2026-09-28', ret: '2026-10-02' });
const tier = K.tier(dc.mie);

export default defineState({
  slug: 'district-of-columbia',
  title: 'Per Diem Rates DC 2026-27: Washington Area, Spring Peak',
  description: `Washington, DC per diem 2026-27 (FY2027): ${K.usd(dc.high)} a night in ${dc.highMonths[0]} to ${dc.highMonths[dc.highMonths.length - 1]}, ${K.usd(dc.low)} in ${K.listOf(dc.lowMonths)}, ${K.usd(dc.mie)} M&IE, one rate shared with nearby Maryland and Virginia.`,
  intro: `The District of Columbia is a single GSA area for FY2027, and the same rates extend into parts of Virginia and Maryland.`,
  resume: `The FY2027 per diem for Washington, DC is ${K.usd(dc.high)} of lodging a night in ${K.listOf(dc.highMonths)}, falling to ${K.usd(winter)} from November to February and to ${K.usd(dc.low)} in ${K.listOf(dc.lowMonths)}, with ${K.usd(dc.mie)} of M&IE every day, the top federal tier. GSA defines the area as the District plus the cities of Alexandria, Falls Church and Fairfax, the counties of Arlington and Fairfax in Virginia, and the counties of Montgomery and Prince George's in Maryland, so a hotel in Rockville, Bowie or Arlington County is capped exactly like one in the District. The rates run from October 1, 2026 to September 30, 2027. A three-night stay from April 12, 2027 comes to ${m(apr.total)} at the federal maximum, while the same three nights from August 9, 2027 come to ${m(aug.total)}. The gap, ${m(apr.total - aug.total)}, is lodging only. The calculator above is set on the District.`,
  body: (h) => `
<h2>One rate, three jurisdictions</h2>
<p>GSA prints the Washington area under the District${twins.length ? `, and again under ${K.listOf(twins.map((s) => (s === 'MD' ? 'Maryland' : 'Virginia')))}, with identical monthly figures` : ''}. The text of the area reads: "${dc.counties}". In practice that means a contractor staying in Rockville, Gaithersburg or Hyattsville, or in Alexandria or Arlington County, claims the same ${K.usd(dc.mie)} of M&IE and the same nightly cap as one lodged inside the District. Beyond those lines the rate depends on the county: Loudoun, for instance, has its own separate listing in the Virginia table. The ${h.a('state:maryland', 'Maryland page')} and the ${h.a('state:virginia', 'Virginia page')} cover the rest of each state.</p>
<h2>Spring is dearest, high summer cheapest</h2>
<p>The FY2027 calendar for the District has four levels. ${K.listOf(fallMonths)} sit at ${K.usd(fall)}; ${K.listOf(winterMonths)} at ${K.usd(winter)}; ${K.listOf(dc.highMonths)} at ${K.usd(dc.high)}; ${K.listOf(dc.lowMonths)} at ${K.usd(dc.low)}. Compared with FY2026 the spring top rose ${K.usd(dc.high - dc.prev!.high)} and the summer floor ${K.usd(dc.low - dc.prev!.low)}. A May hearing therefore carries a cap ${K.usd(dc.high - dc.low)} higher per night than an August one with the same agenda.</p>
${h.mini('areaTrip', { area: 'Washington, DC', lodging: L27, mie: dc.mie })}
<h3>The October 1 step inside a trip</h3>
<p>September 2026 was still FY2026, at ${K.usd(L26[11])}. October 2026 opened FY2027 at ${K.usd(L27[0])}. Four nights from September 28 to October 2, 2026 therefore mix two caps: ${K.listOf(cross.days.filter((x) => x.lodgingMax > 0).map((x) => K.usd(x.lodgingMax)))}, for ${m(cross.total)} in all with M&IE. The calculator reads each night against its own fiscal year.</p>
<h2>Meals at the ${K.usd(dc.mie)} tier</h2>
<p>That tier breaks down into ${K.usd(tier.breakfast)} for breakfast, ${K.usd(tier.lunch)} for lunch, ${K.usd(tier.dinner)} for dinner and ${K.usd(tier.incidentals)} of incidentals. When a conference in the District serves lunch, ${K.usd(tier.lunch)} comes off that day; on the first and last day the allowance is ${K.usd(dc.mie * share, 2)} before any deduction. The ${h.a('meals-and-incidental-expenses', 'M&IE page')} explains how deductions work.</p>
<p>Driving in, the District is priced in EIA's ${K.stateRef('district-of-columbia').gasArea} gasoline series at ${K.usd(gas, 3)} a gallon (week of ${K.day(K.ENERGY_META.gasWeek)}). Residential electricity averaged ${K.num(elec, 2)} cents per kWh over ${K.ENERGY_META.elecPeriod}, against ${K.num(K.ENERGY_META.usElecCents, 2)} cents nationally.</p>
`,
  faqs: [
    { q: 'What is the per diem rate for Washington, DC in FY2027?', a: `${K.usd(dc.mie)} of M&IE a day and a lodging cap that depends on the month: ${K.usd(dc.high)} in ${K.listOf(dc.highMonths)}, ${K.usd(fall)} in ${K.listOf(fallMonths)}, ${K.usd(winter)} from November to February and ${K.usd(dc.low)} in ${K.listOf(dc.lowMonths)}. These GSA rates apply from October 1, 2026 to September 30, 2027.` },
    { q: 'Do Arlington and Rockville use the Washington, DC per diem?', a: `Yes. GSA's District of Columbia area includes Arlington and Fairfax counties and the cities of Alexandria, Falls Church and Fairfax in Virginia, plus Montgomery County (Rockville, Gaithersburg) and Prince George's County (Bowie, College Park) in Maryland. All of them take the same ${K.usd(dc.mie)} M&IE and the same monthly lodging cap, up to ${K.usd(dc.high)}.` },
    { q: 'Which month has the lowest DC per diem for lodging?', a: `${K.listOf(dc.lowMonths)}, at ${K.usd(dc.low)} a night in FY2027, which makes them the cheapest months in the Washington area, ${K.usd(dc.high - dc.low)} under the spring cap. Three nights in August 2027 total ${m(aug.total)} at the federal maximum including M&IE, against ${m(apr.total)} in April. M&IE stays at ${K.usd(dc.mie)} in every month.` },
  ],
  related: ['per-diem-rates', 'home', 'state:maryland', 'state:virginia', 'meals-and-incidental-expenses', 'per-diem-calculator'],
});
