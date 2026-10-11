import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const b1 = K.irs('2026-06-30'), b2 = K.irs('2026-07-01');
const m1 = K.irs('2026-06-30', 'medical'), m2 = K.irs('2026-07-01', 'medical');
const ch = K.irs('2026-07-01', 'charity');
const b25 = K.irs('2025-06-01');
const dep = K.P.mileage.depreciationCents;
const hist = K.P.mileage.history;

export default definePage({
  id: 'irs-mileage-rate',
  group: 'mileage',
  order: 10,
  slug: 'irs-mileage-rate',
  nav: 'IRS mileage rate 2026',
  card: '72.5 cents to June 30, 76 cents from July 1, 2026: every purpose, every year since 2018.',
  title: 'IRS Mileage Rate 2026: 76 Cents From July 1, 72.5 Before',
  description: `IRS mileage rate 2026: 76 cents for business from July 1 (72.5 cents before), 23.5 cents medical and moving, 14 cents charity, with the full rate history.`,
  h1: 'IRS standard mileage rates for 2026',
  intro: 'The IRS changed its business rate twice in 2026: up to 72.5 cents on January 1, then to 76 cents on July 1. Pick a date and a purpose to see which one applies.',
  resume: `The IRS standard mileage rate for business use is ${K.centsWord(b2)} a mile for miles driven from July 1 to December 31, 2026, and ${K.centsWord(b1)} for miles driven from January 1 to June 30, 2026. The mid-year change came in Announcement 2026-11, which the IRS tied to recent increases in the price of fuel; it also raised the medical and military moving rate from ${K.centsWord(m1)} to ${K.centsWord(m2)}. The charity rate stays at ${K.centsWord(ch)} because Congress fixed it in the tax code. A mile takes the rate of the day it was driven, so a June trip logged in August still uses ${K.centsWord(b1)}. The same figures apply to gasoline, diesel, hybrid and fully electric cars, vans, pickups and panel trucks. For comparison, the 2025 business rate was ${K.centsWord(b25)}. Of each business mile in 2026, ${dep['2026']} cents count as depreciation and lower the car's tax basis.`,
  tool: 'irs-rate',
  body: (h) => `
<h2>Two business rates in one year</h2>
<p>A mid-year revision is rare. The IRS last did it in 2022, when the business rate went from 58.5 to 62.5 cents on July 1, and before that in 2011. In 2026 it happened again: ${h.src('irs_notice_2026_10', 'Notice 2026-10')} set ${K.centsWord(b1)} on January 1, and ${h.src('irs_ann_2026_11', 'Announcement 2026-11')}, published in the Internal Revenue Bulletin of July 13, 2026, moved it to ${K.centsWord(b2)} for transportation costs paid or incurred on or after July 1. The announcement is explicit on one point that payroll teams often get wrong: an allowance paid after July 1 for miles driven before July 1 stays at the old rate.</p>
<p>In practice, keep the date of every trip. A yearly total of business miles is not enough to apply the right rate, which is why the ${h.a('mileage-reimbursement-calculator', 'reimbursement calculator')} asks for the miles of each half of the year and the ${h.a('mileage-log', 'mileage log')} applies the rate line by line.</p>
<h2>Who uses which rate</h2>
<p>The business rate serves three groups. The self-employed use it to deduct car costs on Schedule C instead of adding up gas, insurance and repairs. Employers use it as the ceiling of a tax-free mileage allowance under an accountable plan. And a few employees can still deduct unreimbursed driving as an adjustment to income: members of a reserve component of the armed forces, state and local officials paid on a fee basis, certain performing artists and eligible educators. Other employees lost that deduction in 2018 and the One Big Beautiful Bill Act made the loss permanent, as Notice 2026-10 recalls.</p>
<p>The medical rate (${K.centsWord(m2)} since July 1) counts toward medical expenses, which are deductible only above 7.5% of adjusted gross income for people who itemize. The moving rate is the same figure, but only active-duty military moving under orders and, from 2026, certain members of the intelligence community may use it. The ${h.a('medical-and-charity-mileage', 'medical and charity page')} works through both.</p>
${h.mini('mileSplit')}
<h2>Federal employees: the GSA rate is the same, with a twist</h2>
<p>Civilian federal employees driving their own car on official travel are paid by GSA, not by the IRS table, but GSA followed the IRS on both dates: ${K.usd(K.pov('2026-03-01'), 3)} then ${K.usd(K.pov('2026-07-01'), 2)} a mile (${h.src('gsa_pov', 'GSA POV rates')}). If a government car was authorized and available and the traveler chose to drive their own, GSA pays only ${K.usd(K.pov('2026-07-01', 'govCarAvailable'), 3)}. Motorcycles get ${K.usd(K.pov('2026-07-01', 'motorcycle'), 2)} and private planes ${K.usd(K.pov('2026-07-01', 'airplane'), 3)} a statute mile.</p>
<h2>What the rate is made of</h2>
<p>The business rate rests on an annual study of fixed and variable costs that an independent contractor runs for the IRS; the medical and moving rate uses only the variable part, which is why it is so much lower. The depreciation share of the business rate has climbed from ${dep['2022']} cents in 2022 to ${dep['2026']} cents in 2026. If you sell a car you used at the standard rate, that amount per business mile has been taken off its basis, which raises the gain or shrinks the loss. The ${h.a('car-depreciation-calculator', 'car depreciation page')} shows the effect.</p>
<p>The rate is optional. Taxpayers may track actual costs instead, but whoever owns the car must choose the standard rate in its first business year to be allowed to switch later, and a leased car that starts on the standard rate keeps it for the whole lease, renewals included. The ${h.a('business-mileage-deduction', 'business mileage deduction calculator')} compares both methods.</p>
<h2>Rates since 2018</h2>
${h.table(['Period', 'Business', 'Charity', 'Medical or military move', 'IRS release'], hist.map((r) => [String(r[0]), `${K.num(Number(r[1]), 1)}¢`, `${K.num(Number(r[2]), 0)}¢`, `${K.num(Number(r[3]), 1)}¢`, String(r[4])]), 'IRS standard mileage rates in cents per mile, from the IRS rate history page.', ['l', 'r', 'r', 'r', 'l'])}
`,
  faqs: [
    { q: 'What is the IRS mileage rate for July 2026?', a: `${K.centsWord(b2)} a mile for business driving from July 1, 2026, under Announcement 2026-11, up from ${K.centsWord(b1)}. Medical and military moving miles rose to ${K.centsWord(m2)}. The charity rate did not change. The new figures apply to miles driven on or after July 1 and stay in force until the IRS publishes the 2027 rates.` },
    { q: 'Does the IRS mileage rate apply to electric cars?', a: `Yes. The IRS says the standard rates apply to fully electric and hybrid automobiles as well as gasoline and diesel ones, so an EV driver uses ${K.centsWord(b2)} a business mile since July 1, 2026. Because charging usually costs less than fuel, the rate often leaves an EV owner with a larger margin over the energy cost.` },
    { q: 'Can I use 76 cents for miles I drove in May 2026?', a: `No. Miles keep the rate of the date they were driven: May 2026 business miles are worth ${K.centsWord(b1)}. Announcement 2026-11 adds that an allowance paid after July 1 for expenses incurred before July 1 also stays at the old rate. Keep dated records so the two halves of the year can be priced separately.` },
    { q: 'Why is the charity mileage rate still 14 cents?', a: `Because it is written into the tax code at section 170(i) and only Congress can change it. The IRS adjusts the business, medical and moving rates from its cost study, but not this one. The rate of ${K.centsWord(ch)} applies to miles driven while volunteering for a qualified organization.` },
    { q: 'How much of the 2026 business mileage rate is depreciation?', a: `${dep['2026']} cents a mile, according to Notice 2026-10. If you use the standard rate, that amount per business mile reduces the basis of your car, so it matters when you sell it. The figure was ${dep['2025']} cents in 2025, ${dep['2024']} in 2024 and ${dep['2023']} in 2023. The July 2026 announcement did not change the depreciation part.` },
  ],
  related: ['mileage-reimbursement-calculator', 'mileage-log', 'business-mileage-deduction', 'medical-and-charity-mileage', 'home'],
  sources: ['irs_rates_page', 'irs_ann_2026_11', 'irs_notice_2026_10', 'irs_ir_2025_128', 'gsa_pov'],
});
