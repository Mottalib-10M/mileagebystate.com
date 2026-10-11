import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import { destIndex, T } from '../../lib/data';
import PLACES from '../../data/places.json';

const sum = K.stateSummary('minnesota');
const ref = K.stateRef('minnesota');
const area = (name: string) => K.nsas('MN').find((n) => n.name === name)!;
const dul = area('Duluth'), tw = area('Minneapolis / St. Paul'), roc = area('Rochester');
const dulRow = T.dest[destIndex('MN', 'Duluth')].fy;
const unchanged = dulRow['2027'].lodging.every((v, m) => v === dulRow['2026'].lodging[m]) && dulRow['2027'].mie === dulRow['2026'].mie;
type Place = [string, string, string, number, number, number];
const rows = (PLACES as { rows: Place[] }).rows.filter((r) => r[1] === 'MN');
const listed = (county: string) => sum.list.some((n) => n.counties.split(' / ').some((c) => county.startsWith(c)));
const stdRows = rows.filter((r) => r[3] === -1 && !listed(r[2]));
const share = K.P.mie.partialDayShare;
const bl = rows.find((r) => r[0] === 'Bloomington')!, wo = rows.find((r) => r[0] === 'Woodbury')!;
const msp = K.trip({ destIndex: destIndex('MN', 'Minneapolis / St. Paul'), depart: '2027-02-08', ret: '2027-02-11' });
const dulT = K.trip({ destIndex: destIndex('MN', 'Duluth'), depart: '2027-02-08', ret: '2027-02-11' });
const gas = K.gas('minnesota'), midwest = K.gas('iowa');

export default defineState({
  slug: 'minnesota',
  dest: 'Minneapolis / St. Paul',
  title: 'Per Diem Rates Minnesota 2026-27: Twin Cities and Duluth',
  description: `Minnesota per diem rates 2026-27: Minneapolis / St. Paul at ${K.usd(tw.high)} with ${K.usd(tw.mie)} M&IE, Duluth ${K.usd(dul.low)} to ${K.usd(dul.high)} by season, Rochester ${K.usd(roc.high)}; ${K.usd(sum.std.lodging)} in every other county.`,
  intro: `Minnesota's ${sum.count} GSA areas sit on ${sum.mieTiers.length} different meal tiers, and the one with the highest summer rate did not change at all this year.`,
  resume: `Minnesota per diem in FY2027 pays ${K.usd(tw.high)} a night in Hennepin and Ramsey counties (Minneapolis / St. Paul) every month, with ${K.usd(tw.mie)} of M&IE, the top federal meal tier. Duluth (St. Louis County) is seasonal, ${K.usd(dul.high)} in ${K.listOf(dul.highMonths)} and ${K.usd(dul.low)} from ${dul.lowMonths[0]} to ${dul.lowMonths[dul.lowMonths.length - 1]}, with ${K.usd(dul.mie)}. Rochester (Olmsted County) is flat at ${K.usd(roc.high)} with ${K.usd(roc.mie)}. Every other county takes the standard ${K.usd(sum.std.lodging)} and ${K.usd(sum.std.mie)}, from October 1, 2026 to September 30, 2027. In winter the Twin Cities are the slightly dearer stop: three nights from February 8 to 11, 2027 come to ${K.usd(msp.total, 2)} at the federal maximum, against ${K.usd(dulT.total, 2)} in Duluth for the same dates. In summer the order flips on lodging. The calculator above opens on Minneapolis / St. Paul; type a Minnesota city or ZIP code to switch.`,
  body: (h) => `
<h2>Duluth, the Minnesota rate that ${unchanged ? 'did not move' : 'barely moved'}</h2>
<p>${unchanged ? `Every monthly figure for Duluth in the FY2027 file is identical to FY2026: ${K.usd(dul.high)} in ${K.listOf(dul.highMonths)}, ${K.usd(dul.low)} in the other months, and ${K.usd(dul.mie)} of M&IE.` : `Duluth changed only slightly between FY2026 and FY2027.`} Over the same switch of fiscal year the standard rate rose by ${K.usd(sum.std.lodging - K.std(2026).lodging)}, the Twin Cities by ${K.usd(tw.high - tw.prev!.high)} and Rochester by ${K.usd(roc.high - roc.prev!.high)}. A Duluth claim prepared from last year's numbers is therefore still right, which is not true anywhere else in the state. The ${dul.highMonths.length}-month peak is long: it runs from ${dul.highMonths[1]} through ${dul.highMonths[0]}, so the cheaper season is limited to ${dul.lowMonths[0]} through ${dul.lowMonths[dul.lowMonths.length - 1]}.</p>
${h.mini('areaTrip', { area: 'Duluth, MN', lodging: dulRow['2027'].lodging, mie: dulRow['2027'].mie })}
<h2>Hennepin and Ramsey on the top meal tier</h2>
<p>The Minneapolis / St. Paul area covers just two counties, and it sits on the highest M&IE tier GSA pays, ${K.usd(tw.mie)} a day, and the ${h.src('gsa_mie', 'GSA breakdown')} splits it into the meals you deduct when food is provided. Its lodging, ${K.usd(tw.high)}, is lower than Duluth in summer. Rochester, on the ${K.usd(roc.mie)} tier, gained ${K.usd(roc.high - roc.prev!.high)} this year, the largest increase in Minnesota, and is now ${K.usd(tw.high - roc.high)} under the Twin Cities on lodging and ${K.usd(tw.mie - roc.mie)} under them on meals. For a week-long assignment in Olmsted County, that meal gap alone adds up to ${K.usd((tw.mie - roc.mie) * (2 * share + 5), 2)} over seven travel days. A three-tier state means meal deductions differ by place: a provided lunch costs ${K.usd(K.tier(tw.mie).lunch)} of M&IE in Minneapolis and ${K.usd(K.tier(sum.std.mie).lunch)} at the standard rate.</p>
<h3>${K.listOf(stdRows.slice(0, 3).map((r) => r[2].replace(' County', '')))} counties stay on the standard rate</h3>
<p>Large cities outside Hennepin, Ramsey, St. Louis and Olmsted counties have no line of their own, ${K.listOf(stdRows.slice(0, 5).map((r) => `${r[0]} (${r[2]})`))} among them. A trip there is paid ${K.usd(sum.std.lodging)} and ${K.usd(sum.std.mie)}, whatever the distance to the Twin Cities line. Minnesota is one of the states with its own EIA gasoline series: ${K.usd(gas, 3)} a gallon of regular in the week of ${K.day(K.ENERGY_META.gasWeek)}, against ${K.usd(midwest, 3)} for the Midwest region and ${K.usd(K.ENERGY_META.usGas, 3)} for the country.</p>
${h.mini('fuelLeg', { label: 'Minnesota', price: gas })}
<p>The ${h.a('mileage-calculator', 'mileage calculator')} measures a drive between any two Minnesota addresses.</p>
`,
  faqs: [
    { q: 'Did the Duluth, Minnesota per diem change for FY2027?', a: unchanged ? `No. Duluth keeps exactly its FY2026 figures: ${K.usd(dul.high)} a night in ${K.listOf(dul.highMonths)}, ${K.usd(dul.low)} in the other months, and ${K.usd(dul.mie)} of M&IE a day. The rate covers St. Louis County. Every other Minnesota area and the standard rate went up on October 1, 2026.` : `Slightly. Check the monthly table above for the exact FY2027 figures.` },
    { q: 'What is the Minneapolis, Minnesota per diem for M&IE in FY2027?', a: `${K.usd(tw.mie)} a day, the highest of the ${K.P.mie.tiers.length} federal meal tiers, for Hennepin and Ramsey counties. That is ${K.usd(K.tier(tw.mie).breakfast)} for breakfast, ${K.usd(K.tier(tw.mie).lunch)} for lunch, ${K.usd(K.tier(tw.mie).dinner)} for dinner and ${K.usd(K.tier(tw.mie).incidentals)} for incidentals. On travel days you get ${K.usd(tw.mie * share, 2)}. Lodging is ${K.usd(tw.high)} a night all year, with no seasonal step.` },
    { q: 'Do Bloomington or Woodbury in Minnesota get the Twin Cities rate?', a: `It depends on the county. Bloomington is in ${bl[2]}, so it takes the Minneapolis / St. Paul rate of ${K.usd(tw.high)} and ${K.usd(tw.mie)}. Woodbury is in ${wo[2]}, which GSA does not list, so it takes the standard ${K.usd(sum.std.lodging)} and ${K.usd(sum.std.mie)} in FY2027. Check the county of each work site.` },
  ],
  related: ['per-diem-rates', 'home', 'mileage-calculator', 'meals-and-incidental-expenses', 'state:wisconsin', 'state:iowa'],
});
