import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import { allowanceVsMileage } from '../../lib/engine/vehicle';

const b2 = K.irs('2026-07-01');
const pay = K.P.payroll.employeeShare;
const ex = allowanceVsMileage({ allowanceMonthly: 500, businessMilesYear: 8000, irsRate: b2, marginalRate: 0.22, payrollRate: pay });

export default definePage({
  id: 'car-allowance-vs-mileage-reimbursement',
  group: 'mileage',
  order: 70,
  slug: 'car-allowance-vs-mileage-reimbursement',
  nav: 'Car allowance vs mileage',
  card: 'A flat monthly allowance after tax against tax-free mileage at the IRS rate, and the break-even miles.',
  title: 'Car Allowance vs Mileage Reimbursement 2026: After-Tax Math',
  description: `Car allowance vs mileage reimbursement in 2026: a $500 monthly allowance is taxed as wages, mileage at 76 cents is not. See the miles where they break even.`,
  h1: 'Car allowance or mileage reimbursement?',
  intro: 'Enter the monthly allowance, your business miles and your tax rates: the calculator compares what you keep from each.',
  resume: `A car allowance of $500 a month is $6,000 a year of wages: with a 22% income tax rate and the ${K.pct(pay, 2)} employee share of Social Security and Medicare, you keep about ${K.usd(ex.allowanceNet)}. The same driver reimbursed for 8,000 business miles at the IRS rate of ${K.centsWord(b2)} receives ${K.usd(ex.mileage)}, all of it tax-free under an accountable plan. Mileage wins here by ${K.usd(ex.difference)}, and it keeps winning above about ${K.num(ex.breakEvenMiles)} business miles a year. The difference is not the gross amount, it is the tax: a flat allowance with no mileage record is pay from the first dollar, while reimbursement up to the IRS rate, backed by a log, stays off the W-2. Employers like allowances for their simplicity and for heavy drivers they can cost less. The calculator above puts your own figures in both columns.`,
  tool: 'allowance',
  body: (h) => `
<h2>Why the same money is worth less as an allowance</h2>
<p>An allowance paid without any accounting for miles fails the accountable plan rules of ${h.src('ecfr_1_62_2', '26 CFR 1.62-2')}: there is no substantiation and nothing to return. The whole amount goes through payroll, with federal income tax, state income tax in most states, and the ${K.pct(K.P.payroll.socialSecurity, 1)} Social Security and ${K.pct(K.P.payroll.medicare, 2)} Medicare employee shares (${h.src('irs_pub_15', 'Publication 15')}). The employer pays its own matching payroll taxes on top. And since 2018 the employee cannot deduct the real car costs the allowance was meant to cover.</p>
<p>Mileage reimbursement at or below the IRS rate, with a record of the date, place, purpose and miles of each trip, is not income at all (${h.src('irs_pub_463', 'Publication 463')}). The trade-off is paperwork: a log every week and an expense report every month. The ${h.a('mileage-log', 'mileage log')} on this site takes care of the first part.</p>
<h2>The break-even point</h2>
<p>The comparison turns on miles. Few business miles make the allowance attractive, because it pays the same whether you drive or not. Many miles make reimbursement better, because each one adds ${K.centsWord(b2)} untaxed. Divide what you keep from the allowance by the IRS rate and you get the number of miles where both are equal; the result line shows it for your inputs. Remember the July change: miles driven before July 1, 2026 count at ${K.centsWord(K.irs('2026-06-30'))}, so a full-year comparison for 2026 sits slightly below the figure shown.</p>
${h.mini('mileSplit')}
<h2>Hybrid plans: allowance plus mileage, and FAVR</h2>
<p>Some employers pay a small allowance for ownership costs and reimburse each mile at a lower rate for fuel. If the allowance part has no substantiation, it remains wages. The IRS-approved hybrid is the fixed and variable rate plan of ${h.src('irs_rp_2019_46', 'Rev. Proc. 2019-46')}: a periodic fixed payment for insurance, depreciation and registration based on a standard car, plus a variable rate per mile for fuel and maintenance, both computed from local costs. For 2026 the standard car in a FAVR plan cannot cost more than ${K.usd(K.P.mileage.favrMaxCost)} (${h.src('irs_notice_2026_10', 'Notice 2026-10')}). Under the revenue procedure, a FAVR plan must cover at least five employees at all times during the year, each driver must substantiate at least 5,000 business miles, and the plan needs local cost data for each base area, which the employer or a vendor has to maintain.</p>
<h2>A company car is a third option</h2>
<p>A car provided by the employer replaces both, and the personal use of it is a taxable fringe benefit, valued for instance by the vehicle cents-per-mile rule, which in 2026 is limited to cars worth up to ${K.usd(K.P.mileage.fleetMaxFmv)} (Notice 2026-10). That case is outside this calculator. To check whether a per-mile rate your employer offers is generous or stingy, use the ${h.a('mileage-reimbursement-calculator', 'reimbursement calculator')}; to see what your car really costs per mile, the ${h.a('cost-per-mile-calculator', 'cost per mile calculator')}.</p>
`,
  faqs: [
    { q: 'Is a car allowance taxable in 2026?', a: `Yes, when it is a flat amount paid without a mileage record or a requirement to return any excess. It is then wages: income tax, Social Security at ${K.pct(K.P.payroll.socialSecurity, 1)} and Medicare at ${K.pct(K.P.payroll.medicare, 2)} are withheld, and the employee cannot deduct the real car costs. Mileage reimbursed at up to ${K.centsWord(b2)} with a log is not taxed.` },
    { q: 'How many miles make mileage reimbursement better than a car allowance?', a: `Divide the allowance you keep after tax by the IRS rate. With $500 a month, a 22% tax rate and ${K.pct(pay, 2)} payroll tax, you keep about ${K.usd(ex.allowanceNet)} a year; at ${K.centsWord(b2)} a mile, reimbursement beats it above roughly ${K.num(ex.breakEvenMiles)} business miles. Your own tax rates move that threshold.` },
    { q: 'What is a FAVR car allowance plan?', a: `A fixed and variable rate plan under Rev. Proc. 2019-46: a fixed payment for ownership costs of a standard car plus a rate per mile for operating costs, both based on local prices. Paid under the rules, it is tax-free. For 2026 the standard car cannot cost more than ${K.usd(K.P.mileage.favrMaxCost)}, under Notice 2026-10.` },
    { q: 'Can my employer pay both a car allowance and mileage?', a: `Yes, but the tax treatment follows each part. Reimbursed miles up to the IRS rate, with records, are tax-free; any flat allowance without substantiation is wages. If the combined per-mile payment exceeds the IRS rate, the excess is wages too. Ask payroll how each line of your plan is reported.` },
  ],
  related: ['mileage-reimbursement-calculator', 'irs-mileage-rate', 'cost-per-mile-calculator', 'travel-reimbursement', 'mileage-log'],
  sources: ['irs_pub_463', 'irs_rp_2019_46', 'irs_notice_2026_10', 'ecfr_1_62_2', 'irs_pub_15'],
});
