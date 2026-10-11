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
const sum = K.stateSummary('new-mexico');
const ref = K.stateRef('new-mexico');
const at = (name: string) => sum.list.find((n) => n.name === name)!;
const abq = at('Albuquerque'), sf = at('Santa Fe'), cb = at('Carlsbad'), taos = at('Taos');
const abqRow = T.dest[abq.i].fy['2027'], sfRow = T.dest[sf.i].fy['2027'];
const sfMid = sfRow.lodging[1];
const sfMidMonths = K.MONTHS_FY.filter((_, m) => sfRow.lodging[m] === sfMid);
const std = sum.std;
const places = (PLACES as { rows: Array<[string, string, string, number, number, number]> }).rows.filter((r) => r[1] === 'NM');
const stdPlaces = places.filter((r) => r[3] === -1).map((r) => r[0]);
const rr = places.find((r) => r[0] === 'Rio Rancho');
const winter = K.trip({ destIndex: destIndex('NM', 'Albuquerque'), depart: '2027-01-18', ret: '2027-01-21' });
const spring = K.trip({ destIndex: destIndex('NM', 'Albuquerque'), depart: '2027-04-19', ret: '2027-04-22' });
const share = K.P.mie.partialDayShare;

export default defineState({
  slug: 'new-mexico',
  dest: 'Albuquerque',
  title: 'Per Diem Rates New Mexico 2026-27: Albuquerque Winter Peak',
  description: `New Mexico per diem 2026-27: Albuquerque jumps to ${K.usd(abq.high)} a night from ${abq.highMonths[0]} to ${abq.highMonths[abq.highMonths.length - 1]} in FY2027 (${K.usd(abq.prev!.high)} in FY2026), Santa Fe up to ${K.usd(sf.high)}, standard ${K.usd(std.lodging)} elsewhere.`,
  intro: `Albuquerque was a flat-rate area in FY2026; for FY2027 GSA gave it a winter season worth ${K.usd(abq.high - abq.prev!.high)} more a night.`,
  resume: `New Mexico has ${sum.count} GSA per diem areas in FY2027, and the biggest change is in Bernalillo County. Albuquerque now caps lodging at ${K.usd(abq.high)} from ${abq.highMonths[0]} through ${abq.highMonths[abq.highMonths.length - 1]} and ${K.usd(abq.low)} from ${abq.lowMonths[0]} through ${abq.lowMonths[abq.lowMonths.length - 1]}, against a single ${K.usd(abq.prev!.high)} last year, with ${K.usd(abq.mie)} of M&IE. Santa Fe ranges from ${K.usd(sf.low)} to ${K.usd(sf.high)}, Carlsbad (Eddy County) holds ${K.usd(cb.high)} and Taos ${K.usd(taos.high)}. Every other county uses ${K.usd(std.lodging)} and ${K.usd(std.mie)}. Three nights in Albuquerque from January 18 to 21, 2027 are worth ${K.usd(winter.total, 2)} at the federal maximum, and the same stay from April 19 to 22, 2027 is worth ${K.usd(spring.total, 2)}. All FY2027 values run from October 1, 2026 to September 30, 2027. Pick another New Mexico city or ZIP code in the calculator above to switch areas.`,
  body: (h) => `
<h2>Bernalillo County gets an October-to-March premium</h2>
<p>Until September 30, 2026, a federal traveler in Albuquerque could book up to ${K.usd(abq.prev!.high)} in any month. The FY2027 file replaces that flat figure with two: ${K.usd(abq.high)} for ${L(abq.highMonths)}, and ${K.usd(abq.low)} for the other six months. That is a ${K.usd(abq.high - abq.prev!.high)} rise in the high months and still ${K.usd(abq.low - abq.prev!.low)} more in the low ones, the largest move of any New Mexico line. The meal tier did not change: ${K.usd(abq.mie)} a day. A project team that rotates people through Albuquerque all year should budget the two halves separately, since a week in February and a week in May now differ by ${K.usd(5 * (abq.high - abq.low))} on five nights of lodging alone.</p>
${h.mini('areaTrip', { area: 'Albuquerque, NM', lodging: abqRow.lodging, mie: abqRow.mie })}
<h3>Rio Rancho is not part of it</h3>
<p>${rr ? `Rio Rancho lies in ${rr[2]}, outside the Albuquerque line, so a stay there is paid at the standard ${K.usd(std.lodging)}.` : `Sandoval County is outside the Albuquerque line.`} In ${abq.highMonths[0]}, that is ${K.usd(abq.high - std.lodging)} a night below a hotel inside Bernalillo County. The meal allowance falls too, from ${K.usd(abq.mie)} to ${K.usd(std.mie)}.</p>
<h2>Santa Fe's dip falls in January and February</h2>
<p>Santa Fe works on three levels: ${K.usd(sf.high)} in ${L(sf.highMonths)}, ${K.usd(sfMid)} in ${L(sfMidMonths)}, and its lowest ${K.usd(sf.low)} in ${L(sf.lowMonths)}. So the two cities point in opposite directions in midwinter: in January Albuquerque pays ${K.usd(abqRow.lodging[3])} and Santa Fe ${K.usd(sfRow.lodging[3])}. Both sit on the ${K.usd(sf.mie)} M&IE tier.</p>
<h3>Carlsbad and Taos, flat all year</h3>
<p>Eddy County, listed as Carlsbad, pays ${K.usd(cb.high)} in every month, up from ${K.usd(cb.prev!.high)}, with ${K.usd(cb.mie)} of M&IE. Taos is the only New Mexico area whose lodging cap did not move at all between the two fiscal years: ${K.usd(taos.high)}, also with ${K.usd(taos.mie)}. Las Cruces, Roswell, Farmington and the rest of the ${stdPlaces.length} larger Census places outside the four areas take the standard rate.</p>
<p>Gasoline for a New Mexico drive is priced with the EIA ${ref.gasArea} average, ${K.usd(ref.gas, 3)} a gallon in the week of ${K.day(K.ENERGY_META.gasWeek)}, ${K.usd(K.ENERGY_META.usGas - ref.gas, 3)} below the U.S. average. At the IRS ${K.centsWord(K.irs('2026-07-01'))} a mile, the ${h.a('mileage-reimbursement-calculator', 'mileage reimbursement calculator')} shows how much of the rate is left after fuel.</p>
`,
  faqs: [
    { q: 'Why did the Albuquerque, New Mexico per diem go up so much in FY2027?', a: `GSA turned Bernalillo County into a seasonal area. In FY2026 lodging was capped at ${K.usd(abq.prev!.high)} all year; in FY2027 it is ${K.usd(abq.high)} from ${abq.highMonths[0]} to ${abq.highMonths[abq.highMonths.length - 1]} and ${K.usd(abq.low)} from ${abq.lowMonths[0]} to ${abq.lowMonths[abq.lowMonths.length - 1]}. The high period covers the first six months of the fiscal year. The M&IE stayed at ${K.usd(abq.mie)}.` },
    { q: 'What is the cheapest month for the Santa Fe, New Mexico per diem?', a: `${L(sf.lowMonths)}, when the Santa Fe lodging cap is ${K.usd(sf.low)} a night in FY2027, ${K.usd(sf.high - sf.low)} below its peak. ${L(sfMidMonths)} pay ${K.usd(sfMid)}, and the other months ${K.usd(sf.high)}. The M&IE is ${K.usd(sf.mie)} every day, or ${K.usd(sf.mie * share, 2)} on the day you arrive and the day you leave.` },
    { q: 'Does Rio Rancho, New Mexico use the Albuquerque per diem rate?', a: `No. Rio Rancho is in Sandoval County, and only Bernalillo County is in the Albuquerque area. In FY2027 a Rio Rancho hotel is reimbursed up to the standard ${K.usd(std.lodging)} with ${K.usd(std.mie)} of M&IE, while Albuquerque pays up to ${K.usd(abq.high)}. Check the ZIP code of the hotel before you book.` },
  ],
  related: ['per-diem-rates', 'home', 'mileage-reimbursement-calculator', 'state:arizona', 'state:colorado', 'state:texas'],
});
