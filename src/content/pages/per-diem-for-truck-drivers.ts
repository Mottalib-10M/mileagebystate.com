import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const tr = K.P.transportation;
const share = K.P.mie.partialDayShare;
const hos = tr.hoursOfServiceDeductible, half = tr.mealsDeductible;
// An owner-operator's year: 200 full days and 50 departure or return days away from home.
const full = 200, part = 50;
const amount = full * tr.conus + part * tr.conus * share;
const tiers = K.P.mie.tiers;

export default definePage({
  id: 'per-diem-for-truck-drivers',
  group: 'rules',
  order: 30,
  slug: 'per-diem-for-truck-drivers',
  nav: 'Per diem for truck drivers',
  card: `The special transportation rate: ${K.usd(tr.conus)} a day in CONUS, ${K.usd(tr.oconus)} outside, ${K.pct(hos)} deductible for drivers under DOT hours of service.`,
  title: `Per Diem for Truck Drivers 2026-27: ${K.usd(tr.conus)}/Day, ${K.pct(hos)} Deductible`,
  description: `Per diem for truck drivers 2026-27: ${K.usd(tr.conus)} a day in CONUS, ${K.usd(tr.oconus)} outside (Notice 2026-60), ${K.pct(hos)} deductible under DOT hours of service, partial days counted at ${K.pct(share)}.`,
  h1: 'Per diem for truck drivers: the transportation industry rate',
  intro: 'Count full days and departure or return days away from home in the year: the tool applies the special rate and the deductible share that fits your case.',
  resume: `Truck drivers and other transportation workers may use one special M&IE rate instead of the rate of every town where they stop: ${K.usd(tr.conus)} a day for travel in the continental United States and ${K.usd(tr.oconus)} outside it, under IRS Notice 2026-60 for the year from October 1, 2026. For a driver subject to the Department of Transportation's hours of service limits, ${K.pct(hos)} of that meal allowance is deductible instead of the usual ${K.pct(half)}. Departure and return days count at ${K.pct(share)} when the figure is used for a deduction. Who benefits depends on status. A self-employed owner-operator deducts the allowance on Schedule C. A company driver gets it only as a per diem paid by the carrier under an accountable plan, tax-free up to the special rate; unreimbursed meals are not deductible for an employee. Choosing the special rate binds the driver or the carrier for the whole calendar year.`,
  tool: 'driver',
  body: (h) => `
<h2>Why a single rate exists for drivers</h2>
<p>${K.usd(tr.conus)} a day anywhere in the 48 states. A long-haul route can cross counties at all five GSA tiers, from ${K.usd(tiers[0])} to ${K.usd(tiers[tiers.length - 1])}, in one week, and the regular rule would make the driver look up the rate of each place where they stop to sleep. Section 4.04 of ${h.src('irs_rp_2019_48', 'Rev. Proc. 2019-48')} lets transportation workers skip that with one CONUS rate and one OCONUS rate, published each year; ${h.src('irs_notice_2026_60', 'Notice 2026-60')} sets them at ${K.usd(tr.conus)} and ${K.usd(tr.oconus)} for travel from October 1, 2026.</p>
<p>The rate is for meals and incidentals only. Lodging, when a driver pays for a motel, stays at actual cost.</p>
${h.mini('pdDriverMonth')}
<h2>Who counts as transportation industry</h2>
<p>The definition has two parts. The work must directly involve moving people or goods by airplane, barge, bus, ship, train or truck, and it must regularly take the worker away from home with stops, during a single trip, in places with different federal M&IE rates. A local delivery driver home every night does not meet it. A carrier decides which drivers qualify with a method applied consistently and in line with reasonable business practice.</p>
<h2>The 80% rule, and who it covers</h2>
<p>Meals while away from home are normally deductible at ${K.pct(half)}. ${h.src('irs_pub_463', 'Publication 463')} raises that to ${K.pct(hos)} for meals eaten during, or incident to, a period subject to the federal hours of service limits. It names interstate truck operators and bus drivers under Department of Transportation rules, certain air transportation workers under FAA rules, certain railroad employees and certain merchant mariners.</p>
<h2>Self-employed or company driver</h2>
<p>An owner-operator with ${full} full days and ${part} departure or return days away from home in a year reaches ${K.usd(amount)} of meal allowance at ${K.usd(tr.conus)} a day, the partial days counted at ${K.pct(share)} as the revenue procedure requires for a deduction. At ${K.pct(hos)}, ${K.usd(amount * hos)} of it is deductible, on Schedule C. The driver keeps a log of dates, places and business purpose but needs no meal receipts.</p>
<p>A company driver is in a different position. Unreimbursed employee expenses have not been deductible since 2018, so the only way to benefit is a per diem paid by the carrier under an accountable plan. Up to the special rate for the days away, it is not wages. A carrier may pay it per mile driven; Rev. Proc. 2019-48 uses exactly that case as an example, and lets a transportation employer test the total at least monthly instead of day by day, against the days or partial days away multiplied by the rate. Anything above that ceiling is wages on the W-2, as the ${h.a('travel-reimbursement', 'travel reimbursement page')} explains.</p>
<h2>One rate for the whole year</h2>
<p>The choice is sticky. A driver or a carrier that uses the special rate for a person must use it for all that person's trips in the calendar year, and the reverse holds: one that used the regular federal M&IE rates in the first nine months cannot move to the special rate before January 1. On partial days a carrier may prorate by any method it applies consistently; the ${h.a('first-and-last-day-per-diem', 'first and last day page')} covers that difference, and the ${h.a('per-diem-calculator', 'per diem calculator')} gives the regular GSA figure for comparison. Outside the 48 states the same logic runs at ${K.usd(tr.oconus)}, and the ${h.a('oconus-per-diem-rates', 'OCONUS page')} lists who publishes the regular rates there.</p>
`,
  faqs: [
    { q: 'What is the truck driver per diem rate for 2026-27?', a: `${K.usd(tr.conus)} a day for travel in the continental United States and ${K.usd(tr.oconus)} outside it, under IRS Notice 2026-60, for travel from October 1, 2026. This is the special M&IE rate for the transportation industry. It covers meals and incidentals only; lodging is a separate cost. Departure and return days count at ${K.pct(share)} for a deduction.` },
    { q: 'Can a company truck driver deduct per diem the carrier did not pay?', a: `No. Unreimbursed employee business expenses, meals on the road included, are miscellaneous itemized deductions suspended since 2018. A company driver benefits only when the carrier pays a per diem under an accountable plan: up to ${K.usd(tr.conus)} a day in CONUS it stays off box 1 of the W-2. Self-employed owner-operators deduct the allowance on Schedule C.` },
    { q: 'Why can truck drivers deduct 80% of meals instead of 50%?', a: `Because the tax code sets ${K.pct(hos)} for food eaten during or incident to a period subject to the Department of Transportation hours of service limits. IRS Publication 463 names interstate truck operators and bus drivers, certain air crews, railroad workers and merchant mariners. At ${K.usd(tr.conus)} a day, a driver deducts ${K.usd(tr.conus * hos)} per full day instead of ${K.usd(tr.conus * half)}.` },
    { q: `Can a driver use the ${K.usd(tr.conus)} special rate for some trips and city rates for others?`, a: `Not within one calendar year. Rev. Proc. 2019-48, section 4.04(3), requires the special rate for all of a person's travel in the year once it is used, and section 4.06(2) bars a switch in October: a driver who used the federal M&IE rates through September waits until January 1 to adopt the special rate.` },
    { q: 'How does a cents-per-mile per diem stay tax-free for a truck driver?', a: `The carrier compares what it paid over a period of a month or less with the days and partial days away times the special rate, ${K.usd(tr.conus)} in CONUS. Rev. Proc. 2019-48 allows this periodic test for transportation employers. If ${K.usd(1500)} was paid for a month with 20 full days away, the ceiling is ${K.usd(20 * tr.conus)} and the whole amount is deemed substantiated; any excess would be wages.` },
  ],
  related: ['travel-reimbursement', 'first-and-last-day-per-diem', 'per-diem-calculator', 'oconus-per-diem-rates', 'meals-and-incidental-expenses'],
  sources: ['irs_notice_2026_60', 'irs_rp_2019_48', 'irs_pub_463', 'ecfr_1_62_2'],
});
