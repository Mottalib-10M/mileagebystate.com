import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import { T } from '../../lib/data';

const sum = K.stateSummary('south-dakota');
const std = sum.std;
const area = (name: string) => K.nsas('SD').find((x) => x.name === name)!;
const rc = area('Rapid City'), dw = area('Deadwood / Spearfish'), hs = area('Hot Springs');
const L = (n: { i: number }, fy = '2027') => T.dest[n.i].fy[fy].lodging;
const atStd = sum.list.filter((x) => x.low === std.lodging).length;
const dw26High = K.MONTHS_FY.filter((_, m) => L(dw, '2026')[m] === dw.prev!.high);
const july = K.trip({ destIndex: rc.i, depart: '2027-07-19', ret: '2027-07-22' });
const fallsJuly = K.trip({ destIndex: -1, depart: '2027-07-19', ret: '2027-07-22' });
const nov = K.trip({ destIndex: rc.i, depart: '2026-11-09', ret: '2026-11-12' });
const gas = K.gas('south-dakota');
const share = K.P.mie.partialDayShare;
const CAL = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const span = (ms: string[]) => { const set = new Set(ms.map((x) => CAL.indexOf(x))); const start = [...set].find((i) => !set.has((i + 11) % 12)); if (start === undefined) return 'all year'; let end = start, n = 1; while (set.has((end + 1) % 12)) { end = (end + 1) % 12; n++; } return n !== set.size ? K.listOf(ms) : n === 1 ? CAL[start] : `${CAL[start]} to ${CAL[end]}`; };
const W = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve'];
const m2 = (x: number) => K.usd(x, x % 1 ? 2 : 0);

export default defineState({
  slug: 'south-dakota',
  dest: 'Rapid City',
  title: 'Per Diem Rates South Dakota 2026-27: Summer-Only Areas',
  description: `South Dakota per diem 2026-27: Rapid City ${K.usd(rc.high)} a night in ${K.listOf(rc.highMonths)}, Deadwood ${K.usd(dw.high)}, Hot Springs ${K.usd(hs.high)}, and ${K.usd(std.lodging)} elsewhere, Sioux Falls included.`,
  intro: `All ${sum.count} South Dakota GSA areas for FY2027 lift their lodging cap only in summer and fall back to the standard figure the rest of the year.`,
  resume: `South Dakota's federal per diem is the standard ${K.usd(std.lodging)} of lodging and ${K.usd(std.mie)} of M&IE almost everywhere, Sioux Falls included, and only three groups of counties pay more, and only in the warm months. Rapid City (${rc.counties} County) reaches ${K.usd(rc.high)} in ${K.listOf(rc.highMonths)} 2027, Deadwood and Spearfish (${dw.counties} County) ${K.usd(dw.high)} from ${span(dw.highMonths)}, and Hot Springs (${hs.counties}) ${K.usd(hs.high)}. Outside those months all ${atStd} areas cap lodging at ${K.usd(std.lodging)}, so the only extra is a higher M&IE. Using GSA's FY2027 table, three nights in Rapid City from July 19 to July 22, 2027 total ${m2(july.total)}; the same nights in Sioux Falls total ${m2(fallsJuly.total)}, and a November 2026 visit to Rapid City ${m2(nov.total)}. Travel days pay ${K.pct(share)} of the daily meals rate.`,
  body: (h) => `
<h2>Most of the year at the standard cap</h2>
<p>Look at the low months of the three areas and they all print ${K.usd(std.lodging)}, the CONUS standard for FY2027. Rapid City stays there in ${K.listOf(rc.lowMonths)}; Deadwood and Hot Springs in ${K.listOf(dw.lowMonths)}. During those months a federal traveler in Pennington or Lawrence County gets the same room allowance as one in Aberdeen or Brookings. What still differs is the meals rate: ${K.usd(rc.mie)} in Rapid City and Hot Springs and ${K.usd(dw.mie)} in Deadwood and Spearfish, against ${K.usd(std.mie)} elsewhere. Over a four-night winter stay in Lawrence County that gap is worth ${K.usd((dw.mie - std.mie) * (3 + 2 * share), 2)}.</p>
${h.mini('areaTrip', { area: 'Rapid City, SD', lodging: L(rc), mie: rc.mie })}
<h3>Deadwood and Spearfish: a shorter season, a higher cap</h3>
<p>In FY2026 ${dw.counties} County paid ${K.usd(dw.prev!.high)} across ${K.listOf(dw26High)}, a long season with a modest cap. FY2027 shortens it to ${K.listOf(dw.highMonths)} and raises the cap to ${K.usd(dw.high)}, so ${K.listOf(dw26High.filter((x) => !dw.highMonths.includes(x)))} now fall back to ${K.usd(dw.low)}. A trip to Spearfish in late ${dw26High.find((x) => !dw.highMonths.includes(x) && x !== 'October') ?? 'spring'} 2027 is thus cheaper on paper than it was a year earlier, while a July one is ${K.usd(dw.high - dw.prev!.high)} a night richer. Rapid City's summer cap rose ${K.usd(rc.high - rc.prev!.high)}, and its September went back to the low figure. Hot Springs ${hs.high === hs.prev!.high ? `kept its ${K.usd(hs.high)} summer cap unchanged` : `moved from ${K.usd(hs.prev!.high)} to ${K.usd(hs.high)}`}.</p>
<h2>Sioux Falls and the other standard-rate cities</h2>
<p>In the Census city file behind the search, Rapid City is the only South Dakota place of 15,000 people or more inside a listed county. Sioux Falls (Minnehaha County), Aberdeen, Brookings, Watertown, Yankton and Mitchell are in counties GSA does not list. They follow the standard rate all year with no seasonal change. A two-night meeting in Sioux Falls costs at most ${m2(K.trip({ destIndex: -1, depart: '2027-03-01', ret: '2027-03-03' }).total)} at the federal maximum, M&IE included.</p>
<p>For the drive itself, EIA groups South Dakota in its ${K.stateRef('south-dakota').gasArea} gasoline series: ${K.usd(gas, 3)} a gallon in the week of ${K.day(K.ENERGY_META.gasWeek)}. The ${h.a('road-trip-cost-calculator', 'road trip cost calculator')} adds fuel, lodging and meals for the full loop.</p>
`,
  faqs: [
    { q: 'What is the Rapid City, South Dakota per diem in summer 2027?', a: `${K.usd(rc.high)} of lodging per night in ${K.listOf(rc.highMonths)} 2027 and ${K.usd(rc.mie)} of M&IE per day, under GSA's FY2027 rates for ${rc.counties} County. From ${span(rc.lowMonths)} the room cap drops to ${K.usd(rc.low)}, the national standard. On the first and last day of the trip the M&IE is ${K.usd(rc.mie * share, 2)}.` },
    { q: 'Does Sioux Falls, South Dakota have a higher per diem than the standard?', a: `No. Minnehaha County is not a GSA non-standard area, so Sioux Falls takes the standard ${K.usd(std.lodging)} for lodging and ${K.usd(std.mie)} for M&IE in FY2027, from October 1, 2026 to September 30, 2027. In South Dakota only Pennington, Lawrence, Fall River and Custer counties have their own rates, and only their summer months pay more for lodging.` },
    { q: 'When does the Deadwood, South Dakota per diem season run in FY2027?', a: `${K.listOf(dw.highMonths)}, at ${K.usd(dw.high)} a night. The other months pay ${K.usd(dw.low)}. In FY2026 the higher cap was ${K.usd(dw.prev!.high)} and also covered ${K.listOf(dw26High.filter((x) => !dw.highMonths.includes(x)))}, so the season is shorter but better paid. M&IE in Deadwood and Spearfish is ${K.usd(dw.mie)} all year, the highest meals rate in the state.` },
  ],
  related: ['per-diem-rates', 'home', 'state:north-dakota', 'state:wyoming', 'state:nebraska', 'road-trip-cost-calculator'],
});
