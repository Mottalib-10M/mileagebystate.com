import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import { destIndex, T } from '../../lib/data';
import PLACES from '../../data/places.json';

const sum = K.stateSummary('kansas');
const ref = K.stateRef('kansas');
const kc = sum.list[0];
const kcRow = T.dest[destIndex('KS', kc.name)].fy['2027'];
const mo = K.nsas('MO').find((n) => n.name === 'Kansas City')!;
const sameAsMo = mo.high === kc.high && mo.mie === kc.mie;
const std26 = K.std(2026);
type Place = [string, string, string, number, number, number];
const rows = (PLACES as { rows: Place[] }).rows.filter((r) => r[1] === 'KS');
const inArea = rows.filter((r) => r[3] >= 0);
const stdRows = rows.filter((r) => r[3] === -1);
const ex = K.trip({ destIndex: destIndex('KS', kc.name), depart: '2027-01-11', ret: '2027-01-14' });
const exStd = K.trip({ destIndex: -1, depart: '2027-01-11', ret: '2027-01-14' });
const elec = K.elec('kansas');

export default defineState({
  slug: 'kansas',
  title: 'Per Diem Rates Kansas 2026-27: Overland Park and the Rest',
  description: `Kansas per diem for 2026-27: one GSA area, ${kc.name}, at ${K.usd(kc.high)} a night and ${K.usd(kc.mie)} M&IE; ${stdRows[0][0]} and every other county take ${K.usd(sum.std.lodging)} plus ${K.usd(sum.std.mie)}.`,
  intro: `Kansas has a single non-standard GSA area in FY2027, the three counties around Overland Park and Kansas City, Kansas.`,
  resume: `Kansas per diem in FY2027 comes down to one line: ${kc.name}, covering ${K.listOf(kc.counties.split(' / '))} counties, pays ${K.usd(kc.high)} of lodging and ${K.usd(kc.mie)} of M&IE a day, and the rest of the state takes the standard ${K.usd(sum.std.lodging)} and ${K.usd(sum.std.mie)}. Both apply from October 1, 2026 to September 30, 2027, with no seasonal variation. That keeps a Kansas budget simple: a traveler needs to know only whether the work site falls in those three counties. A three-night stay in Overland Park from January 11 to 14, 2027 comes to ${K.usd(ex.total, 2)} at the federal maximum; the same trip to ${stdRows[0][0]} or ${stdRows[1][0]} is capped at ${K.usd(exStd.total, 2)}. Of the ${K.usd(ex.total - exStd.total, 2)} difference, ${K.usd(ex.lodging - exStd.lodging)} comes from the room and the rest from the higher meal tier. The calculator above is preset on ${kc.name}; any Kansas ZIP code switches it.`,
  body: (h) => `
<h2>One Kansas line, three counties</h2>
<p>GSA lists ${K.listOf(kc.counties.split(' / '))} counties together. In the Census list of places with 15,000 people or more, ${inArea.length} of the ${rows.length} Kansas places fall in them, from ${K.listOf(inArea.slice(0, 4).map((r) => r[0]))} to smaller suburbs. Leavenworth County is part of the area as well, so a visit to a site in the city of Leavenworth is paid at the metropolitan rate, not the standard one. The rate rose from ${K.usd(kc.prev!.high)} to ${K.usd(kc.high)} between FY2026 and FY2027, ${K.usd(kc.high - kc.prev!.high)} more, while the standard rate gained ${K.usd(sum.std.lodging - std26.lodging)}.</p>
${h.mini('areaTrip', { area: `${kc.name}, KS`, lodging: kcRow.lodging, mie: kcRow.mie })}
<h2>The Missouri side of the same metro</h2>
<p>Kansas City, Missouri has its own GSA line under Missouri, built from ${K.listOf(mo.counties.split(' / '))} counties. ${sameAsMo ? `Its FY2027 figures match the Kansas line exactly: ${K.usd(mo.high)} of lodging and ${K.usd(mo.mie)} of M&IE. A team that sleeps on one bank and works on the other therefore claims the same amount whichever hotel it picks, and a split stay does not need two rates on the voucher.` : `Its FY2027 figures differ from the Kansas line: ${K.usd(mo.high)} of lodging and ${K.usd(mo.mie)} of M&IE, so the hotel address decides the rate.`} Under the ${h.src('ftr_301_11', 'FTR')} the rate is set by the place of duty, so a cross-river assignment only needs care when the two lines disagree. The ${h.a('state:missouri', 'Missouri page')} covers St. Louis, which sits on a higher meal tier.</p>
<h3>${K.listOf(stdRows.slice(0, 3).map((r) => r[0]))}: the standard rate applies</h3>
<p>Every other Kansas county, including ${K.listOf(stdRows.slice(0, 3).map((r) => `${r[2]} (${r[0]})`))}, takes ${K.usd(sum.std.lodging)} for a room and ${K.usd(sum.std.mie)} for meals in FY2027. The first and last day of a trip pay ${K.usd(sum.std.mie * K.P.mie.partialDayShare, 2)} of M&IE. If you drive an electric car between these cities, Kansas residential power averaged ${K.cents(elec)} per kWh from ${K.ENERGY_META.elecPeriod} in the EIA series, against ${K.cents(K.ENERGY_META.usElecCents)} for the country.</p>
${h.mini('evCharge', { label: 'Kansas', cents: elec })}
<h3>Private employers on the high-low method</h3>
<p>A company that reimburses with the IRS ${h.a('high-low-per-diem-method', 'high-low method')} does not look up the GSA table at all. It needs to know only whether a place is on the high-cost list, which takes localities whose federal per diem reaches ${K.usd(K.P.highLow['2027'].threshold)} for part of the year. The best Kansas figure, ${K.usd(kc.high + kc.mie)} a day in ${kc.name}, falls well short, so a Kansas trip under ${K.P.highLow['2027'].notice} is paid at the low rate of ${K.usd(K.P.highLow['2027'].low)}, of which ${K.usd(K.P.highLow['2027'].mieLow)} counts as meals. That is more than the GSA total in any Kansas county.</p>
<p>The ${h.a('ev-charging-cost-calculator', 'EV charging cost calculator')} compares that home charging cost with the ${K.centsWord(K.irs('2026-10-01'))} mileage rate an employer may pay.</p>
`,
  faqs: [
    { q: 'Does Wichita, Kansas have a special per diem rate for FY2027?', a: `No. ${stdRows[0][2]} is not listed by GSA, so ${stdRows[0][0]} takes the standard CONUS rate of ${K.usd(sum.std.lodging)} for lodging and ${K.usd(sum.std.mie)} for meals and incidentals from October 1, 2026. Only ${K.listOf(kc.counties.split(' / '))} counties have a higher Kansas rate. A higher hotel bill in ${stdRows[0][0]} needs actual-expense approval to be repaid.` },
    { q: 'Is the per diem in Overland Park, Kansas the same as in Kansas City, Missouri?', a: sameAsMo ? `Yes, for FY2027. Both GSA areas pay ${K.usd(kc.high)} a night and ${K.usd(kc.mie)} of M&IE, the Kansas one for ${K.listOf(kc.counties.split(' / '))} counties and the Missouri one for ${K.listOf(mo.counties.split(' / '))} counties. Neither changes by season, so a stay that crosses the state line keeps the same daily maximum on both sides.` : `No. In FY2027 the Kansas area pays ${K.usd(kc.high)} and ${K.usd(kc.mie)}, the Missouri area ${K.usd(mo.high)} and ${K.usd(mo.mie)}. The duty location sets the rate, so check it before booking.` },
    { q: 'How much is a day trip per diem in Kansas when I do not stay overnight?', a: `Federal rules pay M&IE on a same-day trip only when it lasts more than ${K.P.mie.travelMinHours} hours, and then at ${K.pct(K.P.mie.partialDayShare)} of the daily rate: ${K.usd(sum.std.mie * K.P.mie.partialDayShare, 2)} in a standard Kansas county, ${K.usd(kc.mie * K.P.mie.partialDayShare, 2)} around Overland Park. Private employers write their own day-trip rule, so read your policy before you claim.` },
  ],
  related: ['per-diem-rates', 'home', 'ev-charging-cost-calculator', 'high-low-per-diem-method', 'state:missouri', 'state:nebraska'],
});
