import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const E = K.ENERGY_META;
const miles = 12000;
const ev = K.ev('2027 Chevrolet Equinox EV FWD');
const gas = K.car('Chevrolet Equinox');
const yearCost = (s: { gas: number; elecCents: number }) => ({ g: miles / gas.mpg * s.gas, e: miles * ev.kwh100 / 100 * s.elecCents / 100 });
const states = K.STATE_LIST.map((s) => ({ s, ...yearCost(s), d: yearCost(s).g - yearCost(s).e })).sort((a, b) => b.d - a.d);
const best = states[0], worst = states[states.length - 1];
const us = yearCost({ gas: E.usGas, elecCents: E.usElecCents });

export default definePage({
  id: 'gas-vs-electric-car-calculator',
  group: 'driving',
  order: 70,
  slug: 'gas-vs-electric-car-calculator',
  nav: 'Gas vs electric car',
  card: 'Yearly fuel against yearly electricity for the same miles, in your state.',
  title: 'Gas vs Electric Car Calculator 2026: Energy Cost by State',
  description: `Gas vs electric car calculator for 2026: a year of gasoline at your state's EIA price against a year of home charging at its EIA power price, and 5-year totals.`,
  h1: 'Gas or electric: what a year of driving costs in energy',
  intro: 'Pick a state, an electric model, the MPG of the gasoline car and your yearly miles: the calculator compares the two energy bills.',
  resume: `Over ${K.num(miles)} miles a year, a ${gas.label.replace(/ \(.*$/, '')} rated ${gas.mpg} mpg burns about ${K.usd(us.g)} of gasoline at the U.S. average of ${K.usd(E.usGas, 3)} a gallon (EIA, week of ${K.day(E.gasWeek)}), while its electric sibling, the ${ev.label}, uses about ${K.usd(us.e)} of electricity at the U.S. residential average of ${K.num(E.usElecCents, 2)} cents per kWh. That is a saving of ${K.usd(us.g - us.e)} a year, or ${K.usd((us.g - us.e) * 5)} over five years, in energy alone. The gap is not the same everywhere: with both prices from EIA, it is widest in ${best.s.name} (${K.usd(best.d)} a year) and narrowest in ${worst.s.name} (${K.usd(worst.d)}). The calculator above lets you swap models, MPG, miles and prices. It compares energy only; purchase price, insurance and depreciation belong in the cost of ownership calculator.`,
  tool: 'compare',
  toolProps: { state: 'texas' },
  body: (h) => `
<h2>Same car, two drivetrains</h2>
<p>The fairest comparison uses similar vehicles. Chevrolet sells the Equinox with a gasoline engine and as an electric model, and the EPA rates both (${h.src('epa_fueleconomy', 'fueleconomy.gov')}): ${gas.mpg} mpg combined for the gasoline version on this page, ${K.num(ev.kwh100, 1)} kWh per 100 miles for the electric one. A gallon of gasoline at the national price buys about ${K.num(gas.mpg)} miles for ${K.usd(E.usGas, 2)}; the same miles take ${K.num(gas.mpg * ev.kwh100 / 100, 1)} kWh, or ${K.usd(gas.mpg * ev.kwh100 / 100 * E.usElecCents / 100, 2)} at the national electricity price.</p>
<h2>Where electricity wins most, and least</h2>
<p>Two prices drive the result, and states combine them differently. A state with cheap power and average gasoline favors the EV; a state with expensive power and cheap gasoline narrows the gap. Using the EIA residential averages for ${E.elecPeriod} and the EIA gasoline prices of the week of ${K.day(E.gasWeek)}, the Equinox pair saves the most in ${best.s.name} and the least in ${worst.s.name}:</p>
${h.table(['State', 'Gasoline / gal', 'Electricity / kWh', 'Gasoline per year', 'Electricity per year', 'EV saves'], [...states.slice(0, 4), ...states.slice(-4)].map((x) => [x.s.name, K.usd(x.s.gas, 3), `${K.num(x.s.elecCents, 2)}¢`, K.usd(x.g), K.usd(x.e), K.usd(x.d)]), `${K.num(miles)} miles a year, ${gas.mpg} mpg against ${K.num(ev.kwh100, 1)} kWh/100 mi. States without their own EIA gasoline series take their region's average.`, ['l', 'r', 'r', 'r', 'r', 'r'])}
${h.mini('evCharge', { label: 'U.S. average', cents: E.usElecCents, kwh100: ev.kwh100 })}
<h2>Running your own comparison</h2>
<p>The Equinox pair is only an example. Pick any electric model in the list, then type the combined MPG of the gasoline car you would buy instead; the EPA window sticker or the presets of the gas cost calculator give it. Set your yearly miles from your odometer: the saving grows in proportion, so a driver doing 20,000 miles a year sees two thirds more than the 12,000-mile example. If your electricity bill shows a price far from the state average, enter it; the same goes for the price at your usual gas station.</p>
<p>The five-year line simply multiplies the yearly gap. It assumes prices stay where EIA measured them, which they will not: gasoline moves week to week and electricity month to month. Rerun the comparison with a higher and a lower price for each to see how sensitive the answer is for you.</p>
<h2>What the comparison leaves out</h2>
<p>Home charging at the residential average is the assumption here. Charging often at highway fast chargers costs more per kWh, and a time-of-use plan at night can cost less; the ${h.a('ev-charging-cost-calculator', 'EV charging calculator')} blends home and public charging. Maintenance differs too: electric cars need no oil changes, but tires can wear faster on heavier vehicles; this tool does not guess those amounts. The price gap between the two versions, insurance and resale value often outweigh the energy saving, which is why the ${h.a('cost-of-owning-a-car-calculator', 'cost of ownership calculator')} exists.</p>
<h2>For business driving</h2>
<p>The IRS mileage rate does not care what is under the hood: ${K.centsWord(K.irs('2026-07-01'))} a mile since July 1, 2026 for gasoline, hybrid and electric cars alike. An EV driver reimbursed at that rate keeps the larger share of it, because energy is a smaller part of the cost per mile; see the ${h.a('cost-per-mile-calculator', 'cost per mile calculator')}.</p>
`,
  faqs: [
    { q: 'How much does an electric car save on fuel per year?', a: `It depends on your state and the cars. For ${K.num(miles)} miles, the Equinox EV saves about ${K.usd(us.g - us.e)} a year against the gasoline Equinox at U.S. average prices (${K.usd(E.usGas, 3)} a gallon, ${K.num(E.usElecCents, 2)} cents per kWh). Across states, the saving runs from ${K.usd(worst.d)} to ${K.usd(best.d)} with EIA prices.` },
    { q: 'In which state does an EV save the most over a gas car?', a: `With the EIA prices used on this page and the Equinox pair, ${best.s.name}, where the yearly saving reaches ${K.usd(best.d)} for ${K.num(miles)} miles. The smallest saving is in ${worst.s.name}, ${K.usd(worst.d)}. Utility rates within a state differ, so enter your own electricity price for your case.` },
    { q: 'Does the gas vs electric car calculator include maintenance and insurance?', a: `No, only energy: gasoline at the EIA price of your state against home electricity at its EIA residential average. Maintenance, insurance, purchase price and resale value change from model to model and have no official averages. Add them in the cost of ownership calculator, where every one of those lines is an input.` },
    { q: 'Is the EPA consumption of an electric car realistic for this comparison?', a: `It is the same kind of figure as the gasoline MPG: a combined city and highway rating from a standard test, measured at the outlet for an EV. Both drift in real life, with speed, temperature and load. Comparing two EPA figures keeps the comparison fair; type your own measured values if you have them.` },
  ],
  related: ['ev-charging-cost-calculator', 'tesla-charging-cost', 'cost-of-owning-a-car-calculator', 'gas-cost-calculator', 'cost-per-mile-calculator'],
  sources: ['epa_fueleconomy', 'eia_epm', 'eia_gas', 'irs_ann_2026_11'],
});
