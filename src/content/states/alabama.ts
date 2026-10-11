import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import { destIndex, T } from '../../lib/data';

const sum = K.stateSummary('alabama');
const area = (name: string) => K.nsas('AL').find((n) => n.name === name)!;
const gs = area('Gulf Shores'), bhm = area('Birmingham'), hsv = area('Huntsville'), mob = area('Mobile');
const gsL = T.dest[gs.i].fy['2027'].lodging;
const spring = gsL[5]; // March to May step of the Gulf Shores calendar (index 5 = March)
const springMonths = K.MONTHS_FY.filter((_, m) => gsL[m] === spring);
const std = sum.std;
const m = (x: number) => K.usd(x, x % 1 ? 2 : 0);
const gas = K.gas('alabama');
const share = K.P.mie.partialDayShare;
const june = K.trip({ destIndex: gs.i, depart: '2027-06-14', ret: '2027-06-17' });
const nov = K.trip({ destIndex: gs.i, depart: '2026-11-09', ret: '2026-11-12' });
const bhmTrip = K.trip({ destIndex: bhm.i, depart: '2026-11-09', ret: '2026-11-12' });
const hsvTrip = K.trip({ destIndex: hsv.i, depart: '2026-11-09', ret: '2026-11-12' });

export default defineState({
  slug: 'alabama',
  dest: 'Gulf Shores',
  title: 'Per Diem Rates Alabama 2026-27: Gulf Shores to Mobile',
  description: `Alabama per diem 2026-27 (FY2027): ${sum.count} GSA areas, Gulf Shores up to ${K.usd(gs.high)} a night in ${K.listOf(gs.highMonths)}, Birmingham M&IE ${K.usd(bhm.mie)}, ${K.usd(std.lodging)} lodging in all other counties.`,
  intro: `Alabama has ${sum.count} GSA areas in FY2027, and only the Baldwin County coast changes its lodging cap with the calendar.`,
  resume: `Federal per diem in Alabama tops out at ${K.usd(gs.high)} of lodging a night in Gulf Shores (Baldwin County) in ${K.listOf(gs.highMonths)}, with ${K.usd(gs.mie)} of M&IE, and falls to the standard ${K.usd(std.lodging)} plus ${K.usd(std.mie)} in every county GSA does not name. The FY2027 table, valid from October 1, 2026 to September 30, 2027, lists ${sum.count} Alabama areas: Gulf Shores, Huntsville, Birmingham and Mobile. Gulf Shores is the only one with seasons; the other three keep one cap all year. A three-night stay in Gulf Shores from June 14, 2027 comes to ${m(june.total)} at the federal maximum, against ${m(nov.total)} for the same three nights in November 2026, because the room cap drops to ${K.usd(gs.low)} outside the peak. Birmingham is the one Alabama area on the ${K.usd(bhm.mie)} meals tier. Search a city or ZIP code in the calculator to switch areas.`,
  body: (h) => `
<h2>Baldwin County runs on three price steps</h2>
<p>Gulf Shores does not simply have a summer and a winter. Its FY2027 cap sits at ${K.usd(gs.low)} in ${K.listOf(gs.lowMonths)}, climbs to ${K.usd(spring)} in ${K.listOf(springMonths)}, then reaches ${K.usd(gs.high)} in ${K.listOf(gs.highMonths)} alone. So a crew booked for the last week of May and the first week of June gets two different maxima in the same trip, ${K.usd(gs.high - spring)} apart per night. Last year the coastal range was ${K.usd(gs.prev!.low)} to ${K.usd(gs.prev!.high)}; the floor moved up ${K.usd(gs.low - gs.prev!.low)} and the summer ceiling ${K.usd(gs.high - gs.prev!.high)}.</p>
${h.mini('areaTrip', { area: 'Gulf Shores, AL', lodging: gsL, mie: gs.mie })}
<h2>Birmingham: cheaper rooms, bigger meal allowance</h2>
<p>Huntsville (Madison County) has the higher flat room cap, ${K.usd(hsv.high)} against ${K.usd(bhm.high)} in Birmingham (Jefferson County). Meals reverse the order: Birmingham is on the ${K.usd(bhm.mie)} M&IE tier, Huntsville and Mobile on ${K.usd(hsv.mie)}. Over three nights in November 2026 the gap nearly cancels out: ${m(hsvTrip.total)} in Huntsville, ${m(bhmTrip.total)} in Birmingham. Huntsville also lost its small seasonal swing; in FY2026 it ranged from ${K.usd(hsv.prev!.low)} to ${K.usd(hsv.prev!.high)}, now one figure covers every month. Mobile gained the most of the flat areas, from ${K.usd(mob.prev!.high)} to ${K.usd(mob.high)}.</p>
<h3>Montgomery, Tuscaloosa and Dothan stay on the floor</h3>
<p>Census counts put Montgomery (Montgomery County), Tuscaloosa, Auburn (Lee County) and Dothan (Houston County) among the larger Alabama cities, and none of their counties has a GSA area, so a meeting there is paid at ${K.usd(std.lodging)} and ${K.usd(std.mie)}. Hoover follows Birmingham because it sits in Jefferson County; Madison follows Huntsville through Madison County. When a suburb straddles a county line, the ZIP code search settles it.</p>
<h2>Fuel on Alabama roads</h2>
<p>EIA does not publish an Alabama series; the state falls in its Gulf Coast region, where regular gasoline averaged ${K.usd(gas, 3)} a gallon in the week of ${K.day(K.ENERGY_META.gasWeek)}, ${K.usd(K.ENERGY_META.usGas - gas, 3)} under the national ${K.usd(K.ENERGY_META.usGas, 3)}. The IRS business rate of ${K.centsWord(K.irs('2026-07-01'))} a mile is the same everywhere, so a Birmingham to Gulf Shores drive leaves more of each reimbursed mile for wear and insurance than the same distance in a pricier fuel region. The ${h.a('gas-cost-calculator', 'gas cost calculator')} reads the Gulf Coast price.</p>
${h.mini('fuelLeg', { label: 'Gulf Coast (Alabama)', price: gas })}
<p>On the first and last day the M&IE is cut to ${K.pct(share)}: ${K.usd(gs.mie * share, 2)} in Gulf Shores, ${K.usd(bhm.mie * share, 2)} in Birmingham.</p>
`,
  faqs: [
    { q: 'When is the Gulf Shores, Alabama per diem highest in FY2027?', a: `In ${K.listOf(gs.highMonths)}, when the Baldwin County lodging cap is ${K.usd(gs.high)} a night. It steps down to ${K.usd(spring)} in ${K.listOf(springMonths)} and to ${K.usd(gs.low)} for the rest of the year. M&IE stays at ${K.usd(gs.mie)} in every month. These are GSA FY2027 maxima, valid from October 1, 2026; hotel taxes come on top.` },
    { q: 'Why does Birmingham, Alabama get more M&IE than Huntsville?', a: `In the FY2027 GSA table Jefferson County sits on the ${K.usd(bhm.mie)} M&IE tier and Madison County on the ${K.usd(hsv.mie)} tier, a split that also held in FY2026. Huntsville keeps the higher room cap, ${K.usd(hsv.high)} against ${K.usd(bhm.high)}. On a three-night November 2026 trip the totals land within a few dollars of each other: ${m(hsvTrip.total)} and ${m(bhmTrip.total)}.` },
    { q: 'What per diem applies in Montgomery, Alabama?', a: `The standard CONUS rate, because Montgomery County has no non-standard area in the FY2027 GSA table. That means ${K.usd(std.lodging)} of lodging and ${K.usd(std.mie)} of M&IE a day from October 1, 2026, up from ${K.usd(K.std(2026).lodging)} of lodging in FY2026. On the arrival and departure days you receive ${K.usd(std.mie * share, 2)} of M&IE.` },
    { q: 'Which Alabama area had the biggest per diem increase for FY2027?', a: `Mobile County, among the flat areas: its single lodging cap went from ${K.usd(mob.prev!.high)} in FY2026 to ${K.usd(mob.high)} in FY2027, a rise of ${K.usd(mob.high - mob.prev!.high)} a night, with M&IE unchanged at ${K.usd(mob.mie)}. Birmingham rose ${K.usd(bhm.high - bhm.prev!.high)} and Huntsville ${K.usd(hsv.high - hsv.prev!.high)} over its old summer top. The new figures apply to nights from October 1, 2026, the first day of FY2027.` },
  ],
  related: ['per-diem-rates', 'home', 'state:florida', 'state:georgia', 'state:mississippi', 'gas-cost-calculator'],
});
