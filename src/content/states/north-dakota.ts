import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import PLACES from '../../data/places.json';

const CAL = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
/** Months listed as they run on the calendar, starting after a gap (Nov., Dec., Jan.); other lists keep their order. */
const L = (xs: string[]) => {
  if (!xs.length || !xs.every((x) => CAL.includes(x))) return K.listOf(xs);
  const has = (i: number) => xs.includes(CAL[(i + 12) % 12]);
  const start = CAL.findIndex((_, i) => has(i) && !has(i - 1));
  return K.listOf(start < 0 ? CAL : Array.from({ length: 12 }, (_, k) => CAL[(start + k) % 12]).filter((m) => xs.includes(m)));
};
const sum = K.stateSummary('north-dakota');
const ref = K.stateRef('north-dakota');
const std = sum.std, std26 = K.std(2026);
const places = (PLACES as { rows: Array<[string, string, string, number, number, number]> }).rows.filter((r) => r[1] === 'ND');
const towns = places.map((r) => r[0]);
const t = K.tier(std.mie);
const share = K.P.mie.partialDayShare;
const ex = K.trip({ destIndex: -1, depart: '2027-03-01', ret: '2027-03-05' });
const exMeals = K.trip({ destIndex: -1, depart: '2027-03-01', ret: '2027-03-05', meals: { breakfast: 0, lunch: 3, dinner: 0 } });
const cap = K.P.mie.actualExpenseCap;
const hl = K.P.highLow['2027'];
const nb = ['minnesota', 'south-dakota', 'montana'].map((x) => ({ name: K.stateRef(x).name, n: K.stateSummary(x).count }));
const stdLine = Array(12).fill(std.lodging);

export default defineState({
  slug: 'north-dakota',
  title: 'Per Diem Rates North Dakota 2026-27: One Statewide Rate',
  description: `North Dakota per diem 2026-27: no GSA area in FY2027 or FY2026, so every county (Fargo too) gets ${K.usd(std.lodging)} lodging and ${K.usd(std.mie)} M&IE, ${K.usd(std.lodging + std.mie)} a day, up ${K.usd(std.lodging - std26.lodging)} from FY2026.`,
  intro: `North Dakota has no non-standard GSA area at all, so one federal rate covers Fargo, Bismarck and Williston alike.`,
  resume: `North Dakota per diem in FY2027 is the same in every county: ${K.usd(std.lodging)} a night for lodging and ${K.usd(std.mie)} a day for meals and incidentals, ${K.usd(std.lodging + std.mie)} in total, from October 1, 2026 to September 30, 2027. GSA lists ${sum.count === 0 ? 'no' : sum.count} non-standard area in the state this year, and ${sum.prevCount === 0 ? 'none' : sum.prevCount} in FY2026, when the lodging part was ${K.usd(std26.lodging)}. There is no season either: the cap is flat in all twelve months. A four-night trip to Fargo from March 1 to 5, 2027 is worth ${K.usd(ex.total, 2)} at the federal maximum, made of ${K.usd(ex.lodging)} of lodging and ${K.usd(ex.mie, 2)} of M&IE, with ${K.usd(std.mie * share, 2)} on the arrival and departure days. If the hotel costs more than ${K.usd(std.lodging)}, the excess is yours unless your agency approves actual expense before you leave. The calculator above uses the statewide rate; any North Dakota ZIP code returns the same figures.`,
  body: (h) => `
<h2>No county above the floor</h2>
<p>${L(nb.map((x) => `${x.name} has ${x.n}`))} non-standard areas in the FY2027 GSA table; North Dakota has ${sum.count === 0 ? 'none' : sum.count}. That makes the rule easy to apply and hard to argue with. Cass, Burleigh, Grand Forks, Ward and Williams counties are all paid at ${K.usd(std.lodging)} and ${K.usd(std.mie)}, and so are the ${places.length} North Dakota places of 15,000 people or more in the Census file: ${L(towns)}. A Bismarck trip and a Williston trip produce the same claim for the same dates.</p>
<p>The only thing that moved between the two fiscal years is the national standard itself, which rose by ${K.usd(std.lodging - std26.lodging)} on lodging while the meal allowance stayed at ${K.usd(std.mie)}.</p>
${h.mini('areaTrip', { area: 'North Dakota (standard CONUS rate)', lodging: stdLine, mie: std.mie })}
<h2>The ${K.usd(std.mie)} split, meal by meal</h2>
<p>Because the whole state sits on the base tier, every North Dakota claim uses the same GSA breakdown: ${K.usd(t.breakfast)} for breakfast, ${K.usd(t.lunch)} for lunch, ${K.usd(t.dinner)} for dinner and ${K.usd(t.incidentals)} of incidentals. These are the amounts removed when a meal is furnished. At a three-day training in Grand Forks where lunch is served each day, the four-night trip above drops from ${K.usd(ex.total, 2)} to ${K.usd(exMeals.total, 2)}. The ${h.a('meals-and-incidental-expenses', 'M&IE breakdown page')} covers the case of a meal provided on a travel day.</p>
<h3>When a Williston hotel costs more than ${K.usd(std.lodging)}</h3>
<p>A flat statewide cap does not stop hotel prices from varying. When the per diem is insufficient, the Federal Travel Regulation lets a traveler ask for actual expenses up to ${K.pct(cap)} of the per diem rate, at the agency's discretion; on the North Dakota rate that ceiling is ${K.usd((std.lodging + std.mie) * cap)} a day (${h.src('ftr_301_11', '41 CFR part 301-11')}). Approval has to come first, and the receipt is needed. Private employers set their own policy and may simply reimburse the hotel bill.</p>
<p>Businesses on the IRS high-low method pay the low rate of ${K.usd(hl.low)} for any North Dakota location under ${hl.notice}, since the state's federal total of ${K.usd(std.lodging + std.mie)} never reaches the ${K.usd(hl.threshold)} that defines a high-cost locality. For the drive itself, the EIA ${ref.gasArea} average was ${K.usd(ref.gas, 3)} a gallon in the week of ${K.day(K.ENERGY_META.gasWeek)}, and residential electricity in North Dakota averaged ${K.cents(ref.elecCents)} per kWh; the ${h.a('cost-per-mile-calculator', 'cost per mile calculator')} combines both with insurance and wear.</p>
`,
  faqs: [
    { q: 'Does Fargo, North Dakota have a higher per diem than the rest of the state?', a: `No. Cass County, which includes Fargo and West Fargo, has no GSA line in FY2027, so the rate is the standard ${K.usd(std.lodging)} for lodging and ${K.usd(std.mie)} for M&IE, as in every other North Dakota county. GSA listed no North Dakota area in FY2026 either, when lodging was ${K.usd(std26.lodging)}.` },
    { q: 'How much is a full day of per diem in North Dakota in FY2027?', a: `${K.usd(std.lodging + std.mie)}: up to ${K.usd(std.lodging)} for the hotel and ${K.usd(std.mie)} for meals and incidentals. On the first and last day of travel the M&IE is ${K.pct(share)}, or ${K.usd(std.mie * share, 2)}, and the lodging is paid only for nights actually spent away. These figures apply from October 1, 2026 to September 30, 2027.` },
    { q: 'Can a federal traveler in North Dakota be paid more than the standard lodging rate?', a: `Yes, if the agency authorizes actual expense in advance. The FTR caps it at ${K.pct(cap)} of the per diem rate, which puts the North Dakota ceiling at ${K.usd((std.lodging + std.mie) * cap)} a day in FY2027, lodging and meals together. You must keep the hotel receipt, and without that prior approval the excess over ${K.usd(std.lodging)} stays with the traveler.` },
  ],
  related: ['per-diem-rates', 'home', 'meals-and-incidental-expenses', 'state:minnesota', 'state:south-dakota', 'state:montana'],
});
