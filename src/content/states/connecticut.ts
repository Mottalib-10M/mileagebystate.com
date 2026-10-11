import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import { T } from '../../lib/data';

const sum = K.stateSummary('connecticut');
const list = K.nsas('CT');
const area = (name: string) => list.find((n) => n.name === name)!;
const fair = area('Bridgeport / Danbury'), nl = area('New London / Groton'), hfd = area('Hartford'), nh = area('New Haven');
const rise = (n: typeof fair) => n.high - n.prev!.high;
const prevOrder = [...list].sort((a, b) => b.prev!.high - a.prev!.high);
const std = sum.std;
const m = (x: number) => K.usd(x, x % 1 ? 2 : 0);
const share = K.P.mie.partialDayShare;
const gas = K.gas('connecticut');
const elec = K.elec('connecticut');
const nlTrip = K.trip({ destIndex: nl.i, depart: '2026-12-07', ret: '2026-12-10' });
const nlOld = 3 * nl.prev!.high + nl.prev!.mie * share * 2 + nl.prev!.mie * 2;
const nhTrip = K.trip({ destIndex: nh.i, depart: '2026-12-07', ret: '2026-12-10' });

export default defineState({
  slug: 'connecticut',
  dest: 'New London / Groton',
  title: 'Per Diem Rates Connecticut 2026-27: Four Flat County Rates',
  description: `Connecticut per diem 2026-27 (FY2027): ${sum.count} GSA areas with no seasons, Fairfield County ${K.usd(fair.high)}, New London up ${K.usd(rise(nl))} to ${K.usd(nl.high)}, M&IE ${K.usd(sum.mieTiers[0])} or ${K.usd(sum.mieTiers[1])}, ${K.usd(std.lodging)} elsewhere.`,
  intro: `None of Connecticut's ${sum.count} GSA areas changes with the month in FY2027, and New London / Groton made the largest jump of the four.`,
  resume: `Connecticut per diem in FY2027 is a short list of fixed numbers: Fairfield County (Bridgeport / Danbury) allows ${K.usd(fair.high)} of lodging a night, New London County (New London / Groton) ${K.usd(nl.high)}, Hartford County ${K.usd(hfd.high)} and New Haven County ${K.usd(nh.high)}, each the same in all twelve months. Fairfield and New London carry ${K.usd(fair.mie)} of M&IE, Hartford and New Haven ${K.usd(hfd.mie)}. The rates run from October 1, 2026 to September 30, 2027; Litchfield, Middlesex and the other unlisted counties take the standard ${K.usd(std.lodging)} and ${K.usd(std.mie)}. New London / Groton rose ${K.usd(rise(nl))} a night, far more than any other Connecticut area. Three nights there from December 7, 2026 total ${m(nlTrip.total)} at the federal maximum, against ${m(nlOld)} at last year's rate. The same three nights in New Haven come to ${m(nhTrip.total)}. Switch the calculator to any Connecticut town or ZIP code.`,
  body: (h) => `
<h2>New London County leapfrogs Hartford and New Haven</h2>
<p>Last year the Connecticut order, from the highest room cap down, was ${K.listOf(prevOrder.map((n) => `${n.name} (${K.usd(n.prev!.high)})`))}. New London / Groton was the cheapest of the four. For FY2027 it climbs ${K.usd(rise(nl))} to ${K.usd(nl.high)} and becomes second, behind Fairfield County and ahead of Hartford by ${K.usd(nl.high - hfd.high)}. Bridgeport / Danbury, Hartford and New Haven moved by ${K.listOf([fair, hfd, nh].map((n) => K.usd(rise(n))))} respectively. Its meals allowance was already on the ${K.usd(nl.mie)} tier, the higher of the two used in the state, so the change is entirely in lodging.</p>
${h.mini('areaTrip', { area: 'New London / Groton, CT', lodging: T.dest[nl.i].fy['2027'].lodging, mie: nl.mie })}
<h2>No peak month to plan around</h2>
<p>Every Connecticut area has a single lodging figure for the whole fiscal year, which spares travelers the month-by-month reading that coastal areas in other states require. The only date that matters is October 1: nights before it use FY2026, nights from it use FY2027. A trip from September 29 to October 2, 2026 in Fairfield County is paid ${K.usd(fair.prev!.high)} for the first two nights and ${K.usd(fair.high)} for the third, and the calculator above applies that split automatically.</p>
<h3>Where the standard rate still applies</h3>
<p>Census places outside the four counties include Middletown (Middlesex County) and Torrington (Litchfield County). A meeting there is reimbursed at ${K.usd(std.lodging)} of lodging, ${K.usd(fair.high - std.lodging)} under the Fairfield figure, and ${K.usd(std.mie)} of M&IE. Stamford, Norwalk and Danbury all sit in Fairfield County; Waterbury follows New Haven; New Britain and Bristol follow Hartford. For a three-night December 2026 trip the federal maximum is ${m(nhTrip.total)} in New Haven and ${m(K.trip({ destIndex: -1, depart: '2026-12-07', ret: '2026-12-10' }).total)} in Middletown, so the county line is worth checking before the hotel is booked.</p>
<h2>Fuel and power cost more in New England</h2>
<p>EIA prices Connecticut gasoline within its ${K.stateRef('connecticut').gasArea} series: ${K.usd(gas, 3)} a gallon for regular in the week of ${K.day(K.ENERGY_META.gasWeek)}, close to the national ${K.usd(K.ENERGY_META.usGas, 3)}. Electricity is another matter. Connecticut households paid ${K.num(elec, 2)} cents per kWh over ${K.ENERGY_META.elecPeriod}, against ${K.num(K.ENERGY_META.usElecCents, 2)} cents nationally, so charging an electric car at home costs about ${K.pct(elec / K.ENERGY_META.usElecCents - 1)} more per mile than the U.S. average. The IRS rate of ${K.centsWord(K.irs('2026-07-01'))} does not adjust for either; the ${h.a('gas-vs-electric-car-calculator', 'gas versus electric comparison')} uses the state prices.</p>
`,
  faqs: [
    { q: 'What is the FY2027 per diem for Stamford, Connecticut?', a: `Stamford is in Fairfield County, which GSA lists as Bridgeport / Danbury: ${K.usd(fair.high)} of lodging a night in every month and ${K.usd(fair.mie)} of M&IE from October 1, 2026 to September 30, 2027. That is ${K.usd(rise(fair))} more lodging than in FY2026. On the travel days the M&IE is ${K.usd(fair.mie * share, 2)}.` },
    { q: 'Why did the New London, Connecticut per diem rise so much?', a: `GSA raised the New London County lodging cap from ${K.usd(nl.prev!.high)} in FY2026 to ${K.usd(nl.high)} in FY2027, a ${K.usd(rise(nl))} increase, while M&IE stayed at ${K.usd(nl.mie)}. The new figure applies to every night from October 1, 2026. The jump moved New London County from last to second place among the four Connecticut areas, ahead of Hartford.` },
    { q: 'Do Connecticut per diem rates change by season?', a: `Not in FY2027. All ${sum.count} Connecticut areas have one lodging cap for all twelve months: ${K.listOf(list.map((n) => `${K.usd(n.high)} in ${n.name}`))}. The rest of the state takes the standard ${K.usd(std.lodging)}. Only the change of fiscal year on October 1 can put two different caps in the same trip.` },
  ],
  related: ['per-diem-rates', 'home', 'state:new-york', 'state:massachusetts', 'state:rhode-island', 'gas-vs-electric-car-calculator'],
});
