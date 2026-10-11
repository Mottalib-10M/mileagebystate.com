import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import { T } from '../../lib/data';

const sum = K.stateSummary('indiana');
const area = (name: string) => K.nsas('IN').find((n) => n.name === name)!;
const blo = area('Bloomington'), ind = area('Indianapolis / Carmel'), laf = area('Lafayette / West Lafayette');
const bloL = T.dest[blo.i].fy['2027'].lodging;
const chi = K.nsas('IL').find((n) => n.name === 'Chicago')!;
const std = sum.std;
const m = (x: number) => K.usd(x, x % 1 ? 2 : 0);
const share = K.P.mie.partialDayShare;
const gas = K.gas('indiana');
const bloJun = K.trip({ destIndex: blo.i, depart: '2027-06-07', ret: '2027-06-11' });
const bloNov = K.trip({ destIndex: blo.i, depart: '2026-11-09', ret: '2026-11-13' });
const indy = K.trip({ destIndex: ind.i, depart: '2026-11-09', ret: '2026-11-13' });
const fw = K.trip({ destIndex: -1, depart: '2026-11-09', ret: '2026-11-13' });

export default defineState({
  slug: 'indiana',
  dest: 'Indianapolis / Carmel',
  title: 'Per Diem Rates Indiana 2026-27: Indianapolis, Bloomington',
  description: `Indiana per diem 2026-27 (FY2027): Indianapolis and Carmel ${K.usd(ind.high)} all year, Bloomington ${K.usd(blo.high)} in summer, Lafayette flat at ${K.usd(laf.high)}, Fort Wayne and Gary at ${K.usd(std.lodging)}.`,
  intro: `Indiana lists ${sum.count} GSA areas for FY2027: Bloomington kept its summer peak and raised it, Lafayette dropped its season altogether.`,
  resume: `Indiana per diem for FY2027 is the standard ${K.usd(std.lodging)} of lodging and ${K.usd(std.mie)} of M&IE in all but ${sum.count} areas. Marion and Hamilton counties, listed as Indianapolis / Carmel, allow ${K.usd(ind.high)} a night in every month with ${K.usd(ind.mie)} of M&IE, the only Indiana area on that tier. Monroe County (Bloomington) runs ${K.usd(blo.low)} most of the year and ${K.usd(blo.high)} in ${K.listOf(blo.highMonths)}. Tippecanoe County (Lafayette / West Lafayette) is flat at ${K.usd(laf.high)}, below its FY2026 top of ${K.usd(laf.prev!.high)}. Fort Wayne, Evansville, South Bend and the Lake County cities of Hammond and Gary are not listed. The rates apply from October 1, 2026 to September 30, 2027. Four nights from November 9, 2026 come to ${m(indy.total)} in Indianapolis and ${m(fw.total)} in Fort Wayne at the federal maximum; in Bloomington the same four nights cost ${m(bloNov.total)}, and ${m(bloJun.total)} from June 7, 2027. The calculator opens on Indianapolis.`,
  body: (h) => `
<h2>Lafayette traded its season for one flat figure</h2>
<p>In FY2026 Tippecanoe County had a calendar, from ${K.usd(laf.prev!.low)} to ${K.usd(laf.prev!.high)} depending on the month. For FY2027 GSA replaced it with a single ${K.usd(laf.high)} cap for all twelve months. The low months gained ${K.usd(laf.high - laf.prev!.low)}, the former peak lost ${K.usd(laf.prev!.high - laf.high)}. A university visit or a plant audit in West Lafayette is now priced the same in any month, with ${K.usd(laf.mie)} of M&IE. Policies that budgeted the old peak should lower their ceiling for those months; policies that used the old low figure gain room all year.</p>
<h2>Bloomington's four summer months</h2>
<p>Monroe County went the other way and kept a pronounced season: ${K.usd(blo.low)} in ${K.listOf(blo.lowMonths)}, ${K.usd(blo.high)} in ${K.listOf(blo.highMonths)}. Both steps rose since last year, the floor by ${K.usd(blo.low - blo.prev!.low)} and the summer cap by ${K.usd(blo.high - blo.prev!.high)}. A stay running from late April into May changes cap on May 1, and the calculator prices each night on its own month.</p>
${h.mini('areaTrip', { area: 'Bloomington, IN', lodging: bloL, mie: blo.mie })}
<h3>Indianapolis, Carmel, Fishers and Noblesville share one rate</h3>
<p>The Indianapolis / Carmel area covers ${ind.counties.replace(' / ', ' and ')} counties, so the Hamilton County cities of Carmel, Fishers and Noblesville carry the same ${K.usd(ind.high)} and ${K.usd(ind.mie)} as downtown Indianapolis. The cap is up ${K.usd(ind.high - ind.prev!.high)} from FY2026. Johnson County is a different story: Greenwood, in the Census file under Johnson County, is not in the area and pays ${K.usd(std.lodging)}.</p>
<h2>Two Lake Counties, two rates</h2>
<p>Illinois and Indiana each have a Lake County, and GSA treats them differently. Lake County, Illinois is part of the Chicago area, capped up to ${K.usd(chi.high)} with ${K.usd(chi.mie)} of M&IE. Lake County, Indiana, home to Hammond, Gary, Merrillville and Crown Point, has no listing at all, so it pays ${K.usd(std.lodging)} and ${K.usd(std.mie)}. Expense tools that match on county name alone can confuse the two; the ZIP code does not. Indiana gasoline falls in EIA's ${K.stateRef('indiana').gasArea} series, ${K.usd(gas, 3)} a gallon for regular in the week of ${K.day(K.ENERGY_META.gasWeek)}. The ${h.a('mileage-reimbursement-calculator', 'mileage reimbursement calculator')} applies the IRS rate of ${K.centsWord(K.irs('2026-07-01'))} to an Indianapolis to Bloomington drive, and the travel-day M&IE in Indianapolis is ${K.usd(ind.mie * share, 2)}.</p>
`,
  faqs: [
    { q: 'What is the Indianapolis, Indiana per diem for FY2027?', a: `Marion and Hamilton counties have ${K.usd(ind.high)} of lodging a night in every month and ${K.usd(ind.mie)} of M&IE, from October 1, 2026 to September 30, 2027. That is ${K.usd(ind.high - ind.prev!.high)} more lodging than in FY2026. Carmel, Fishers and Noblesville share the rate. On the first and last day the M&IE is ${K.usd(ind.mie * share, 2)}.` },
    { q: 'Why did the Lafayette, Indiana per diem drop in some months?', a: `Because GSA turned Tippecanoe County's seasonal rate into a flat one. In FY2026 lodging ranged from ${K.usd(laf.prev!.low)} to ${K.usd(laf.prev!.high)}; in FY2027 it is ${K.usd(laf.high)} in all months. The former peak months therefore lose ${K.usd(laf.prev!.high - laf.high)} a night while the others gain ${K.usd(laf.high - laf.prev!.low)}. M&IE stays at ${K.usd(laf.mie)}, and the new figures apply to nights from October 1, 2026.` },
    { q: 'Is Gary, Indiana on the Chicago per diem rate?', a: `No. The Chicago area covers Cook and Lake counties in Illinois only. Gary and Hammond are in Lake County, Indiana, which has no GSA area for FY2027, so they take the standard ${K.usd(std.lodging)} of lodging and ${K.usd(std.mie)} of M&IE a day, against up to ${K.usd(chi.high)} and ${K.usd(chi.mie)} in Chicago.` },
    { q: 'When is the Bloomington, Indiana per diem highest?', a: `In ${K.listOf(blo.highMonths)}, when Monroe County lodging is capped at ${K.usd(blo.high)} a night in FY2027. The other months carry ${K.usd(blo.low)}. M&IE is ${K.usd(blo.mie)} all year. Four nights from June 7, 2027 total ${m(bloJun.total)} at the federal maximum, against ${m(bloNov.total)} for four nights in November 2026.` },
  ],
  related: ['per-diem-rates', 'home', 'state:illinois', 'state:ohio', 'state:kentucky', 'mileage-reimbursement-calculator'],
});
