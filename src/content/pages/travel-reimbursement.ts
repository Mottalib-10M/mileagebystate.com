import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const s27 = K.std(2027);
const fed = s27.lodging + s27.mie;
const irs = K.irs('2026-07-01');
const fica = K.P.payroll.employeeShare;
// Worked example: a flat daily allowance above the standard federal rate.
const paid = 225, days = 5;
const excess = Math.max(0, paid - fed) * days;
const miles = 400, mileRate = 0.85;
const mileExcess = miles * (mileRate - irs);

export default definePage({
  id: 'travel-reimbursement',
  group: 'rules',
  order: 10,
  slug: 'travel-reimbursement',
  nav: 'Travel reimbursement and taxes',
  card: 'Accountable plan rules, what stays tax-free up to the federal rates, and what lands on the W-2.',
  title: 'Travel Reimbursement 2026: Accountable Plan Rules and Taxes',
  description: `Travel reimbursement 2026: tax-free under an accountable plan up to the federal per diem (${K.usd(fed)} standard) and ${K.centsWord(irs)} a mile; any excess kept is W-2 wages.`,
  h1: 'Travel reimbursement: when it is tax-free and when it is pay',
  intro: 'Enter what your employer pays per day and the federal rate of the place: the tool splits the allowance into its tax-free part and its taxable part.',
  resume: `Travel reimbursement is tax-free for an employee when the employer pays it under an accountable plan, the arrangement defined in 26 CFR 1.62-2: the expense has a business connection, the employee accounts for it within a reasonable period, and any excess is returned. Per diem allowances up to the federal rate of the place and mileage allowances up to the IRS business rate count as substantiated in amount, with no receipts; the employee still proves the time, place and business purpose of each trip. In FY2027 the standard federal per diem is ${K.usd(fed)} a day and the IRS rate ${K.centsWord(irs)} a mile since July 1, 2026. Anything paid above those figures and not returned is wages on the W-2, subject to withholding and payroll taxes. A plan that skips any of the three rules is nonaccountable, and then the whole payment is wages. An employee who is not reimbursed at all generally gets no deduction in 2026.`,
  tool: 'excess',
  body: (h) => `
<h2>The three tests of an accountable plan</h2>
<p>Three conditions in ${h.src('ecfr_1_62_2', '26 CFR 1.62-2')} decide whether a travel payment is pay or not. First, a business connection: the money must cover deductible expenses the employee paid or incurred while working for that employer. Second, substantiation: the employee must account for the expenses to the employer. Third, return of excess: whatever the employee cannot account for goes back. Miss one and the arrangement is nonaccountable for that payment.</p>
<p>For per diem and mileage allowances, the second test is lighter. The employer does not need hotel or restaurant receipts for the amount, as long as the allowance stays within the federal per diem of the place or the IRS standard mileage rate; the employee still documents the dates, the destination and the business reason. ${h.src('irs_rp_2019_48', 'Rev. Proc. 2019-48')} sets this up for per diem, ${h.src('irs_rp_2019_46', 'Rev. Proc. 2019-46')} for mileage.</p>
${h.mini('pdAccountable')}
<h2>Reasonable period: the 30, 60 and 120 days</h2>
<p>The regulation leaves the period to the facts, but it offers a safe harbor, summarized in ${h.src('irs_pub_463', 'Publication 463')}: an advance given within 30 days of the expense, an accounting within 60 days after the expense, and any excess returned within 120 days. An employer may instead send a statement at least once a quarter asking for an accounting or a refund of open advances, with 120 days to comply.</p>
<p>For a per diem advance, only unsubstantiated days must be returned. Take a five-day advance where the trip lasts three: the two days you did not travel go back. The extra above the federal rate on the three days you did travel can stay with you, but it is taxed as wages.</p>
<h2>Paying above the federal rate</h2>
<p>A flat ${K.usd(paid)} a day for ${days} days in a standard-rate county, where the federal per diem is ${K.usd(fed)}, puts ${K.usd(excess)} of excess in box 1 of the W-2, with income tax withholding and the employee's ${K.pct(fica)} of Social Security and Medicare on it. The amount up to the federal rate is reported in box 12 under code L and is not taxed. Mileage works the same way: ${K.num(miles)} miles reimbursed at ${K.rate(mileRate)} instead of ${K.rate(irs)} create ${K.usd(mileExcess, 2)} of wages.</p>
${h.table(['Situation', 'W-2 box 1 (taxed)', 'W-2 box 12, code L'], [['Actual costs reimbursed, accounted for, excess returned', 'nothing', 'nothing'], ['Per diem or mileage at or under the federal rate, accounted for', 'nothing', 'nothing'], ['Per diem or mileage above the federal rate, excess kept', 'the excess', 'the part up to the federal rate'], ['Per diem or mileage at or under the federal rate, unused advance kept', 'the excess', 'the part up to the federal rate'], ['Actual costs reimbursed, excess not returned', 'the excess', 'nothing'], ['Nonaccountable plan', 'the whole payment', 'nothing']], `How travel payments are reported (${h.src('irs_pub_463', 'IRS Publication 463, Table 6-1')})`, ['l', 'l', 'l'])}
<h2>When the plan turns nonaccountable</h2>
<p>A payment can fail the rules even inside a well-built plan. Excess the employee keeps, reimbursement of a cost that is not deductible business travel (meals for working late at the office, for example), and a reimbursement funded by cutting the employee's salary are all treated as paid under a nonaccountable plan. So is double coverage: if an employee receives an M&IE per diem and the employer also reimburses a dinner with clients, the employee's own share of that dinner becomes wages under section 6.06 of Rev. Proc. 2019-48. An employee paid under a nonaccountable plan cannot fix it alone by sending receipts afterwards.</p>
<h2>No reimbursement, no deduction for most employees</h2>
<p>Unreimbursed employee travel was a miscellaneous itemized deduction until 2017; it has been suspended since 2018. Only four groups still deduct it, on Form 2106: Armed Forces reservists, qualified performing artists, fee-basis state or local government officials, and employees with impairment-related work expenses. Self-employed people deduct travel on Schedule C instead. For everyone else, a stingy policy is a straight loss, which makes the ${h.a('per-diem-calculator', 'federal per diem total')} and the ${h.a('mileage-reimbursement-calculator', 'mileage figure')} the useful numbers to bring to the employer.</p>
`,
  faqs: [
    { q: 'What makes a travel reimbursement plan accountable under 26 CFR 1.62-2?', a: `Three rules: the expenses have a business connection with the employer, the employee accounts for them within a reasonable period, and the employee returns any excess within a reasonable period. Per diem up to the federal rate (${K.usd(fed)} a day at the FY2027 standard rate) and mileage up to ${K.centsWord(irs)} count as accounted for in amount once dates, place and purpose are documented.` },
    { q: 'How many days does an employee have to return an excess travel advance?', a: `Under the IRS safe harbor, 120 days after the expense was paid or incurred, with the accounting due within 60 days and the advance itself given no more than 30 days before the expense. A periodic statement method also works: the employer asks at least quarterly and the employee complies within 120 days. Excess kept past that point is wages.` },
    { q: 'Where does a travel reimbursement above the federal rate show on the W-2?', a: `The part above the federal rate goes in box 1 as wages, with withholding and payroll taxes; the part up to the federal rate goes in box 12 with code L and is not taxed. Paying ${K.usd(paid)} a day where the FY2027 federal per diem is ${K.usd(fed)} puts ${K.usd(paid - fed)} a day in box 1 (IRS Publication 463).` },
    { q: 'Can an employee deduct travel costs the employer did not reimburse in 2026?', a: `Generally no. Unreimbursed employee business expenses were miscellaneous itemized deductions, suspended for tax years after 2017. Four groups can still claim them on Form 2106: Armed Forces reservists, qualified performing artists, fee-basis state or local officials and employees with impairment-related work expenses. Self-employed travelers deduct on Schedule C.` },
    { q: 'Can my employer reimburse a client dinner on top of my M&IE per diem tax-free?', a: `Not your own share of it. Rev. Proc. 2019-48, section 6.06, says that when you already receive an M&IE per diem under an accountable plan, reimbursing your part of a business meal is a double payment: it is treated as nonaccountable, reported as wages on your W-2 and subject to withholding. The guests' share can still be reimbursed as a business meal.` },
  ],
  related: ['per-diem-calculator', 'mileage-reimbursement-calculator', 'high-low-per-diem-method', 'irs-mileage-rate', 'per-diem-rates'],
  sources: ['ecfr_1_62_2', 'irs_pub_463', 'irs_rp_2019_48', 'irs_rp_2019_46', 'irs_pub_15'],
});
