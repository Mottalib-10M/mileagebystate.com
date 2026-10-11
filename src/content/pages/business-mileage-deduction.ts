import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const b1 = K.irs('2026-06-30'), b2 = K.irs('2026-07-01');
const std = 4000 * b1 + 4000 * b2;
const dep = K.P.mileage.depreciationCents['2026'];

export default definePage({
  id: 'business-mileage-deduction',
  group: 'mileage',
  order: 50,
  slug: 'business-mileage-deduction',
  nav: 'Business mileage deduction',
  card: 'Standard rate against actual costs for a car used in your business, with the 2026 split.',
  title: 'Business Mileage Deduction 2026: Standard vs Actual Costs',
  description: `Business mileage deduction for 2026: compare the standard rate (72.5 then 76 cents) with actual car costs times your business share, and the switching rules.`,
  h1: 'Business mileage deduction: standard rate or actual costs',
  intro: 'For a car you use in your own business: enter the business miles, their share of all miles and your actual car costs, and see which method deducts more.',
  resume: `A self-employed person who drives 8,000 business miles in 2026, half before July 1 and half after, can deduct ${K.usd(std)} with the standard mileage rate: 4,000 miles at ${K.centsWord(b1)} and 4,000 at ${K.centsWord(b2)}, plus business parking and tolls. The alternative is to add up what the car really cost in the year (gas, oil, repairs, tires, insurance, registration, lease payments or depreciation) and deduct the business share of it. The standard rate wins for most economical cars driven a lot; actual costs can win for an expensive or thirsty vehicle, or a car driven few miles. The choice is not free every year: to keep the option, an owned car must start on the standard rate in its first business year, and a leased car that starts on it must keep it for the whole lease. Employees, except a few groups, cannot take this deduction at all.`,
  tool: 'deduction',
  body: (h) => `
<h2>Who can deduct business miles</h2>
<p>Sole proprietors and single-member LLC owners report car costs on Schedule C; farmers on Schedule F. Partners and S corporation owners are usually reimbursed by the business under an accountable plan instead. Employees lost the itemized deduction for unreimbursed job expenses in 2018, and the 2025 tax law made the loss permanent (${h.src('irs_notice_2026_10', 'Notice 2026-10')}). Four groups keep a deduction as an adjustment to income: members of a reserve component of the armed forces, state or local officials paid on a fee basis, certain performing artists, and eligible educators.</p>
<h2>The standard rate: simple, with strings</h2>
<p>With the standard rate you multiply business miles by the rate of each date and add parking and tolls. Gas, insurance, repairs and depreciation are all inside the rate and cannot be added. A self-employed person can still deduct the business share of car loan interest on top of the rate, according to ${h.src('irs_pub_463', 'Publication 463')}.</p>
<p>The rate is not allowed for a car on which you claimed accelerated depreciation (MACRS), a section 179 deduction or bonus depreciation, nor when you use five or more cars at the same time, as in a fleet. For an owned car, you must choose it in the first year the car is used in the business; you may then switch to actual costs later, with straight-line depreciation for the remaining life. For a leased car, choosing the standard rate binds you for the entire lease, renewals included.</p>
${h.mini('mileSplit')}
<h2>Actual costs: more paperwork, sometimes more money</h2>
<p>Actual costs require receipts for everything and a log of business and total miles, because only the business share counts: 8,000 business miles out of 13,000 means 61.5% of each cost. Depreciation is the big item and is capped by the luxury auto limits for passenger cars, which this tool does not compute; enter the depreciation figure your tax software or preparer gives you inside the actual costs.</p>
<h2>The depreciation inside the standard rate</h2>
<p>Using the standard rate is not depreciation-free. For each business mile, ${dep} cents in 2026 (${K.P.mileage.depreciationCents['2025']} in 2025) count as depreciation and reduce the car's basis. When you sell the car, that lower basis increases the gain. On 8,000 business miles in 2026, the basis drops by ${K.usd(8000 * dep / 100)}. The ${h.a('car-depreciation-calculator', 'car depreciation page')} tracks this over several years.</p>
<h2>Which to pick</h2>
<p>Run both every year you are free to choose. A hybrid sedan driven 15,000 business miles almost always favors the standard rate; a large pickup driven 4,000 miles with high insurance may favor actual costs. The tool above gives the two figures side by side. For the record-keeping side, see the ${h.a('mileage-log', 'mileage log')}; for the rates themselves, the ${h.a('irs-mileage-rate', 'IRS mileage rate page')}.</p>
`,
  faqs: [
    { q: 'Can I switch from actual expenses to the standard mileage rate?', a: `For an owned car, only if you used the standard rate in the first year the car was in your business. A car that started on actual costs with MACRS, section 179 or bonus depreciation can never move to the standard rate. The other way, from standard rate to actual costs, is allowed later with straight-line depreciation for the car's remaining useful life.` },
    { q: 'Can an employee deduct business mileage in 2026?', a: `Generally not. The miscellaneous itemized deduction for unreimbursed employee expenses has been suspended since 2018 and is now permanent law. The exceptions are reservists, fee-basis state or local officials, qualified performing artists and eligible educators, who deduct as an adjustment to income. Others should ask the employer for reimbursement at up to ${K.centsWord(b2)} a mile.` },
    { q: 'Are parking fees and tolls deductible on top of the business mileage rate?', a: `Yes. Business parking and tolls are deducted at cost in addition to the standard mileage rate, because they are not part of the cost study behind it. Parking at your regular workplace is commuting and stays personal. Keep the receipts, or the toll account statement, with your mileage log.` },
    { q: 'How much does the business mileage deduction reduce my car’s basis in 2026?', a: `${dep} cents for every business mile driven at the standard rate in 2026, under Notice 2026-10. Ten thousand business miles lower the basis by ${K.usd(10000 * dep / 100)}. The reduction stops when the basis reaches zero, and it matters when you sell or trade the car, because a lower basis means a larger taxable gain.` },
  ],
  related: ['irs-mileage-rate', 'mileage-log', 'car-depreciation-calculator', 'cost-per-mile-calculator', 'mileage-calculator'],
  sources: ['irs_pub_463', 'irs_notice_2026_10', 'irs_ann_2026_11', 'irs_ir_2025_128'],
});
