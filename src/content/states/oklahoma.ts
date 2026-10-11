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
const sum = K.stateSummary('oklahoma');
const ref = K.stateRef('oklahoma');
const okc = sum.list.find((n) => n.name === 'Oklahoma City')!;
const okcRow = T.dest[okc.i].fy['2027'];
const std = sum.std, std26 = K.std(2026);
const places = (PLACES as { rows: Array<[string, string, string, number, number, number]> }).rows.filter((r) => r[1] === 'OK');
const stdPlaces = places.filter((r) => r[3] === -1);
const listed = places.filter((r) => r[3] >= 0).map((r) => r[0]);
const norman = places.find((r) => r[0] === 'Norman');
const lawton = places.find((r) => r[0] === 'Lawton');
const tulsaCo = places.filter((r) => r[2] === 'Tulsa County').map((r) => r[0]);
const ex = K.trip({ destIndex: destIndex('OK', 'Oklahoma City'), depart: '2027-02-15', ret: '2027-02-18' });
const exStd = K.trip({ destIndex: -1, depart: '2027-02-15', ret: '2027-02-18' });
const roomGap = ex.lodging - exStd.lodging, mealGap = ex.mie - exStd.mie;
const share = K.P.mie.partialDayShare;
const tOk = K.tier(okc.mie), tStd = K.tier(std.mie);

export default defineState({
  slug: 'oklahoma',
  dest: 'Oklahoma City',
  title: 'Per Diem Rates Oklahoma 2026-27: Oklahoma City vs. Tulsa',
  description: `Oklahoma per diem 2026-27: Oklahoma County pays ${K.usd(okc.high)} a night and ${K.usd(okc.mie)} M&IE in FY2027, only ${K.usd(okc.high - std.lodging)} above the standard room; Tulsa and Norman get ${K.usd(std.lodging)} plus ${K.usd(std.mie)}.`,
  intro: `Oklahoma's single GSA area beats the standard room cap by just ${K.usd(okc.high - std.lodging)}, but its meal allowance is ${K.usd(okc.mie - std.mie)} a day higher.`,
  resume: `Oklahoma per diem in FY2027 is ${K.usd(okc.high)} of lodging and ${K.usd(okc.mie)} of M&IE in Oklahoma County, the state's only GSA area, and ${K.usd(std.lodging)} plus ${K.usd(std.mie)} everywhere else, including Tulsa and Norman. The Oklahoma City cap is the same in every month from October 1, 2026 to September 30, 2027, and rose from ${K.usd(okc.prev!.high)} the year before. A three-night stay in Oklahoma City from February 15 to 18, 2027 totals ${K.usd(ex.total, 2)} at the federal maximum; the same dates in Tulsa total ${K.usd(exStd.total, 2)}. Of that ${K.usd(ex.total - exStd.total, 2)} difference, only ${K.usd(roomGap)} comes from the hotel and ${K.usd(mealGap, 2)} from meals and incidentals. Lodging taxes are reimbursed on top under most policies. The calculator above starts on Oklahoma City; enter any Oklahoma city or ZIP code to change it.`,
  body: (h) => `
<h2>Oklahoma County's edge is in the meals</h2>
<p>The lodging premium of the only Oklahoma line is thin. At ${K.usd(okc.high)}, the Oklahoma City cap sits ${K.usd(okc.high - std.lodging)} above the ${K.usd(std.lodging)} standard and gained ${K.usd(okc.high - okc.prev!.high)} over the year. The M&IE is a different story: ${K.usd(okc.mie)} against ${K.usd(std.mie)}, or ${K.usd(okc.mie - std.mie)} more per full day. Broken down by GSA, that is ${K.usd(tOk.breakfast)} instead of ${K.usd(tStd.breakfast)} for breakfast, ${K.usd(tOk.lunch)} instead of ${K.usd(tStd.lunch)} for lunch and ${K.usd(tOk.dinner)} instead of ${K.usd(tStd.dinner)} for dinner. On a two-week posting at a state agency in Oklahoma City, the meal line outgrows the room line from the very first day.</p>
<h3>A year-on-year gap that barely moved</h3>
<p>In FY2026 the Oklahoma County cap was ${K.usd(okc.prev!.high)} against a standard of ${K.usd(std26.lodging)}, a spread of ${K.usd(okc.prev!.high - std26.lodging)}. For FY2027 it is ${K.usd(okc.high - std.lodging)}. The meal tiers on both sides did not change.</p>
${h.mini('areaTrip', { area: 'Oklahoma City, OK', lodging: okcRow.lodging, mie: okcRow.mie })}
<h2>Tulsa, Norman and Lawton on the standard line</h2>
<p>Tulsa County has no GSA area, so ${L(tulsaCo)} are paid the standard ${K.usd(std.lodging)} and ${K.usd(std.mie)}. ${norman ? `Norman, in ${norman[2]}, is not part of the listed county either.` : ''} Among the ${places.length} Oklahoma places of 15,000 or more people in the Census file, ${listed.length} fall inside Oklahoma County (${L(listed.slice(0, 5))}${listed.length > 5 ? ' and others' : ''}) and ${stdPlaces.length} outside it. Edmond sits in Oklahoma County and takes the city rate; Moore, in Cleveland County, does not. ${lawton ? `Lawton, in ${lawton[2]}, is also a standard-rate stop, as are Enid and Stillwater.` : ''} A traveler shuttling between Tulsa and Oklahoma City on the same trip changes rate with the hotel: ${K.usd(std.lodging)} one night, ${K.usd(okc.high)} the next, so the claim should list each night with its own cap. The ZIP search above settles any address.</p>
<h2>Fuel on Oklahoma highways</h2>
<p>EIA has no Oklahoma series, so this page uses its ${ref.gasArea} average: ${K.usd(ref.gas, 3)} for a gallon of regular in the week of ${K.day(K.ENERGY_META.gasWeek)}, against ${K.usd(K.ENERGY_META.usGas, 3)} nationally. Diesel on the same series was ${K.usd(ref.diesel, 3)}. A driver paid the IRS ${K.centsWord(K.irs('2026-07-01'))} keeps the difference between that rate and the true cost of the car, which the ${h.a('cost-of-owning-a-car-calculator', 'cost of owning a car calculator')} estimates.</p>
`,
  faqs: [
    { q: 'Does Tulsa, Oklahoma have its own per diem rate?', a: `No. Tulsa County is not a GSA non-standard area in FY2027, so Tulsa and Broken Arrow use the standard ${K.usd(std.lodging)} for lodging and ${K.usd(std.mie)} for M&IE. Oklahoma County, listed as Oklahoma City, is the only area in the state with its own rate: ${K.usd(okc.high)} and ${K.usd(okc.mie)}, from October 1, 2026.` },
    { q: 'How much more does Oklahoma City pay than the rest of Oklahoma per day?', a: `${K.usd(okc.high + okc.mie - std.lodging - std.mie)} on a full day in FY2027: ${K.usd(okc.high - std.lodging)} more for lodging and ${K.usd(okc.mie - std.mie)} more for M&IE. On a travel day the meal gap shrinks to ${K.usd((okc.mie - std.mie) * share, 2)} under the 75% rule. Over a three-night stay, meals account for ${K.usd(mealGap, 2)} of the ${K.usd(ex.total - exStd.total, 2)} difference and the hotel for ${K.usd(roomGap)}.` },
    { q: 'Is Norman, Oklahoma in the Oklahoma City per diem area?', a: `No. Norman is in ${norman ? norman[2] : 'Cleveland County'}, and GSA lists only Oklahoma County for the Oklahoma City rate. A stay in Norman in FY2027 is paid at ${K.usd(std.lodging)} for lodging and ${K.usd(std.mie)} for M&IE. If you sleep in Oklahoma City for a meeting in Norman, ask which rate your employer applies.` },
  ],
  related: ['per-diem-rates', 'home', 'cost-of-owning-a-car-calculator', 'state:texas', 'state:kansas', 'state:arkansas'],
});
