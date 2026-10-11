import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import { destIndex, T } from '../../lib/data';
import PLACES from '../../data/places.json';

const sum = K.stateSummary('massachusetts');
const ref = K.stateRef('massachusetts');
const area = (name: string) => K.nsas('MA').find((n) => n.name === name)!;
const bos = area('Boston / Cambridge'), fal = area('Falmouth'), hya = area('Hyannis'), nan = area('Nantucket'), mv = area("Martha's Vineyard"), bur = area('Burlington / Woburn');
const falPrev = K.nsas('MA', 2026).find((n) => n.name === 'Falmouth')!;
const falRow = T.dest[destIndex('MA', 'Falmouth')].fy['2027'];
const bosRow = T.dest[destIndex('MA', 'Boston / Cambridge')].fy['2027'];
const frozen = sum.list.filter((n) => n.prev && n.prev.high === n.high && n.prev.low === n.low).map((n) => n.name);
const lower = sum.list.filter((n) => n.prev && (n.high < n.prev.high || n.low < n.prev.low)).map((n) => n.name);
type Place = [string, string, string, number, number, number];
const rows = (PLACES as { rows: Place[] }).rows.filter((r) => r[1] === 'MA');
const midTowns = rows.filter((r) => r[2] === 'Middlesex County' && r[0] !== 'Cambridge').slice(0, 3).map((r) => r[0]);
const stdRows = rows.filter((r) => r[3] === -1);
const share = K.P.mie.partialDayShare;
const oct = K.trip({ destIndex: destIndex('MA', 'Boston / Cambridge'), depart: '2026-10-19', ret: '2026-10-22' });
const jan = K.trip({ destIndex: destIndex('MA', 'Boston / Cambridge'), depart: '2027-01-18', ret: '2027-01-21' });
const elec = K.elec('massachusetts'), gas = K.gas('massachusetts');

export default defineState({
  slug: 'massachusetts',
  dest: 'Boston / Cambridge',
  title: 'Per Diem Rates Massachusetts 2026-27: Boston to the Islands',
  description: `Massachusetts per diem rates 2026-27: ${sum.count} GSA areas cover almost the whole state; Boston peaks at ${K.usd(bos.high)} in fall, Nantucket at ${K.usd(nan.high)} in summer, M&IE up to ${K.usd(sum.mieTiers[sum.mieTiers.length - 1])}.`,
  intro: `Massachusetts has ${sum.count} GSA areas in FY2027, and two of them are drawn along city limits rather than county lines.`,
  resume: `Massachusetts per diem in FY2027 reaches ${K.usd(nan.high)} a night on Nantucket in ${K.listOf(nan.highMonths)} and ${K.usd(bos.high)} in Boston and Cambridge in ${K.listOf(bos.highMonths)}, both with ${K.usd(bos.mie)} of M&IE. In all, ${sum.count} areas have a rate above the standard ${K.usd(sum.std.lodging)} and ${K.usd(sum.std.mie)}, and they cover so much of the state that only ${stdRows.length} of ${rows.length} Census places of 15,000 people or more ${stdRows.length === 1 ? 'falls' : 'fall'} outside them. The figures run from October 1, 2026 to September 30, 2027. Boston peaks in autumn, not summer: three nights from October 19 to 22, 2026 are worth ${K.usd(oct.total, 2)} at the federal cap, while the same stay from January 18 to 21, 2027 comes to ${K.usd(jan.total, 2)}. Falmouth's FY2027 rate is lower than last year's. The calculator above opens on Boston; type a Massachusetts town or ZIP code to switch.`,
  body: (h) => `
<h2>Falmouth stands apart from the rest of Barnstable</h2>
<p>Barnstable County is split in two by GSA. The Hyannis area is Barnstable County "less the city of Falmouth", and Falmouth has its own line defined by its city limits. The two do not move together. Hyannis rose from ${K.usd(hya.prev!.high)} to ${K.usd(hya.high)} at its summer peak, which covers ${K.listOf(hya.highMonths)}. Falmouth went the other way: its peak fell from ${K.usd(falPrev.high)} to ${K.usd(fal.high)} and its off-season figure from ${K.usd(falPrev.low)} to ${K.usd(fal.low)}, but the peak now starts earlier, in ${K.listOf(fal.highMonths)} instead of ${K.listOf(falPrev.highMonths)}. A June week in Falmouth is therefore paid more than a year ago, a July week a little less. Falmouth's M&IE is ${K.usd(fal.mie)}; the rest of Barnstable County is on ${K.usd(hya.mie)}.</p>
${h.mini('areaTrip', { area: 'Falmouth, MA', lodging: falRow.lodging, mie: falRow.mie })}
<h2>Cambridge counts as Boston, the rest of Middlesex does not</h2>
<p>The second city-limit rule runs through Middlesex County. Boston / Cambridge is Suffolk County plus the city of Cambridge, and the Burlington / Woburn area is Middlesex "less the city of Cambridge". A meeting in Cambridge is paid ${K.usd(bos.low)} to ${K.usd(bos.high)} with ${K.usd(bos.mie)} of M&IE; one in another Middlesex town ${K.usd(bur.low)} to ${K.usd(bur.high)} with ${K.usd(bur.mie)}. Boston's dearest months are ${K.listOf(bos.highMonths)}, its cheapest ${K.listOf(bos.lowMonths)}, and March to August sit in between at ${K.usd(bosRow.lodging[5])}. The ZIP search in the calculator handles the Cambridge exception; a county-level lookup would not.</p>
<h3>The islands, and the lines that stood still</h3>
<p>Nantucket pays ${K.usd(nan.high)} and Martha's Vineyard ${K.usd(mv.high)} in ${K.listOf(nan.highMonths)}, with off-season floors of ${K.usd(nan.low)} and ${K.usd(mv.low)}. ${frozen.length ? `${K.listOf(frozen)} kept exactly the FY2026 figures. ` : ''}${lower.length ? `Lines with at least one lower figure this year: ${K.listOf(lower)}. ` : ''}Only ${K.listOf(stdRows.map((r) => `${r[0]} (${r[2]})`))} among the larger Census places takes the standard ${K.usd(sum.std.lodging)}. Gasoline is not the problem for drivers: ${K.usd(gas, 3)} a gallon in the EIA Massachusetts series for ${K.day(K.ENERGY_META.gasWeek)}, ${gas < K.ENERGY_META.usGas ? 'a shade under' : 'about'} the U.S. ${K.usd(K.ENERGY_META.usGas, 3)}. Electricity is: homes paid ${K.cents(elec)} per kWh over ${K.ENERGY_META.elecPeriod}, against ${K.cents(K.ENERGY_META.usElecCents)} for the country.</p>
${h.mini('evCharge', { label: 'Massachusetts', cents: elec })}
<p>The ${h.a('gas-vs-electric-car-calculator', 'gas vs electric car calculator')} uses both Massachusetts prices.</p>
`,
  faqs: [
    { q: 'Is Cambridge, Massachusetts per diem the same as Boston?', a: `Yes. GSA puts the city of Cambridge in the Boston / Cambridge area with Suffolk County, at ${K.usd(bos.low)} to ${K.usd(bos.high)} a night and ${K.usd(bos.mie)} of M&IE in FY2027. The rest of Middlesex County, ${K.listOf(midTowns)} included, is in the Burlington / Woburn area at ${K.usd(bur.low)} to ${K.usd(bur.high)}, with ${K.usd(bur.mie)} of M&IE.` },
    { q: 'Why is the Falmouth, Massachusetts per diem lower in FY2027?', a: `GSA cut both Falmouth figures: the summer maximum from ${K.usd(falPrev.high)} to ${K.usd(fal.high)} and the rest of the year from ${K.usd(falPrev.low)} to ${K.usd(fal.low)}. The file lists the new figures without a note on each line, and the claim follows the new figure. The summer rate now also covers ${K.listOf(fal.highMonths.filter((m) => !falPrev.highMonths.includes(m)))}, so June trips gain while July and August trips lose a little.` },
    { q: 'What is the Nantucket, Massachusetts per diem in summer 2027?', a: `${K.usd(nan.high)} a night from ${nan.highMonths[0]} through ${nan.highMonths[nan.highMonths.length - 1]} 2027, plus ${K.usd(nan.mie)} of M&IE a day, for a full-day total of ${K.usd(nan.high + nan.mie)}. From ${nan.lowMonths[0]} to ${nan.lowMonths[nan.lowMonths.length - 1]} the lodging maximum is ${K.usd(nan.low)}. On the day you fly or sail in and the day you leave, the M&IE is ${K.usd(nan.mie * share, 2)}.` },
    { q: 'Which Massachusetts cities still use the standard per diem rate?', a: `Very few. Among the ${rows.length} Census places of 15,000 people or more, only ${K.listOf(stdRows.map((r) => r[0]))} sits outside every GSA area, so it takes ${K.usd(sum.std.lodging)} of lodging and ${K.usd(sum.std.mie)} of M&IE. Smaller towns in counties GSA does not list are in the same position, and the travel days pay ${K.usd(sum.std.mie * share, 2)} of M&IE.` },
  ],
  related: ['per-diem-rates', 'home', 'gas-vs-electric-car-calculator', 'state:rhode-island', 'state:new-hampshire', 'state:connecticut'],
});
