import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import { destIndex, T } from '../../lib/data';
import PLACES from '../../data/places.json';

const sum = K.stateSummary('missouri');
const ref = K.stateRef('missouri');
const area = (name: string) => K.nsas('MO').find((n) => n.name === name)!;
const stl = area('St. Louis'), kc = area('Kansas City');
const ks = K.nsas('KS')[0];
const stlRow = T.dest[destIndex('MO', 'St. Louis')].fy['2027'];
type Place = [string, string, string, number, number, number];
const rows = (PLACES as { rows: Place[] }).rows.filter((r) => r[1] === 'MO');
const stdRows = rows.filter((r) => r[3] === -1);
const stlTowns = rows.filter((r) => r[3] === stl.i).map((r) => r[0]);
const kcTowns = rows.filter((r) => r[3] === kc.i).map((r) => r[0]);
const share = K.P.mie.partialDayShare;
const days = 5;
const stlT = K.trip({ destIndex: destIndex('MO', 'St. Louis'), depart: '2027-06-07', ret: '2027-06-11' });
const kcT = K.trip({ destIndex: destIndex('MO', 'Kansas City'), depart: '2027-06-07', ret: '2027-06-11' });
const diesel = ref.diesel, tr = K.P.transportation;

export default defineState({
  slug: 'missouri',
  dest: 'St. Louis',
  title: 'Per Diem Rates Missouri 2026-27: St. Louis and Kansas City',
  description: `Missouri per diem rates for 2026-27: St. Louis at ${K.usd(stl.high)} a night with ${K.usd(stl.mie)} M&IE, Kansas City ${K.usd(kc.high)} with ${K.usd(kc.mie)}, and ${K.usd(sum.std.lodging)} plus ${K.usd(sum.std.mie)} in every other Missouri county.`,
  intro: `Missouri's two GSA areas are its two big metros, and they sit on different meal tiers.`,
  resume: `Missouri per diem in FY2027 has two lines above the standard. St. Louis, which covers St. Louis County, St. Louis City and St. Charles County, pays ${K.usd(stl.high)} a night and ${K.usd(stl.mie)} of M&IE. Kansas City, for ${K.listOf(kc.counties.split(' / '))} counties, pays ${K.usd(kc.high)} and ${K.usd(kc.mie)}. Neither changes by month. Every other county, including those of ${stdRows[0][0]}, ${stdRows[1][0]} and ${stdRows[4]?.[0] ?? stdRows[2][0]}, takes the standard ${K.usd(sum.std.lodging)} and ${K.usd(sum.std.mie)}. The rates run from October 1, 2026 to September 30, 2027. On a Monday-to-Friday trip from June 7 to 11, 2027, St. Louis is worth ${K.usd(stlT.total, 2)} at the federal maximum and Kansas City ${K.usd(kcT.total, 2)}, a gap of ${K.usd(stlT.total - kcT.total, 2)}, split between ${K.usd(stlT.lodging - kcT.lodging)} of lodging and ${K.usd(stlT.mie - kcT.mie, 2)} of meals. The calculator above opens on St. Louis; type a Missouri city or ZIP code to switch.`,
  body: (h) => `
<h2>St. Louis sits one meal tier above Kansas City</h2>
<p>Lodging in the two metros differs by ${K.usd(stl.high - kc.high)} a night, but the meal tier is where the claim drifts apart over a long assignment. St. Louis is on ${K.usd(stl.mie)}, Kansas City on ${K.usd(kc.mie)}. Over ${days} travel days, with the first and last at ${K.pct(share)}, the M&IE gap reaches ${K.usd((stl.mie - kc.mie) * (2 * share + days - 2), 2)}. The ${h.src('gsa_mie', 'GSA breakdown')} also changes what comes off for a provided dinner: ${K.usd(K.tier(stl.mie).dinner)} in St. Louis, ${K.usd(K.tier(kc.mie).dinner)} in Kansas City. This year St. Louis gained ${K.usd(stl.high - stl.prev!.high)} on lodging, from ${K.usd(stl.prev!.high)}, and Kansas City ${K.usd(kc.high - kc.prev!.high)}, from ${K.usd(kc.prev!.high)}.</p>
${h.mini('areaTrip', { area: 'St. Louis, MO', lodging: stlRow.lodging, mie: stlRow.mie })}
<h2>A county and a city, filed as one area</h2>
<p>GSA names St. Louis County and St. Louis City separately in the county column, then joins them in one area with St. Charles County. In practice the rate is the same in ${K.listOf(stlTowns.slice(0, 4))}. At the other end of the state, ${K.listOf(kcTowns.slice(0, 4))} take the Kansas City figure. ${ks.high === kc.high && ks.mie === kc.mie ? `The Kansas line across the state border, ${ks.name}, carries the identical ${K.usd(ks.high)} and ${K.usd(ks.mie)}, so the ${h.a('state:kansas', 'Kansas page')} reads the same numbers from the other bank.` : `The Kansas line across the border pays ${K.usd(ks.high)} and ${K.usd(ks.mie)}; see the ${h.a('state:kansas', 'Kansas page')}.`}</p>
<h3>${K.listOf(stdRows.slice(0, 3).map((r) => r[0]))}: no line of their own</h3>
<p>${K.listOf(stdRows.slice(0, 5).map((r) => `${r[0]} (${r[2]})`))} are among the larger Missouri cities without an area, so they get ${K.usd(sum.std.lodging)} and ${K.usd(sum.std.mie)}. Diesel in the EIA ${ref.dieselArea} series cost ${K.usd(diesel, 3)} a gallon in the week of ${K.day(K.ENERGY_META.gasWeek)}, against ${K.usd(K.ENERGY_META.usDiesel, 3)} nationally. Drivers in the transportation industry do not use the GSA table for meals: the IRS special rate is ${K.usd(tr.conus)} a day anywhere in the continental United States, with ${K.pct(tr.hoursOfServiceDeductible)} deductible for workers under hours-of-service rules. The ${h.a('per-diem-for-truck-drivers', 'truck driver per diem page')} works through a year of those days, including the ${K.usd(tr.incidentalsOnly)} incidentals-only rate for days with no meal cost.</p>
`,
  faqs: [
    { q: 'Why is the St. Louis, Missouri M&IE higher than Kansas City?', a: `GSA places each area on one of ${K.P.mie.tiers.length} meal tiers. For FY2027 St. Louis is on ${K.usd(stl.mie)} and Kansas City on ${K.usd(kc.mie)}. The difference is ${K.usd(stl.mie - kc.mie)} on a full day and ${K.usd((stl.mie - kc.mie) * share, 2)} on a travel day. Lodging is ${K.usd(stl.high)} and ${K.usd(kc.high)} respectively, flat all year.` },
    { q: 'Does St. Charles, Missouri get the St. Louis per diem?', a: `Yes. St. Charles County is part of the St. Louis GSA area along with St. Louis County and St. Louis City, so St. Charles, O'Fallon and St. Peters are paid ${K.usd(stl.high)} a night and ${K.usd(stl.mie)} of M&IE in FY2027. Jefferson and Franklin counties are not listed and take the standard ${K.usd(sum.std.lodging)} and ${K.usd(sum.std.mie)}.` },
    { q: 'What per diem applies in Springfield or Columbia, Missouri?', a: `The standard CONUS rate. ${stdRows[0][2]} (${stdRows[0][0]}) and ${stdRows[1][2]} (${stdRows[1][0]}) are not GSA areas, so a trip there in FY2027 pays ${K.usd(sum.std.lodging)} of lodging and ${K.usd(sum.std.mie)} of M&IE a day, ${K.usd(sum.std.mie * share, 2)} on the first and last day. Only the St. Louis and Kansas City areas are higher in Missouri.` },
  ],
  related: ['per-diem-rates', 'home', 'per-diem-for-truck-drivers', 'state:kansas', 'state:illinois', 'state:iowa'],
});
