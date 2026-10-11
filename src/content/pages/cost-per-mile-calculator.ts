import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import { costPerMile } from '../../lib/engine/vehicle';

const E = K.ENERGY_META;
const b2 = K.irs('2026-07-01');
const dep = K.P.mileage.depreciationCents['2026'];
const base = { mpg: 28, fuelPrice: E.usGas, maintenancePerMile: 0.1, insurance: 1800, registration: 250, depreciation: 3500, financing: 900, parkingTolls: 300 };
const a = costPerMile({ ...base, milesPerYear: 6000 });
const b = costPerMile({ ...base, milesPerYear: 12000 });
const c = costPerMile({ ...base, milesPerYear: 25000 });

export default definePage({
  id: 'cost-per-mile-calculator',
  group: 'driving',
  order: 30,
  slug: 'cost-per-mile-calculator',
  nav: 'Cost per mile calculator',
  card: 'Fuel, maintenance and yearly fixed costs turned into cents per mile, next to the IRS rate.',
  title: 'Cost per Mile Calculator 2026: Your Car Against the IRS 76¢',
  description: `Cost per mile calculator for 2026: fuel, maintenance, insurance, registration, depreciation and interest per mile, against the IRS rate of 76 cents since July.`,
  h1: 'Cost per mile calculator',
  intro: 'Put in your miles, your MPG and what the car costs you each year: the result is your own cost per mile, next to the IRS rate.',
  resume: `With the same car and the same yearly bills, driving 6,000 miles costs ${K.rate(a.perMile)} a mile, 12,000 miles ${K.rate(b.perMile)} and 25,000 miles ${K.rate(c.perMile)}, in the example used by the calculator above (28 mpg, gasoline at the EIA U.S. average of ${K.usd(E.usGas, 3)}, 10 cents a mile of maintenance, $1,800 of insurance, $250 of registration, $3,500 of loss of value and $900 of loan interest a year). Fixed costs do not care how much you drive, so they shrink per mile as the odometer turns. Compare your figure with the IRS business rate of ${K.centsWord(b2)} a mile since July 1, 2026: if your cost is lower, a reimbursement at the IRS rate leaves you a margin; if it is higher, the rate does not cover your car. Every input except the default fuel price is yours, because no official table gives one car's insurance or depreciation.`,
  tool: 'cpm',
  body: (h) => `
<h2>Two kinds of cost</h2>
<p>Running costs grow with every mile: fuel, oil, tires, brakes, scheduled maintenance. Ownership costs arrive whether the car moves or not: insurance, registration, the loss of value, loan interest, a parking permit. The calculator keeps them apart and shows both per mile. Fuel per mile is simply the price per gallon divided by MPG: at ${K.usd(E.usGas, 3)} and 28 mpg, ${K.rate(E.usGas / 28)}. The ${h.a('gas-cost-calculator', 'gas cost calculator')} gives the price of your state.</p>
<p>Loss of value is the heaviest fixed line on a newer car and the hardest to know. Use the difference between what you paid and what similar cars of the same age sell for, spread over the years you have owned it. The ${h.a('car-depreciation-calculator', 'car depreciation calculator')} turns a yearly percentage into dollars.</p>
${h.mini('fuelLeg', { label: 'U.S. average', price: E.usGas })}
<h2>How the IRS builds its rate</h2>
<p>The business standard mileage rate rests on an annual study of fixed and variable costs that an independent contractor runs for the IRS (${h.src('irs_notice_2026_10', 'Notice 2026-10')}). It is an average over many cars and drivers, which is why it fits some cars well and others badly. Of the 2026 rate, ${dep} cents a mile is depreciation. The mid-year increase to ${K.centsWord(b2)} (${h.src('irs_ann_2026_11', 'Announcement 2026-11')}) reflected fuel prices, the most volatile variable cost.</p>
<h2>Who should run this calculation</h2>
<p>Rideshare and delivery drivers who are paid per trip need their real cost per mile to judge whether an offer pays; the IRS rate is what they may deduct as independent contractors, not what they spend. Employees paid a flat rate per mile by their employer can check whether it covers their car. Self-employed people choosing between the standard rate and actual costs see which is higher: the ${h.a('business-mileage-deduction', 'business mileage deduction calculator')} does that comparison with the business share. Households comparing two cars can run it twice with each car's MPG, insurance and price.</p>
<h2>Reading the example</h2>
<p>The three mileages in the summary use exactly the same car and the same bills; only the odometer changes. Between 6,000 and 25,000 miles a year, fuel and maintenance per mile stay flat at about ${K.rate(b.fuel + b.maintenance)}, while the fixed part falls from ${K.rate(a.fixedPerMile)} to ${K.rate(c.fixedPerMile)}. A second car that sits in the driveway most of the week is the classic case of a high cost per mile; a commuter car on the highway every day the opposite. If you are deciding whether to keep a little-used second car, the yearly total in the result is the number to weigh against rentals or rideshares for those few trips.</p>
<p>The bar under the result shows how the cost splits between fuel, maintenance and fixed costs, so it is easy to see which input deserves a better estimate. Most people know their fuel and insurance well and their loss of value badly.</p>
<h2>Limits of the figure</h2>
<p>Repairs come in lumps, so a single year can look cheap or expensive; average over several years if you can. Loan interest falls as a loan ages. Insurance depends on where you live and your record. The per-mile figure is a snapshot of the inputs you type; change one and watch the bar move.</p>
`,
  faqs: [
    { q: 'How do I calculate my car’s cost per mile?', a: `Add your yearly fixed costs (insurance, registration, loss of value, loan interest, parking) and divide by the miles you drive in a year. Then add the running costs per mile: fuel price divided by MPG, plus maintenance and tires per mile. At 12,000 miles in the example on this page the total is ${K.rate(b.perMile)} a mile.` },
    { q: 'Is my cost per mile higher than the IRS mileage rate?', a: `It can be, mostly for cars driven few miles or with high insurance and loan costs. The IRS business rate is ${K.centsWord(b2)} a mile since July 1, 2026, an average from a national cost study. In the example here, 6,000 miles a year cost ${K.rate(a.perMile)} a mile while 25,000 miles cost ${K.rate(c.perMile)}.` },
    { q: 'What cost per mile should a rideshare driver use?', a: `Your own, from this calculator, to judge whether trips pay: fuel, maintenance and the share of fixed costs your driving adds. For taxes, an independent contractor may instead deduct business miles at the IRS standard rate of ${K.centsWord(b2)} since July 1, 2026, or actual costs times the business share, whichever is higher and allowed.` },
    { q: 'Does cost per mile include depreciation?', a: `It should, because losing value is a real cost even without a bill. Enter the yearly loss as a fixed cost. In the IRS business rate, depreciation counts for ${dep} cents of each mile in 2026, according to Notice 2026-10, which shows how large that line is next to fuel.` },
  ],
  related: ['irs-mileage-rate', 'car-depreciation-calculator', 'gas-cost-calculator', 'business-mileage-deduction', 'cost-of-owning-a-car-calculator'],
  sources: ['irs_notice_2026_10', 'irs_ann_2026_11', 'eia_gas', 'irs_rates_page'],
});
