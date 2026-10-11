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
const sum = K.stateSummary('nevada');
const ref = K.stateRef('nevada');
const lv = sum.list.find((n) => n.name === 'Las Vegas')!;
const rn = sum.list.find((n) => n.name === 'Incline Village / Reno / Sparks')!;
const lvRow = T.dest[lv.i].fy['2027'];
const lvMid = lvRow.lodging[0];
const midMonths = K.MONTHS_FY.filter((_, m) => lvRow.lodging[m] === lvMid);
const std = sum.std;
const places = (PLACES as { rows: Array<[string, string, string, number, number, number]> }).rows.filter((r) => r[1] === 'NV');
const stdPlaces = places.filter((r) => r[3] === -1).map((r) => r[0]);
const winter = K.trip({ destIndex: destIndex('NV', 'Las Vegas'), depart: '2027-02-08', ret: '2027-02-11' });
const summer = K.trip({ destIndex: destIndex('NV', 'Las Vegas'), depart: '2027-06-07', ret: '2027-06-10' });
const share = K.P.mie.partialDayShare;
const gas = ref.gas, usGas = K.ENERGY_META.usGas;

export default defineState({
  slug: 'nevada',
  dest: 'Las Vegas',
  title: 'Per Diem Rates Nevada 2026-27: Las Vegas and Reno Seasons',
  description: `Nevada per diem rates 2026-27 (FY2027): Las Vegas peaks at ${K.usd(lv.high)} a night in ${lv.highMonths[0]} to ${lv.highMonths[lv.highMonths.length - 1]}, Reno at ${K.usd(rn.high)} in summer; Clark County M&IE ${K.usd(lv.mie)}, Washoe ${K.usd(rn.mie)}.`,
  intro: `Nevada's two GSA areas run on opposite calendars: Clark County is dearest in late winter, Washoe County in summer.`,
  resume: `Per diem in Nevada for FY2027 depends on the county and on the month. Clark County, listed as Las Vegas, caps lodging at ${K.usd(lv.high)} in ${L(lv.highMonths)}, ${K.usd(lvMid)} in ${L(midMonths)}, and only ${K.usd(lv.low)} from ${lv.lowMonths[0]} to ${lv.lowMonths[lv.lowMonths.length - 1]}, with ${K.usd(lv.mie)} of M&IE every day. Washoe County (Incline Village, Reno and Sparks) pays ${K.usd(rn.high)} in ${L(rn.highMonths)} and ${K.usd(rn.low)} the rest of the year, with ${K.usd(rn.mie)} of M&IE. Everywhere else in the state the standard ${K.usd(std.lodging)} and ${K.usd(std.mie)} apply. Three nights in Las Vegas from February 8 to 11, 2027 are worth ${K.usd(winter.total, 2)} at the federal maximum; the same trip from June 7 to 10, 2027 is worth ${K.usd(summer.total, 2)}, because only the room cap changed. The calculator above starts on Las Vegas and prices each night at the rate of its own month.`,
  body: (h) => `
<h2>Clark and Washoe peak in opposite halves of the year</h2>
<p>Nevada's two lines do not share a calendar. The Las Vegas cap tops out at ${K.usd(lv.high)} in ${L(lv.highMonths)} and bottoms out in ${L(lv.lowMonths)}, precisely the months when the Washoe County cap climbs to ${K.usd(rn.high)}. A consultant who splits a contract between the two cities can therefore see the cheaper city change sides during the fiscal year: in February, Reno costs ${K.usd(lv.high - rn.low)} less a night than Las Vegas; in July, Las Vegas costs ${K.usd(rn.high - lv.low)} less than Reno.</p>
<h3>A Las Vegas summer close to the floor</h3>
<p>The low Clark County value of ${K.usd(lv.low)} is just ${K.usd(lv.low - std.lodging)} above the national standard of ${K.usd(std.lodging)}. It also fell compared with FY2026, when the lowest month paid ${K.usd(lv.prev!.low)}, while the top month rose from ${K.usd(lv.prev!.high)} to ${K.usd(lv.high)}. In other words, GSA stretched the gap between the dear and the cheap months. The meal allowance did not follow: Clark County stays on the ${K.usd(lv.mie)} tier all year, one step above Washoe's ${K.usd(rn.mie)}.</p>
<h3>Washoe County, steadier at the bottom</h3>
<p>The Incline Village, Reno and Sparks line moved the other way. Its lowest monthly cap went from ${K.usd(rn.prev!.low)} to ${K.usd(rn.low)}, while its summer top barely moved (${K.usd(rn.prev!.high)} last year, ${K.usd(rn.high)} now). A booking in the off months is now paid noticeably better than a year ago.</p>
${h.mini('areaTrip', { area: 'Las Vegas, NV', lodging: lvRow.lodging, mie: lvRow.mie })}
<h2>Carson City and the open counties</h2>
<p>The capital has no line. Of the ${places.length} Nevada places above 15,000 residents in the Census file, ${stdPlaces.length} sit outside Clark and Washoe and take the standard rate: ${L(stdPlaces)}. A stay there is reimbursed at ${K.usd(std.lodging)} and ${K.usd(std.mie)}, with ${K.usd(std.mie * share, 2)} on the first and last day.</p>
<h2>What a gallon costs on Nevada roads</h2>
<p>EIA does not survey Nevada on its own; its nearest series is ${ref.gasArea}, where regular gasoline averaged ${K.usd(gas, 3)} in the week of ${K.day(K.ENERGY_META.gasWeek)}, ${K.usd(gas - usGas, 3)} above the U.S. figure of ${K.usd(usGas, 3)}. The IRS mileage rate does not adjust for that, so each mile driven in Nevada eats a larger slice of the ${K.centsWord(K.irs('2026-07-01'))} than it would at the national price. Test your own mileage below, or use the ${h.a('road-trip-cost-calculator', 'road trip calculator')} for a multi-day route.</p>
${h.mini('fuelLeg', { label: 'Nevada (West Coast ex. California)', price: gas })}
`,
  faqs: [
    { q: 'When is the Las Vegas, Nevada per diem highest in FY2027?', a: `In ${L(lv.highMonths)}, when Clark County lodging is capped at ${K.usd(lv.high)} a night. It drops to ${K.usd(lvMid)} in ${L(midMonths)} and to ${K.usd(lv.low)} from ${lv.lowMonths[0]} through ${lv.lowMonths[lv.lowMonths.length - 1]}. The M&IE of ${K.usd(lv.mie)} does not change by month. A stay that spans two of these periods is paid night by night.` },
    { q: 'What is the Reno, Nevada per diem rate for FY2027?', a: `Washoe County, listed as Incline Village / Reno / Sparks, pays ${K.usd(rn.high)} a night in ${L(rn.highMonths)} and ${K.usd(rn.low)} in the other months, plus ${K.usd(rn.mie)} of M&IE. That is ${K.usd(rn.mie * share, 2)} on travel days under the 75% rule. The FY2027 rates run from October 1, 2026 to September 30, 2027.` },
    { q: 'Does Carson City, Nevada have its own GSA per diem?', a: `No. Carson City is not in any Nevada GSA area for FY2027, so lodging is capped at the standard ${K.usd(std.lodging)} and M&IE is ${K.usd(std.mie)}. Only Clark County and Washoe County have their own rates. If the meeting is in Carson City but you sleep in Reno, ask your approver which rate applies before booking.` },
  ],
  related: ['per-diem-rates', 'home', 'road-trip-cost-calculator', 'state:california', 'state:arizona', 'state:utah'],
});
