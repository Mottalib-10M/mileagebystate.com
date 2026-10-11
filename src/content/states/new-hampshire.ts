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
const sum = K.stateSummary('new-hampshire');
const ref = K.stateRef('new-hampshire');
const at = (name: string) => sum.list.find((n) => n.name === name)!;
const lac = at('Laconia'), leb = at('Lebanon / Lincoln / West Lebanon'), pts = at('Portsmouth'), con = at('Conway'), dur = at('Durham'), man = at('Manchester'), cnc = at('Concord');
const lacRow = T.dest[lac.i].fy['2027'];
const seasonal = sum.list.filter((n) => n.seasonal);
const octPeak = seasonal.filter((n) => n.highMonths.includes('October'));
const std = sum.std;
const places = (PLACES as { rows: Array<[string, string, string, number, number, number]> }).rows.filter((r) => r[1] === 'NH');
const keene = places.find((r) => r[0] === 'Keene');
const july = K.trip({ destIndex: destIndex('NH', 'Laconia'), depart: '2027-07-12', ret: '2027-07-15' });
const nov = K.trip({ destIndex: destIndex('NH', 'Laconia'), depart: '2026-11-09', ret: '2026-11-12' });
const share = K.P.mie.partialDayShare;
const elec = K.elec('new-hampshire'), usElec = K.ENERGY_META.usElecCents;
const ev = K.ev('2027 Chevrolet Equinox EV AWD');

export default defineState({
  slug: 'new-hampshire',
  title: 'Per Diem Rates New Hampshire 2026-27: Seasonal GSA Areas',
  description: `New Hampshire per diem 2026-27: ${sum.count} GSA areas in FY2027, ${seasonal.length} of them seasonal; Laconia tops out at ${K.usd(lac.high)} a night, Concord stays at ${K.usd(cnc.high)} all year, standard ${K.usd(std.lodging)}.`,
  intro: `In New Hampshire, ${seasonal.length} of the ${sum.count} GSA areas change price with the season, and ${octPeak.length} of them keep their summer cap through October.`,
  resume: `New Hampshire has ${sum.count} GSA per diem areas in FY2027, and the cap you get depends heavily on the month. Laconia (Belknap County) pays ${K.usd(lac.high)} a night in ${L(lac.highMonths)} and ${K.usd(lac.low)} from ${lac.lowMonths[0]} to ${lac.lowMonths[lac.lowMonths.length - 1]}; Lebanon, Portsmouth and Conway follow the same calendar at lower amounts. Only Manchester (${K.usd(man.high)}) and Concord (${K.usd(cnc.high)}) hold one value all year. Meals are ${K.usd(lac.mie)} a day in every area except Conway, at ${K.usd(con.mie)}, and counties GSA does not name get ${K.usd(std.lodging)} plus ${K.usd(std.mie)}. Three nights in Laconia from July 12 to 15, 2027 come to ${K.usd(july.total, 2)} at the federal maximum; the same length of stay from November 9 to 12, 2026 comes to ${K.usd(nov.total, 2)}. The calculator above opens on ${sum.top!.name}; enter a New Hampshire town or ZIP code to change it.`,
  body: (h) => `
<h2>October still counts as high season</h2>
<p>For Laconia, Lebanon, Portsmouth and Conway, the expensive part of FY2027 is ${L(lac.highMonths)}. The cap falls on November 1 and does not rise again until June, so the first month of the federal fiscal year is paid at summer prices. Durham (Strafford County) is the exception among the seasonal lines: its peak of ${K.usd(dur.high)} lasts only ${L(dur.highMonths)}, and September already drops back to ${K.usd(dur.low)}. An auditor planning a visit to Durham in early fall gains nothing by waiting; one heading to Laconia gains ${K.usd(lac.high - lac.low)} a night by moving the trip from October to November.</p>
<h3>Portsmouth, the one top cap that went down</h3>
<p>Every New Hampshire area received a higher peak for FY2027 except Rockingham County. Portsmouth's summer and October cap went from ${K.usd(pts.prev!.high)} to ${K.usd(pts.high)}, while its off-season value stayed at ${K.usd(pts.low)}. Lebanon, by contrast, rose from ${K.usd(leb.prev!.high)} to ${K.usd(leb.high)} at the top, and Conway from ${K.usd(con.prev!.high)} to ${K.usd(con.high)}.</p>
<h3>Conway: lower rooms, richer meals</h3>
<p>The Conway line covers Carroll County, which the GSA file spells "${con.counties}". Its lodging stays below Laconia's in every month, yet it is the only New Hampshire area on the ${K.usd(con.mie)} M&IE tier. On a five-night stay, that extra ${K.usd(con.mie - lac.mie)} a day adds ${K.usd((con.mie - lac.mie) * (4 + 2 * share), 2)} to the meal allowance compared with Laconia.</p>
${h.mini('areaTrip', { area: 'Laconia, NH', lodging: lacRow.lodging, mie: lacRow.mie })}
<h2>Keene and the unlisted counties</h2>
<p>${keene ? `Keene, in ${keene[2]}, is the largest town in the Census file that falls outside every New Hampshire GSA area.` : 'Cheshire County has no GSA line.'} A trip there is paid at ${K.usd(std.lodging)} and ${K.usd(std.mie)} in every month, with no seasonal bump.</p>
<h2>Charging an EV at New Hampshire electricity prices</h2>
<p>Residential power cost ${K.cents(elec)} per kWh in New Hampshire over ${K.ENERGY_META.elecPeriod}, the EIA reports, against ${K.cents(usElec)} for the country. For the ${ev.label}, rated by the EPA at ${K.num(ev.kwh100, 1)} kWh per 100 miles, that is ${K.usd((ev.kwh100 * elec) / 100, 2)} of home charging per 100 miles. Gasoline is read from the ${ref.gasArea} series: ${K.usd(ref.gas, 3)} a gallon in the week of ${K.day(K.ENERGY_META.gasWeek)}. The ${h.a('gas-vs-electric-car-calculator', 'gas versus electric comparison')} weighs both with your own mileage.</p>
${h.mini('evCharge', { label: 'New Hampshire', cents: elec, kwh100: ev.kwh100 })}
`,
  faqs: [
    { q: 'Why is the Laconia, New Hampshire per diem higher in October than in November?', a: `GSA keeps Belknap County at its peak cap of ${K.usd(lac.high)} in ${L(lac.highMonths)}, then lowers it to ${K.usd(lac.low)} from ${lac.lowMonths[0]} to ${lac.lowMonths[lac.lowMonths.length - 1]}. October is therefore paid like summer. Moving a three-night stay from late October into November cuts the lodging cap by ${K.usd(3 * (lac.high - lac.low))} at the FY2027 rates.` },
    { q: 'What is the FY2027 per diem for Manchester, New Hampshire?', a: `Hillsborough County, listed as Manchester, has a flat ${K.usd(man.high)} lodging cap in every month of FY2027 and ${K.usd(man.mie)} of M&IE, or ${K.usd(man.mie * share, 2)} on the first and last day. It rose from ${K.usd(man.prev!.high)} in FY2026. The rates apply from October 1, 2026 to September 30, 2027.` },
    { q: 'Which New Hampshire area has the highest M&IE in FY2027?', a: `Conway, which covers Carroll County, at ${K.usd(con.mie)} a day. The other ${sum.count - 1} areas are on the ${K.usd(lac.mie)} tier, and the rest of the state takes the standard ${K.usd(std.mie)}. The tier sets the breakfast, lunch and dinner amounts deducted when a meal is provided, so Conway deducts slightly more per meal too.` },
  ],
  related: ['per-diem-rates', 'home', 'gas-vs-electric-car-calculator', 'state:vermont', 'state:maine', 'state:massachusetts'],
});
