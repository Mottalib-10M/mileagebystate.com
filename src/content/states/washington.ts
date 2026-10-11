import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import { T } from '../../lib/data';

const sum = K.stateSummary('washington');
const std = sum.std;
const area = (name: string) => K.nsas('WA').find((x) => x.name === name)!;
const sea = area('Seattle'), pa = area('Port Angeles / Port Townsend'), oly = area('Olympia / Tumwater'), van = area('Vancouver');
const oc = area('Ocean Shores'), spo = area('Spokane'), tac = area('Tacoma');
const L = (n: { i: number }, fy = '2027') => T.dest[n.i].fy[fy].lodging;
const pa26High = K.MONTHS_FY.filter((_, m) => L(pa, '2026')[m] === pa.prev!.high);
const sea26High = K.MONTHS_FY.filter((_, m) => L(sea, '2026')[m] === sea.prev!.high);
const oct26 = K.trip({ destIndex: sea.i, depart: '2026-10-12', ret: '2026-10-15' });
const oct25 = K.trip({ destIndex: sea.i, depart: '2025-10-13', ret: '2025-10-16' });
const ref = K.stateRef('washington');
const gas = ref.gas, us = K.ENERGY_META.usGas;
const irs = K.irs('2026-07-01');
const mpg = 30;
const ev = area('Everett / Lynnwood'), rp = area('Richland / Pasco');
const unchanged = sum.list.filter((x) => x.prev && x.prev.high === x.high && x.prev.low === x.low).map((x) => x.name);
const share = K.P.mie.partialDayShare;
const CAL = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const span = (ms: string[]) => { const set = new Set(ms.map((x) => CAL.indexOf(x))); const start = [...set].find((i) => !set.has((i + 11) % 12)); if (start === undefined) return 'all year'; let end = start, n = 1; while (set.has((end + 1) % 12)) { end = (end + 1) % 12; n++; } return n !== set.size ? K.listOf(ms) : n === 1 ? CAL[start] : `${CAL[start]} to ${CAL[end]}`; };
const W = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve'];
const m2 = (x: number) => K.usd(x, x % 1 ? 2 : 0);

export default defineState({
  slug: 'washington',
  dest: 'Seattle',
  title: 'Per Diem Rates Washington 2026-27: Seattle October Shift',
  description: `Washington State per diem 2026-27: Seattle ${K.usd(sea.high)} from ${span(sea.highMonths)}, Port Angeles ${K.usd(pa.high)}, Vancouver ${K.usd(van.high)}, and gas at ${K.usd(gas, 3)} a gallon, above the U.S. average.`,
  intro: `Washington's ${sum.count} GSA areas for FY2027 all pay at least ${K.usd(sum.mieTiers[0])} of M&IE, and Seattle now counts October as a peak month.`,
  resume: `King County leads the Washington per diem for FY2027 at ${K.usd(sea.high)} a night in ${K.listOf(sea.highMonths)} and ${K.usd(sea.low)} from ${span(sea.lowMonths)}, with ${K.usd(sea.mie)} of M&IE. ${K.listOf(sea.highMonths.filter((x) => !sea26High.includes(x)))} is new in that top band: in FY2026 Seattle paid its peak only in ${K.listOf(sea26High)}. Clallam and Jefferson counties, the Port Angeles and Port Townsend area, stretched their summer from ${W[pa26High.length]} months to ${W[pa.highMonths.length]} and now reach ${K.usd(pa.high)}. Every listed area sits at ${K.usd(sum.mieTiers[0])} of M&IE or more, against ${K.usd(std.mie)} in counties such as Yakima, Whatcom and Kitsap, where lodging is the standard ${K.usd(std.lodging)}. Taking the FY2027 table, three nights in Seattle from October 12 to October 15, 2026 total ${m2(oct26.total)} at the federal maximum; the same stay a year earlier under FY2026 rates was ${m2(oct25.total)}. Travel days count at ${K.pct(share)} of the daily M&IE.`,
  body: (h) => `
<h2>Washington's own gasoline series</h2>
<p>EIA prices Washington on its own weekly series, and in the week of ${K.day(K.ENERGY_META.gasWeek)} regular averaged ${K.usd(gas, 3)} a gallon, ${K.usd(gas - us, 3)} above the U.S. figure of ${K.usd(us, 3)}. At ${mpg} miles per gallon that is ${K.rate(gas / mpg)} of fuel per mile, or ${K.pct(gas / mpg / irs)} of the IRS business rate of ${K.centsWord(irs)}. A company paying a flat allowance set for the national average leaves a Washington driver short by ${K.rate((gas - us) / mpg)} a mile before tires, insurance or depreciation. Diesel follows the ${ref.dieselArea} series at ${K.usd(ref.diesel, 3)}.</p>
${h.mini('fuelLeg', { label: 'Washington', price: gas })}
<h2>Seattle's peak now ends in October</h2>
<p>The King County schedule has two levels: ${K.usd(sea.high)} in ${K.listOf(sea.highMonths)}, ${K.usd(sea.low)} in ${K.listOf(sea.lowMonths)}. October 2026 opened at the upper level, ${K.usd(sea.high - sea.low)} above where October 2025 stood, so fall trips booked on last year's figures under-claim. The summer cap itself rose ${K.usd(sea.high - sea.prev!.high)}; the low months did not move. Tacoma, in Pierce County, keeps a flat ${K.usd(tac.high)}.</p>
${h.mini('areaTrip', { area: 'Seattle, WA', lodging: L(sea), mie: sea.mie })}
<h3>Port Angeles, Olympia and Ocean Shores</h3>
<p>Clallam and Jefferson counties went from ${K.usd(pa.prev!.high)} in ${K.listOf(pa26High)} to ${K.usd(pa.high)} in ${K.listOf(pa.highMonths)}, while the off season slipped from ${K.usd(pa.prev!.low)} to ${K.usd(pa.low)}. Thurston County (Olympia, Tumwater) collapsed a three-level FY2026 calendar into two: ${K.usd(oly.high)} in ${K.listOf(oly.highMonths)}, ${K.usd(oly.low)} otherwise. Grays Harbor County, Ocean Shores, lifted its floor from ${K.usd(oc.prev!.low)} to ${K.usd(oc.low)}. Spokane ${unchanged.length === 1 && unchanged[0] === spo.name ? `is the only area with exactly the same ${K.usd(spo.high)} cap as last year` : `sits at ${K.usd(spo.high)}`}. Clark, Cowlitz and Skamania counties, the Vancouver area, pay ${K.usd(van.high)} with ${K.usd(van.mie)} of M&IE. Bellingham, Yakima, Bremerton, Wenatchee and Walla Walla are in counties GSA does not list, according to the Census file behind the search, so they take ${K.usd(std.lodging)}.</p>
<p>North of Seattle, Snohomish County (Everett, Lynnwood) is a separate area at ${K.usd(ev.low)} most of the year and ${K.usd(ev.high)} in ${K.listOf(ev.highMonths)}, so a hotel there in July allows ${K.usd(sea.high - ev.high)} less than one in King County. Benton and Franklin counties, the Richland and Pasco area, hold ${K.usd(rp.high)} all year with ${K.usd(rp.mie)} of M&IE. The ${h.a('road-trip-cost-calculator', 'road trip cost calculator')} uses the Washington gasoline series by default.</p>
`,
  faqs: [
    { q: 'What is the Seattle, Washington per diem in October 2026?', a: `${K.usd(L(sea)[0])} of lodging per night and ${K.usd(sea.mie)} of M&IE per day, the FY2027 rate for King County. October is in the top band with ${K.listOf(sea.highMonths.filter((x) => x !== 'October'))}; in FY2026 it was ${K.usd(L(sea, '2026')[0])}. From ${span(sea.lowMonths)} the cap is ${K.usd(sea.low)}. Travel days pay ${K.usd(sea.mie * share, 2)} of M&IE.` },
    { q: 'Why is gas more expensive for mileage claims in Washington State?', a: `EIA's Washington series stood at ${K.usd(gas, 3)} a gallon in the week of ${K.day(K.ENERGY_META.gasWeek)}, ${K.usd(gas - us, 3)} above the national average. The IRS business rate stays ${K.centsWord(irs)} a mile in every state, so fuel takes a larger share of it in Washington: about ${K.pct(gas / mpg / irs)} at ${mpg} miles per gallon. An employer may reimburse actual costs instead.` },
    { q: 'Does Bremerton, Washington get a non-standard per diem?', a: `No. Bremerton is in Kitsap County, which has no GSA listing for FY2027, so it takes the standard ${K.usd(std.lodging)} of lodging and ${K.usd(std.mie)} of M&IE. In King County, Seattle pays up to ${K.usd(sea.high)} and ${K.usd(sea.mie)}. Lodging follows the county where you sleep, so a Seattle hotel for a Bremerton job is paid at the Seattle rate.` },
    { q: 'When is the Port Angeles, Washington per diem season in FY2027?', a: `${K.listOf(pa.highMonths)}, at ${K.usd(pa.high)} a night, against ${K.usd(pa.low)} from ${span(pa.lowMonths)}. The area covers Clallam and Jefferson counties, including Port Townsend, with ${K.usd(pa.mie)} of M&IE all year. In FY2026 the higher cap was ${K.usd(pa.prev!.high)} and only covered ${K.listOf(pa26High)}, so ${K.listOf(pa.highMonths.filter((x) => !pa26High.includes(x)))} gained the most.` },
  ],
  related: ['per-diem-rates', 'home', 'state:oregon', 'state:idaho', 'gas-cost-calculator', 'road-trip-cost-calculator'],
});
