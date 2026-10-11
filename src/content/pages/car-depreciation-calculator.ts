import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import { depreciate } from '../../lib/engine/vehicle';
import { basisReduction } from '../../lib/engine/mileage';

const D = K.P.mileage.depreciationCents as Record<string, number>;
const ex = depreciate(36000, 0.15, 5);
const ex20 = depreciate(36000, 0.2, 5);
const basis = basisReduction({ '2024': 9000, '2025': 9000, '2026': 9000 }, D);

export default definePage({
  id: 'car-depreciation-calculator',
  group: 'driving',
  order: 40,
  slug: 'car-depreciation-calculator',
  nav: 'Car depreciation calculator',
  card: 'Value after each year at the loss rate you choose, plus the tax basis cut of the standard mileage rate.',
  title: 'Car Depreciation Calculator 2026: Value by Year, IRS Basis',
  description: `Car depreciation calculator for 2026: a car's value year by year at the loss rate you choose, and the ${D['2026']}-cent basis cut per business mile under the IRS rate.`,
  h1: 'Car depreciation calculator',
  intro: 'Type the price, a yearly loss rate and the years you plan to keep the car: the table shows its value at the end of each year, and the tax side for business miles.',
  resume: `A $36,000 car that loses 15% of its value every year is worth about ${K.usd(ex.value)} after five years, a loss of ${K.usd(ex.lost)}; at 20% a year it falls to ${K.usd(ex20.value)}. The calculator above applies the rate you choose to the value left at the start of each year, which is how used-car prices usually behave: the biggest drop in dollars comes first. The rate itself is your assumption. No federal agency publishes an official depreciation table for private cars, and this site will not invent an average; check what cars like yours, a few years older, sell for and use the rate that matches. The tax side is official: if you deduct business driving with the IRS standard mileage rate, ${D['2026']} cents of each 2026 business mile counts as depreciation and lowers the car's basis, ${D['2025']} cents in 2025 and ${D['2024']} in 2024.`,
  tool: 'depreciation',
  body: (h) => `
<h2>Market value and tax depreciation are two different things</h2>
<p>Market depreciation is what you lose when you sell: the gap between the price you paid and the price a buyer offers. It depends on the model, the mileage, the condition and the market of the moment, and it is what the yearly rate in the calculator describes. Tax depreciation is an accounting rule for a car used in a business, and it follows the tax code, not the market. The two rarely match, and for a car used only privately, tax depreciation does not exist.</p>
<h2>The depreciation inside the standard mileage rate</h2>
<p>A self-employed person who deducts business miles at the standard rate does not claim depreciation separately, but part of each mile is treated as depreciation all the same. ${h.src('irs_notice_2026_10', 'Notice 2026-10')} sets that part at ${K.listOf(Object.entries(D).map(([y, c]) => `${c} cents for ${y}`))}. The car's basis (roughly what you paid) goes down by that amount per business mile, never below zero. With 9,000 business miles a year from 2024 to 2026, the basis falls by ${K.usd(basis)}. When the car is sold, the gain is computed on the reduced basis, so a car "sold at a loss" in market terms can produce a taxable gain on its business part.</p>
${h.mini('mileSplit')}
<h2>Actual-cost depreciation, in one paragraph</h2>
<p>A business owner who deducts actual car costs depreciates the business share of the car under the tax rules for vehicles, with yearly caps for passenger cars and special elections such as section 179 or bonus depreciation. Choosing any of them closes the door to the standard mileage rate for that car for good (${h.src('irs_pub_463', 'Publication 463')}). Those computations need the purchase date, the business share each year and the caps of each year; this calculator does not perform them. The ${h.a('business-mileage-deduction', 'business mileage deduction calculator')} compares the two methods once you have the actual-cost figure.</p>
<h2>Using the result</h2>
<p>The yearly loss in dollars is a fixed cost of owning the car. Enter it in the ${h.a('cost-per-mile-calculator', 'cost per mile calculator')} to see what it adds to each mile, or in the ${h.a('cost-of-owning-a-car-calculator', 'cost of ownership calculator')} with insurance and fuel. If you plan to sell after a few years, the end-of-year values give you a target price; if you keep cars until they wear out, the loss of value matters less than repairs and fuel.</p>
<h2>Picking a rate honestly</h2>
<p>Look up the asking prices of the same model one, three and five years older with similar miles, divide each by the new price, and see which yearly rate reproduces them. Electric cars, luxury cars and work trucks follow different curves, and a single model can swing with fuel prices or a new generation. A rate that fits your car beats any national average, even a sourced one.</p>
`,
  faqs: [
    { q: 'How much does a car depreciate per year?', a: `There is no official figure: it depends on the model, mileage, condition and market. This calculator lets you pick the yearly rate and applies it to the value left each year; at 15% a $36,000 car is worth about ${K.usd(ex.value)} after five years. Compare listings of the same model at older ages to choose a rate that fits.` },
    { q: 'What is the depreciation part of the 2026 IRS mileage rate?', a: `${D['2026']} cents per business mile, set by IRS Notice 2026-10. If you use the standard mileage rate, that amount reduces your car's tax basis for every business mile driven in 2026. It was ${D['2025']} cents in 2025 and ${D['2024']} cents in 2024. The basis never drops below zero.` },
    { q: 'Can I deduct car depreciation if I use the standard mileage rate?', a: `No separate depreciation deduction is allowed: it is already inside the rate. You still track it, because ${D['2026']} cents of each 2026 business mile lowers the car's basis and affects the gain or loss when you sell. Claiming separate depreciation, section 179 or bonus depreciation means you cannot use the standard rate for that car.` },
    { q: 'Does car depreciation matter if I never use the car for business?', a: `For taxes, no: a personal car has no tax depreciation and a loss on its sale is not deductible. For your budget, yes: the yearly loss of value is usually the largest cost of owning a newer car. Enter it in the cost of ownership calculator to see it next to fuel and insurance.` },
  ],
  related: ['cost-per-mile-calculator', 'cost-of-owning-a-car-calculator', 'business-mileage-deduction', 'irs-mileage-rate'],
  sources: ['irs_notice_2026_10', 'irs_pub_463', 'irs_rp_2019_46', 'irs_rates_page'],
});
