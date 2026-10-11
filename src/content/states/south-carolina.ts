import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import { T } from '../../lib/data';

const sum = K.stateSummary('south-carolina');
const area = (name: string) => K.nsas('SC').find((x) => x.name === name)!;
const chs = area('Charleston'), hh = area('Hilton Head'), myr = area('Myrtle Beach'), col = area('Columbia');
const L = (n: { i: number }, fy = '2027') => T.dest[n.i].fy[fy].lodging;
const frozen = L(chs).join() === L(chs, '2026').join();
const chsMid = L(chs)[0];
const chsMidMonths = K.MONTHS_FY.filter((_, m) => L(chs)[m] === chsMid);
const myrSpring = L(myr)[6];
const myrSpringMonths = K.MONTHS_FY.filter((_, m) => L(myr)[m] === myrSpring);
const myrSpring26 = L(myr, '2026')[6];
const myrSpring26Months = K.MONTHS_FY.filter((_, m) => L(myr, '2026')[m] === myrSpring26);
const ex = K.trip({ destIndex: chs.i, depart: '2027-04-12', ret: '2027-04-15' });
const exJan = K.trip({ destIndex: chs.i, depart: '2027-01-11', ret: '2027-01-14' });
const gas = K.gas('south-carolina');
const share = K.P.mie.partialDayShare;
const CAL = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const span = (ms: string[]) => { const set = new Set(ms.map((x) => CAL.indexOf(x))); const start = [...set].find((i) => !set.has((i + 11) % 12)); if (start === undefined) return 'all year'; let end = start, n = 1; while (set.has((end + 1) % 12)) { end = (end + 1) % 12; n++; } return n !== set.size ? K.listOf(ms) : n === 1 ? CAL[start] : `${CAL[start]} to ${CAL[end]}`; };
const W = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve'];
const m2 = (x: number) => K.usd(x, x % 1 ? 2 : 0);

export default defineState({
  slug: 'south-carolina',
  dest: 'Charleston',
  title: 'Per Diem Rates SC 2026-27: Charleston and Myrtle Beach',
  description: `South Carolina per diem 2026-27: Charleston peaks at ${K.usd(chs.high)} in ${K.listOf(chs.highMonths)}, Myrtle Beach ${K.usd(myr.high)} in summer, Columbia ${K.usd(col.high)}, M&IE from ${K.usd(sum.mieTiers[0])} to ${K.usd(sum.mieTiers[sum.mieTiers.length - 1])} a day.`,
  intro: `South Carolina lists ${sum.count} GSA areas for FY2027, and the Charleston calendar is a spring one rather than a summer one.`,
  resume: `Charleston, Berkeley and Dorchester counties top the South Carolina per diem table at ${K.usd(chs.high)} a night in ${K.listOf(chs.highMonths)} 2027, with ${K.usd(chs.mie)} of M&IE, the highest of the ${sum.mieTiers.length} meal tiers found in the state. ${frozen ? 'Not one of its twelve monthly caps moved from FY2026.' : 'Its monthly caps were revised from FY2026.'} On the beaches the peak falls in ${K.listOf(myr.highMonths)} instead: ${K.usd(myr.high)} at Myrtle Beach and ${K.usd(hh.high)} at Hilton Head. Columbia holds ${K.usd(col.high)} all year, only ${K.usd(col.high - sum.std.lodging)} above the standard ${K.usd(sum.std.lodging)} that covers counties such as Greenville and Spartanburg. Worked out with the FY2027 tables, three nights in Charleston from April 12 to April 15, 2027 come to ${m2(ex.total)} at the federal maximum, while the same stay in January 2027 is ${m2(exJan.total)}. The two travel days pay ${K.pct(share)} of the M&IE, and lodging taxes are reimbursed separately.`,
  body: (h) => `
<h2>Charleston peaks before the beaches do</h2>
<p>The Charleston area runs on three steps. ${K.listOf(chs.highMonths)} are capped at ${K.usd(chs.high)}, ${K.listOf(chs.lowMonths)} at ${K.usd(chs.low)}, and ${K.listOf(chsMidMonths)} at ${K.usd(chsMid)}. ${frozen ? `GSA carried the whole FY2026 schedule over unchanged, so a planner who budgeted Charleston last year can reuse the same nightly figures for FY2027.` : `The schedule was revised from FY2026.`} The coastal resort areas follow a different clock, with their top month in ${K.listOf(myr.highMonths)}. A spring conference in Charleston and a summer one in Myrtle Beach therefore both land on their area's highest cap.</p>
${h.mini('areaTrip', { area: 'Charleston, SC', lodging: L(chs), mie: chs.mie })}
<h3>Myrtle Beach grew a spring step</h3>
<p>Horry County was redrawn more than any other South Carolina area. In FY2026 it had a flat ${K.usd(myr.prev!.low)} for most of the year, ${K.usd(myrSpring26)} in ${K.listOf(myrSpring26Months)} and ${K.usd(myr.prev!.high)} in summer. In FY2027 the summer cap is ${K.usd(myr.high)}, ${K.listOf(myrSpringMonths)} pay ${K.usd(myrSpring)}, and the low months bottom out at ${K.usd(myr.low)}, which is exactly the standard rate. The M&IE stays at ${K.usd(myr.mie)}. Beaufort County, the Hilton Head area, swings from ${K.usd(hh.low)} to ${K.usd(hh.high)} with ${K.usd(hh.mie)} of M&IE, a tier above Myrtle Beach.</p>
<h2>Columbia, and Greenville on the standard rate</h2>
<p>Richland and Lexington counties form the Columbia area at ${K.usd(col.high)} in every month, the same as in FY2026, and ${K.usd(col.mie)} of meals. That is close enough to the standard that the area mostly matters for M&IE: ${K.usd(col.mie - sum.std.mie)} a day above the ${K.usd(sum.std.mie)} standard. Greenville, Spartanburg, Rock Hill, Florence and Aiken are not in any area; the Census city list used by the search above places them in counties that GSA does not name, so they take ${K.usd(sum.std.lodging)} and ${K.usd(sum.std.mie)}.</p>
<p>South Carolina gasoline is priced in EIA's ${K.stateRef('south-carolina').gasArea} series, ${K.usd(gas, 3)} a gallon in the week of ${K.day(K.ENERGY_META.gasWeek)}, which is ${K.usd(K.ENERGY_META.usGas - gas, 3)} under the U.S. average. A driver paid ${K.centsWord(K.irs('2026-07-01'))} a mile spends about ${K.usd(gas / 28, 3)} of that on fuel at 28 miles per gallon; the ${h.a('mileage-reimbursement-calculator', 'mileage reimbursement calculator')} splits the trip at the IRS rate.</p>
`,
  faqs: [
    { q: 'What is the Charleston, South Carolina per diem for FY2027?', a: `${K.usd(chs.mie)} of M&IE a day, with lodging capped at ${K.usd(chs.high)} in ${K.listOf(chs.highMonths)}, ${K.usd(chsMid)} in ${K.listOf(chsMidMonths)} and ${K.usd(chs.low)} from ${span(chs.lowMonths)}. The area covers ${chs.counties} counties. ${frozen ? 'Every monthly figure is the same as in FY2026.' : ''} Arrival and departure days pay ${K.usd(chs.mie * share, 2)} of M&IE.` },
    { q: 'How much did the Myrtle Beach, South Carolina per diem change in FY2027?', a: `The summer lodging cap for Horry County went from ${K.usd(myr.prev!.high)} to ${K.usd(myr.high)}, a rise of ${K.usd(myr.high - myr.prev!.high)} a night in ${K.listOf(myr.highMonths)}. GSA also added a ${K.usd(myrSpring)} level for ${K.listOf(myrSpringMonths)}. The winter floor is ${K.usd(myr.low)}, the standard rate, and M&IE is unchanged at ${K.usd(myr.mie)}.` },
    { q: 'Is Greenville, South Carolina a non-standard per diem area?', a: `No. Greenville County has no GSA listing in FY2027, so travel to Greenville or Greer is paid at the standard ${K.usd(sum.std.lodging)} of lodging and ${K.usd(sum.std.mie)} of M&IE. The same applies to Spartanburg and York counties. In South Carolina only Charleston, Hilton Head (Beaufort), Myrtle Beach (Horry) and Columbia (Richland, Lexington) have their own rates.` },
  ],
  related: ['per-diem-rates', 'home', 'state:north-carolina', 'state:georgia', 'mileage-reimbursement-calculator'],
});
