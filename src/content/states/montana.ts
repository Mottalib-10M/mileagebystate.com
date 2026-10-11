import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import { destIndex, T } from '../../lib/data';
import PLACES from '../../data/places.json';

const sum = K.stateSummary('montana');
const ref = K.stateRef('montana');
const area = (name: string) => K.nsas('MT').find((n) => n.name === name)!;
const big = area('Big Sky / West Yellowstone/Gardiner'), kal = area('Kalispell/Whitefish'), mso = area('Missoula'), hel = area('Helena');
const bigRow = T.dest[destIndex('MT', big.name)].fy['2027'];
const seasonal = sum.list.filter((n) => n.seasonal);
const septAll = seasonal.every((n) => n.highMonths.includes('September'));
type Place = [string, string, string, number, number, number];
const rows = (PLACES as { rows: Place[] }).rows.filter((r) => r[1] === 'MT');
const listed = (county: string) => sum.list.some((n) => n.counties.split(/\s*\/\s*/).some((c) => county.startsWith(c)));
const stdRows = rows.filter((r) => r[3] === -1 && !listed(r[2]));
const share = K.P.mie.partialDayShare;
const cty = sum.list.flatMap((n) => n.counties.split(/\s*\/\s*/));
const bigPrevRow = T.dest[destIndex('MT', big.name)].fy['2026'];
const hl = K.P.highLow['2027'];
const sep = K.trip({ destIndex: destIndex('MT', big.name), depart: '2027-09-13', ret: '2027-09-16' });
const oct = K.trip({ destIndex: destIndex('MT', big.name), depart: '2026-10-11', ret: '2026-10-14' });
const gas = K.gas('montana');

export default defineState({
  slug: 'montana',
  title: 'Per Diem Rates Montana 2026-27: Big Sky, Whitefish, Missoula',
  description: `Montana per diem 2026-27: Big Sky and West Yellowstone peak at ${K.usd(big.high)} a night, ${K.usd(big.high - big.low)} over their off-season ${K.usd(big.low)}; Helena is flat at ${K.usd(hel.high)}, standard ${K.usd(sum.std.lodging)} elsewhere.`,
  intro: `Three of Montana's ${sum.count} GSA areas follow a summer calendar that ${septAll ? 'keeps September at the peak price' : 'ends in late summer'}.`,
  resume: `Montana per diem in FY2027 peaks at ${K.usd(big.high)} a night in the Big Sky / West Yellowstone / Gardiner area (Gallatin and Park counties) in ${K.listOf(big.highMonths)}, and falls to ${K.usd(big.low)} from ${big.lowMonths[0]} to ${big.lowMonths[big.lowMonths.length - 1]}, with ${K.usd(big.mie)} of M&IE. Kalispell and Whitefish (Flathead County) reach ${K.usd(kal.high)}, Missoula ${K.usd(mso.high)}, and Helena is flat at ${K.usd(hel.high)}. All other counties take the standard ${K.usd(sum.std.lodging)} and ${K.usd(sum.std.mie)}. The rates run from October 1, 2026 to September 30, 2027. The step between seasons is sharp: three nights in the Big Sky area from September 13 to 16, 2027 come to ${K.usd(sep.total, 2)} at the federal maximum, while three nights from October 11 to 14, 2026 are capped at ${K.usd(oct.total, 2)}. The calculator above opens on the dearest area; type a Montana town or ZIP code to switch.`,
  body: (h) => `
<h2>${septAll ? 'September still counts as summer in Montana' : 'Montana summer rates'}</h2>
<p>${septAll ? `In each of the ${seasonal.length} seasonal Montana areas, September is billed at the peak.` : ''} Big Sky / West Yellowstone / Gardiner and Missoula use the same calendar, ${K.listOf(big.highMonths)}. Kalispell / Whitefish starts a month later, in ${kal.highMonths[0]}, and keeps June at its low figure of ${K.usd(kal.low)}. October drops straight back to the off-season everywhere, with no shoulder step. That makes the turn of the fiscal year a real price cliff: a crew that worked the last week of September 2026 and the first week of October 2026 in the Big Sky area saw the lodging cap fall from ${K.usd(bigPrevRow.lodging[11])} to ${K.usd(bigRow.lodging[0])} overnight, and the day-by-day table of the calculator shows the change on the right night.</p>
${h.mini('areaTrip', { area: 'Big Sky / West Yellowstone / Gardiner, MT', lodging: bigRow.lodging, mie: bigRow.mie })}
<h2>Big Sky's winter rate went down</h2>
<p>In the Big Sky area the two seasons moved in opposite directions. The summer peak rose from ${K.usd(big.prev!.high)} to ${K.usd(big.high)}, but the off-season maximum fell from ${K.usd(big.prev!.low)} to ${K.usd(big.low)}. A winter assignment in Gallatin or Park County is therefore capped ${K.usd(big.prev!.low - big.low)} a night lower than a year ago, while the standard rate gained ${K.usd(sum.std.lodging - K.std(2026).lodging)}. Kalispell rose from ${K.usd(kal.prev!.high)} to ${K.usd(kal.high)} at the top, Missoula from ${K.usd(mso.prev!.high)} to ${K.usd(mso.high)}, and Helena from ${K.usd(hel.prev!.high)} to ${K.usd(hel.high)} all year. Big Sky and Kalispell sit on the ${K.usd(big.mie)} meal tier, Missoula and Helena on ${K.usd(mso.mie)}.</p>
<h3>${stdRows.slice(0, 3).map((r) => r[0]).join(', ')} and the high-low list</h3>
<p>${K.listOf(stdRows.slice(0, 3).map((r) => `${r[0]} (${r[2]})`))} have no GSA area and take ${K.usd(sum.std.lodging)} and ${K.usd(sum.std.mie)}. Employers that use the IRS ${h.a('high-low-per-diem-method', 'high-low method')} should note that the Big Sky summer total, ${K.usd(big.high + big.mie)} a day, is above the ${K.usd(hl.threshold)} mark that puts a locality on the high-cost list for part of the year, so the ${K.usd(hl.high)} rate of ${hl.notice} can apply there during the listed months. Fuel adds to the cost of long Montana drives: the EIA ${ref.gasArea} average was ${K.usd(gas, 3)} a gallon in the week of ${K.day(K.ENERGY_META.gasWeek)}, ${gas > K.ENERGY_META.usGas ? 'above' : 'below'} the national ${K.usd(K.ENERGY_META.usGas, 3)}.</p>
${h.mini('fuelLeg', { label: `${ref.gasArea} (Montana)`, price: gas })}
`,
  faqs: [
    { q: 'When does the Big Sky, Montana per diem peak in FY2027?', a: `In ${K.listOf(big.highMonths)} 2027, at ${K.usd(big.high)} a night for Gallatin and Park counties. From ${big.lowMonths[0]} 2026 to ${big.lowMonths[big.lowMonths.length - 1]} 2027 the maximum is ${K.usd(big.low)}. The M&IE is ${K.usd(big.mie)} a day all year, ${K.usd(big.mie * share, 2)} on the first and last day of the trip.` },
    { q: 'Is the Whitefish, Montana per diem higher in June?', a: `No. Flathead County (Kalispell / Whitefish) pays its summer maximum of ${K.usd(kal.high)} only in ${K.listOf(kal.highMonths)}. June stays at ${K.usd(kal.low)}, the same as winter. That differs from Missoula and the Big Sky area, where June is already at the peak. The M&IE is ${K.usd(kal.mie)} in every month.` },
    { q: `What per diem applies in ${stdRows[0][0]}, Montana?`, a: `The standard CONUS rate. ${stdRows[0][2]} is not a GSA area, so ${stdRows[0][0]} pays ${K.usd(sum.std.lodging)} for lodging and ${K.usd(sum.std.mie)} for M&IE in FY2027, with no seasonal change. Only ${K.listOf(cty)} counties have a higher Montana rate. The standard was ${K.usd(K.std(2026).lodging)} in FY2026.` },
  ],
  related: ['per-diem-rates', 'home', 'high-low-per-diem-method', 'gas-cost-calculator', 'state:idaho', 'state:wyoming'],
});
