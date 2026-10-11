import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import { T } from '../../lib/data';

const sum = K.stateSummary('west-virginia');
const std = sum.std;
const area = (name: string) => K.nsas('WV').find((x) => x.name === name)!;
const ct = area('Charles Town'), chw = area('Charleston');
const chs = K.nsas('SC').find((x) => x.name === 'Charleston')!;
const oneTier = sum.mieTiers.length === 1 && sum.mieTiers[0] === std.mie;
const tier = K.tier(std.mie);
const share = K.P.mie.partialDayShare;
const ex = K.trip({ destIndex: chw.i, depart: '2027-04-19', ret: '2027-04-22' });
const exStd = K.trip({ destIndex: -1, depart: '2027-04-19', ret: '2027-04-22' });
const exCt = K.trip({ destIndex: ct.i, depart: '2027-04-19', ret: '2027-04-22' });
const week = K.trip({ destIndex: chw.i, depart: '2027-01-10', ret: '2027-01-15' });
const gas = K.gas('west-virginia');
const elec = K.elec('west-virginia');
const m2 = (x: number) => K.usd(x, x % 1 ? 2 : 0);

export default defineState({
  slug: 'west-virginia',
  dest: 'Charleston',
  title: 'Per Diem Rates WV 2026-27: Charleston and Charles Town',
  description: `West Virginia per diem 2026-27: Charles Town ${K.usd(ct.high)}, Charleston ${K.usd(chw.high)}, ${K.usd(std.lodging)} everywhere else, and ${K.usd(std.mie)} of M&IE in every county of the state, listed or not.`,
  intro: `${oneTier ? `Every West Virginia county pays the same ${K.usd(std.mie)} meals rate in FY2027` : `West Virginia has ${sum.count} GSA areas in FY2027`}, so only two counties earn a lodging premium, and a modest one.`,
  resume: `West Virginia has ${sum.count} GSA areas in FY2027, Jefferson County (Charles Town) at ${K.usd(ct.high)} a night and Kanawha County (Charleston) at ${K.usd(chw.high)}, and ${oneTier ? `both keep the ${K.usd(std.mie)} M&IE of the standard rate, so meals pay exactly the same in Huntington, Morgantown or the capital` : `their M&IE differs from the standard`}. Neither area has a seasonal cap; the figure holds from October 1, 2026 to September 30, 2027. Charleston sits ${K.usd(chw.high - std.lodging)} above the standard ${K.usd(std.lodging)}, Charles Town ${K.usd(ct.high - std.lodging)}. Applying the FY2027 rates, three nights in Charleston from April 19 to April 22, 2027 total ${m2(ex.total)} at the federal maximum, only ${m2(ex.total - exStd.total)} more than the same nights in a standard-rate county, and three nights in Charles Town ${m2(exCt.total)}. M&IE on the two travel days is ${K.usd(std.mie * share, 2)} each, and any lodging tax is reimbursed on top of the cap.`,
  body: (h) => `
<h2>A single meals rate across the state</h2>
<p>${oneTier ? `GSA places both West Virginia areas in the ${K.usd(std.mie)} M&IE tier, the lowest of the five and the one used for the standard rate. A traveler therefore gets ${K.usd(tier.breakfast)} for breakfast, ${K.usd(tier.lunch)} for lunch, ${K.usd(tier.dinner)} for dinner and ${K.usd(tier.incidentals)} of incidentals in any county of the state.` : `West Virginia areas use M&IE rates of ${K.listOf(sum.mieTiers.map((x) => K.usd(x)))}.`} The only per diem difference between Wheeling and Charleston is the room cap. That makes expense reports simple to check: the meals line of a five-day trip anywhere in the state is ${K.usd(std.mie * (3 + 2 * share), 2)}, before any provided meal is deducted.</p>
${h.mini('areaTrip', { area: 'Charleston, WV', lodging: T.dest[chw.i].fy['2027'].lodging, mie: chw.mie })}
<h3>Charleston, West Virginia or Charleston, South Carolina?</h3>
<p>Both appear as "Charleston" in the GSA files, and a hurried search can return the wrong one. The West Virginia area is ${chw.counties} County at ${K.usd(chw.high)} and ${K.usd(chw.mie)}. The South Carolina area covers ${chs.counties} counties at up to ${K.usd(chs.high)} and ${K.usd(chs.mie)}. Five nights in the West Virginia capital in January 2027 come to ${m2(week.total)}; picking the South Carolina rate by mistake would overstate the cap by ${K.usd(chs.low - chw.high)} or more per night. The ${h.a('state:south-carolina', 'South Carolina page')} carries that schedule month by month, and the search in the calculator above takes a ZIP code to remove any doubt.</p>
<h2>Where the standard ${K.usd(std.lodging)} applies</h2>
<p>Charleston is the only West Virginia place above 15,000 people in the Census file that falls inside a listed county. Huntington (Cabell County), Morgantown, Parkersburg, Wheeling, Martinsburg, Weirton, Fairmont and Beckley are all outside both areas. Martinsburg, in Berkeley County, is paid ${K.usd(std.lodging)} while Charles Town in Jefferson County gets ${K.usd(ct.high)}. Compared with FY2026, Charles Town gained ${K.usd(ct.high - ct.prev!.high)} and Charleston ${K.usd(chw.high - chw.prev!.high)}, while the standard rose from ${K.usd(K.std(2026).lodging)} to ${K.usd(std.lodging)}.</p>
<p>For driving, EIA groups the state in its ${K.stateRef('west-virginia').gasArea} gasoline series, ${K.usd(gas, 3)} a gallon in the week of ${K.day(K.ENERGY_META.gasWeek)}, and residential power averaged ${K.num(elec, 2)} cents per kWh over ${K.ENERGY_META.elecPeriod}. The ${h.a('cost-per-mile-calculator', 'cost per mile calculator')} compares that with the IRS rate.</p>
`,
  faqs: [
    { q: 'What is the per diem for Charleston, West Virginia in FY2027?', a: `${K.usd(chw.high)} of lodging per night in every month and ${K.usd(chw.mie)} of M&IE per day, for Kanawha County, from October 1, 2026 to September 30, 2027. That is ${K.usd(chw.high - std.lodging)} above the standard lodging rate, with the same meals rate. Arrival and departure days pay ${K.usd(chw.mie * share, 2)} of M&IE.` },
    { q: 'Does Morgantown, West Virginia have a special per diem rate?', a: `No. Monongalia County is not a GSA non-standard area, so Morgantown uses the FY2027 standard rate of ${K.usd(std.lodging)} for lodging and ${K.usd(std.mie)} for M&IE. In West Virginia only Jefferson County (Charles Town, ${K.usd(ct.high)}) and Kanawha County (Charleston, ${K.usd(chw.high)}) have their own lodging caps, and neither changes with the season.` },
    { q: 'Is the M&IE the same everywhere in West Virginia?', a: `${oneTier ? `Yes. In FY2027 both listed West Virginia areas are in the ${K.usd(std.mie)} tier, which is also the standard M&IE, so a full day pays ${K.usd(std.mie)} in every county and a travel day ${K.usd(std.mie * share, 2)}. A provided dinner reduces the day by ${K.usd(tier.dinner)}, a lunch by ${K.usd(tier.lunch)}, a breakfast by ${K.usd(tier.breakfast)}.` : `No. The listed areas pay ${K.listOf(sum.mieTiers.map((x) => K.usd(x)))}, against ${K.usd(std.mie)} elsewhere in the state, for a full day of travel under the FY2027 rates.`}` },
  ],
  related: ['per-diem-rates', 'home', 'state:virginia', 'state:maryland', 'state:south-carolina', 'cost-per-mile-calculator'],
});
