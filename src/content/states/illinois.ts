import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import { T } from '../../lib/data';

const sum = K.stateSummary('illinois');
const area = (name: string) => K.nsas('IL').find((n) => n.name === name)!;
const chi = area('Chicago'), esl = area("East St. Louis / O'Fallon / Fairview Heights"), obt = area('Oakbrook Terrace'), bol = area('Bolingbrook / Romeoville / Lemont');
const oldName = sum.dropped[0], newName = sum.added[0];
const oldObt = K.nsas('IL', 2026).find((n) => n.name === oldName);
const chiL = T.dest[chi.i].fy['2027'].lodging;
const fall = chiL[0], summer = chiL[9];
const fallMonths = K.MONTHS_FY.filter((_, m) => chiL[m] === fall);
const summerMonths = K.MONTHS_FY.filter((_, m) => chiL[m] === summer);
const std = sum.std;
const m = (x: number) => K.usd(x, x % 1 ? 2 : 0);
const share = K.P.mie.partialDayShare;
const gas = K.gas('illinois');
const may = K.trip({ destIndex: chi.i, depart: '2027-05-10', ret: '2027-05-13' });
const jan = K.trip({ destIndex: chi.i, depart: '2027-01-11', ret: '2027-01-14' });
const dup = K.trip({ destIndex: obt.i, depart: '2027-01-11', ret: '2027-01-14' });
const kane = K.trip({ destIndex: -1, depart: '2027-01-11', ret: '2027-01-14' });

export default defineState({
  slug: 'illinois',
  dest: 'Chicago',
  title: 'Per Diem Rates Illinois 2026-27: Chicago and Collar Counties',
  description: `Illinois per diem 2026-27 (FY2027): Chicago ${K.usd(chi.low)} to ${K.usd(chi.high)} a night, DuPage now listed as ${newName} at ${K.usd(obt.high)} (was ${K.usd(oldObt ? oldObt.high : obt.high)}), M&IE ${K.usd(sum.mieTiers[0])} to ${K.usd(sum.mieTiers[sum.mieTiers.length - 1])} across ${sum.count} areas.`,
  intro: `Each of Illinois' ${sum.count} GSA areas sits on a different M&IE tier in FY2027, and the DuPage County area changed its name along with its rate.`,
  resume: `Illinois per diem for FY2027 is set by ${sum.count} GSA areas, each on its own meals tier: Chicago (Cook and Lake counties) at ${K.usd(chi.mie)}, East St. Louis / O'Fallon / Fairview Heights (St. Clair County) at ${K.usd(esl.mie)}, ${newName} (DuPage County) at ${K.usd(obt.mie)} and Bolingbrook / Romeoville / Lemont (Will County) at ${K.usd(bol.mie)}. Chicago lodging peaks at ${K.usd(chi.high)} a night in ${K.listOf(chi.highMonths)} and falls to ${K.usd(chi.low)} in ${K.listOf(chi.lowMonths)}. Every other county, Kane, Winnebago, Sangamon and Champaign included, takes the standard ${K.usd(std.lodging)} and ${K.usd(std.mie)}. The rates run from October 1, 2026 to September 30, 2027. Three nights in Chicago from May 10, 2027 total ${m(may.total)} at the federal maximum; from January 11, 2027 the same stay is ${m(jan.total)}. In January the DuPage rate gives ${m(dup.total)} and an Aurora hotel in Kane County ${m(kane.total)}. The calculator starts on Chicago.`,
  body: (h) => `
<h2>From ${oldName} to ${newName}</h2>
<p>The FY2026 GSA file listed DuPage County as "${oldName}". The FY2027 file lists it as "${newName}", one word, and the lodging cap moved from ${K.usd(oldObt ? oldObt.high : obt.high)} to ${K.usd(obt.high)}. The county and the ${K.usd(obt.mie)} M&IE did not change. The rename matters if your expense system matches areas by name: a lookup for the old spelling finds nothing in FY2027, and in the table at the bottom of this page the area shows up as new. Searching by ZIP code avoids the problem, since the ZIP file points to the county.</p>
<h2>Chicago's winter discount is ${K.usd(chi.high - chi.low)} a night</h2>
<p>Cook and Lake counties share one calendar with four levels: ${K.usd(fall)} in ${K.listOf(fallMonths)}, ${K.usd(chi.low)} in ${K.listOf(chi.lowMonths)}, ${K.usd(chi.high)} in ${K.listOf(chi.highMonths)} and ${K.usd(summer)} in ${K.listOf(summerMonths)}. A three-night trip in January costs ${m(may.total - jan.total)} less than the same trip in May at the federal maximum, all of it lodging. Since FY2026 the spring top rose ${K.usd(chi.high - chi.prev!.high)} and the winter floor ${K.usd(chi.low - chi.prev!.low)}. Lake County towns such as Waukegan, Highland Park and Gurnee fall inside the Chicago area too.</p>
${h.mini('areaTrip', { area: 'Chicago, IL', lodging: chiL, mie: chi.mie })}
<h3>Kane County and downstate on the standard rate</h3>
<p>Aurora and Elgin (Kane County) are among the largest Illinois cities in the Census file, and Kane County has no GSA area. Neither do Rockford (Winnebago), Springfield (Sangamon), Peoria or Champaign. In January the standard ${K.usd(std.lodging)} is only ${K.usd(chi.low - std.lodging)} under the Chicago cap; in May the gap is ${K.usd(chi.high - std.lodging)}. Joliet follows the Will County rate of ${K.usd(bol.high)}.</p>
<h2>St. Clair County: higher meals than DuPage</h2>
<p>East St. Louis, O'Fallon and Fairview Heights share a flat ${K.usd(esl.high)} with ${K.usd(esl.mie)} of M&IE, both above the DuPage figures. St. Louis itself is in Missouri, with its own rates on the ${h.a('state:missouri', 'Missouri page')}, so check which state the hotel is in. Illinois gasoline is priced in EIA's ${K.stateRef('illinois').gasArea} series at ${K.usd(gas, 3)} a gallon (week of ${K.day(K.ENERGY_META.gasWeek)}); the ${h.a('mileage-calculator', 'mileage calculator')} applies the IRS rate of ${K.centsWord(K.irs('2026-07-01'))} to any route, and the arrival day in Chicago pays ${K.usd(chi.mie * share, 2)} of M&IE.</p>
`,
  faqs: [
    { q: 'What is the Chicago, Illinois per diem for FY2027?', a: `Cook and Lake counties have ${K.usd(chi.mie)} of M&IE and a monthly lodging cap: ${K.usd(chi.high)} in ${K.listOf(chi.highMonths)}, ${K.usd(fall)} in ${K.listOf(fallMonths)}, ${K.usd(summer)} in ${K.listOf(summerMonths)} and ${K.usd(chi.low)} from December to March. The rates apply from October 1, 2026 to September 30, 2027.` },
    { q: 'Why is Oak Brook Terrace, Illinois missing from the FY2027 per diem list?', a: `It is not missing; GSA now spells it "${newName}". The area still covers DuPage County, with ${K.usd(obt.mie)} of M&IE, and its lodging cap rose from ${K.usd(oldObt ? oldObt.high : obt.high)} in FY2026 to ${K.usd(obt.high)} a night in FY2027, the same in every month. Search by ZIP code or city to get the right rate.` },
    { q: 'What per diem applies in Aurora, Illinois?', a: `The Census place file puts Aurora in Kane County, which has no GSA area in FY2027, so the standard rate applies: ${K.usd(std.lodging)} of lodging and ${K.usd(std.mie)} of M&IE a day. A hotel whose ZIP code maps to DuPage County would take the ${newName} rate of ${K.usd(obt.high)} instead; the ZIP search settles it.` },
    { q: 'Do the four Illinois per diem areas all have different M&IE?', a: `Yes. In FY2027 Chicago is on the ${K.usd(chi.mie)} tier, St. Clair County on ${K.usd(esl.mie)}, DuPage on ${K.usd(obt.mie)} and Will County on ${K.usd(bol.mie)}, so a full day of meals is worth ${K.usd(chi.mie - bol.mie)} more in Chicago than in Bolingbrook. The standard ${K.usd(std.mie)} covers the rest of Illinois, and on travel days each figure is cut to ${K.pct(share)}.` },
  ],
  related: ['per-diem-rates', 'home', 'state:indiana', 'state:wisconsin', 'state:missouri', 'mileage-calculator'],
});
