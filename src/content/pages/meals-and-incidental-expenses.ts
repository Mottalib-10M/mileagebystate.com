import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const share = K.P.mie.partialDayShare;
const tiers = K.P.mie.tiers;
const lo = tiers[0], top = tiers[tiers.length - 1];
const tLo = K.tier(lo), t80 = K.tier(80), tTop = K.tier(top);
const inc = tLo.incidentals;
// First day at the lowest tier with lunch and dinner served: the deduction would go under the incidentals.
const rawLo = lo * share - tLo.lunch - tLo.dinner;
const floorDay = Math.max(Math.min(inc, lo * share), rawLo);
// Full conference day at $80 with breakfast and lunch served.
const conf80 = 80 - t80.breakfast - t80.lunch;
const travelTop = top * share - tTop.dinner;
const incOnly = K.P.transportation.incidentalsOnly;
const receipt = K.P.mie.mealReceiptAbove;
const half = K.P.transportation.mealsDeductible;

export default definePage({
  id: 'meals-and-incidental-expenses',
  group: 'perdiem',
  order: 30,
  slug: 'meals-and-incidental-expenses',
  nav: 'M&IE breakdown and deductions',
  card: 'The five M&IE tiers split into breakfast, lunch, dinner and incidentals, and what a provided meal takes off.',
  title: 'Meals and Incidental Expenses 2026: M&IE Tiers, Deductions',
  description: `Meals and incidental expenses 2026-27: M&IE from ${K.usd(lo)} to ${K.usd(top)} a day, each tier split by meal, ${K.usd(inc)} of incidentals kept, provided meals deducted per FTR 301-11.21.`,
  h1: 'Meals and incidental expenses (M&IE): tiers and deductions',
  intro: 'Choose the M&IE rate of the place, say which meals were served, and see what the day still pays.',
  resume: `Meals and incidental expenses, or M&IE, is the flat daily part of the federal per diem that covers food and the tips around travel: ${K.usd(lo)}, ${K.usd(tiers[1])}, ${K.usd(tiers[2])}, ${K.usd(tiers[3])} or ${K.usd(top)} a day in the continental United States, depending on the GSA area. Each tier is split by GSA into a value for breakfast, lunch and dinner plus ${K.usd(inc)} of incidental expenses; at the top tier that is ${K.usd(tTop.breakfast)}, ${K.usd(tTop.lunch)}, ${K.usd(tTop.dinner)} and ${K.usd(tTop.incidentals)}. The split matters only when a meal is provided: a lunch paid by the government or folded into a conference fee comes off at its GSA value, even on a ${K.pct(share)} travel day, but the day never drops below the incidentals. Meals served by an airline and breakfast included in the hotel rate are not deducted. The tiers have not changed since FY${K.P.mie.tiersRevisedFy} and apply to FY2026 and FY2027 trips alike.`,
  tool: 'meals',
  body: (h) => `
<h2>Five tiers, one split each</h2>
<p>The whole continental table uses only five M&IE amounts, and GSA attaches a fixed meal split to each. A dinner is worth ${K.usd(tLo.dinner)} in a ${K.usd(lo)} county and ${K.usd(tTop.dinner)} in a ${K.usd(top)} one, whatever the restaurant prices of the city. The incidentals line is the same everywhere: ${K.usd(inc)}.</p>
${h.table(['M&IE rate', 'Breakfast', 'Lunch', 'Dinner', 'Incidentals', 'Travel day (75%)'], tiers.map((t) => { const x = K.tier(t); return [K.usd(t), K.usd(x.breakfast), K.usd(x.lunch), K.usd(x.dinner), K.usd(x.incidentals), K.usd(t * share, 2)]; }), `GSA M&IE breakdown for CONUS, in force since FY${K.P.mie.tiersRevisedFy} (${h.src('gsa_mie', 'GSA M&IE breakdowns')})`, ['l', 'r', 'r', 'r', 'r', 'r'])}
${h.mini('mealDay')}
<h2>What the incidentals pay for, and what they do not</h2>
<p>${K.usd(inc)} a day does not go far, and it is not meant to. The IRS defines incidental expenses as fees and tips given to porters, baggage carriers, hotel staff and staff on ships. Laundry, dry cleaning, lodging taxes, phone calls, and the ride from your hotel to a restaurant are outside it, according to ${h.src('irs_pub_463', 'IRS Publication 463')}. Lodging taxes are a separate miscellaneous expense under the FTR; for laundry and local rides, your employer's policy decides.</p>
<p>For a traveler who buys no meals at all on a given day, a separate IRS method allows ${K.usd(incOnly)} a day for incidentals alone (${h.src('irs_notice_2026_60', 'Notice 2026-60')}, section 4). It cannot be combined with the meal allowance on the same day, and it is not subject to the meal deduction limit.</p>
<h2>Deducting a provided meal, step by step</h2>
<p>The rule sits in ${h.src('ftr_301_11', '41 CFR 301-11.21')}. A meal furnished by the government or included in a registration fee is taken off at the GSA value shown for your tier. On a full day the arithmetic is plain: at ${K.usd(80)}, a conference that serves breakfast and lunch leaves ${K.usd(conf80)}. On the first or last day the deduction is made from the reduced amount, and in full: dinner on a departure day at ${K.usd(top)} leaves ${K.usd(top * share, 2)} minus ${K.usd(tTop.dinner)}, so ${K.usd(travelTop, 2)}.</p>
<p>The floor shows up at the lowest tier. A first day at ${K.usd(lo)} pays ${K.usd(lo * share, 2)}; take off a provided lunch (${K.usd(tLo.lunch)}) and dinner (${K.usd(tLo.dinner)}) and you would land at ${K.usd(rawLo, 2)}. The regulation stops the deductions at the incidentals, so the day pays ${K.usd(floorDay, 2)}.</p>
<h3>Meals that are never deducted</h3>
<p>Food from a common carrier (the snack box on a flight, a meal on a train) and a complimentary breakfast that comes with the hotel room leave M&IE untouched. An agency may also pay the full amount when you could not eat a furnished meal because official business ran over it, or for medical or religious reasons, provided you asked in advance when you knew of the meal and tried to arrange an alternative.</p>
<h2>The tax side: employers need not deduct</h2>
<p>Private employers paying per diem for tax purposes follow a looser rule. ${h.src('irs_rp_2019_48', 'Rev. Proc. 2019-48')} (section 6.03) says a payor is not required to reduce the federal M&IE rate for meals provided in kind, provided it reasonably believes the employee will have meal and incidental costs on each travel day. Many companies still mirror the federal deductions in their policy, but the tax-free ceiling does not demand it.</p>
<p>Two limits apply after the payment. The meal part of the allowance is treated as food and beverage, deductible at ${K.pct(half)} by whoever bears the cost. And if your employer reimburses actual meals instead of paying a flat rate, the federal rule asks for a receipt for any single meal above ${K.usd(receipt)}. For a trip priced as a whole, the ${h.a('per-diem-calculator', 'per diem calculator')} spreads provided meals over full days and travel days for you.</p>
`,
  faqs: [
    { q: 'What do the incidental expenses in M&IE actually cover?', a: `Fees and tips given to porters, baggage carriers, hotel staff and staff on ships: ${K.usd(inc)} a day at every CONUS tier. IRS Publication 463 excludes laundry, cleaning and pressing, lodging taxes, phone calls and transport between your lodging and the places you eat. Those costs are claimed separately when your travel policy allows it, never out of the M&IE.` },
    { q: 'How much M&IE is deducted for a lunch served at a conference?', a: `The GSA lunch value of your tier: from ${K.usd(tLo.lunch)} at ${K.usd(lo)} to ${K.usd(tTop.lunch)} at ${K.usd(top)}. The deduction is the same on a full day and on a ${K.pct(share)} travel day, because 41 CFR 301-11.21(b) takes the entire meal value off the reduced rate. Only meals paid by the government or included in the registration fee count.` },
    { q: `Can provided meals push a day's M&IE below ${K.usd(inc)}?`, a: `No. Under 41 CFR 301-11.21(b) the meal deductions stop at the incidental expenses amount. A first day at ${K.usd(lo)} pays ${K.usd(lo * share, 2)}; with lunch and dinner provided the arithmetic would give ${K.usd(rawLo, 2)}, so the day pays ${K.usd(floorDay, 2)} instead. With all three meals furnished on a full day, the traveler still receives ${K.usd(inc)}.` },
    { q: 'Does a private employer have to cut M&IE for meals it provides?', a: `Not for the tax-free limit. Rev. Proc. 2019-48, section 6.03, lets a payor keep the full federal M&IE rate when meals are provided in kind, as long as it reasonably believes the employee still incurs meal and incidental costs each travel day. The FTR deductions bind federal agencies; a company may copy them in its own policy.` },
    { q: 'Why is a dinner worth the same in every city of one M&IE tier?', a: `Because GSA does not price meals city by city. It sets five M&IE rates and one split for each, so every ${K.usd(80)} area values dinner at ${K.usd(t80.dinner)} and breakfast at ${K.usd(t80.breakfast)}. The split has applied since FY${K.P.mie.tiersRevisedFy}, and GSA plans its next review of the tiers for FY${K.P.mie.tiersNextReviewFy}.` },
  ],
  related: ['per-diem-calculator', 'first-and-last-day-per-diem', 'per-diem-rates', 'oconus-per-diem-rates', 'travel-reimbursement'],
  sources: ['gsa_mie', 'ftr_301_11', 'irs_pub_463', 'irs_rp_2019_48', 'irs_notice_2026_60'],
});
