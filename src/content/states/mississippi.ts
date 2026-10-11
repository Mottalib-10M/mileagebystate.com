import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import { destIndex, T } from '../../lib/data';
import PLACES from '../../data/places.json';

const sum = K.stateSummary('mississippi');
const ref = K.stateRef('mississippi');
const area = (name: string) => K.nsas('MS').find((n) => n.name === name)!;
const ox = area('Oxford'), stv = area('Starkville'), sh = area('Southaven');
const oxRow = T.dest[destIndex('MS', 'Oxford')].fy['2027'];
const allBase = sum.mieTiers.length === 1 && sum.mieTiers[0] === sum.std.mie;
type Place = [string, string, string, number, number, number];
const rows = (PLACES as { rows: Place[] }).rows.filter((r) => r[1] === 'MS');
const stdRows = rows.filter((r) => r[3] === -1);
const desoto = rows.filter((r) => r[3] === sh.i).map((r) => r[0]);
const share = K.P.mie.partialDayShare;
const oxT = K.trip({ destIndex: destIndex('MS', 'Oxford'), depart: '2026-11-09', ret: '2026-11-12' });
const stdT = K.trip({ destIndex: -1, depart: '2026-11-09', ret: '2026-11-12' });
const gas = K.gas('mississippi');
const rise = (n: { high: number; prev?: { high: number } }) => n.high - (n.prev?.high ?? n.high);

export default defineState({
  slug: 'mississippi',
  dest: 'Oxford',
  title: 'Per Diem Rates Mississippi 2026-27: Oxford and Southaven',
  description: `Mississippi per diem 2026-27: Oxford pays ${K.usd(ox.high)} a night, up ${K.usd(rise(ox))}, Starkville ${K.usd(stv.high)}, Southaven ${K.usd(sh.high)}; all three keep the base ${K.usd(ox.mie)} M&IE, like the rest of the state.`,
  intro: `Mississippi has ${sum.count} GSA areas in FY2027, and not one of them pays more than the base meal allowance.`,
  resume: `Mississippi per diem in FY2027 differs from the standard rate only on lodging. Oxford (Lafayette County) pays ${K.usd(ox.high)} a night, Starkville (Oktibbeha County) ${K.usd(stv.high)} and Southaven (DeSoto County) ${K.usd(sh.high)}, all year round, while every other county takes the standard ${K.usd(sum.std.lodging)}. The M&IE is ${K.usd(sum.std.mie)} everywhere in the state, listed areas included, from October 1, 2026 to September 30, 2027. That makes the gap between a listed and an unlisted county easy to compute: on a three-night trip from November 9 to 12, 2026, Oxford is worth ${K.usd(oxT.total, 2)} at the federal maximum and a standard-rate city such as ${stdRows[0][0]} ${K.usd(stdT.total, 2)}, a difference of exactly ${K.usd(oxT.total - stdT.total)} that comes from the three nights of lodging alone. The calculator above opens on Oxford; any Mississippi city or ZIP code changes it.`,
  body: (h) => `
<h2>Mississippi meals never leave the base tier</h2>
<p>${allBase ? `GSA uses ${K.P.mie.tiers.length} meal tiers for the continental United States, from ${K.usd(K.P.mie.tiers[0])} to ${K.usd(K.P.mie.tiers[K.P.mie.tiers.length - 1])}. All ${sum.count} Mississippi areas are on the lowest, ${K.usd(sum.std.mie)}, the same figure as the standard rate.` : `Mississippi areas use ${K.listOf(sum.mieTiers.map((m) => K.usd(m)))} of M&IE.`} For a traveler, the meal side of a Mississippi claim is the same in Oxford, ${stdRows[0][0]} or a rural county: ${K.usd(sum.std.mie)} for a full day, ${K.usd(sum.std.mie * share, 2)} on the first and last day. The ${h.src('gsa_mie', 'GSA breakdown')} for that tier is ${K.usd(K.tier(sum.std.mie).breakfast)} for breakfast, ${K.usd(K.tier(sum.std.mie).lunch)} for lunch, ${K.usd(K.tier(sum.std.mie).dinner)} for dinner and ${K.usd(K.tier(sum.std.mie).incidentals)} of incidentals, which is what comes off when a conference serves lunch. Only the hotel cap separates one place from another.</p>
<h2>Oxford's rise from FY2026</h2>
<p>Lafayette County moved from ${K.usd(ox.prev!.high)} to ${K.usd(ox.high)}, a gain of ${K.usd(rise(ox))} a night, against ${K.usd(rise(stv))} for Starkville, ${K.usd(rise(sh))} for Southaven and ${K.usd(sum.std.lodging - K.std(2026).lodging)} for the standard rate. Oxford already led the Mississippi list a year ago; the gap with the other two areas has widened, and Oxford is now ${K.usd(ox.high - sum.std.lodging)} above the standard. Since none of the three areas is seasonal, the monthly picker of the mini calculator below shows the same cap in every month; only the number of nights changes the total. A traveler who books a room above the cap pays the difference personally unless the agency or employer approves actual expenses, which under the FTR can reach ${K.pct(K.P.mie.actualExpenseCap)} of the area rate, so Oxford's higher line also raises that ceiling.</p>
${h.mini('areaTrip', { area: 'Oxford, MS', lodging: oxRow.lodging, mie: oxRow.mie })}
<h3>${K.listOf(stdRows.slice(0, 3).map((r) => r[0]))} on the standard rate</h3>
<p>The largest Census places in Mississippi are outside the three listed counties: ${K.listOf(stdRows.slice(0, 5).map((r) => `${r[0]} (${r[2]})`))} all take ${K.usd(sum.std.lodging)} a night. Southaven's area, by contrast, is the whole of DeSoto County, so ${K.listOf(desoto.slice(0, 4))} share its ${K.usd(sh.high)}. Fuel is cheap by national standards: Mississippi is priced in the EIA ${ref.gasArea} series, ${K.usd(gas, 3)} a gallon of regular in the week of ${K.day(K.ENERGY_META.gasWeek)}, against ${K.usd(K.ENERGY_META.usGas, 3)} for the United States. The ${h.a('road-trip-cost-calculator', 'road trip cost calculator')} adds the drive to the per diem.</p>
`,
  faqs: [
    { q: 'What is the M&IE rate in Oxford, Mississippi for FY2027?', a: `${K.usd(ox.mie)} a day, the same as the standard CONUS rate and the same as every other Mississippi location. Oxford's higher per diem comes only from lodging, ${K.usd(ox.high)} a night against the standard ${K.usd(sum.std.lodging)}. On the first and last day of travel the M&IE is ${K.usd(ox.mie * share, 2)}, and provided meals come off at the GSA breakdown.` },
    { q: 'Do Gulfport and Biloxi have a special per diem in Mississippi?', a: `No. Harrison County is not a GSA area in FY2027, so Gulfport and Biloxi take the standard ${K.usd(sum.std.lodging)} for lodging and ${K.usd(sum.std.mie)} for M&IE from October 1, 2026. Only Lafayette, Oktibbeha and DeSoto counties are listed in Mississippi, and all three are flat all year.` },
    { q: 'Is Southaven, Mississippi per diem the same in Olive Branch and Horn Lake?', a: `Yes. The Southaven area covers all of DeSoto County, so ${K.listOf(desoto.slice(0, 4))} share the same FY2027 rate: ${K.usd(sh.high)} a night and ${K.usd(sh.mie)} of M&IE, up from ${K.usd(sh.prev!.high)} of lodging in FY2026. The rate does not change by month, and the M&IE is the same base figure paid in any unlisted county.` },
  ],
  related: ['per-diem-rates', 'home', 'road-trip-cost-calculator', 'state:louisiana', 'state:alabama', 'state:tennessee'],
});
