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
const sum = K.stateSummary('new-jersey');
const at = (name: string) => sum.list.find((n) => n.name === name)!;
const tr = at('Toms River'), nwk = at('Newark'), pr = at('Princeton / Trenton'), ch = at('Cherry Hill / Moorestown'), ed = at('Edison / Piscataway');
const trRow = T.dest[tr.i].fy['2027'], nwkRow = T.dest[nwk.i].fy['2027'];
const trLead = K.MONTHS_FY.filter((_, m) => trRow.lodging[m] > nwkRow.lodging[m]);
const nwkLead = K.MONTHS_FY.filter((_, m) => nwkRow.lodging[m] > trRow.lodging[m]);
const trLow = trLead.filter((m) => !tr.highMonths.includes(m));
const std = sum.std;
const places = (PLACES as { rows: Array<[string, string, string, number, number, number]> }).rows.filter((r) => r[1] === 'NJ');
const stdPlaces = places.filter((r) => r[3] === -1);
const ac = places.find((r) => r[0] === 'Atlantic City');
const stdCounties = [...new Set(stdPlaces.map((r) => r[2]))];
const ex = K.trip({ destIndex: destIndex('NJ', 'Newark'), depart: '2026-11-02', ret: '2026-11-05' });
const shore = K.trip({ destIndex: destIndex('NJ', 'Toms River'), depart: '2027-07-19', ret: '2027-07-22' });
const share = K.P.mie.partialDayShare;
const tier86 = sum.list.filter((n) => n.mie === 86).map((n) => n.name);

export default defineState({
  slug: 'new-jersey',
  dest: 'Newark',
  title: 'Per Diem Rates New Jersey 2026-27: Newark, Shore, Suburbs',
  description: `New Jersey per diem 2026-27: ${sum.count} GSA areas; Newark peaks at ${K.usd(nwk.high)} a night in the fall, Toms River ${K.usd(tr.high)} in summer, Cherry Hill ${K.usd(ch.high)}; M&IE ${K.usd(sum.mieTiers[0])} to ${K.usd(sum.mieTiers[sum.mieTiers.length - 1])} in FY2027.`,
  intro: `For ${trLead.length} months of FY2027 the highest New Jersey lodging cap belongs to Ocean County, not to Newark.`,
  resume: `New Jersey per diem for FY2027 is set county by county across ${sum.count} GSA areas. The Newark line (Essex, Bergen, Hudson and Passaic) pays ${K.usd(nwk.high)} of lodging in ${L(nwk.highMonths)} and ${K.usd(nwk.low)} the rest of the year, with ${K.usd(nwk.mie)} of M&IE. Ocean County, listed as Toms River, reaches ${K.usd(tr.high)} in ${L(tr.highMonths)} but stays on the ${K.usd(tr.mie)} meal tier. Mercer County (Princeton and Trenton) is ${K.usd(pr.high)} flat, and Camden and Burlington counties sit at ${K.usd(ch.high)}. Counties outside the list, Atlantic and Cumberland among them, take ${K.usd(std.lodging)} and ${K.usd(std.mie)}. A three-night trip to Newark from November 2 to 5, 2026 adds up to ${K.usd(ex.total, 2)} at the federal maximum, ${K.usd(ex.lodging)} for the rooms and ${K.usd(ex.mie, 2)} for meals. The calculator above is set to Newark; switch to any New Jersey city or ZIP code.`,
  body: (h) => `
<h2>Ocean County outranks North Jersey most of the year</h2>
<p>Newark leads the New Jersey table only in ${L(nwkLead)}, at ${K.usd(nwk.high)}. From ${trLead[0]} through ${trLead[trLead.length - 1]}, Toms River is ahead: its off-season cap of ${K.usd(tr.low)} already edges past the Newark value of ${K.usd(nwk.low)}, and in ${L(tr.highMonths)} it jumps to ${K.usd(tr.high)}, ${K.usd(tr.high - nwk.low)} above North Jersey for those weeks. The meal side runs the other way: Ocean County is the only New Jersey area on the ${K.usd(tr.mie)} tier, while ${L(tier86)} get ${K.usd(nwk.mie)}. So a July stay at the shore wins on lodging and loses ${K.usd(nwk.mie - tr.mie)} a day on meals against one in Hackensack or Jersey City. Three nights in Toms River from July 19 to 22, 2027 total ${K.usd(shore.total, 2)}.</p>
<h3>Newark now has two prices</h3>
<p>Last year the Essex, Bergen, Hudson and Passaic line was a single ${K.usd(nwk.prev!.high)} in every month. For FY2027 GSA split it: ${K.usd(nwk.high)} in ${L(nwk.highMonths)}, ${K.usd(nwk.low)} from ${nwk.lowMonths[0]} through ${nwk.lowMonths[nwk.lowMonths.length - 1]}. Both values are above the old one, so no traveler loses, but a claim that crosses January 1 now carries two different caps and should be computed night by night, which the calculator does.</p>
${h.mini('areaTrip', { area: 'Newark, NJ', lodging: nwkRow.lodging, mie: nwkRow.mie })}
<h3>Camden and Burlington, a whisker above standard</h3>
<p>The Cherry Hill and Moorestown area pays ${K.usd(ch.high)}, only ${K.usd(ch.high - std.lodging)} more than the ${K.usd(std.lodging)} standard, though its ${K.usd(ch.mie)} M&IE beats the standard ${K.usd(std.mie)} by ${K.usd(ch.mie - std.mie)} each full day. Middlesex County (Edison and Piscataway) is close behind at ${K.usd(ed.high)}. For these suburbs the meal allowance, not the room, is where the GSA listing pays off.</p>
<h2>Atlantic City on the standard rate</h2>
<p>${ac ? `Atlantic City sits in ${ac[2]}, which has no GSA line in FY2027.` : 'Atlantic County has no GSA line in FY2027.'} Of the ${places.length} New Jersey places of 15,000 or more people in the Census file, ${stdPlaces.length} fall outside every listed area, in ${L(stdCounties.slice(0, 5))}. Each is paid at ${K.usd(std.lodging)} and ${K.usd(std.mie)}, with ${K.usd(std.mie * share, 2)} on travel days. A trip to a casino-hotel conference is still a standard-rate trip; only the hotel bill above the cap is the traveler's problem, or the reason to ask for ${h.a('travel-reimbursement', 'actual expense approval')} in advance.</p>
<p>Fuel for a New Jersey drive is priced with the EIA ${K.stateRef('new-jersey').gasArea} series, ${K.usd(K.gas('new-jersey'), 3)} a gallon of regular in the week of ${K.day(K.ENERGY_META.gasWeek)}.</p>
`,
  faqs: [
    { q: 'Is the Toms River, New Jersey per diem higher than Newark in FY2027?', a: `On lodging, yes in ${trLead.length} months: Ocean County pays ${K.usd(tr.low)} from ${trLow[0]} to ${trLow[trLow.length - 1]} and ${K.usd(tr.high)} in ${L(tr.highMonths)}, against ${K.usd(nwk.low)} in Newark. Newark is higher in ${L(nwkLead)}, at ${K.usd(nwk.high)}. Toms River also has the lowest M&IE among New Jersey areas, ${K.usd(tr.mie)} a day, compared with ${K.usd(nwk.mie)} in Newark.` },
    { q: 'What is the per diem for Princeton or Trenton, New Jersey?', a: `Mercer County is one GSA area, Princeton / Trenton, with a lodging cap of ${K.usd(pr.high)} in every month of FY2027 and ${K.usd(pr.mie)} of M&IE. That is up from ${K.usd(pr.prev!.high)} of lodging in FY2026. On the first and last day of the trip the M&IE is ${K.usd(pr.mie * share, 2)}.` },
    { q: 'Does Atlantic City, New Jersey have a GSA per diem rate?', a: `Not its own. Atlantic County is not a non-standard area in FY2027, so a trip there is reimbursed at the standard ${K.usd(std.lodging)} for lodging and ${K.usd(std.mie)} for M&IE, from October 1, 2026 to September 30, 2027. If hotel prices during an event exceed the cap, your agency can approve actual expense before you travel.` },
  ],
  related: ['per-diem-rates', 'home', 'travel-reimbursement', 'state:new-york', 'state:pennsylvania', 'state:delaware'],
});
