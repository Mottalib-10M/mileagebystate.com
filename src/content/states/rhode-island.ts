import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import { T } from '../../lib/data';

const sum = K.stateSummary('rhode-island');
const area = (name: string) => K.nsas('RI').find((x) => x.name === name)!;
const np = area('Jamestown / Middletown / Newport');
const pv = area('Providence / Bristol');
const L = T.dest[np.i].fy['2027'].lodging;
const L26 = T.dest[np.i].fy['2026'].lodging;
const shoulder = L[0];
const shoulderMonths = K.MONTHS_FY.filter((_, m) => L[m] === shoulder);
const tier = K.tier(np.mie);
const share = K.P.mie.partialDayShare;
const summer = K.trip({ destIndex: np.i, depart: '2027-07-12', ret: '2027-07-15' });
const winter = K.trip({ destIndex: np.i, depart: '2027-02-08', ret: '2027-02-11' });
const prov = K.trip({ destIndex: pv.i, depart: '2027-07-12', ret: '2027-07-15' });
const elec = K.elec('rhode-island');
const usElec = K.ENERGY_META.usElecCents;
const gas = K.gas('rhode-island');
const CAL = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const span = (ms: string[]) => { const set = new Set(ms.map((x) => CAL.indexOf(x))); const start = [...set].find((i) => !set.has((i + 11) % 12)); if (start === undefined) return 'all year'; let end = start, n = 1; while (set.has((end + 1) % 12)) { end = (end + 1) % 12; n++; } return n !== set.size ? K.listOf(ms) : n === 1 ? CAL[start] : `${CAL[start]} to ${CAL[end]}`; };
const W = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve'];
const m2 = (x: number) => K.usd(x, x % 1 ? 2 : 0);

export default defineState({
  slug: 'rhode-island',
  dest: 'Jamestown / Middletown / Newport',
  title: 'Per Diem Rates Rhode Island 2026-27: Newport and Providence',
  description: `Rhode Island per diem 2026-27: Newport caps lodging at ${K.usd(np.high)} in ${K.listOf(np.highMonths)} and ${K.usd(np.low)} off season, Providence ${K.usd(pv.high)} all year, both at ${K.usd(np.mie)} of M&IE.`,
  intro: `Rhode Island has ${sum.count} GSA areas in FY2027, and only the Newport one changes its cap with the calendar.`,
  resume: `A night in Newport County is capped at ${K.usd(np.high)} in ${K.listOf(np.highMonths)} 2027, ${K.num(np.high / np.low, 1)} times the ${K.usd(np.low)} that applies from ${span(np.lowMonths)}, while Providence and Bristol counties keep one cap of ${K.usd(pv.high)} for the whole of FY2027. Both listed areas pay ${K.usd(np.mie)} of meals and incidentals per day, against the standard ${K.usd(sum.std.mie)} in the rest of Rhode Island, where lodging stops at ${K.usd(sum.std.lodging)}. These rates run from October 1, 2026 to September 30, 2027. For a concrete case, three nights in Newport from July 12 to July 15, 2027 add up to ${m2(summer.total)} at the federal maximum: ${K.usd(summer.lodging)} for the rooms and ${m2(summer.mie)} of M&IE, with the arrival and departure days paid at ${K.pct(share)}. The same dates in February 2027 come to ${m2(winter.total)}. Lodging taxes sit on top of these figures, and receipts still decide what the room line pays.`,
  body: (h) => `
<h2>Newport's three bands of lodging</h2>
<p>GSA writes the coastal area as Jamestown, Middletown and Newport, and the county behind it is ${np.counties}. Its FY2027 calendar has ${W[new Set(L).size]} levels. ${K.listOf(np.highMonths)} carry ${K.usd(np.high)}. ${K.listOf(shoulderMonths)} sit in between at ${K.usd(shoulder)}. The other ${W[np.lowMonths.length]} months, ${K.listOf(np.lowMonths)}, drop to ${K.usd(np.low)}. Each band moved up from FY2026: the summer cap by ${K.usd(np.high - np.prev!.high)}, the in-between months by ${K.usd(shoulder - L26[0])}, the long off season by ${K.usd(np.low - np.prev!.low)}. A booking that runs from the last week of ${np.highMonths[np.highMonths.length - 1]} into ${shoulderMonths[shoulderMonths.length - 1]} crosses from one cap to the next, so the nights are priced separately.</p>
${h.mini('areaTrip', { area: 'Newport, RI', lodging: L, mie: np.mie })}
<h3>Providence and Bristol: no season at all</h3>
<p>The second area, ${pv.counties}, holds ${K.usd(pv.high)} in every month of FY2027, ${K.usd(pv.high - pv.prev!.high)} more than its flat ${K.usd(pv.prev!.high)} of FY2026. In July, a Providence stay of three nights totals ${m2(prov.total)}, or ${m2(summer.total - prov.total)} less than Newport for the same dates; in February the order flips and Providence pays more, since the Newport cap falls below it. Warwick, the one Rhode Island city of 15,000 people or more on the Census list that is not in either area, sits in Kent County and takes ${K.usd(sum.std.lodging)} and ${K.usd(sum.std.mie)}, like every other county GSA leaves out.</p>
<p>Meals are the same in both listed areas: ${K.usd(tier.breakfast)} for breakfast, ${K.usd(tier.lunch)} for lunch, ${K.usd(tier.dinner)} for dinner and ${K.usd(tier.incidentals)} of incidentals. A lunch served at a Providence meeting removes ${K.usd(tier.lunch)} from that day, as the ${h.a('meals-and-incidental-expenses', 'M&IE breakdown')} shows.</p>
<h2>Home charging at Rhode Island power prices</h2>
<p>For anyone reimbursed by the mile in an electric car, the local power price matters more than the gasoline one. Rhode Island residential electricity averaged ${K.num(elec, 2)} cents per kWh over ${K.ENERGY_META.elecPeriod} in EIA data, against ${K.num(usElec, 2)} cents for the country, so charging at home costs about ${K.pct(elec / usElec - 1)} more per mile than the national average. Gasoline is priced in EIA's ${K.stateRef('rhode-island').gasArea} series, ${K.usd(gas, 3)} a gallon in the week of ${K.day(K.ENERGY_META.gasWeek)}, close to the ${K.usd(K.ENERGY_META.usGas, 3)} U.S. figure. The IRS rate of ${K.centsWord(K.irs('2026-07-01'))} a mile is the same for both cars; the ${h.a('ev-charging-cost-calculator', 'EV charging cost calculator')} shows how much of it the power bill eats.</p>
${h.mini('evCharge', { label: 'Rhode Island', cents: elec })}
`,
  faqs: [
    { q: 'What is the Newport, Rhode Island per diem in July 2027?', a: `${K.usd(np.high)} of lodging per night and ${K.usd(np.mie)} of M&IE per day. The summer cap covers ${K.listOf(np.highMonths)} 2027 under GSA's FY2027 table. On the day you arrive and the day you leave, M&IE is ${K.usd(np.mie * share, 2)}. In ${K.listOf(shoulderMonths)} the room cap is ${K.usd(shoulder)}, and from ${span(np.lowMonths)} it is ${K.usd(np.low)}.` },
    { q: 'Does Warwick, Rhode Island have its own GSA per diem?', a: `No. Warwick is in Kent County, which GSA does not list, so a federal traveler there gets the standard CONUS rate of ${K.usd(sum.std.lodging)} for lodging and ${K.usd(sum.std.mie)} for M&IE in FY2027. Only Newport County (Jamestown, Middletown, Newport) and Providence and Bristol counties have higher Rhode Island rates. A hotel just over the line in Providence County takes ${K.usd(pv.high)}.` },
    { q: 'Why is the M&IE the same in Newport and Providence, Rhode Island?', a: `GSA puts both Rhode Island areas in the ${K.usd(np.mie)} tier for FY2027, so meals pay the same wherever you stay in those counties: ${K.usd(tier.breakfast)}, ${K.usd(tier.lunch)} and ${K.usd(tier.dinner)} plus ${K.usd(tier.incidentals)} of incidentals. What differs is lodging, which in Newport depends on the month and in Providence does not. The standard tier elsewhere in the state is ${K.usd(sum.std.mie)}.` },
    { q: 'Is charging an electric car in Rhode Island expensive for mileage claims?', a: `Yes, relative to the country. EIA puts Rhode Island residential power at ${K.num(elec, 2)} cents per kWh for ${K.ENERGY_META.elecPeriod}, against ${K.num(usElec, 2)} cents nationally. At 30 kWh per 100 miles that is ${K.usd(elec * 0.3, 2)} of electricity per 100 miles at home. The IRS business rate is still ${K.centsWord(K.irs('2026-07-01'))} a mile, so the claim does not change with the power price.` },
  ],
  related: ['per-diem-rates', 'home', 'state:massachusetts', 'state:connecticut', 'ev-charging-cost-calculator', 'meals-and-incidental-expenses'],
});
