import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import { T } from '../../lib/data';

const sum = K.stateSummary('wisconsin');
const std = sum.std;
const area = (name: string) => K.nsas('WI').find((x) => x.name === name)!;
const mke = area('Milwaukee'), msn = area('Madison'), stb = area('Sturgeon Bay');
const L = (n: { i: number }, fy = '2027') => T.dest[n.i].fy[fy].lodging;
const msn26High = K.MONTHS_FY.filter((_, m) => L(msn, '2026')[m] === msn.prev!.high);
const gained = msn.highMonths.filter((x) => !msn26High.includes(x));
const oneTier = sum.mieTiers.length === 1;
const apr27 = K.trip({ destIndex: msn.i, depart: '2027-04-12', ret: '2027-04-15' });
const apr26 = K.trip({ destIndex: msn.i, depart: '2026-04-13', ret: '2026-04-16' });
const tier = K.tier(mke.mie);
const mkeEx = K.trip({ destIndex: mke.i, depart: '2027-05-10', ret: '2027-05-13' });
const stdEx = K.trip({ destIndex: -1, depart: '2027-05-10', ret: '2027-05-13' });
const cross = K.trip({ destIndex: msn.i, depart: '2027-03-29', ret: '2027-04-02' });
const share = K.P.mie.partialDayShare;
const elec = K.elec('wisconsin');
const CAL = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const span = (ms: string[]) => { const set = new Set(ms.map((x) => CAL.indexOf(x))); const start = [...set].find((i) => !set.has((i + 11) % 12)); if (start === undefined) return 'all year'; let end = start, n = 1; while (set.has((end + 1) % 12)) { end = (end + 1) % 12; n++; } return n !== set.size ? K.listOf(ms) : n === 1 ? CAL[start] : `${CAL[start]} to ${CAL[end]}`; };
const W = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve'];
const m2 = (x: number) => K.usd(x, x % 1 ? 2 : 0);

export default defineState({
  slug: 'wisconsin',
  dest: 'Milwaukee',
  title: 'Per Diem Rates WI 2026-27: Milwaukee, Madison, Door County',
  description: `Wisconsin per diem 2026-27: Milwaukee ${K.usd(mke.high)} all year, Madison ${K.usd(msn.high)} for ${msn.highMonths.length} months, Sturgeon Bay ${K.usd(stb.high)} in season, ${K.usd(mke.mie)} M&IE in all ${sum.count} GSA areas, ${K.usd(std.lodging)} elsewhere.`,
  intro: `Wisconsin's ${sum.count} GSA areas for FY2027 ${oneTier ? `share one ${K.usd(mke.mie)} meals rate` : 'use several meals rates'}, and Madison's higher lodging cap now starts in April.`,
  resume: `Milwaukee County holds the top Wisconsin per diem for FY2027, ${K.usd(mke.high)} a night in every month, but Dane County's ${K.usd(msn.high)} now applies for ${msn.highMonths.length} months of the year, ${K.listOf(msn.highMonths)}, after GSA added ${K.listOf(gained)} to its high band. Door County, listed as Sturgeon Bay, reaches ${K.usd(stb.high)} in ${K.listOf(stb.highMonths)}. ${oneTier ? `All three areas pay ${K.usd(mke.mie)} of M&IE.` : ''} Green Bay, Kenosha, Racine, Appleton and Waukesha are not listed and take the standard ${K.usd(std.lodging)} and ${K.usd(std.mie)}. With the FY2027 table, three nights in Madison from April 12 to April 15, 2027 total ${m2(apr27.total)} at the federal maximum; the same April stay in 2026, under FY2026 rates, was ${m2(apr26.total)}. The two travel days in each total are paid at ${K.pct(share)} of the meals rate, and lodging taxes are claimed separately.`,
  body: (h) => `
<h2>Madison's high band now runs from April</h2>
<p>Dane County has two lodging levels in FY2027: ${K.usd(msn.high)} in ${K.listOf(msn.highMonths)}, and ${K.usd(msn.low)} in ${K.listOf(msn.lowMonths)}. In FY2026 the upper figure, also ${K.usd(msn.prev!.high)}, covered ${K.listOf(msn26High)}, and the low months paid ${K.usd(msn.prev!.low)}. An April meeting in Madison is therefore paid ${K.usd(msn.high - msn.prev!.low)} more per night than a year ago. The low level equals the standard lodging rate, so from ${span(msn.lowMonths)} a Madison trip differs from a Green Bay one only through M&IE: ${K.usd(msn.mie)} against ${K.usd(std.mie)}.</p>
${h.mini('areaTrip', { area: 'Madison, WI', lodging: L(msn), mie: msn.mie })}
<h3>Door County's off season is the standard rate</h3>
<p>The Sturgeon Bay area pays ${K.usd(stb.high)} in ${K.listOf(stb.highMonths)}, up ${K.usd(stb.high - stb.prev!.high)}, and ${K.usd(stb.low)} from ${span(stb.lowMonths)}. Those ${W[stb.lowMonths.length]} months match the national standard to the dollar. Milwaukee is the opposite case: no season at all, ${K.usd(mke.high)} from October 2026 to September 2027, ${K.usd(mke.high - mke.prev!.high)} more than last year's flat ${K.usd(mke.prev!.high)}.</p>
<h2>Most Wisconsin cities are on the standard rate</h2>
<p>Most Wisconsin places with 15,000 people or more in the Census file sit in counties that GSA does not list. That includes Waukesha County (Waukesha, Brookfield, New Berlin), Kenosha and Racine counties, Brown County (Green Bay), Outagamie (Appleton), Winnebago (Oshkosh), Eau Claire and Rock (Janesville). All take ${K.usd(std.lodging)} for the room and ${K.usd(std.mie)} for meals. ${oneTier ? `In the three listed areas the ${K.usd(mke.mie)} tier breaks down into ${K.usd(tier.breakfast)} for breakfast, ${K.usd(tier.lunch)} for lunch, ${K.usd(tier.dinner)} for dinner and ${K.usd(tier.incidentals)} of incidentals.` : ''}</p>
<p>The county line matters in money terms. Three nights in Milwaukee County from May 10 to May 13, 2027 total ${m2(mkeEx.total)} at the federal maximum; the same nights in Waukesha County, on the standard rate, ${m2(stdEx.total)}. In Madison, a stay from March 29 to April 2, 2027 straddles the change of band: the March nights are capped at ${K.usd(L(msn)[5])} and the April ones at ${K.usd(L(msn)[6])}, for ${m2(cross.total)} in all.</p>
<p>Wisconsin gasoline is priced in EIA's ${K.stateRef('wisconsin').gasArea} series at ${K.usd(K.gas('wisconsin'), 3)} a gallon (week of ${K.day(K.ENERGY_META.gasWeek)}), and residential electricity averaged ${K.num(elec, 2)} cents per kWh over ${K.ENERGY_META.elecPeriod}. Both feed the ${h.a('mileage-reimbursement-calculator', 'mileage reimbursement calculator')} comparison with the IRS rate.</p>
`,
  faqs: [
    { q: 'What is the Madison, Wisconsin per diem for April 2027?', a: `${K.usd(L(msn)[6])} of lodging per night and ${K.usd(msn.mie)} of M&IE per day, under GSA's FY2027 rates for Dane County. April joined the higher band this year; in April 2026 the cap was ${K.usd(L(msn, '2026')[6])}. From ${span(msn.lowMonths)} the cap is ${K.usd(msn.low)}. On travel days the M&IE is ${K.usd(msn.mie * share, 2)}.` },
    { q: 'Does Green Bay, Wisconsin have a non-standard per diem?', a: `No. Brown County has no GSA listing in FY2027, so Green Bay takes the standard ${K.usd(std.lodging)} for lodging and ${K.usd(std.mie)} for M&IE, from October 1, 2026 to September 30, 2027. In Wisconsin only Milwaukee, Dane (Madison) and Door (Sturgeon Bay) counties have their own rates.` },
    { q: 'Is Waukesha, Wisconsin covered by the Milwaukee per diem rate?', a: `No. The Milwaukee area is Milwaukee County only. Waukesha County is not listed, so a hotel in Waukesha, Brookfield or New Berlin is capped at the standard ${K.usd(std.lodging)} in FY2027, against ${K.usd(mke.high)} in Milwaukee County. The meals rate also differs: ${K.usd(std.mie)} against ${K.usd(mke.mie)}. Lodging follows the place where you sleep.` },
  ],
  related: ['per-diem-rates', 'home', 'state:minnesota', 'state:illinois', 'state:iowa', 'mileage-reimbursement-calculator'],
});
