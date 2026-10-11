import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const b1 = K.irs('2026-06-30'), b2 = K.irs('2026-07-01');
const ex = K.splitValue(3200, 3800);
const emp = 0.6;
const short = 7000 * b2 - 7000 * emp;
const over = K.reimbursement(4000, 0.85, b2);

export default definePage({
  id: 'mileage-reimbursement-calculator',
  group: 'mileage',
  order: 20,
  slug: 'mileage-reimbursement-calculator',
  nav: 'Mileage reimbursement calculator',
  card: 'Your miles on each side of July 1, 2026, your employer’s rate, and what becomes taxable.',
  title: 'Mileage Reimbursement Calculator 2026: IRS Rate Split July 1',
  description: `Mileage reimbursement calculator for 2026: miles before and after July 1 at 72.5 and 76 cents, your employer's rate against the IRS one, and the taxable excess.`,
  h1: 'Mileage reimbursement calculator, 2026 rates',
  intro: 'Enter the business miles of each half of 2026 and the rate your employer pays: the tool prices them at the IRS rates and shows any part that turns into wages.',
  resume: `${K.num(3200)} business miles in the first half of 2026 and ${K.num(3800)} in the second are worth ${K.usd(ex.total, 2)} at the IRS rates: ${K.usd(ex.before, 2)} at ${K.centsWord(b1)} and ${K.usd(ex.after, 2)} at ${K.centsWord(b2)}. That total is the most an employer can reimburse without receipts for actual car costs and without it counting as pay, provided the plan is an accountable plan: a business reason for each trip, a record of the miles, dates and places within a reasonable time, and any excess returned. An employer may pay less, and many do; the gap is lost for the employee, because unreimbursed employee driving is no longer deductible for most workers. An employer that pays more must report the excess as wages. The calculator above does those three things at once, and adds parking and tolls, which are reimbursed at cost on top of the rate.`,
  tool: 'reimb',
  body: (h) => `
<h2>Why the year must be cut at July 1</h2>
<p>The IRS raised the business rate in the middle of 2026 (${h.src('irs_ann_2026_11', 'Announcement 2026-11')}). The new figure applies to miles driven on or after July 1 and to allowances paid for those miles. Miles driven earlier keep ${K.centsWord(b1)}, even when the expense report is filed in the autumn. An employer that pays "the IRS rate" therefore owes two prices for 2026, and a reimbursement system that switched everything to ${K.centsWord(b2)} on the day of the announcement overpaid June trips, a small excess that is technically wages.</p>
<p>The ${h.a('mileage-log', 'mileage log')} keeps the date of each trip and applies the right rate automatically, which settles the question line by line rather than with a split at the end of the year.</p>
${h.mini('mileSplit')}
<h2>When the employer pays less than the IRS rate</h2>
<p>Federal tax law does not oblige a private employer to pay the IRS rate; whether your state's labor law asks for more is a separate question this tool does not answer. At ${K.usd(emp, 2)} a mile, an employee who drives ${K.num(7000)} business miles in the second half of 2026 receives ${K.usd(7000 * emp)} instead of ${K.usd(7000 * b2)}, a shortfall of ${K.usd(short)}. Before 2018 that gap could be deducted as a miscellaneous itemized expense; the deduction was suspended that year and made permanent by the One Big Beautiful Bill Act, as ${h.src('irs_notice_2026_10', 'Notice 2026-10')} recalls. Reservists, fee-basis state and local officials, certain performing artists and eligible educators are the exceptions.</p>
<h2>When the employer pays more</h2>
<p>An allowance above the IRS rate is not illegal, it is partly taxable. Under ${h.src('irs_rp_2019_46', 'Rev. Proc. 2019-46')} only the amount up to the standard rate is deemed substantiated. Paid ${K.usd(0.85, 2)} for ${K.num(4000)} miles driven after July 1, an employee receives ${K.usd(over.paid)}: ${K.usd(over.federal)} is tax-free and ${K.usd(over.taxableExcess)} goes on the W-2 with income tax, Social Security and Medicare withheld, unless the employee returns it. Payroll software usually books it as a separate wage item, so the pay stub shows where the extra cents went.</p>
<h2>Flat allowances and FAVR plans</h2>
<p>A fixed monthly car allowance with no mileage record is pay from the first dollar. Some employers combine a fixed part for ownership costs and a variable part per mile, the fixed and variable rate (FAVR) plan of Rev. Proc. 2019-46; for 2026 the standard vehicle cost in such a plan cannot exceed ${K.usd(K.P.mileage.favrMaxCost)}. The ${h.a('car-allowance-vs-mileage-reimbursement', 'allowance against mileage page')} compares a flat allowance after tax with mileage at the IRS rate.</p>
<h2>Federal employees</h2>
<p>Agencies follow the GSA rates rather than the IRS table: ${K.usd(K.pov('2026-07-01'), 2)} a mile from July 1, 2026 for a personal car, ${K.usd(K.pov('2026-07-01', 'govCarAvailable'), 3)} when a government car was available and the traveler preferred their own (${h.src('gsa_pov', 'GSA')}). The ${h.a('home', 'trip calculator')} offers both, next to the per diem of the trip.</p>
`,
  faqs: [
    { q: 'Is mileage reimbursement taxable in 2026?', a: `Not up to the IRS rate, if your employer runs an accountable plan: you record the date, place, purpose and miles of each trip and return any excess. In 2026 the tax-free limit is ${K.centsWord(b1)} a mile through June 30 and ${K.centsWord(b2)} from July 1. Anything paid above those figures, or a flat allowance without records, is taxable wages.` },
    { q: 'My employer pays 60 cents a mile: can I deduct the rest of the IRS rate?', a: `Not as an ordinary employee. The deduction for unreimbursed employee expenses was suspended in 2018 and made permanent in 2025, so the gap between ${K.usd(emp, 2)} and ${K.centsWord(b2)} is simply lost. Members of a reserve component, fee-basis officials, certain performing artists and eligible educators can still deduct it as an adjustment to income.` },
    { q: 'Which mileage rate applies to a trip in June reimbursed in August 2026?', a: `${K.centsWord(b1)} a mile. Announcement 2026-11 says the old rates keep applying to mileage allowances paid for transportation expenses incurred before July 1, 2026, whatever the payment date. Only miles driven on or after July 1 qualify for ${K.centsWord(b2)}. Keep the trip dates on the expense report.` },
    { q: 'Are parking and tolls included in the mileage reimbursement rate?', a: `No. Business parking fees and tolls are reimbursed or deducted on top of the standard mileage rate, at their actual cost, with receipts. Parking at your regular workplace is a commuting cost and stays personal. The calculator adds a separate field for them so they do not dilute the rate per mile.` },
  ],
  related: ['irs-mileage-rate', 'mileage-log', 'car-allowance-vs-mileage-reimbursement', 'travel-reimbursement', 'home'],
  sources: ['irs_ann_2026_11', 'irs_notice_2026_10', 'irs_rp_2019_46', 'irs_pub_463', 'gsa_pov'],
});
