import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import { T } from '../../lib/data';

const sum = K.stateSummary('florida');
const list = K.nsas('FL');
const area = (name: string) => list.find((n) => n.name === name)!;
const kw = area('Key West'), orl = area('Orlando'), stu = area('Stuart'), pc = area('Panama City'), mia = area('Miami');
const L = (n: { i: number }) => T.dest[n.i].fy['2027'].lodging;
const summer = list.filter((n) => n.highMonths.includes('June') || n.highMonths.includes('July'));
const winterPeak = list.filter((n) => n.seasonal && !summer.includes(n) && n.highMonths.some((x) => ['January', 'February', 'March'].includes(x)));
const flat = list.filter((n) => !n.seasonal);
const unchanged = list.filter((n) => n.prev && n.prev.low === n.low && n.prev.high === n.high);
const aboveKwLow = list.filter((n) => n !== kw && n.high >= kw.low).length;
const std = sum.std;
const m = (x: number) => K.usd(x, x % 1 ? 2 : 0);
const share = K.P.mie.partialDayShare;
const gas = K.gas('florida');
const kwMar = K.trip({ destIndex: kw.i, depart: '2027-03-08', ret: '2027-03-11' });
const pcJun = K.trip({ destIndex: pc.i, depart: '2027-06-14', ret: '2027-06-17' });
const pcMar = K.trip({ destIndex: pc.i, depart: '2027-03-08', ret: '2027-03-11' });
const jax = K.trip({ destIndex: -1, depart: '2027-03-08', ret: '2027-03-11' });

export default defineState({
  slug: 'florida',
  title: 'Per Diem Rates Florida 2026-27: Key West, Miami, Panhandle',
  description: `Florida per diem 2026-27 (FY2027): ${sum.count} GSA areas, Key West up to ${K.usd(kw.high)} a night, the Panhandle peaking in summer, Jacksonville on the ${K.usd(std.lodging)} standard rate.`,
  intro: `Florida has ${sum.count} GSA areas in FY2027, and they peak in two different seasons depending on which coast you work on.`,
  resume: `Florida per diem for FY2027 tops out in Key West (Monroe County), where lodging is capped at ${K.usd(kw.high)} a night in ${K.listOf(kw.highMonths)} and never falls below ${K.usd(kw.low)}, with ${K.usd(kw.mie)} of M&IE. Of the ${sum.count} Florida areas, ${winterPeak.length} reach their peak in winter or early spring, while ${summer.length} in the western Panhandle peak in June or July instead. Miami-Dade County is the one area on the ${K.usd(mia.mie)} tier. Duval County, home to Jacksonville, has no listing and pays the standard ${K.usd(std.lodging)} and ${K.usd(std.mie)}. The rates apply from October 1, 2026 to September 30, 2027. Three nights from March 8, 2027 cost ${m(kwMar.total)} at the federal maximum in Key West, ${m(pcMar.total)} in Panama City and ${m(jax.total)} in Jacksonville. Panama City catches up in June, at ${m(pcJun.total)} for three nights from June 14. The calculator starts on Key West.`,
  body: (h) => `
<h2>The Panhandle runs on a summer clock</h2>
<p>${K.listOf(summer.map((n) => `${n.name} (${n.counties})`))} all hit their highest cap in ${K.listOf(summer[0].highMonths)}, and their lowest in the cool months. That is the reverse of most of the state, where areas such as ${K.listOf(winterPeak.slice(0, 5).map((n) => n.name))} peak in late winter and drop by May. Panama City shows the pattern clearly: ${K.usd(pc.low)} through February, ${K.usd(L(pc)[5])} from March to May, ${K.usd(pc.high)} in ${K.listOf(pc.highMonths)}. A company sending staff to Pensacola and to Naples in the same July meets two very different maxima: ${K.usd(area('Pensacola').high)} against ${K.usd(area('Naples').low)}.</p>
${h.mini('areaTrip', { area: 'Panama City, FL', lodging: L(pc), mie: pc.mie })}
<h2>Key West's floor beats most ceilings</h2>
<p>Even in its quietest months (${K.listOf(kw.lowMonths)}) Monroe County allows ${K.usd(kw.low)}. Only ${aboveKwLow} other Florida area${aboveKwLow === 1 ? '' : 's'} ever reach${aboveKwLow === 1 ? 'es' : ''} that figure in any month. The peak climbs in two steps, ${K.usd(L(kw)[2])} in December and January, then ${K.usd(kw.high)} in ${K.listOf(kw.highMonths)}. Since FY2026 the top rose ${K.usd(kw.high - kw.prev!.high)}.</p>
<h3>Biggest moves and the ones that stood still</h3>
<p>Martin County (Stuart) gained the most at the bottom of its range: its off-season cap went from ${K.usd(stu.prev!.low)} to ${K.usd(stu.low)}. By contrast ${K.listOf(unchanged.map((n) => n.name))} kept exactly the FY2026 figures. ${flat.length ? `${K.listOf(flat.map((n) => n.name))} ${flat.length === 1 ? 'is' : 'are'} flat all year.` : 'Every Florida area changes with the month, without exception.'} Orlando (Orange County) runs from ${K.usd(orl.low)} to ${K.usd(orl.high)}, peaking in ${K.listOf(orl.highMonths)}.</p>
<h2>Big Florida cities with no listing</h2>
<p>The Census file has Jacksonville as the most populous place in Florida, and Duval County has no GSA area. The same goes for Port St. Lucie and Fort Pierce (St. Lucie County), Gainesville (Alachua), Lakeland (Polk), Ocala (Marion) and Kissimmee (Osceola). Kissimmee is the sharpest case: Orlando in Orange County is listed, Osceola County is not, so a hotel in Osceola County is capped at ${K.usd(std.lodging)} instead of up to ${K.usd(orl.high)}. Check the ZIP code before booking.</p>
<p>Florida is one of the states EIA prices on its own: regular gasoline averaged ${K.usd(gas, 3)} a gallon in the week of ${K.day(K.ENERGY_META.gasWeek)}, ${K.usd(K.ENERGY_META.usGas - gas, 3)} under the U.S. average. The ${h.a('road-trip-cost-calculator', 'road trip calculator')} uses it for a Miami to Pensacola run, and the ${h.a('first-and-last-day-per-diem', 'travel-day rule')} pays ${K.usd(kw.mie * share, 2)} of M&IE on arrival in Key West.</p>
`,
  faqs: [
    { q: 'What is the Key West, Florida per diem for FY2027?', a: `Monroe County has ${K.usd(kw.mie)} of M&IE and a lodging cap of ${K.usd(kw.low)} to ${K.usd(kw.high)} by month: ${K.usd(kw.high)} in ${K.listOf(kw.highMonths)}, ${K.usd(L(kw)[2])} in December and January, ${K.usd(L(kw)[0])} in October and November, ${K.usd(kw.low)} from May to September. The rates apply from October 1, 2026 to September 30, 2027.` },
    { q: 'Why is the Florida Panhandle per diem highest in summer?', a: `Because GSA sets those caps by month and gives ${K.listOf(summer[0].highMonths)} the top figure in ${K.listOf(summer.map((n) => n.name))}. Panama City, for example, is ${K.usd(pc.high)} in summer against ${K.usd(pc.low)} in winter. Areas such as Naples or Sarasota peak in ${K.listOf(area('Naples').highMonths)} instead, so the season depends on where in Florida the work is.` },
    { q: 'Does Jacksonville, Florida have a special per diem rate?', a: `No. Duval County is not a GSA non-standard area in FY2027, so Jacksonville takes the standard CONUS rate: ${K.usd(std.lodging)} of lodging and ${K.usd(std.mie)} of M&IE a day, or ${K.usd(std.mie * share, 2)} of M&IE on travel days. St. Johns County, by contrast, is listed as St. Augustine, at up to ${K.usd(area('St. Augustine').high)}.` },
    { q: 'Is Kissimmee, Florida on the Orlando per diem rate?', a: `No. Kissimmee is in Osceola County, which GSA does not list, so it pays the standard ${K.usd(std.lodging)} of lodging and ${K.usd(std.mie)} of M&IE in FY2027. The Orlando rate covers Orange County only: ${K.usd(orl.low)} to ${K.usd(orl.high)} a night with ${K.usd(orl.mie)} of M&IE, highest in ${K.listOf(orl.highMonths)}.` },
  ],
  related: ['per-diem-rates', 'home', 'state:georgia', 'state:alabama', 'road-trip-cost-calculator', 'first-and-last-day-per-diem'],
});
