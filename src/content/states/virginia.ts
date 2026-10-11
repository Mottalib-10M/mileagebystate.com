import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import { T } from '../../lib/data';

const sum = K.stateSummary('virginia');
const std = sum.std;
const area = (name: string) => K.nsas('VA').find((x) => x.name === name)!;
const dc = area('District of Columbia'), wal = area('Wallops Island'), vb = area('Virginia Beach'), ric = area('Richmond');
const cville = area('Charlottesville'), wburg = area('Williamsburg / York'), roa = area('Roanoke'), lyn = area('Lynchburg'), lou = area('Loudoun');
const L = (n: { i: number }, fy = '2027') => T.dest[n.i].fy[fy].lodging;
const cityDefined = sum.list.filter((x) => /city/i.test(x.counties) && x.name !== dc.name).map((x) => x.name);
const wb26High = K.MONTHS_FY.filter((_, m) => L(wburg, '2026')[m] === wburg.prev!.high);
const vbJul = K.trip({ destIndex: vb.i, depart: '2027-07-12', ret: '2027-07-15' });
const nfJul = K.trip({ destIndex: -1, depart: '2027-07-12', ret: '2027-07-15' });
const walAug = K.trip({ destIndex: wal.i, depart: '2027-08-02', ret: '2027-08-05' });
const share = K.P.mie.partialDayShare;
const gas = K.gas('virginia');
const m2 = (x: number) => K.usd(x, x % 1 ? 2 : 0);

export default defineState({
  slug: 'virginia',
  dest: 'Virginia Beach',
  title: 'Per Diem Rates Virginia 2026-27: City Limits and Northern VA',
  description: `Virginia per diem 2026-27: Arlington and Fairfax ${K.usd(dc.high)} at the spring peak, Virginia Beach ${K.usd(vb.high)} in summer, Richmond ${K.usd(ric.high)}, Norfolk at the ${K.usd(std.lodging)} standard rate.`,
  intro: `Virginia's ${sum.count} GSA areas for FY2027 are drawn as much by independent city as by county, which leaves Norfolk and Chesapeake on the standard rate next to Virginia Beach.`,
  resume: `In Virginia the per diem depends on which side of a city line the hotel stands: ${cityDefined.length} of the ${sum.count} FY2027 GSA areas are written around an independent city, and the dearest part of the state belongs to the Washington, DC area, where Arlington, Fairfax and Alexandria pay up to ${K.usd(dc.high)} a night in ${K.listOf(dc.highMonths)} with ${K.usd(dc.mie)} of M&IE. Virginia Beach is its own area, at ${K.usd(vb.high)} in ${K.listOf(vb.highMonths)}, but Norfolk, Chesapeake, Portsmouth and Newport News have no listing and take the standard ${K.usd(std.lodging)} and ${K.usd(std.mie)}. Computed on the FY2027 table, three nights in Virginia Beach from July 12 to July 15, 2027 total ${m2(vbJul.total)} at the federal maximum, while the same nights in Norfolk total ${m2(nfJul.total)}, a gap of ${m2(vbJul.total - nfJul.total)}. Both totals pay the travel days at ${K.pct(share)} of the meals rate and leave lodging taxes out.`,
  body: (h) => `
<h2>Independent cities draw the lines</h2>
<p>Virginia's cities stand outside its counties, and GSA's definitions follow that map. The Virginia Beach area is "${vb.counties}" and nothing else. Richmond is "${ric.counties}", Roanoke "${roa.counties}". Lynchburg pairs the city with ${lyn.counties.split('/')[0].trim()} County, Charlottesville joins its city to Albemarle, and the Williamsburg area combines the city with James City and York counties. The practical consequence: a neighboring city can be on the standard rate. Chesapeake, Norfolk, Portsmouth, Suffolk, Hampton and Newport News appear in the Census city file as county-level cities without a GSA line, so a contractor sleeping in Norfolk claims ${K.usd(std.lodging)} in July, ${K.usd(vb.high - std.lodging)} less than in Virginia Beach. Harrisonburg and Manassas are in the same position.</p>
${h.mini('areaTrip', { area: 'Virginia Beach, VA', lodging: L(vb), mie: vb.mie })}
<h3>Northern Virginia sits in the Washington area, except Loudoun</h3>
<p>GSA files Arlington County, Fairfax County and the cities of Alexandria, Falls Church and Fairfax under the District of Columbia area, with the same ${K.usd(dc.mie)} M&IE and the same monthly caps as the District, from ${K.usd(dc.low)} in ${K.listOf(dc.lowMonths)} to ${K.usd(dc.high)}. Loudoun County is listed apart at ${K.usd(lou.high)} all year with ${K.usd(lou.mie)} of M&IE, so the county of the hotel decides between two very different rates. The full Washington calendar is on the ${h.a('state:district-of-columbia', 'District of Columbia page')}.</p>
<h2>Wallops Island: summer cap at the bottom meals tier</h2>
<p>Accomack County carries ${K.usd(wal.high)} in ${K.listOf(wal.highMonths)} and ${K.usd(wal.low)} in the other ten months, a jump of ${K.usd(wal.high - wal.low)} a night, the widest seasonal swing in the state. Its M&IE, though, is ${K.usd(wal.mie)}, the same as the standard rate. Three nights there from August 2 to August 5, 2027 total ${m2(walAug.total)}. Williamsburg rearranged its calendar: its higher cap covered ${K.listOf(wb26High)} in FY2026 and now covers ${K.listOf(wburg.highMonths)}, at ${K.usd(wburg.high)}, so ${K.listOf(wb26High.filter((x) => !wburg.highMonths.includes(x)))} moved to the low figure of ${K.usd(wburg.low)}.</p>
<p>Virginia gasoline is priced in EIA's ${K.stateRef('virginia').gasArea} series, ${K.usd(gas, 3)} a gallon in the week of ${K.day(K.ENERGY_META.gasWeek)}. The ${h.a('mileage-calculator', 'mileage calculator')} measures a drive between two Virginia cities and prices it at the IRS rate.</p>
`,
  faqs: [
    { q: 'Do Arlington and Alexandria, Virginia use the Washington, DC per diem?', a: `Yes. GSA's District of Columbia area includes Arlington and Fairfax counties and the cities of Alexandria, Falls Church and Fairfax. In FY2027 they pay ${K.usd(dc.mie)} of M&IE and a lodging cap of ${K.usd(dc.low)} to ${K.usd(dc.high)} depending on the month. Loudoun County is not part of it: ${K.usd(lou.high)} and ${K.usd(lou.mie)}.` },
    { q: 'What is the per diem for Norfolk, Virginia in FY2027?', a: `Norfolk has no GSA area of its own, so the FY2027 standard rate applies: ${K.usd(std.lodging)} of lodging and ${K.usd(std.mie)} of M&IE, from October 1, 2026 to September 30, 2027. The listed Virginia Beach area covers only the City of Virginia Beach, at up to ${K.usd(vb.high)}. Chesapeake, Portsmouth and Newport News are also on the standard rate.` },
    { q: 'Is Henrico or Chesterfield covered by the Richmond, Virginia per diem?', a: `No. GSA defines the Richmond area as the City of Richmond alone, at ${K.usd(ric.high)} a night all year and ${K.usd(ric.mie)} of M&IE in FY2027. Henrico and Chesterfield counties are not listed, so a hotel there falls under the standard ${K.usd(std.lodging)} and ${K.usd(std.mie)}. Check the hotel's address with the ZIP search before booking.` },
    { q: 'When is the Wallops Island, Virginia per diem highest?', a: `In ${K.listOf(wal.highMonths)}, at ${K.usd(wal.high)} a night, against ${K.usd(wal.low)} in the other months of FY2027. The area covers Accomack County. M&IE is ${K.usd(wal.mie)} all year, or ${K.usd(wal.mie * share, 2)} on travel days, the lowest federal tier, so the summer premium comes from lodging alone. Three summer nights total ${m2(walAug.total)}.` },
  ],
  related: ['per-diem-rates', 'home', 'state:district-of-columbia', 'state:maryland', 'state:north-carolina', 'mileage-calculator'],
});
