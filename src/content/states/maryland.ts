import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import { destIndex, T } from '../../lib/data';
import PLACES from '../../data/places.json';

const sum = K.stateSummary('maryland');
const ref = K.stateRef('maryland');
const area = (name: string) => K.nsas('MD').find((n) => n.name === name)!;
const oc = area('Ocean City'), dc = area('District of Columbia'), bal = area('Baltimore City'), col = area('Columbia'), ann = area('Annapolis'), cam = area('Cambridge / St. Michaels');
const ocRow = T.dest[destIndex('MD', 'Ocean City')].fy['2027'];
const dcRow = T.dest[destIndex('MD', 'District of Columbia')].fy['2027'];
const ocOverDc = K.MONTHS_FY.filter((_, m) => ocRow.lodging[m] > dcRow.lodging[m]);
const mdCounties = (dc.counties.match(/;\s*and the counties of (.+?) in Maryland/) ?? [])[1] ?? "Montgomery and Prince George's";
type Place = [string, string, string, number, number, number];
const rows = (PLACES as { rows: Place[] }).rows.filter((r) => r[1] === 'MD');
const dcTowns = rows.filter((r) => r[2] === 'Montgomery County' || r[2] === "Prince George's County").map((r) => r[0]);
const stdRows = rows.filter((r) => r[3] === -1);
const share = K.P.mie.partialDayShare;
const rock = K.trip({ destIndex: destIndex('MD', 'District of Columbia'), depart: '2027-04-19', ret: '2027-04-22' });
const balT = K.trip({ destIndex: destIndex('MD', 'Baltimore City'), depart: '2027-04-19', ret: '2027-04-22' });
const gas = K.gas('maryland');

export default defineState({
  slug: 'maryland',
  dest: 'Baltimore City',
  title: 'Per Diem Rates Maryland 2026-27: DC Suburbs and Ocean City',
  description: `Maryland per diem 2026-27: ${sum.count} GSA areas on ${sum.mieTiers.length} M&IE tiers; Ocean City peaks at ${K.usd(oc.high)} in summer, Baltimore City is ${K.usd(bal.high)}, the DC suburbs up to ${K.usd(dc.high)} a night.`,
  intro: `Two Maryland counties are paid as part of Washington, DC, and Ocean City outranks them for part of the year.`,
  resume: `Maryland per diem in FY2027 spans ${sum.count} GSA areas and ${sum.mieTiers.length} meal tiers. ${mdCounties} counties belong to the District of Columbia area, at ${K.usd(dc.low)} to ${K.usd(dc.high)} a night with ${K.usd(dc.mie)} of M&IE. Baltimore City pays ${K.usd(bal.high)} all year with ${K.usd(bal.mie)}, Ocean City ${K.usd(oc.high)} in ${K.listOf(oc.highMonths)}, Annapolis up to ${K.usd(ann.high)}. Counties without a listing take the standard ${K.usd(sum.std.lodging)} and ${K.usd(sum.std.mie)}, all from October 1, 2026 to September 30, 2027. Where the meeting sits changes the claim even inside one metro: three nights from April 19 to 22, 2027 come to ${K.usd(rock.total, 2)} at the federal maximum in ${dcTowns[0]} or ${dcTowns[1]} under the DC rate, and ${K.usd(balT.total, 2)} in Baltimore. The calculator above opens on Baltimore City; switch to any Maryland ZIP code to test another site.`,
  body: (h) => `
<h2>${mdCounties} counties ride on the Washington rate</h2>
<p>GSA does not give the Maryland suburbs of the capital a line of their own. The District of Columbia area is written as Washington plus three Virginia cities, two Virginia counties, and the counties of ${mdCounties} in Maryland, so ${K.listOf(dcTowns.slice(0, 4))} are paid exactly as a downtown hotel would be: ${K.usd(dc.high)} in ${K.listOf(dc.highMonths)}, ${K.usd(dcRow.lodging[0])} in October and September, ${K.usd(dcRow.lodging[1])} from November to February and ${K.usd(dc.low)} in ${K.listOf(dc.lowMonths)}. The meal allowance is ${K.usd(dc.mie)}, the top tier. Howard and Anne Arundel counties have their own lines, much lower, so the county of the duty station is worth checking before a team books rooms near a county line.</p>
<h2>Ocean City outranks the capital ${ocOverDc.length === 3 ? 'for three months' : 'in summer'}</h2>
<p>In ${K.listOf(ocOverDc)} the Worcester County area pays ${K.usd(oc.high)} a night, more than the DC area pays in any month of the year, its own top being ${K.usd(dc.high)}. That makes Ocean City the dearest Maryland line on the strip at the top of this page. The other ${12 - oc.highMonths.length} months tell another story: ${K.usd(oc.low)}, only ${K.usd(oc.low - sum.std.lodging)} above the standard. The off-season figure did not change from FY2026, while the summer figure rose from ${K.usd(oc.prev!.high)}. Cambridge and St. Michaels follow the same summer pattern on a smaller scale, ${K.usd(cam.low)} to ${K.usd(cam.high)}.</p>
${h.mini('areaTrip', { area: 'Ocean City, MD', lodging: ocRow.lodging, mie: ocRow.mie })}
<h3>Howard County: a modest room, a generous meal rate</h3>
<p>Columbia is the odd line in the Maryland file. Its lodging maximum is ${K.usd(col.high)}, ${K.usd(col.high - sum.std.lodging)} above the standard, yet its M&IE is ${K.usd(col.mie)}, the same as Baltimore City and above Annapolis at ${K.usd(ann.mie)}. On a five-day trip the meals alone come to ${K.usd(col.mie * (2 * share + 3), 2)} in Columbia against ${K.usd(sum.std.mie * (2 * share + 3), 2)} at the standard rate. Baltimore City posted the largest rise of any flat Maryland area, from ${K.usd(bal.prev!.high)} to ${K.usd(bal.high)}. ${K.listOf(stdRows.slice(0, 3).map((r) => `${r[0]} (${r[2]})`))} have no line and take the standard ${K.usd(sum.std.lodging)}. Drivers pay the ${ref.gasArea} price: ${K.usd(gas, 3)} a gallon in the EIA survey of ${K.day(K.ENERGY_META.gasWeek)}. The ${h.a('state:district-of-columbia', 'District of Columbia page')} covers the same capital area seen from the city.</p>
`,
  faqs: [
    { q: 'Do Montgomery and Prince George\'s counties in Maryland use the DC per diem?', a: `Yes. GSA includes both counties in the District of Columbia area, so ${K.listOf(dcTowns.slice(0, 5))} get ${K.usd(dc.low)} to ${K.usd(dc.high)} of lodging depending on the month and ${K.usd(dc.mie)} of M&IE in FY2027. There is no separate Maryland line for them; any ZIP code in either county returns the DC rate.` },
    { q: 'What is the Ocean City, Maryland per diem outside summer?', a: `${K.usd(oc.low)} a night from ${oc.lowMonths[0]} to ${oc.lowMonths[oc.lowMonths.length - 2]} and again in ${oc.lowMonths[oc.lowMonths.length - 1]}, with ${K.usd(oc.mie)} of M&IE. Only ${K.listOf(oc.highMonths)} pay the summer maximum of ${K.usd(oc.high)}. The off-season figure is the same as in FY2026, while the standard rate rose to ${K.usd(sum.std.lodging)}, so the gap between the two narrowed to ${K.usd(oc.low - sum.std.lodging)} a night.` },
    { q: 'How much did the Baltimore City per diem rise in Maryland for FY2027?', a: `From ${K.usd(bal.prev!.high)} to ${K.usd(bal.high)} a night, ${K.usd(bal.high - bal.prev!.high)} more, effective October 1, 2026. The M&IE stays at ${K.usd(bal.mie)}. The rate covers Baltimore City only; Baltimore County is not listed by GSA and takes the standard ${K.usd(sum.std.lodging)} and ${K.usd(sum.std.mie)}. Check the street address: a hotel in Baltimore County is capped ${K.usd(bal.high - sum.std.lodging)} less a night.` },
  ],
  related: ['per-diem-rates', 'home', 'state:district-of-columbia', 'state:virginia', 'state:delaware', 'first-and-last-day-per-diem'],
});
