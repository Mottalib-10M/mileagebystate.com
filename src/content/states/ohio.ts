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
const sum = K.stateSummary('ohio');
const ref = K.stateRef('ohio');
const at = (name: string) => sum.list.find((n) => n.name === name)!;
const san = at('Sandusky'), cin = at('Cincinnati'), cle = at('Cleveland'), col = at('Columbus'), ham = at('Hamilton'), day = at('Dayton / Fairborn');
const sanRow = T.dest[san.i].fy['2027'];
const sanMid = sanRow.lodging[3];
const sanMidMonths = K.MONTHS_FY.filter((_, m) => sanRow.lodging[m] === sanMid);
const std = sum.std;
const places = (PLACES as { rows: Array<[string, string, string, number, number, number]> }).rows.filter((r) => r[1] === 'OH');
const stdPlaces = places.filter((r) => r[3] === -1).map((r) => r[0]);
const hamCity = places.find((r) => r[0] === 'Hamilton');
const ex = K.trip({ destIndex: destIndex('OH', 'Cincinnati'), depart: '2027-05-10', ret: '2027-05-13' });
const sanJul = K.trip({ destIndex: destIndex('OH', 'Sandusky'), depart: '2027-07-12', ret: '2027-07-15' });
const share = K.P.mie.partialDayShare;
const gas = ref.gas, usGas = K.ENERGY_META.usGas;
const camry = K.car('Toyota Camry');

export default defineState({
  slug: 'ohio',
  dest: 'Cincinnati',
  title: 'Per Diem Rates Ohio 2026-27: Cincinnati, Cleveland, Sandusky',
  description: `Ohio per diem 2026-27: ${sum.count} GSA areas on ${sum.mieTiers.length} M&IE tiers; Cincinnati ${K.usd(cin.high)} a night with ${K.usd(cin.mie)}, Cleveland ${K.usd(cle.high)}, Sandusky up to ${K.usd(san.high)} in summer; ${K.usd(std.lodging)} elsewhere in FY2027.`,
  intro: `Ohio's ${sum.count} GSA areas use ${sum.mieTiers.length} different meal tiers, and the highest room cap of FY2027 belongs to the county on the lowest one.`,
  resume: `Ohio per diem for FY2027 is listed for ${sum.count} areas, with M&IE from ${K.usd(sum.mieTiers[0])} to ${K.usd(sum.mieTiers[sum.mieTiers.length - 1])} a day. Cincinnati (Hamilton and Clermont counties) caps lodging at ${K.usd(cin.high)} with ${K.usd(cin.mie)} of M&IE, Cleveland at ${K.usd(cle.high)} with ${K.usd(cle.mie)}, Columbus at ${K.usd(col.high)}, all flat across the year. Sandusky (Erie County) is the one seasonal line: ${K.usd(san.high)} in ${L(san.highMonths)}, ${K.usd(sanMid)} from ${sanMidMonths[0]} to ${sanMidMonths[sanMidMonths.length - 1]} and ${K.usd(san.low)} in ${L(san.lowMonths)}. Toledo, Akron and the other unlisted counties take ${K.usd(std.lodging)} and ${K.usd(std.mie)}. A three-night trip to Cincinnati from May 10 to 13, 2027 adds up to ${K.usd(ex.total, 2)} at the federal maximum, ${K.usd(ex.lodging)} for lodging and ${K.usd(ex.mie, 2)} for M&IE. These FY2027 rates apply from October 1, 2026 to September 30, 2027. The calculator above opens on Cincinnati; enter an Ohio city or ZIP code to switch.`,
  body: (h) => `
<h2>Hamilton the area is not Hamilton County</h2>
<p>Ohio's GSA file contains a trap. The line called Hamilton covers Butler and Warren counties, ${hamCity ? `named after the city of Hamilton in ${hamCity[2]}` : 'named after the city of Hamilton'}, and pays ${K.usd(ham.high)} with ${K.usd(ham.mie)} of M&IE. Hamilton County, where downtown Cincinnati sits, belongs to the Cincinnati line instead, at ${K.usd(cin.high)} and ${K.usd(cin.mie)}. A traveler who picks the area by name rather than by county can understate the claim by ${K.usd(cin.high - ham.high)} a night and ${K.usd(cin.mie - ham.mie)} a day. The ZIP search above avoids the mix-up.</p>
<h3>Sandusky's summer jump</h3>
<p>Erie County is the only Ohio line that changes with the month, and it runs on three levels in FY2027. Its peak in ${L(san.highMonths)} went from ${K.usd(san.prev!.high)} last year to ${K.usd(san.high)}, a rise of ${K.usd(san.high - san.prev!.high)}, while the off-season changed little. Yet the M&IE stays on the base ${K.usd(san.mie)} tier, so three nights there from July 12 to 15, 2027 total ${K.usd(sanJul.total, 2)}: more room than Cincinnati, fewer dollars for meals.</p>
${h.mini('areaTrip', { area: 'Sandusky, OH', lodging: sanRow.lodging, mie: sanRow.mie })}
<h2>Cincinnati and Cleveland, ${K.usd(cin.high - cle.high)} apart</h2>
<p>The two dearest year-round caps are close on lodging, ${K.usd(cin.high)} and ${K.usd(cle.high)}, but sit on different meal tiers: ${K.usd(cin.mie)} for Hamilton and Clermont counties, ${K.usd(cle.mie)} for Cuyahoga. Columbus (Franklin County) is ${K.usd(col.high)}, and Dayton with Fairborn, which spans Greene and Montgomery counties, is the lowest listed at ${K.usd(day.high)}, ${K.usd(day.high - std.lodging)} above the standard. Of the ${places.length} Ohio places above 15,000 people in the Census file, ${stdPlaces.length} lie outside every area, ${L(stdPlaces.slice(0, 5))} included.</p>
<h2>Ohio's own gasoline average</h2>
<p>Buckeye drivers get a price of their own in the EIA survey, with no regional proxy. Regular averaged ${K.usd(gas, 3)} a gallon in the week of ${K.day(K.ENERGY_META.gasWeek)}, ${K.usd(usGas - gas, 3)} under the U.S. figure. For a ${camry.label.split(' (')[0]} rated at ${camry.mpg} mpg by the EPA, that is ${K.usd(gas / camry.mpg, 3)} of fuel per mile, a small slice of the IRS ${K.centsWord(K.irs('2026-07-01'))}. Diesel has no Ohio series and uses the ${ref.dieselArea} figure.</p>
${h.mini('fuelLeg', { label: 'Ohio', price: gas })}
`,
  faqs: [
    { q: 'Is the Hamilton, Ohio per diem the same as Hamilton County?', a: `No. The GSA area named Hamilton covers Butler and Warren counties and pays ${K.usd(ham.high)} of lodging with ${K.usd(ham.mie)} of M&IE in FY2027. Hamilton County is part of the Cincinnati area, together with Clermont County, at ${K.usd(cin.high)} and ${K.usd(cin.mie)}. Look up the work site's ZIP code rather than the area name.` },
    { q: 'When is the Sandusky, Ohio per diem highest?', a: `In ${L(san.highMonths)}, when Erie County lodging is capped at ${K.usd(san.high)} a night. From ${sanMidMonths[0]} to ${sanMidMonths[sanMidMonths.length - 1]} the cap is ${K.usd(sanMid)}, and in ${L(san.lowMonths)} it is ${K.usd(san.low)}. The M&IE is ${K.usd(san.mie)} all year, or ${K.usd(san.mie * share, 2)} on travel days, from October 1, 2026.` },
    { q: 'What is the Columbus, Ohio per diem rate for FY2027?', a: `Franklin County, listed as Columbus, has a lodging cap of ${K.usd(col.high)} in every month and ${K.usd(col.mie)} of M&IE, up from ${K.usd(col.prev!.high)} of lodging in FY2026. On the first and last day of the trip the M&IE is ${K.usd(col.mie * share, 2)}. Suburbs in other counties, such as Delaware or Licking, need their own lookup.` },
  ],
  related: ['per-diem-rates', 'home', 'gas-cost-calculator', 'state:pennsylvania', 'state:michigan', 'state:kentucky'],
});
