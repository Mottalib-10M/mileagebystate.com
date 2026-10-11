import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import { T } from '../../lib/data';

const sum = K.stateSummary('wyoming');
const std = sum.std;
const area = (name: string) => K.nsas('WY').find((x) => x.name === name)!;
const jh = area('Jackson / Pinedale'), cody = area('Cody');
const L = (n: { i: number }) => T.dest[n.i].fy['2027'].lodging;
const sameSeason = jh.highMonths.join() === cody.highMonths.join();
const jul = K.trip({ destIndex: jh.i, depart: '2027-07-12', ret: '2027-07-16' });
const jan = K.trip({ destIndex: jh.i, depart: '2027-01-11', ret: '2027-01-15' });
const chey = K.trip({ destIndex: -1, depart: '2027-07-12', ret: '2027-07-16' });
const codyJul = K.trip({ destIndex: cody.i, depart: '2027-07-12', ret: '2027-07-16' });
const turn = K.trip({ destIndex: jh.i, depart: '2026-09-28', ret: '2026-10-02' });
const tJ = K.tier(jh.mie), tC = K.tier(cody.mie);
const share = K.P.mie.partialDayShare;
const ref = K.stateRef('wyoming');
const CAL = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const span = (ms: string[]) => { const set = new Set(ms.map((x) => CAL.indexOf(x))); const start = [...set].find((i) => !set.has((i + 11) % 12)); if (start === undefined) return 'all year'; let end = start, n = 1; while (set.has((end + 1) % 12)) { end = (end + 1) % 12; n++; } return n !== set.size ? K.listOf(ms) : n === 1 ? CAL[start] : `${CAL[start]} to ${CAL[end]}`; };
const W = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve'];
const m2 = (x: number) => K.usd(x, x % 1 ? 2 : 0);

export default defineState({
  slug: 'wyoming',
  dest: 'Jackson / Pinedale',
  title: 'Per Diem Rates Wyoming 2026-27: Jackson Summer Cap and Cody',
  description: `Wyoming per diem 2026-27: Jackson and Pinedale ${K.usd(jh.high)} a night from ${span(jh.highMonths)}, ${K.usd(jh.low)} the rest of the year, Cody ${K.usd(cody.high)}, Cheyenne at the ${K.usd(std.lodging)} standard rate.`,
  intro: `Wyoming has only ${sum.count} GSA areas in FY2027, and in summer the Jackson one pays ${K.num(jh.high / std.lodging, 1)} times the standard lodging rate.`,
  resume: `Teton and Sublette counties, listed as Jackson / Pinedale, carry Wyoming's top per diem for FY2027: ${K.usd(jh.high)} a night in ${K.listOf(jh.highMonths)} 2027 and ${K.usd(jh.low)} from ${span(jh.lowMonths)}, with ${K.usd(jh.mie)} of M&IE, the highest federal meals tier. Park County, the Cody area, ${sameSeason ? `follows the same ${span(cody.highMonths)} calendar` : 'has its own calendar'} at ${K.usd(cody.high)} and ${K.usd(cody.low)}, with ${K.usd(cody.mie)} of M&IE. Every other county pays the standard ${K.usd(std.lodging)} and ${K.usd(std.mie)}, including Cheyenne, Casper, Gillette and Laramie. Counted with the FY2027 table, four nights in Jackson from July 12 to July 16, 2027 total ${m2(jul.total)} at the federal maximum, against ${m2(jan.total)} for four nights in January 2027 and ${m2(chey.total)} for the July dates in Cheyenne. The arrival and departure days carry ${K.pct(share)} of the M&IE, and lodging taxes are paid on top.`,
  body: (h) => `
<h2>Jackson: ${K.usd(jh.high)} for ${W[jh.highMonths.length]} months, ${K.usd(jh.low)} for ${W[jh.lowMonths.length]}</h2>
<p>The Jackson and Pinedale area multiplies its room cap by ${K.num(jh.high / jh.low, 1)} on ${jh.highMonths[0]} 1. From ${K.listOf(jh.highMonths)} the ceiling is ${K.usd(jh.high)}, ${K.usd(jh.high - jh.prev!.high)} more than in FY2026; from ${span(jh.lowMonths)} it is ${K.usd(jh.low)}, up ${K.usd(jh.low - jh.prev!.low)}. Even that winter figure is ${K.usd(jh.low - std.lodging)} above the standard. A stay that straddles ${jh.lowMonths[jh.lowMonths.length - 1]} and ${jh.highMonths[0]} mixes the two levels, and the calculator prices each night at its own month. In the high months, a single night's cap here is ${K.num(jh.high / std.lodging, 1)} times the standard ${K.usd(std.lodging)}.</p>
<p>${jh.highMonths.includes('September') ? 'The Jackson season runs through September, the last month of the federal fiscal year, so the drop' : 'The drop'} to the winter figure coincides with the switch to a new GSA table. A trip from September 28 to October 2, 2026 saw both at once: ${K.listOf(turn.days.filter((x) => x.lodgingMax > 0).map((x) => K.usd(x.lodgingMax)))} for its four nights, ${m2(turn.total)} in all with M&IE.</p>
${h.mini('areaTrip', { area: 'Jackson, WY', lodging: L(jh), mie: jh.mie })}
<h3>Cody: same months, smaller jump, lower meals tier</h3>
<p>Park County ${sameSeason ? `uses the same ${K.listOf(cody.highMonths)} window` : `peaks in ${K.listOf(cody.highMonths)}`}, at ${K.usd(cody.high)}, a rise of ${K.usd(cody.high - cody.prev!.high)} from FY2026, the largest increase in either area. Its other months pay ${K.usd(cody.low)}, barely changed. The M&IE is ${K.usd(cody.mie)}: ${K.usd(tC.breakfast)} for breakfast, ${K.usd(tC.lunch)} for lunch and ${K.usd(tC.dinner)} for dinner, against ${K.usd(tJ.breakfast)}, ${K.usd(tJ.lunch)} and ${K.usd(tJ.dinner)} in Teton County. The same four July nights cost ${m2(codyJul.total)} in Cody, ${m2(jul.total - codyJul.total)} less than in Jackson.</p>
<h2>Every large Wyoming city takes the standard rate</h2>
<p>None of the Wyoming places with 15,000 people or more in the Census file lies inside a listed county. Cheyenne (Laramie County), Casper (Natrona), Gillette (Campbell), Laramie (Albany), Rock Springs (Sweetwater) and Sheridan all take ${K.usd(std.lodging)} for lodging and ${K.usd(std.mie)} for meals in every month of FY2027, ${K.usd(std.lodging - K.std(2026).lodging)} more lodging than the FY2026 standard. For those trips the per diem question is settled; the mileage is what varies. EIA prices Wyoming in its ${ref.gasArea} series, ${K.usd(ref.gas, 3)} a gallon of regular and ${K.usd(ref.diesel, 3)} of diesel in the week of ${K.day(K.ENERGY_META.gasWeek)}, and the ${h.a('irs-mileage-rate', 'IRS mileage rate')} of ${K.centsWord(K.irs('2026-07-01'))} applies to the whole drive.</p>
${h.mini('fuelLeg', { label: 'Wyoming', price: ref.gas })}
`,
  faqs: [
    { q: 'What is the Jackson, Wyoming per diem in summer 2027?', a: `${K.usd(jh.high)} of lodging per night in ${K.listOf(jh.highMonths)} 2027 and ${K.usd(jh.mie)} of M&IE per day, under GSA's FY2027 rates for Teton and Sublette counties. From ${span(jh.lowMonths)} the room cap is ${K.usd(jh.low)}. On the first and last day of travel, the M&IE is ${K.usd(jh.mie * share, 2)}. Lodging taxes are reimbursed separately.` },
    { q: 'Does Cheyenne, Wyoming have a higher per diem than the standard?', a: `No. Laramie County is not a GSA non-standard area, so Cheyenne uses the FY2027 standard of ${K.usd(std.lodging)} for lodging and ${K.usd(std.mie)} for M&IE, from October 1, 2026 to September 30, 2027. In Wyoming only Teton and Sublette counties (Jackson, Pinedale) and Park County (Cody) have their own rates.` },
    { q: 'How much did the Cody, Wyoming per diem change for FY2027?', a: `The summer lodging cap for Park County went from ${K.usd(cody.prev!.high)} to ${K.usd(cody.high)}, a rise of ${K.usd(cody.high - cody.prev!.high)} a night in ${K.listOf(cody.highMonths)}. The rest of the year moved from ${K.usd(cody.prev!.low)} to ${K.usd(cody.low)}. M&IE stays at ${K.usd(cody.mie)}, or ${K.usd(cody.mie * share, 2)} on the day you arrive and the day you leave.` },
  ],
  related: ['per-diem-rates', 'home', 'state:montana', 'state:idaho', 'state:utah', 'irs-mileage-rate'],
});
