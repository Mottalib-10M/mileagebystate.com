import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import { T } from '../../lib/data';

const sum = K.stateSummary('utah');
const std = sum.std;
const area = (name: string) => K.nsas('UT').find((x) => x.name === name)!;
const pc = area('Park City'), moab = area('Moab'), slc = area('Salt Lake City'), provo = area('Provo');
const L = (n: { i: number }) => T.dest[n.i].fy['2027'].lodging;
const oneTierEach = sum.mieTiers.length === sum.count;
const moabSpring = L(moab)[6];
const moabSpringMonths = K.MONTHS_FY.filter((_, m) => L(moab)[m] === moabSpring);
const moabSummer = L(moab)[9];
const moabSummerMonths = K.MONTHS_FY.filter((_, m) => L(moab)[m] === moabSummer);
const jan = K.trip({ destIndex: pc.i, depart: '2027-01-18', ret: '2027-01-21' });
const may = K.trip({ destIndex: pc.i, depart: '2027-05-17', ret: '2027-05-20' });
const pcJul = K.trip({ destIndex: pc.i, depart: '2027-07-12', ret: '2027-07-15' });
const slcJul = K.trip({ destIndex: slc.i, depart: '2027-07-12', ret: '2027-07-15' });
const tiers = sum.list.map((x) => `${x.name} ${K.usd(x.mie)}`);
const share = K.P.mie.partialDayShare;
const CAL = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const span = (ms: string[]) => { const set = new Set(ms.map((x) => CAL.indexOf(x))); const start = [...set].find((i) => !set.has((i + 11) % 12)); if (start === undefined) return 'all year'; let end = start, n = 1; while (set.has((end + 1) % 12)) { end = (end + 1) % 12; n++; } return n !== set.size ? K.listOf(ms) : n === 1 ? CAL[start] : `${CAL[start]} to ${CAL[end]}`; };
const W = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve'];
const m2 = (x: number) => K.usd(x, x % 1 ? 2 : 0);

export default defineState({
  slug: 'utah',
  dest: 'Park City',
  title: 'Per Diem Rates Utah 2026-27: Park City Winter Cap, Moab, SLC',
  description: `Utah per diem 2026-27: Park City ${K.usd(pc.high)} a night in ${K.listOf(pc.highMonths)} and ${K.usd(pc.low)} after, Moab up to ${K.usd(moab.high)}, Salt Lake City ${K.usd(slc.high)}, Provo ${K.usd(provo.high)}.`,
  intro: `Utah's ${sum.count} GSA areas for FY2027 ${oneTierEach ? 'each sit in a different M&IE tier' : 'spread over several M&IE tiers'}, and Park City more than doubles its lodging cap in winter.`,
  resume: `Summit County, the Park City area, pays the highest Utah per diem of FY2027: ${K.usd(pc.high)} a night in ${K.listOf(pc.highMonths)} and ${K.usd(pc.low)} in the other ${W[pc.lowMonths.length]} months, with ${K.usd(pc.mie)} of M&IE. Moab, in Grand County, follows a calendar of its own, with its top ${K.usd(moab.high)} in ${K.listOf(moab.highMonths)} and a floor of ${K.usd(moab.low)} from ${span(moab.lowMonths)}. Salt Lake and Tooele counties hold ${K.usd(slc.high)} all year and Utah County (Provo) ${K.usd(provo.high)}; St. George, Ogden and Logan are on the standard ${K.usd(std.lodging)} and ${K.usd(std.mie)}. On the FY2027 table, three nights in Park City from January 18 to January 21, 2027 come to ${m2(jan.total)} at the federal maximum, against ${m2(may.total)} for the same length of stay in May 2027. In each case the first and last day pay ${K.pct(share)} of the M&IE, and lodging taxes are reimbursed on top.`,
  body: (h) => `
<h2>Park City: ${W[pc.highMonths.length]} months at ${K.usd(pc.high)}</h2>
<p>The Summit County cap jumps from ${K.usd(pc.low)} to ${K.usd(pc.high)} on ${pc.highMonths[0]} 1 and stays there through ${pc.highMonths[pc.highMonths.length - 1]}, then falls back. That is a ratio of ${K.num(pc.high / pc.low, 1)} between the two levels, the steepest step in the state. Both levels moved up from FY2026, by ${K.usd(pc.high - pc.prev!.high)} in winter and ${K.usd(pc.low - pc.prev!.low)} for the rest of the year. A stay that starts in the last days of ${K.MONTHS_FY[K.MONTHS_FY.indexOf(pc.highMonths[0]) - 1]} and ends in ${pc.highMonths[0]} is priced at ${K.usd(pc.low)} for the first nights and ${K.usd(pc.high)} for the later ones; the calculator handles the split night by night.</p>
${h.mini('areaTrip', { area: 'Park City, UT', lodging: L(pc), mie: pc.mie })}
<h3>Moab's year has ${W[new Set(L(moab)).size]} levels</h3>
<p>Grand County does not follow the simple summer-winter pattern. ${K.listOf(moab.highMonths)} pay the most, ${K.usd(moab.high)}. ${K.listOf(moabSpringMonths)} pay ${K.usd(moabSpring)}. ${K.listOf(moabSummerMonths)} drop to ${K.usd(moabSummer)}, and ${K.listOf(moab.lowMonths)} to ${K.usd(moab.low)}, which equals the standard lodging rate. So a July field visit to Moab allows ${K.usd(moab.high - moabSummer)} a night less than one in late September. The M&IE does not move: ${K.usd(moab.mie)} every day.</p>
<h2>One meals tier per area</h2>
<p>${oneTierEach ? `Each Utah area lands in its own M&IE tier: ${K.listOf(tiers)}.` : `Utah areas use these M&IE rates: ${K.listOf(tiers)}.`} The standard ${K.usd(std.mie)} applies everywhere else. On a day with a provided lunch the deduction depends on that tier, ${K.usd(K.tier(pc.mie).lunch)} in Park City but ${K.usd(K.tier(provo.mie).lunch)} in Provo, which is why the ${h.a('meals-and-incidental-expenses', 'M&IE breakdown')} matters for conference travel in the state. Provo gained the most of the flat-rate areas, ${K.usd(provo.high - provo.prev!.high)} to ${K.usd(provo.high)}; Salt Lake City added ${K.usd(slc.high - slc.prev!.high)}.</p>
<p>Outside the winter band the gap with Salt Lake City narrows. In July 2027 three nights in Park City total ${m2(pcJul.total)} and three in Salt Lake City ${m2(slcJul.total)}, a difference of ${m2(pcJul.total - slcJul.total)} that comes from ${K.usd(pc.low - slc.high)} a night of lodging and ${K.usd(pc.mie - slc.mie)} a day of M&IE.</p>
<p>Weber and Davis counties (Ogden, Layton, Bountiful), Washington County (St. George) and Cache County (Logan) are not listed, so the Census city file behind the search sends them to the standard rate. A trip to Ogden is therefore ${K.usd(slc.high - std.lodging)} a night below a Salt Lake City one. For driving, EIA's ${K.stateRef('utah').gasArea} series priced regular at ${K.usd(K.gas('utah'), 3)} a gallon in the week of ${K.day(K.ENERGY_META.gasWeek)}.</p>
`,
  faqs: [
    { q: 'What is the Park City, Utah per diem in January 2027?', a: `${K.usd(pc.high)} of lodging per night and ${K.usd(pc.mie)} of M&IE per day. The winter cap runs from ${K.listOf(pc.highMonths)} in GSA's FY2027 table for Summit County. From ${span(pc.lowMonths)} the room cap is ${K.usd(pc.low)}. On the day you arrive and the day you leave, the M&IE is ${K.usd(pc.mie * share, 2)}.` },
    { q: 'When is the Moab, Utah per diem highest in FY2027?', a: `In ${K.listOf(moab.highMonths)}, at ${K.usd(moab.high)} a night. ${K.listOf(moabSpringMonths)} pay ${K.usd(moabSpring)}, ${K.listOf(moabSummerMonths)} ${K.usd(moabSummer)}, and ${span(moab.lowMonths)} ${K.usd(moab.low)}. M&IE in Grand County is ${K.usd(moab.mie)} a day all year. The fiscal year runs from October 1, 2026 to September 30, 2027.` },
    { q: 'Do Ogden and St. George, Utah have their own per diem rates?', a: `No. Weber County (Ogden) and Washington County (St. George) are not GSA non-standard areas in FY2027, so both take the standard ${K.usd(std.lodging)} for lodging and ${K.usd(std.mie)} for M&IE. In Utah only Summit, Grand, Salt Lake, Tooele and Utah counties have higher rates, so a hotel in Layton or Cedar City is capped the same way.` },
  ],
  related: ['per-diem-rates', 'home', 'state:colorado', 'state:idaho', 'state:nevada', 'per-diem-calculator'],
});
