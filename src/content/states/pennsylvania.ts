import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import { destIndex, T } from '../../lib/data';
import PLACES from '../../data/places.json';

const CAL = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
/** Months listed as they run on the calendar, starting after a gap (Nov., Dec., Jan.); other lists keep their order. */
const L = (xs: string[]) => {
  if (!xs.length || !xs.every((x) => CAL.includes(x))) return K.listOf(xs);
  const has = (i: number) => xs.includes(CAL[(i + 12) % 12]);
  const start = CAL.findIndex((_, i) => has(i) && !has(i - 1));
  return K.listOf(start < 0 ? CAL : Array.from({ length: 12 }, (_, k) => CAL[(start + k) % 12]).filter((m) => xs.includes(m)));
};
const sum = K.stateSummary('pennsylvania');
const ref = K.stateRef('pennsylvania');
const at = (name: string) => sum.list.find((n) => n.name === name)!;
const phl = at('Philadelphia'), her = at('Hershey'), hbg = at('Harrisburg'), pit = at('Pittsburgh'), get = at('Gettysburg'), mal = at('Malvern / Frazer / Berwyn');
const phlRow = T.dest[phl.i].fy['2027'];
const phlMid = phlRow.lodging[3];
const phlMidMonths = K.MONTHS_FY.filter((_, m) => phlRow.lodging[m] === phlMid);
const gone = sum.dropped[0];
const goneI = destIndex('PA', gone);
const gone26 = T.dest[goneI].fy['2026'];
const std = sum.std, std26 = K.std(2026);
const places = (PLACES as { rows: Array<[string, string, string, number, number, number]> }).rows.filter((r) => r[1] === 'PA');
const lehigh = places.filter((r) => r[4] === goneI && r[3] === -1).map((r) => r[0]);
const stdOther = places.filter((r) => r[3] === -1 && r[4] === -1).map((r) => r[0]);
const before = K.trip({ destIndex: goneI, depart: '2025-11-03', ret: '2025-11-06' });
const after = K.trip({ destIndex: -1, depart: '2026-11-02', ret: '2026-11-05' });
const ex = K.trip({ destIndex: destIndex('PA', 'Philadelphia'), depart: '2027-07-12', ret: '2027-07-15' });
const exOct = K.trip({ destIndex: destIndex('PA', 'Philadelphia'), depart: '2026-10-12', ret: '2026-10-15' });
const share = K.P.mie.partialDayShare;

export default defineState({
  slug: 'pennsylvania',
  dest: 'Philadelphia',
  title: 'Per Diem Rates Pennsylvania 2026-27: Allentown Drops Out',
  description: `Pennsylvania per diem 2026-27: ${sum.count} GSA areas in FY2027, down from ${sum.prevCount}; Allentown falls to the ${K.usd(std.lodging)} standard, Philadelphia runs ${K.usd(phl.low)} to ${K.usd(phl.high)} with ${K.usd(phl.mie)} M&IE.`,
  intro: `Pennsylvania lost a GSA area for FY2027: Lehigh and Northampton counties went back to the standard rate on October 1, 2026.`,
  resume: `Pennsylvania per diem for FY2027 lists ${sum.count} GSA areas, one fewer than the ${sum.prevCount} of FY2026, because the Allentown, Easton and Bethlehem line was removed. Lehigh and Northampton counties now take the standard ${K.usd(std.lodging)} of lodging and ${K.usd(std.mie)} of M&IE, against ${K.usd(Math.max(...gone26.lodging))} and ${K.usd(gone26.mie)} last year. Philadelphia sits on the top ${K.usd(phl.mie)} meal tier, with lodging from ${K.usd(phl.low)} in ${L(phl.lowMonths)} to ${K.usd(phl.high)} in ${L(phl.highMonths)}. Hershey peaks at ${K.usd(her.high)} in ${L(her.highMonths)}, Pittsburgh is ${K.usd(pit.high)} all year. Three nights in Philadelphia from October 12 to 15, 2026 are worth ${K.usd(exOct.total, 2)} at the federal maximum, and ${K.usd(ex.total, 2)} from July 12 to 15, 2027, when the city's cap is at its lowest. These rates run to September 30, 2027. The calculator above starts on Philadelphia; type a Pennsylvania town or ZIP code to switch.`,
  body: (h) => `
<h2>The Lehigh Valley back on the standard rate</h2>
<p>The FY2027 GSA file has ${sum.count} Pennsylvania lines where FY2026 had ${sum.prevCount}. The one that disappeared is ${gone}, which covered Lehigh and Northampton counties at ${K.usd(Math.max(...gone26.lodging))} a night and ${K.usd(gone26.mie)} of M&IE. Since October 1, 2026, ${L(lehigh)} are paid like any unlisted county: ${K.usd(std.lodging)} and ${K.usd(std.mie)}. The standard lodging rose by ${K.usd(std.lodging - std26.lodging)} at the same time, which did not make up for the loss: the room cap dropped by ${K.usd(Math.max(...gone26.lodging) - std.lodging)} and the daily meal allowance by ${K.usd(gone26.mie - std.mie)}.</p>
<p>In money, a three-night trip to Allentown from November 3 to 6, 2025 was worth ${K.usd(before.total, 2)} at the federal maximum. The same three nights from November 2 to 5, 2026 are worth ${K.usd(after.total, 2)}, ${K.usd(before.total - after.total, 2)} less, most of it on meals. A company that kept a travel budget based on last year's Allentown figure should update it; one that books through a tool with a cached rate table should check that the tool knows.</p>
<h3>Hershey carved out of Dauphin County</h3>
<p>Two Pennsylvania lines share one county. GSA lists Hershey as its own area and defines Harrisburg as "${hbg.counties}". The result is a ${K.usd(her.low - hbg.high)} gap in the off months and ${K.usd(her.high - hbg.high)} in ${L(her.highMonths)}, plus a meal tier of ${K.usd(her.mie)} in Hershey against ${K.usd(hbg.mie)} in Harrisburg. Use the address, not the county, for anything near the boundary.</p>
${h.mini('areaTrip', { area: 'Philadelphia, PA', lodging: phlRow.lodging, mie: phlRow.mie })}
<h2>Philadelphia's summer is its cheap season</h2>
<p>The city's FY2027 cap reaches ${K.usd(phl.high)} in ${L(phl.highMonths)}, holds ${K.usd(phlMid)} from ${phlMidMonths[0]} to ${phlMidMonths[phlMidMonths.length - 1]}, and is lowest, ${K.usd(phl.low)}, in ${L(phl.lowMonths)}. Both ends rose from FY2026 (${K.usd(phl.prev!.low)} to ${K.usd(phl.prev!.high)}). Chester County, listed as Malvern, Frazer and Berwyn, had the largest increase among the state's flat-rate lines, from ${K.usd(mal.prev!.high)} to ${K.usd(mal.high)}. Gettysburg went the other way in shape: two values last year, a single ${K.usd(get.high)} now, on the base ${K.usd(get.mie)} tier.</p>
<p>${L(stdOther.slice(0, 4))} were not listed in either year and stay at the standard rate. Gasoline in Pennsylvania is priced on the EIA ${ref.gasArea} series, ${K.usd(ref.gas, 3)} a gallon in the week of ${K.day(K.ENERGY_META.gasWeek)}; the ${h.a('irs-mileage-rate', 'IRS mileage rate page')} explains the ${K.centsWord(K.irs('2026-07-01'))} that applies to the drive.</p>
`,
  faqs: [
    { q: 'Why did Allentown, Pennsylvania lose its per diem rate in FY2027?', a: `GSA removed the Allentown / Easton / Bethlehem area from the FY2027 list, so Lehigh and Northampton counties fall back to the standard rate: ${K.usd(std.lodging)} for lodging and ${K.usd(std.mie)} for M&IE from October 1, 2026. In FY2026 the area paid ${K.usd(Math.max(...gone26.lodging))} and ${K.usd(gone26.mie)}. The FY2027 files record ${K.fy(2027).leftNsa} as the area that left the non-standard list.` },
    { q: 'Is the Hershey, Pennsylvania per diem different from Harrisburg?', a: `Yes. Hershey is its own GSA area, at ${K.usd(her.low)} to ${K.usd(her.high)} a night in FY2027 with ${K.usd(her.mie)} of M&IE. Harrisburg covers the rest of Dauphin County at ${K.usd(hbg.high)} and ${K.usd(hbg.mie)}. In ${L(her.highMonths)} the Hershey cap is ${K.usd(her.high - hbg.high)} higher per night, and ${K.usd(her.low - hbg.high)} higher in the other months. Check which side of the line the hotel is on.` },
    { q: 'When is the Philadelphia, Pennsylvania per diem lowest?', a: `In ${L(phl.lowMonths)}, when the FY2027 lodging cap is ${K.usd(phl.low)} a night. It is ${K.usd(phlMid)} from ${phlMidMonths[0]} to ${phlMidMonths[phlMidMonths.length - 1]} and ${K.usd(phl.high)} in ${L(phl.highMonths)}. The M&IE stays at ${K.usd(phl.mie)}, the top tier, or ${K.usd(phl.mie * share, 2)} on the day you arrive and the day you leave.` },
  ],
  related: ['per-diem-rates', 'home', 'irs-mileage-rate', 'state:new-york', 'state:new-jersey', 'state:ohio'],
});
