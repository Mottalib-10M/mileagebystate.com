import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import { destIndex, T } from '../../lib/data';

const y = K.P.highLow['2027'], p = K.P.highLow['2026'];
const half = K.P.transportation.mealsDeductible;
const chi = T.dest[destIndex('IL', 'Chicago')].fy['2027'];
const nyc = T.dest[destIndex('NY', 'New York City')].fy['2027'];
const chiOct = chi.lodging[0] + chi.mie, chiDec = chi.lodging[2] + chi.mie;
const nycOct = nyc.lodging[0] + nyc.mie;
const s27 = K.std(2027);
const stdDay = s27.lodging + s27.mie;
// One employee's year: 40 days in listed localities, 60 elsewhere.
const hd = 40, ld = 60;
const year = hd * y.high + ld * y.low, yearMeals = hd * y.mieHigh + ld * y.mieLow;

export default definePage({
  id: 'high-low-per-diem-method',
  group: 'rules',
  order: 20,
  slug: 'high-low-per-diem-method',
  nav: 'High-low per diem method',
  card: `Two daily rates instead of hundreds: ${K.usd(y.high)} for listed high-cost localities, ${K.usd(y.low)} elsewhere in CONUS, from October 1, 2026.`,
  title: `High-Low Per Diem Method 2026-27: ${K.usd(y.high)} and ${K.usd(y.low)} Rates`,
  description: `High-low per diem method 2026-27: ${K.usd(y.high)} for high-cost localities and ${K.usd(y.low)} elsewhere from October 1, 2026 (${y.notice}), ${K.usd(y.mieHigh)} and ${K.usd(y.mieLow)} of it treated as meals.`,
  h1: 'The IRS high-low per diem method',
  intro: 'Count the days an employee spent in listed high-cost localities and elsewhere in CONUS: the tool applies the high and low rates of the period you choose.',
  resume: `The high-low method replaces the GSA table with two daily rates for lodging, meals and incidentals: ${K.usd(y.high)} for travel to a listed high-cost locality and ${K.usd(y.low)} for any other place in the continental United States, for travel from October 1, 2026 under IRS ${y.notice}. Before that date the figures were ${K.usd(p.high)} and ${K.usd(p.low)} (${p.notice}). Of each rate, ${K.usd(y.mieHigh)} and ${K.usd(y.mieLow)} count as the meal part, the share that falls under the ${K.pct(half)} limit on the payor's meal deduction. A locality makes the list when its federal per diem reaches ${K.usd(y.threshold)} for some part of the year, up from ${K.usd(p.threshold)} in the previous notice. Only an employer or other payor can use the method, and only for CONUS trips. Once it picks high-low for an employee, it keeps it for every CONUS trip of that employee in the calendar year, and the last three months of 2026 follow a transition rule.`,
  tool: 'highlow',
  body: (h) => `
<h2>Two numbers instead of a table</h2>
<p>${K.usd(y.high)} or ${K.usd(y.low)}: under ${h.src('irs_notice_2026_60', y.notice)} that is the whole rate card for an employer's CONUS travel from October 1, 2026, instead of a GSA lookup by county and month. The amount deemed substantiated each day is the lesser of the allowance paid and the applicable rate, exactly as with the regular per diem method, and no lodging receipt is needed for the amount. The appeal is plain: one line in a travel policy replaces a table of ${K.fy(2027).nsa} non-standard areas and their monthly caps. The trade-off is precision, and the direction of the error depends on the city and the month.</p>
${h.mini('pdHighLow')}
<h2>Chicago in October and in December</h2>
<p>${y.notice} lists Chicago (Cook and Lake counties) as high-cost from October 1 to November 30 and from April 1 to September 30. In October 2026 the GSA rate is ${K.usd(chi.lodging[0])} of lodging plus ${K.usd(chi.mie)} of M&IE, ${K.usd(chiOct)} a day, and high-low pays ${K.usd(y.high)}: almost the same. In December Chicago drops off the list, so high-low pays the low ${K.usd(y.low)} while GSA would allow ${K.usd(chiDec)}. New York City sits on the list all year, yet its October GSA rate of ${K.usd(nycOct)} is far above ${K.usd(y.high)}. At the other end, a standard-rate county gets ${K.usd(y.low)} under high-low against ${K.usd(stdDay)} from GSA, a gain for the traveler.</p>
<h2>Who may use it, and how long the choice lasts</h2>
<p>The rules sit in section 5 of ${h.src('irs_rp_2019_48', 'Rev. Proc. 2019-48')}. High-low is for payors that pay a per diem allowance instead of reimbursing actual costs. Employees and self-employed people cannot use it to figure a meal deduction on their own return. A payor that uses it for an employee must use it for all of that employee's CONUS travel in the calendar year; for trips outside CONUS it may use actual costs or the regular federal rates (the ${h.a('oconus-per-diem-rates', 'OCONUS page')} explains those). Neither high-low nor a lodging-plus-M&IE per diem at the regular federal rates is available when the payor and the employee are related parties, which for this purpose means 10% ownership.</p>
<h3>October to December 2026: the transition</h3>
<p>The notice applies from October 1, but the IRS works by calendar year. For travel in the last three months of 2026, a payor must keep the method it used for that employee in the first nine months: an employer on the regular GSA rates cannot switch to high-low in October, and one on high-low cannot leave it before January. Within high-low, it may keep the ${K.usd(p.high)} and ${K.usd(p.low)} rates and the old list of localities through December 31, or move to ${K.usd(y.high)} and ${K.usd(y.low)} with the new list, as long as it does the same for every employee paid under high-low (section 5.04).</p>
<h2>The meal part and the list changes</h2>
<p>The meal shares did not move: ${K.usd(y.mieHigh)} and ${K.usd(y.mieLow)} in both notices. They matter for the payor's deduction, since that part of each day is food and beverage and deductible at ${K.pct(half)}, and they double as the M&IE-only rates when the employer pays lodging itself. An employee with ${hd} high-cost days and ${ld} other CONUS days in a year can receive up to ${K.usd(year)} tax-free under high-low, of which ${K.usd(yearMeals)} is the meal part.</p>
<p>${y.notice} added four localities to the list (Tucson, Arizona; San Mateo, Foster City and Belmont, California; Albuquerque, New Mexico; Cody, Wyoming), removed Panama City, Florida, and changed the high-cost months of fifteen others, New York City and Philadelphia among them. A trip priced at the exact GSA rate of the city stays one click away in the ${h.a('per-diem-calculator', 'per diem calculator')}, and the tax treatment of any excess is on the ${h.a('travel-reimbursement', 'travel reimbursement page')}.</p>
`,
  faqs: [
    { q: 'What are the high-low per diem rates from October 1, 2026?', a: `${K.usd(y.high)} a day for travel to a listed high-cost locality and ${K.usd(y.low)} for any other CONUS locality, under IRS ${y.notice}. Of these, ${K.usd(y.mieHigh)} and ${K.usd(y.mieLow)} are treated as paid for meals. The previous rates, ${K.usd(p.high)} and ${K.usd(p.low)} under ${p.notice}, may still be used through December 31, 2026 if applied consistently.` },
    { q: 'Is Chicago a high-cost locality under the high-low method all year?', a: `No. ${y.notice} lists Chicago, meaning Cook and Lake counties, as high-cost from October 1 to November 30 and from April 1 to September 30. From December through March a Chicago trip gets the low rate of ${K.usd(y.low)}, while the FY2027 GSA rate for December is ${K.usd(chiDec)} a day, lodging and M&IE included.` },
    { q: 'Can an employer switch to the high-low method in October 2026?', a: `Not for an employee it paid under the regular per diem method earlier in 2026. Rev. Proc. 2019-48, section 5.04, requires the payor to keep the same method for the last three months of the calendar year. The switch can happen on January 1, 2027, at ${K.usd(y.high)} and ${K.usd(y.low)}, and then holds for all of that employee's CONUS travel in 2027.` },
    { q: 'Can a self-employed consultant use the high-low rates to deduct travel?', a: `No. Rev. Proc. 2019-48, section 5.01, reserves high-low for payors paying a per diem allowance. A self-employed person deducts lodging at actual cost and may figure meals with the federal M&IE rate of each locality, ${K.usd(s27.mie)} in a standard-rate county in FY2027, subject to the ${K.pct(half)} meal limit.` },
    { q: `How much of the ${K.usd(y.high)} high-low rate counts as meals?`, a: `${K.usd(y.mieHigh)} of the ${K.usd(y.high)} high rate and ${K.usd(y.mieLow)} of the ${K.usd(y.low)} low rate, per ${y.notice}. The payor treats that part as food and beverage, deductible at ${K.pct(half)}, and the rest as lodging and incidentals. The same ${K.usd(y.mieHigh)} and ${K.usd(y.mieLow)} serve as the high-low rates for a meals-only allowance.` },
  ],
  related: ['travel-reimbursement', 'per-diem-calculator', 'per-diem-rates', 'oconus-per-diem-rates', 'state:illinois'],
  sources: ['irs_notice_2026_60', 'irs_notice_2025_54', 'irs_rp_2019_48', 'irs_pub_463', 'gsa_files'],
});
