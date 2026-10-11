import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import { medicalMiles } from '../../lib/engine/tax';

const m1 = K.irs('2026-06-30', 'medical'), m2 = K.irs('2026-07-01', 'medical');
const ch = K.irs('2026-07-01', 'charity');
const floor = K.P.medical.agiFloor;
const ex = medicalMiles({ miles: 1200, rate: m2, parkingTolls: 40, otherMedical: 5000, agi: 70000, floor });

export default definePage({
  id: 'medical-and-charity-mileage',
  group: 'mileage',
  order: 60,
  slug: 'medical-and-charity-mileage',
  nav: 'Medical and charity mileage',
  card: '23.5 cents for medical care since July 2026, 14 cents for volunteering, and the limits on each.',
  title: 'Medical Mileage Rate 2026: 23.5 Cents, Charity 14 Cents',
  description: `Medical mileage rate 2026: 20.5 cents to June 30 and 23.5 cents from July 1, deductible above 7.5% of AGI; charity driving stays at 14 cents. Calculator inside.`,
  h1: 'Medical and charity mileage for 2026',
  intro: 'Drives to doctors and for a charity are priced at their own IRS rates, and each comes with a condition that decides whether any of it is deductible.',
  resume: `Driving to medical care is worth ${K.centsWord(m1)} a mile through June 30, 2026 and ${K.centsWord(m2)} from July 1, when the IRS raised it along with the business rate. It only lowers your tax if you itemize and your total medical costs, driving included, exceed ${K.pct(floor, 1)} of your adjusted gross income. With an AGI of $70,000, the first ${K.usd(70000 * floor)} of medical costs gives nothing: 1,200 medical miles after July 1 plus $40 of parking and $5,000 of other bills come to ${K.usd(ex.total)}, so ${K.usd(ex.deductible)} is deductible. Volunteer driving for a qualified charity is valued at ${K.centsWord(ch)} a mile, a rate written into the tax code that did not move in July, and it is deductible as a charitable gift for those who itemize. Military members moving under orders use the medical rate. The calculator above handles both purposes.`,
  tool: 'medical',
  body: (h) => `
<h2>Medical miles: what qualifies</h2>
<p>${h.src('irs_pub_502', 'Publication 502')} counts transportation "primarily for, and essential to, medical care": trips to a doctor, a hospital, a pharmacy to pick up prescriptions, physical therapy, or a parent driving a child to treatment. You may use the standard medical rate or actual gas and oil costs, but not depreciation, insurance or general repairs. Parking fees and tolls are added at cost either way. A trip to another city for treatment counts too, bus, train or plane fares included, when the trip is primarily for and essential to the care.</p><p>Keep the same kind of record as for business driving: date, provider, purpose and miles, with the parking receipts. Health insurance or a health savings account that paid you back for a trip removes it from the deduction, since only costs you bore yourself count.</p>
<p>The rate itself is the variable-cost part of the IRS car cost study, which is why it is far below the business rate: ${K.centsWord(m2)} against ${K.centsWord(K.irs('2026-07-01'))} since July 1, 2026 (${h.src('irs_ann_2026_11', 'Announcement 2026-11')}). Miles driven before July 1 stay at ${K.centsWord(m1)}.</p>
<h2>The 7.5% wall</h2>
<p>Most people never deduct a medical mile, because the floor is high and the standard deduction is larger than their itemized deductions. The floor applies to the total of medical costs: insurance premiums paid with after-tax money, co-pays, dental work, glasses, long-term care and travel all count together. A year with surgery, a hospital stay far from home or a child in regular therapy is the year a mileage log pays off. Lodging near a hospital for treatment can also count, up to $50 a night per person under Publication 502, but meals generally do not.</p>
${h.mini('mileSplit')}
<h2>Charity miles: the 14-cent rate</h2>
<p>The charitable rate comes from section 170(i) of the Internal Revenue Code, not from a cost study, so only Congress can change it, and the July increase left it at ${K.centsWord(ch)}. It covers driving you do while donating services to a qualified organization: delivering meals, transporting volunteers, running errands for a food bank. ${h.src('irs_pub_526', 'Publication 526')} lets you deduct actual gas and oil instead if that is higher, plus parking and tolls, but never your time, depreciation or insurance. A charity that reimburses you removes the deduction for the reimbursed part.</p>
<p>Keep a written record of each volunteer drive: date, organization, purpose and miles. For a single contribution of $250 or more, including unreimbursed car costs, you also need a written acknowledgment from the organization describing the services you provided.</p>
<h2>Military moves</h2>
<p>The moving rate equals the medical rate: ${K.centsWord(m2)} a mile from July 1, 2026. Since 2018 only active-duty members of the armed forces moving under military orders to a permanent change of station could deduct moving costs; ${h.src('irs_notice_2026_10', 'Notice 2026-10')} adds certain members of the intelligence community who relocate after December 31, 2025. Everyone else gets no moving deduction for a job move. For business driving, see the ${h.a('irs-mileage-rate', 'IRS mileage rate page')}; for a log, the ${h.a('mileage-log', 'mileage log')}.</p>
`,
  faqs: [
    { q: 'What is the medical mileage rate for the second half of 2026?', a: `${K.centsWord(m2)} a mile for medical care driven from July 1, 2026, set by Announcement 2026-11; it was ${K.centsWord(m1)} from January 1 to June 30. Add parking and tolls at cost. The total counts toward medical expenses, deductible only if you itemize and only for the part above ${K.pct(floor, 1)} of your adjusted gross income.` },
    { q: 'Can I deduct mileage for volunteering at a charity?', a: `Yes, at ${K.centsWord(ch)} a mile or your actual gas and oil cost, plus parking and tolls, if you itemize and the organization is a qualified charity. The rate is fixed by section 170(i) of the tax code and did not rise in July 2026. Your time is never deductible, and miles the charity reimbursed you for do not count.` },
    { q: 'Does driving a family member to medical appointments count as medical mileage?', a: `It does when the trips are primarily for the medical care of you, your spouse or a dependent, such as a parent taking a child to therapy. IRS Publication 502 also covers trips of a parent who must go along with a child who needs medical care. Log each trip with the date, the provider and the miles.` },
    { q: 'Who can still use the 2026 moving mileage rate?', a: `Active-duty members of the armed forces moving under military orders to a permanent change of station, and, for moves after December 31, 2025, certain members of the intelligence community, under Notice 2026-10. The rate is ${K.centsWord(m2)} a mile from July 1, 2026. Civilian job moves give no deduction since 2018.` },
  ],
  related: ['irs-mileage-rate', 'mileage-log', 'mileage-calculator', 'business-mileage-deduction'],
  sources: ['irs_pub_502', 'irs_pub_526', 'irs_ann_2026_11', 'irs_notice_2026_10', 'irs_rates_page'],
});
