import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const E = K.ENERGY_META;
const byGas = [...K.STATE_LIST].sort((a, b) => a.gas - b.gas);
const lo = byGas[0], hi = byGas[byGas.length - 1];
const own = K.STATE_LIST.filter((s) => s.gasArea === s.name).map((s) => s.name);
const camry = K.car('Toyota Camry'), f150 = K.car('Ford F150');
const trip = (mpg: number, price: number) => (500 / mpg) * price;
const b2 = K.irs('2026-07-01');

export default definePage({
  id: 'gas-cost-calculator',
  group: 'driving',
  order: 10,
  slug: 'gas-cost-calculator',
  nav: 'Gas cost calculator',
  card: 'Fuel for a drive at this week’s EIA price in your state, with EPA MPG for common 2026 models.',
  title: 'Gas Cost Calculator 2026: Trip Fuel at EIA State Prices',
  description: `Gas cost calculator for 2026: fuel for any drive at the latest EIA price in your state (U.S. regular ${K.usd(E.usGas, 2)}), EPA MPG of 2026 models, split by all riders.`,
  h1: 'Gas cost calculator for a drive',
  intro: 'Enter the distance, pick your state and your car (or type the MPG): the fuel cost uses the price EIA measured this week where you fill up.',
  resume: `A 500-mile drive in a car that gets 30 miles per gallon burns about 16.7 gallons; at the U.S. average of ${K.usd(E.usGas, 3)} for regular gasoline in the EIA survey of ${K.day(E.gasWeek)}, that is ${K.usd(trip(30, E.usGas), 2)}. Where you fill up moves the answer more than most people expect: the same drive costs ${K.usd(trip(30, lo.gas), 2)} at the ${lo.name} average of ${K.usd(lo.gas, 3)} and ${K.usd(trip(30, hi.gas), 2)} at the ${hi.name} average of ${K.usd(hi.gas, 3)}. The calculator above starts from the EIA price of your state, or of its region when EIA does not survey the state on its own, and from the EPA combined MPG of sixteen common 2026 models. Type your own price or MPG to override them, switch to diesel, mark the distance as one way to double it, and share the cost between passengers. It also shows what the same miles would be worth at the IRS business rate.`,
  tool: 'fuel',
  toolProps: { state: 'texas' },
  body: (h) => `
<h2>Where the default price comes from</h2>
<p>The Energy Information Administration publishes weekly average retail prices for the country, its regions and a handful of states and cities (${h.src('eia_gas', 'Gasoline and Diesel Fuel Update')}); the calculator uses the latest week available when the site was built and says which one under the state field. Nine states have their own series: ${K.listOf(own)}. Every other state takes the average of its region, such as the Gulf Coast, the Midwest or the Lower Atlantic, which is an approximation: a station in a big-city suburb and one off a rural interstate in the same region can differ by more than the regional average suggests. That is why the price field stays editable.</p>
<p>Diesel follows the same regional series, except California, which has its own. In the week of ${K.day(E.gasWeek)}, diesel averaged ${K.usd(E.usDiesel, 3)} nationally against ${K.usd(E.usGas, 3)} for regular gasoline, a gap wide enough to matter for pickup and van owners who compare engines.</p>
<h2>The MPG you should type</h2>
<p>EPA combined MPG blends 55% city and 45% highway driving. On a long highway trip many cars beat it slightly; at high speed with a loaded roof box or a trailer they do worse. The presets come from the ${h.src('epa_fueleconomy', 'EPA fueleconomy.gov data')} for the plainest 2026 version of each nameplate: the ${camry.label.replace(/ \(.*$/, '')} is rated ${camry.mpg} mpg, the ${f150.label.replace(/ \(.*$/, '')} ${f150.mpg} mpg. On 500 miles at the national price, that gap is ${K.usd(trip(camry.mpg, E.usGas), 2)} against ${K.usd(trip(f150.mpg, E.usGas), 2)}. Your dashboard average over the last few tanks beats any rating, and for a car you just bought, the window sticker shows the same EPA figures the presets use. If you track fill-ups, divide the miles since the last full tank by the gallons you just pumped: that is your real MPG for this kind of driving.</p>
${h.mini('fuelLeg', { label: 'U.S. average', price: E.usGas })}
<h2>Fuel is not the cost of driving</h2>
<p>For a business trip, the fuel figure understates what the car costs. The IRS business rate of ${K.centsWord(b2)} a mile since July 1, 2026 is built from fixed and variable costs: depreciation, insurance, registration, maintenance and tires as well as fuel. A 30-mpg car at the national price spends about ${K.rate(E.usGas / 30)} a mile on gasoline, roughly ${K.pct((E.usGas / 30) / b2)} of the rate. An employer that reimburses "gas only" is paying a fraction of the real cost; see the ${h.a('mileage-reimbursement-calculator', 'mileage reimbursement calculator')} for the tax side and the ${h.a('cost-per-mile-calculator', 'cost per mile calculator')} for your own car's figure.</p>
<h2>Splitting with passengers and planning a longer trip</h2>
<p>The "people sharing the cost" field simply divides fuel and tolls. For a trip with nights on the road, the ${h.a('road-trip-cost-calculator', 'road trip cost calculator')} adds rooms and meals, and the ${h.a('home', 'trip calculator')} handles a business trip with federal per diem. For an electric car, use the ${h.a('ev-charging-cost-calculator', 'EV charging cost calculator')}, which works from kWh per 100 miles and the electricity price of your state.</p>
`,
  faqs: [
    { q: 'How do I calculate gas cost for a road trip?', a: `Divide the total miles by your car's miles per gallon to get gallons, then multiply by the price per gallon. Five hundred miles at 30 mpg is about 16.7 gallons; at the ${K.day(E.gasWeek)} U.S. average of ${K.usd(E.usGas, 3)}, that is ${K.usd(trip(30, E.usGas), 2)}. Double the distance for a return trip and add tolls.` },
    { q: 'Which states have the cheapest and most expensive gas this week?', a: `In the EIA survey of ${K.day(E.gasWeek)}, ${lo.name} had the lowest regular gasoline average among the series the calculator uses, ${K.usd(lo.gas, 3)} a gallon, and ${hi.name} the highest, ${K.usd(hi.gas, 3)}. Only nine states have their own EIA series; the others take a regional average, so rankings between neighboring states are approximate.` },
    { q: 'Is the gas cost the same as the IRS mileage rate?', a: `No. The IRS business rate of ${K.centsWord(b2)} a mile covers fuel plus depreciation, insurance, registration, repairs and tires. Fuel alone for a 30 mpg car at the national average is about ${K.rate(E.usGas / 30)} a mile. That is why a mileage reimbursement is usually well above the gas you bought on the trip.` },
    { q: 'Does the gas cost calculator work for diesel?', a: `Yes. Switch the fuel to diesel and the default price becomes the EIA diesel average for your region, or for California, which has its own diesel series. The U.S. average was ${K.usd(E.usDiesel, 3)} a gallon in the week of ${K.day(E.gasWeek)}. Enter the MPG of your diesel vehicle; the presets are gasoline and hybrid models.` },
  ],
  related: ['road-trip-cost-calculator', 'cost-per-mile-calculator', 'ev-charging-cost-calculator', 'irs-mileage-rate', 'home'],
  sources: ['eia_gas', 'epa_fueleconomy', 'irs_ann_2026_11', 'irs_rates_page'],
});
