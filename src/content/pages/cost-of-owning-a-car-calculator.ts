import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import { ownership } from '../../lib/engine/vehicle';

const E = K.ENERGY_META;
const base = { years: 5, price: 36000, resaleRate: 0.15, milesPerYear: 12000, energyPerMile: E.usGas / 28, maintenancePerMile: 0.1, insurance: 1800, registration: 250, interest: 3200 };
const r = ownership(base);
const r10 = ownership({ ...base, years: 10 });
const b2 = K.irs('2026-07-01');

export default definePage({
  id: 'cost-of-owning-a-car-calculator',
  group: 'driving',
  order: 80,
  slug: 'cost-of-owning-a-car-calculator',
  nav: 'Cost of owning a car',
  card: 'Five years of depreciation, fuel, maintenance, insurance, fees and interest, in dollars and per mile.',
  title: 'Cost of Owning a Car Calculator 2026: Total Ownership Cost',
  description: `Cost of owning a car calculator for 2026: depreciation, fuel at EIA prices, upkeep, insurance, fees and loan interest over the years you keep it, per mile.`,
  h1: 'Cost of owning a car',
  intro: 'Enter the price, how long you keep the car, your miles and your yearly bills: the calculator adds everything up and gives the cost per year and per mile.',
  resume: `A $36,000 car kept five years and driven 12,000 miles a year costs about ${K.usd(r.total)} to own in the example used by the calculator above, or ${K.usd(r.perYear)} a year and ${K.rate(r.perMile)} a mile. Loss of value is the largest line at ${K.usd(r.depreciation)} (with a 15% yearly loss you choose), then insurance at ${K.usd(r.insurance)}, fuel at ${K.usd(r.energy)} at the EIA U.S. average of ${K.usd(E.usGas, 3)} a gallon and 28 mpg, maintenance, registration and ${K.usd(r.interest)} of loan interest. Every line except the fuel price is your own input, because no public agency publishes the insurance, the resale value or the repairs of one car; the defaults are illustrations to replace. Keeping the same car ten years lowers the cost per mile to ${K.rate(r10.perMile)}, because the steepest loss of value is behind you. For an electric car, use the cost per mile of electricity from the charging calculator instead of fuel.`,
  tool: 'tco',
  body: (h) => `
<h2>The lines of a total cost of ownership</h2>
<p>Total cost of ownership is everything a car takes from your budget while you have it, minus what you get back when you sell it. Depreciation is that difference between price and resale value. Fuel and maintenance follow the miles. Insurance and registration follow the calendar. Loan interest follows the financing: the total interest on a loan is printed on the loan disclosure, which is the figure to type here. Parking and tolls can be added to the insurance line if they are regular. Sales tax and the dealer's fees at purchase belong in the price, since you pay them once and do not get them back when you sell.</p>
<p>The calculator spreads the result two ways. Per year tells you what the car costs your household; per mile lets you compare it with the IRS business rate of ${K.centsWord(b2)}, with a rental, or with rideshares for the trips you actually make.</p>
${h.mini('fuelLeg', { label: 'U.S. average', price: E.usGas })}
<h2>Why time changes the answer</h2>
<p>Cars lose the most value in their first years, so the yearly cost of depreciation falls the longer you keep one, while repairs tend to rise. With a constant yearly loss rate, the example loses ${K.usd(r.depreciation)} in five years and ${K.usd(r10.depreciation)} in ten; the extra five years add only ${K.usd(r10.depreciation - r.depreciation)} of depreciation. The ${h.a('car-depreciation-calculator', 'car depreciation calculator')} shows the value year by year. Raise the maintenance per mile for the later years if you expect major work, such as a timing belt, a transmission service or a new set of tires.</p>
<h2>Gasoline or electric</h2>
<p>To compare an electric car, enter its own price, insurance and loss rate, and set the energy cost through the MPG and price fields so that price divided by MPG equals the EV's cost per mile from the ${h.a('ev-charging-cost-calculator', 'EV charging calculator')}. The ${h.a('gas-vs-electric-car-calculator', 'gas versus electric calculator')} gives the yearly energy gap directly for your state.</p>
<h2>Defaults are not averages</h2>
<p>The $36,000 price, $1,800 of insurance, $250 of registration, 10 cents a mile of maintenance and 15% yearly loss are round illustrative inputs, not national figures; this site does not publish averages it cannot source. Your insurer's renewal notice, your state's registration bill and listings for your model give the real numbers. The fuel price is the exception: it defaults to the EIA U.S. average of the week of ${K.day(E.gasWeek)} (${h.src('eia_gas', 'EIA')}), and the ${h.a('gas-cost-calculator', 'gas cost calculator')} gives your state's.</p>
<h2>If the car is used for business</h2>
<p>A self-employed owner deducts the business share of these costs, either through the standard mileage rate or through actual expenses; the ${h.a('business-mileage-deduction', 'business mileage deduction calculator')} compares the two. An employee reimbursed at the IRS rate can set this cost per mile against ${K.centsWord(b2)} to see whether the reimbursement covers the car.</p>
`,
  faqs: [
    { q: 'What is included in the total cost of owning a car?', a: `Depreciation (price minus resale value), fuel or electricity, maintenance and tires, insurance, registration and fees, and loan interest, plus regular parking or tolls if you add them. The calculator sums them over the years you keep the car and divides by years and by miles; in the example it is ${K.usd(r.perYear)} a year.` },
    { q: 'Is it cheaper per mile to keep a car for ten years?', a: `Usually, because depreciation is steepest early. In the example on this page, five years cost ${K.rate(r.perMile)} a mile and ten years ${K.rate(r10.perMile)}, with the same yearly bills. Repairs often grow in later years, so raise the maintenance input for an older car to keep the comparison honest.` },
    { q: 'Where do the default values in the car ownership calculator come from?', a: `Only the fuel price is official: the EIA U.S. average for regular gasoline in the week of ${K.day(E.gasWeek)}, ${K.usd(E.usGas, 3)} a gallon. Price, insurance, registration, maintenance, interest and the yearly loss rate are round illustrations, because no federal source publishes them for a given car. Replace each with your own figure.` },
    { q: 'How does car ownership cost compare with the IRS mileage rate?', a: `Divide your total cost by the miles you drive and compare it with ${K.centsWord(b2)}, the IRS business rate since July 1, 2026. Cars driven many miles often cost less per mile than the rate; little-used or expensive cars often cost more. The rate is a national average from a cost study, not a promise to cover your car.` },
  ],
  related: ['cost-per-mile-calculator', 'car-depreciation-calculator', 'gas-vs-electric-car-calculator', 'gas-cost-calculator', 'business-mileage-deduction'],
  sources: ['eia_gas', 'epa_fueleconomy', 'irs_notice_2026_10', 'irs_ann_2026_11'],
});
