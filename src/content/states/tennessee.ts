import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import { T } from '../../lib/data';

const sum = K.stateSummary('tennessee');
const std = sum.std;
const area = (name: string) => K.nsas('TN').find((x) => x.name === name)!;
const nash = area('Nashville'), wil = area('Brentwood / Franklin'), mem = area('Memphis'), knx = area('Knoxville'), cha = area('Chattanooga');
const L26 = T.dest[nash.i].fy['2026'].lodging;
const nashPeak26 = K.MONTHS_FY.filter((_, m) => L26[m] === nash.prev!.high);
const flatAll = sum.seasonalCount === 0;
const ex = K.trip({ destIndex: nash.i, depart: '2027-03-08', ret: '2027-03-11' });
const wilEx = K.trip({ destIndex: wil.i, depart: '2027-03-08', ret: '2027-03-11' });
const memEx = K.trip({ destIndex: mem.i, depart: '2027-03-08', ret: '2027-03-11' });
const conf = K.trip({ destIndex: nash.i, depart: '2027-03-08', ret: '2027-03-11', meals: { breakfast: 0, lunch: 2, dinner: 0 } });
const tN = K.tier(nash.mie);
const tW = K.tier(wil.mie), tM = K.tier(mem.mie);
const gas = K.gas('tennessee');
const share = K.P.mie.partialDayShare;
const CAL = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const span = (ms: string[]) => { const set = new Set(ms.map((x) => CAL.indexOf(x))); const start = [...set].find((i) => !set.has((i + 11) % 12)); if (start === undefined) return 'all year'; let end = start, n = 1; while (set.has((end + 1) % 12)) { end = (end + 1) % 12; n++; } return n !== set.size ? K.listOf(ms) : n === 1 ? CAL[start] : `${CAL[start]} to ${CAL[end]}`; };
const W = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve'];
const m2 = (x: number) => K.usd(x, x % 1 ? 2 : 0);

export default defineState({
  slug: 'tennessee',
  dest: 'Nashville',
  title: 'Per Diem Rates Tennessee 2026-27: Nashville at One Flat Rate',
  description: `Tennessee per diem 2026-27: Nashville ${K.usd(nash.high)} every month with ${K.usd(nash.mie)} M&IE, Memphis and Franklin ${K.usd(mem.high)}, Knoxville ${K.usd(knx.high)}; no seasonal rate in any of the ${sum.count} areas.`,
  intro: `None of Tennessee's ${sum.count} GSA areas changes its lodging cap by month in FY2027, after Nashville dropped its fall peak.`,
  resume: `Davidson County is the dearest Tennessee destination for federal travel in FY2027, at ${K.usd(nash.high)} of lodging every night of the year and ${K.usd(nash.mie)} of M&IE, and ${flatAll ? 'no Tennessee area has a seasonal cap any more' : 'most Tennessee areas keep one cap all year'}. In FY2026 Nashville paid ${K.usd(nash.prev!.high)} in ${K.listOf(nashPeak26)} and ${K.usd(nash.prev!.low)} otherwise; GSA replaced both with the single ${K.usd(nash.high)}. Williamson County (Brentwood, Franklin) and Shelby County (Memphis) share a ${K.usd(mem.high)} room cap but not the meals rate: ${K.usd(wil.mie)} against ${K.usd(mem.mie)}. Knoxville sits at ${K.usd(knx.high)} and Chattanooga at ${K.usd(cha.high)}, and every other county takes ${K.usd(std.lodging)} and ${K.usd(std.mie)}. Priced on the FY2027 table, three nights in Nashville from March 8 to March 11, 2027 total ${m2(ex.total)} at the federal maximum, or ${m2(ex.total - memEx.total)} more than the same visit to Memphis. The arrival and departure days count at ${K.pct(share)} of M&IE.`,
  body: (h) => `
<h2>Nashville lost its ${K.listOf(nashPeak26)} premium</h2>
<p>Last year a Nashville trip in ${K.listOf(nashPeak26)} carried a cap of ${K.usd(nash.prev!.high)}, ${K.usd(nash.prev!.high - nash.prev!.low)} above the rest of the calendar. FY2027 flattens Davidson County to ${K.usd(nash.high)} from October 2026 through September 2027. The change cuts both ways: a fall booking now allows ${K.usd(nash.prev!.high - nash.high)} a night less than in FY2026, while a winter or spring one allows ${K.usd(nash.high - nash.prev!.low)} more. A travel office that copied last year's October figure into its estimates is now over the cap.</p>
${h.mini('areaTrip', { area: 'Nashville, TN', lodging: T.dest[nash.i].fy['2027'].lodging, mie: nash.mie })}
<h3>Franklin and Memphis: same room, different dinner</h3>
<p>The two areas print the same lodging figure, ${K.usd(wil.high)}, but sit in different M&IE tiers. Williamson County is in the ${K.usd(wil.mie)} tier, with ${K.usd(tW.dinner)} for dinner and ${K.usd(tW.lunch)} for lunch; Shelby County is in the ${K.usd(mem.mie)} tier, with ${K.usd(tM.dinner)} and ${K.usd(tM.lunch)}. Over the March example above, that gap alone makes the Franklin stay ${m2(wilEx.total - memEx.total)} dearer than the Memphis one. When a conference provides a meal, the deduction follows the tier of the county where you sleep, as the ${h.a('meals-and-incidental-expenses', 'meal deduction table')} explains.</p>
<h2>Murfreesboro, Clarksville and the standard rate</h2>
<p>GSA lists Davidson and Williamson counties, and stops there. Murfreesboro and Smyrna (Rutherford County), Hendersonville and Gallatin (Sumner County) and Clarksville (Montgomery County) all appear in the Census city file in counties without a GSA line, so a meeting there is paid at ${K.usd(std.lodging)} for the room and ${K.usd(std.mie)} for meals, ${K.usd(nash.high - std.lodging)} a night below Davidson County. The same goes for Johnson City, Kingsport and Jackson. If you sleep in Nashville for a meeting in Murfreesboro, the Davidson County rate applies, because lodging follows the place where you stay.</p>
<p>Conference meals change the Nashville figure more than the room cap does. If the March event above serves lunch on the two middle days, ${K.usd(tN.lunch)} comes off each of them and the trip falls from ${m2(ex.total)} to ${m2(conf.total)}. A lunch served on the first or last day is deducted from the reduced ${K.pct(share)} allowance instead, at the full ${K.usd(tN.lunch)}.</p>
<p>Knoxville rose ${K.usd(knx.high - knx.prev!.high)} to ${K.usd(knx.high)} a night; Chattanooga gained ${K.usd(cha.high - cha.prev!.high)}. For the drive, EIA prices Tennessee in its ${K.stateRef('tennessee').gasArea} series at ${K.usd(gas, 3)} a gallon (week of ${K.day(K.ENERGY_META.gasWeek)}), and the ${h.a('gas-cost-calculator', 'gas cost calculator')} turns that into a cost per trip.</p>
`,
  faqs: [
    { q: 'What is the Nashville, Tennessee per diem rate for FY2027?', a: `${K.usd(nash.high)} of lodging per night in every month and ${K.usd(nash.mie)} of M&IE per day, for Davidson County, from October 1, 2026 to September 30, 2027. The FY2026 rate had a ${K.usd(nash.prev!.high)} cap in ${K.listOf(nashPeak26)}, now gone. On the first and last day of travel, M&IE is ${K.usd(nash.mie * share, 2)}.` },
    { q: 'Is Murfreesboro, Tennessee covered by the Nashville per diem?', a: `No. Murfreesboro is in Rutherford County, which GSA does not list, so the FY2027 rate there is the standard ${K.usd(std.lodging)} for lodging and ${K.usd(std.mie)} for M&IE. The Nashville area covers Davidson County only, and the neighboring Brentwood and Franklin area covers Williamson County. Where you sleep sets the lodging cap, not where the meeting is.` },
    { q: 'Why does Franklin, Tennessee have a higher M&IE than Memphis?', a: `GSA puts Williamson County in the ${K.usd(wil.mie)} M&IE tier and Shelby County in the ${K.usd(mem.mie)} tier for FY2027, although both have a ${K.usd(mem.high)} lodging cap. The difference is ${K.usd(wil.mie - mem.mie)} per full day, or ${K.usd((wil.mie - mem.mie) * share, 2)} on a travel day. Most of it is in the dinner allowance: ${K.usd(tW.dinner)} against ${K.usd(tM.dinner)}.` },
  ],
  related: ['per-diem-rates', 'home', 'state:kentucky', 'state:georgia', 'state:alabama', 'gas-cost-calculator'],
});
