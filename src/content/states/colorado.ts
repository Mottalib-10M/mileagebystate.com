import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import { T } from '../../lib/data';

const sum = K.stateSummary('colorado');
const list = K.nsas('CO');
const area = (name: string) => list.find((n) => n.name === name)!;
const asp = area('Aspen'), den = area('Denver / Aurora'), cb = area('Crested Butte / Gunnison'), bou = area('Boulder / Broomfield'), dou = area('Douglas'), cos = area('Colorado Springs');
const L = (n: { i: number }) => T.dest[n.i].fy['2027'].lodging;
const ski = list.filter((n) => n.highMonths.includes('December') && n.highMonths.includes('January'));
const std = sum.std;
const m = (x: number) => K.usd(x, x % 1 ? 2 : 0);
const gas = K.gas('colorado');
const share = K.P.mie.partialDayShare;
const aspJan = K.trip({ destIndex: asp.i, depart: '2027-01-18', ret: '2027-01-21' });
const aspOct = K.trip({ destIndex: asp.i, depart: '2026-10-19', ret: '2026-10-22' });
const denNov = K.trip({ destIndex: den.i, depart: '2026-11-02', ret: '2026-11-05' });
const denMay = K.trip({ destIndex: den.i, depart: '2027-05-03', ret: '2027-05-06' });

export default defineState({
  slug: 'colorado',
  title: 'Per Diem Rates Colorado 2026-27: Ski Season and Denver',
  description: `Colorado per diem 2026-27 (FY2027): ${sum.count} GSA areas, Aspen ${K.usd(asp.low)} to ${K.usd(asp.high)} a night, ${ski.length} resorts peaking ${ski[0].highMonths[0]} to ${ski[0].highMonths[ski[0].highMonths.length - 1]}, Denver ${K.usd(den.high)} outside winter, M&IE to ${K.usd(asp.mie)}.`,
  intro: `Colorado lists ${sum.count} GSA areas for FY2027, and ${ski.length} of them reach their highest lodging cap in the ski months.`,
  resume: `Colorado per diem for FY2027 is ruled by snow: in ${K.listOf(ski[0].highMonths)} the lodging cap reaches ${K.usd(asp.high)} a night in Aspen (Pitkin County) and stays at ${K.usd(Math.min(...ski.map((s) => s.high)))} or more in ${ski.length - 1} other resort areas, all with ${K.usd(asp.mie)} of M&IE except Grand Lake. Denver works the other way, at ${K.usd(den.low)} in winter and ${K.usd(den.high)} the rest of the year. In all, ${sum.count} areas carry their own rate from October 1, 2026 to September 30, 2027, and the remaining counties pay the standard ${K.usd(std.lodging)} and ${K.usd(std.mie)}. A three-night Aspen stay from January 18, 2027 comes to ${m(aspJan.total)} at the federal maximum; the same nights from October 19, 2026 come to ${m(aspOct.total)}. In Denver, three nights in early November 2026 total ${m(denNov.total)} and three in early May 2027 total ${m(denMay.total)}. The calculator starts on Aspen; search any Colorado town or ZIP code.`,
  body: (h) => `
<h2>${ski.length} resort calendars on one winter clock</h2>
<p>${K.listOf(ski.map((s) => s.name))} all hit their peak in ${K.listOf(ski[0].highMonths)}. The trough is where they part ways. Aspen drops to ${K.usd(asp.low)} only in ${K.listOf(asp.lowMonths)}, then holds ${K.usd(L(asp)[6])} from April through September, which makes its winter cap ${K.num(asp.high / asp.low, 1)} times its autumn one, the widest ratio in the state. Vail, Telluride and Breckenridge fall straight back to their low figure in April. Steamboat Springs adds a summer step of ${K.usd(L(area('Steamboat Springs'))[8])} from June. A contractor sent to a resort county across late March and early April meets two caps in one trip, and the calculator splits the nights accordingly.</p>
<p>Aspen also shows the oddest change since FY2026: its top figure rose from ${K.usd(asp.prev!.high)} to ${K.usd(asp.high)}, but its floor fell from ${K.usd(asp.prev!.low)} to ${K.usd(asp.low)}.</p>
${h.mini('areaTrip', { area: 'Aspen, CO', lodging: L(asp), mie: asp.mie })}
<h2>Denver's cheap months are the snowy ones</h2>
<p>The Denver / Aurora area (${den.counties.split(' / ').join(', ')} counties) is capped at ${K.usd(den.low)} in ${K.listOf(den.lowMonths)} and at ${K.usd(den.high)} in ${K.listOf(den.highMonths)}, on the ${K.usd(den.mie)} M&IE tier. Boulder / Broomfield follows a similar pattern and did not move at all between the two fiscal years: ${K.usd(bou.low)} to ${K.usd(bou.high)} in both. Douglas County is the one Colorado area whose top cap went down, from ${K.usd(dou.prev!.high)} to ${K.usd(dou.high)}. Colorado Springs peaks in ${K.listOf(cos.highMonths)} at ${K.usd(cos.high)}.</p>
<h3>Crested Butte now has seasons</h3>
<p>Gunnison County paid one flat ${K.usd(cb.prev!.high)} in FY2026. For FY2027 GSA split it into a calendar: ${K.usd(cb.high)} in ${K.listOf(cb.highMonths)}, ${K.usd(cb.low)} in ${K.listOf(cb.lowMonths)}, ${K.usd(L(cb)[1])} in the winter months. Summer travel there costs more than last year, spring travel less.</p>
<h2>Pueblo, Greeley and Grand Junction are not listed</h2>
<p>Three of the larger Colorado cities in the Census file sit in counties without a GSA area: Pueblo (Pueblo County), Greeley (Weld County) and Grand Junction (Mesa County). They take ${K.usd(std.lodging)} and ${K.usd(std.mie)}. Driving there, Colorado is one of the few states with its own EIA gasoline series: ${K.usd(gas, 3)} a gallon for regular in the week of ${K.day(K.ENERGY_META.gasWeek)}, against ${K.usd(K.ENERGY_META.usGas, 3)} nationally. The ${h.a('gas-cost-calculator', 'gas cost calculator')} reads it directly, and the ${h.a('first-and-last-day-per-diem', 'travel-day rule')} gives ${K.usd(asp.mie * share, 2)} of M&IE on arrival in a resort county.</p>
`,
  faqs: [
    { q: 'When is the Aspen, Colorado per diem highest in FY2027?', a: `In ${K.listOf(asp.highMonths)}, at ${K.usd(asp.high)} of lodging a night plus ${K.usd(asp.mie)} of M&IE. Pitkin County drops to ${K.usd(asp.low)} in ${K.listOf(asp.lowMonths)} and sits at ${K.usd(L(asp)[6])} from April to September. These GSA FY2027 caps apply from October 1, 2026; anything a hotel charges above them is not covered by the per diem.` },
    { q: 'Why is the Denver, Colorado per diem lower in winter?', a: `In the FY2027 GSA file the Denver / Aurora cap is set month by month, and for FY2027 ${K.listOf(den.lowMonths)} carry ${K.usd(den.low)} while the other months carry ${K.usd(den.high)}. M&IE is ${K.usd(den.mie)} all year. The area covers ${den.counties.split(" / ").join(", ")} counties, so Aurora, Lakewood, Thornton and Arvada share the Denver figures.` },
    { q: 'Which Colorado per diem areas changed the most for FY2027?', a: `Crested Butte / Gunnison went from a flat ${K.usd(cb.prev!.high)} to a seasonal ${K.usd(cb.low)} to ${K.usd(cb.high)}. Aspen's winter top rose ${K.usd(asp.high - asp.prev!.high)} while its autumn floor fell ${K.usd(asp.prev!.low - asp.low)}. Boulder / Broomfield did not change. Every Colorado area kept its M&IE tier, and the list still has ${sum.count} areas.` },
    { q: 'What per diem applies in Grand Junction, Colorado?', a: `The standard CONUS rate. Mesa County has no non-standard area in the FY2027 GSA file, so a stay in Grand Junction is paid at ${K.usd(std.lodging)} of lodging and ${K.usd(std.mie)} of M&IE a day, or ${K.usd(std.mie * share, 2)} of M&IE on the travel days. Montrose County, further south, does have its own seasonal rate.` },
  ],
  related: ['per-diem-rates', 'home', 'state:utah', 'state:wyoming', 'state:new-mexico', 'gas-cost-calculator'],
});
