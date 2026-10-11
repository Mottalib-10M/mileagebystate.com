import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const share = K.P.mie.partialDayShare;
const tiers = K.P.mie.tiers;
const hrs = K.P.mie.travelMinHours;
const s27 = K.std(2027);
const t74 = 74;
// Five calendar days at $74.
const five = t74 * share * 2 + t74 * 3;
// Rev. Proc. 2019-48 example: 9 a.m. one day to 5 p.m. the next.
const ftrTwo = s27.mie * share * 2;
const incOnly = K.P.transportation.incidentalsOnly;

export default definePage({
  id: 'first-and-last-day-per-diem',
  group: 'perdiem',
  order: 40,
  slug: 'first-and-last-day-per-diem',
  nav: 'First and last day per diem (75%)',
  card: 'Why travel days pay three quarters of the M&IE, where the rule now sits in the FTR, and how the IRS treats it.',
  title: 'First and Last Day Per Diem 2026: 75% Rule, FTR 301-11.20',
  description: `First and last day per diem 2026: ${K.pct(share)} of M&IE on travel days (${K.usd(s27.mie * share, 2)} at the ${K.usd(s27.mie)} standard rate), FTR 301-11.20 since Dec. 2025, Rev. Proc. 2019-48 for taxes.`,
  h1: 'First and last day per diem: the 75% rule',
  intro: 'Enter the M&IE rate and the number of calendar days: the tool applies three quarters on the two travel days and the full rate in between.',
  resume: `On the day a federal traveler leaves and on the day they return, M&IE is paid at ${K.pct(share)} of the daily rate, whatever the departure or arrival hour; every full day in between gets 100%. A trip of more than ${hrs} but less than 24 hours gets ${K.pct(share)} for each calendar day in travel status, and ${hrs} hours or less gets nothing. At the FY2027 standard rate of ${K.usd(s27.mie)}, a travel day pays ${K.usd(s27.mie * share, 2)}; at the top ${K.usd(tiers[tiers.length - 1])} tier, ${K.usd(tiers[tiers.length - 1] * share, 2)}. The rule now sits in 41 CFR 301-11.20, after GSA rewrote part 301-11 in December 2025; it was § 301-11.101 before, the number Rev. Proc. 2019-48 still cites. For taxes, Rev. Proc. 2019-48 lets an employer use the same ${K.pct(share)} or any other proration it applies consistently, while a traveler deducting meals under the standard allowance must use ${K.pct(share)}.`,
  tool: 'firstlast',
  body: (h) => `
<h2>The text, and its new number</h2>
<p>${K.pct(share)} on the first and last day: ${h.src('ftr_301_11', '41 CFR 301-11.20(a)')} says it in two sentences. Travel of more than ${hrs} but less than 24 hours earns three quarters of the M&IE rate for each calendar day in travel status; travel of 24 hours or more earns three quarters on the day of departure and the last day, and full days are paid at 100%. Ship travel is the one exception, left to the agency within the M&IE rate.</p>
<p>Before FTR Case 2025-05, published in the Federal Register on December 8, 2025 (90 FR 56893), the same rule lived at § 301-11.101. The case rewrote and renumbered part 301-11, and the M&IE rule became § 301-11.20, with provided meals at § 301-11.21. The substance did not change. ${h.src('irs_rp_2019_48', 'Rev. Proc. 2019-48')} still points to the old section, and so may an older travel policy; read those references as the new one.</p>
${h.mini('pdTravelDays')}
<h2>Departure hour does not matter, the calendar does</h2>
<p>The federal rule ignores the clock. Leave at 5 a.m. or at 9 p.m., the first day is a ${K.pct(share)} day. What counts is the calendar date on which you leave your home, office or other authorized point and the date you get back (41 CFR 301-11.5). A five-day trip at ${K.usd(t74)} therefore pays ${K.usd(t74 * share, 2)} twice and ${K.usd(t74)} three times: ${K.usd(five, 2)}, not ${K.usd(t74 * 5)}.</p>
${h.table(['M&IE rate', 'Each travel day', 'Two travel days', 'Lost to the rule on any trip'], tiers.map((t) => [K.usd(t), K.usd(t * share, 2), K.usd(t * share * 2, 2), K.usd(t * (1 - share) * 2, 2)]), `Travel-day M&IE by CONUS tier, FY2026 and FY2027 (${h.src('gsa_mie', 'GSA')})`, ['l', 'r', 'r', 'r'])}
<p>A same-day trip is the edge case. With no night away, the day is both first and last; the regulation pays three quarters only if travel status runs past ${hrs} hours, and the ${h.a('per-diem-calculator', 'per diem calculator')} asks for the hours as soon as both dates match. Provided meals on a travel day are taken off the reduced amount in full, a rule explained on the ${h.a('meals-and-incidental-expenses', 'M&IE breakdown page')}.</p>
<h2>What the IRS lets an employer do instead</h2>
<p>A private employer is not bound by the FTR, and the tax rules give it room. Section 6.04 of Rev. Proc. 2019-48 allows a payor to prorate the M&IE for partial days either at three quarters, as the FTR does, or by any method it applies consistently and that is consistent with reasonable business practice. The procedure gives its own example: an employee away from 9 a.m. one day to 5 p.m. the next may be paid twice the daily M&IE rate, even though the FTR would allow one and a half. At the standard rate, that is ${K.usd(s27.mie * 2)} instead of ${K.usd(ftrTwo, 2)}, all of it within the tax-free ceiling.</p>
<p>The flexibility belongs to the payor, not to the traveler. The same section requires the three-quarter method when an employee or a self-employed person figures a deduction with the standard meal allowance (section 4.03) or with the ${K.usd(incOnly)} incidentals-only rate (section 4.05). Truck drivers who deduct the special transportation rate fall under that requirement too, which the ${h.a('per-diem-for-truck-drivers', 'truck driver page')} prices for a full year.</p>
<h3>Which city's rate on a travel day</h3>
<p>On the day you move, the rate is that of the place you are traveling to for work under the FTR (41 CFR 301-11.4). For tax purposes, ${h.src('irs_pub_463', 'Publication 463')} says that when you stop in more than one place in a day, you use the rate where you stop for sleep or rest. If you reach the hotel after midnight, the FTR lets you claim the room on the previous calendar day, which keeps the night attached to the day you set off.</p>
`,
  faqs: [
    { q: 'Is the 75% first and last day rule in 41 CFR 301-11.101 still in force?', a: `Yes, under a new number. FTR Case 2025-05, published at 90 FR 56893 on December 8, 2025, rewrote part 301-11 and moved the rule to § 301-11.20: ${K.pct(share)} of the M&IE rate on the day of departure and the last day of travel, 100% on full days. Rev. Proc. 2019-48 still cites § 301-11.101, and so may older travel policies.` },
    { q: 'Does the 75% first-day rule apply if I leave at 6 a.m.?', a: `Under the FTR, yes. The departure day is paid at ${K.pct(share)} of the M&IE rate whatever the hour, because the rule counts calendar days, not hours, once travel lasts 24 hours or more. A private employer may prorate differently for tax purposes, for instance by hours away, if it applies the method consistently (Rev. Proc. 2019-48, section 6.04).` },
    { q: 'Can my employer pay full M&IE on travel days and keep it tax-free?', a: `It can, if that is its consistent method. Rev. Proc. 2019-48 lets a payor prorate partial days at ${K.pct(share)} or with any consistent method in line with reasonable business practice. Its own example allows twice the daily rate for a trip from 9 a.m. one day to 5 p.m. the next, which is ${K.usd(s27.mie * 2)} at the FY2027 standard rate.` },
    { q: 'Must a self-employed traveler use 75% for the first and last day of a trip?', a: `Yes, when deducting meals with the standard meal allowance. Section 6.04 of Rev. Proc. 2019-48 requires the three-quarter method for amounts figured under section 4.03 (meals and incidentals) or 4.05 (the ${K.usd(incOnly)} incidentals-only rate). A two-night trip in a ${K.usd(80)} area gives ${K.usd(80 * share * 2 + 80, 2)} before the meal deduction limit.` },
    { q: 'What is the first and last day M&IE at each GSA tier?', a: `${K.listOf(tiers.map((t) => `${K.usd(t * share, 2)} at ${K.usd(t)}`))}. These figures are ${K.pct(share)} of each CONUS M&IE rate and apply to FY2026 and FY2027 trips, since the tiers have not changed since FY${K.P.mie.tiersRevisedFy}. A trip of more than ${hrs} but less than 24 hours gets one such amount for each calendar day.` },
  ],
  related: ['per-diem-calculator', 'meals-and-incidental-expenses', 'per-diem-rates', 'per-diem-for-truck-drivers', 'high-low-per-diem-method'],
  sources: ['ftr_301_11', 'irs_rp_2019_48', 'gsa_mie', 'irs_pub_463'],
});
