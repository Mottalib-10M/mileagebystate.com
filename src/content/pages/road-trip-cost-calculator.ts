import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const E = K.ENERGY_META;
const std = K.std(2027);
const miles = 900, mpg = 28, nights = 3, people = 2;
const fuel = (miles / mpg) * E.usGas;
const rooms = nights * std.lodging;
const food = (nights + 1) * std.mie * people;
const total = fuel + rooms + food;

export default definePage({
  id: 'road-trip-cost-calculator',
  group: 'driving',
  order: 20,
  slug: 'road-trip-cost-calculator',
  nav: 'Road trip cost calculator',
  card: 'Fuel, rooms, food and tolls for a multi-day drive, split between travelers.',
  title: 'Road Trip Cost Calculator 2026: Gas, Rooms, Food and Tolls',
  description: `Road trip cost calculator for 2026: fuel at EIA state prices, rooms at your rate (default ${K.usd(std.lodging)}, the federal standard), food and tolls, split per person.`,
  h1: 'Road trip cost calculator',
  intro: 'Distance, car, nights, travelers: the calculator adds fuel, rooms, food and tolls and divides the total between the people in the car.',
  resume: `Two people driving ${K.num(miles)} miles over three nights in a ${mpg}-mpg car spend about ${K.usd(fuel)} on fuel at the U.S. average of ${K.usd(E.usGas, 3)} a gallon measured by EIA in the week of ${K.day(E.gasWeek)}. Add three nights in one room at ${K.usd(std.lodging)} and food at ${K.usd(std.mie)} a day each for four days, and the trip comes to about ${K.usd(total)}, or ${K.usd(total / people)} per person. Those room and food figures are not market prices: they are the federal standard rates for fiscal year 2027, used as neutral defaults because they are published, current and the same in every county without its own rate. Replace them with what you expect to pay. Fuel follows the EIA price of the state you pick; rooms are counted for two travelers each; tolls are typed in as a total. For a business trip paid by an employer, the per diem calculator is the better tool.`,
  tool: 'roadtrip',
  toolProps: { state: 'texas' },
  body: (h) => `
<h2>What a road trip really costs, line by line</h2>
<p>Fuel is the line people estimate first and the smallest one on most trips of more than a day. On the example above, gasoline is about ${K.pct(fuel / total)} of the total; rooms and food make up the rest. That is why a cheaper motel or a cooler of sandwiches usually saves more than shaving a few miles off the route. The calculator shows the split as a bar so the big lines are visible at a glance.</p>
<p>Rooms are counted one per two travelers, rounded up: three friends need two rooms. Food is per person per day, including the departure and arrival days. If someone else pays a night or a meal, lower the figure; the tool does not try to guess hotel rates by city, which change by the week.</p>
<h2>Why the defaults are federal rates</h2>
<p>A calculator needs a starting value, and inventing an "average hotel price" would be a figure without a source. The defaults here are the GSA standard rates in force from October 1, 2026: ${K.usd(std.lodging)} for lodging and ${K.usd(std.mie)} for meals and incidentals (${h.src('gsa_highlights', 'GSA FY2027 highlights')}). They describe what a federal traveler may spend in an ordinary county, not what a family will choose. For a city with its own rate, look it up in the ${h.a('per-diem-rates', 'GSA rate lookup')}: New York, Boston or a ski town in season can be two or three times higher.</p>
${h.mini('fuelLeg', { label: 'U.S. average', price: E.usGas })}
<h2>Fuel price along the way</h2>
<p>The calculator prices all the fuel at the state you choose. On a long drive across regions the price changes: EIA's weekly survey put regular gasoline at ${K.usd(K.gas('texas'), 3)} in Texas and ${K.usd(K.gas('california'), 3)} in California in the week of ${K.day(E.gasWeek)}. For a coast-to-coast trip, run the tool once per leg with the state of each leg, or pick the state where you will buy most of the fuel. The ${h.a('gas-cost-calculator', 'gas cost calculator')} handles a single leg with more vehicle options.</p>
<h2>Tolls, parking and the rest</h2>
<p>Toll costs depend on the road, the vehicle class and the payment method, and toll agencies publish them separately, so the tool takes a total you enter. Parking at hotels in large cities can add a nightly fee; put it in the room price or in tolls. For an electric car, price the energy with the ${h.a('ev-charging-cost-calculator', 'EV charging cost calculator')} and add rooms and food from here.</p>
<h2>When the trip is for work</h2>
<p>If an employer reimburses the trip, what counts is not the budget but the rules: lodging up to the GSA maximum of each night, meals at the federal M&IE with 75% on the travel days, and mileage at the IRS rate of ${K.centsWord(K.irs('2026-07-01'))} instead of the fuel you bought. The ${h.a('home', 'trip calculator')} computes exactly that.</p>
`,
  faqs: [
    { q: 'How much does a three-day road trip cost for two people?', a: `It depends on distance, car and where you sleep. With ${K.num(miles)} miles at ${mpg} mpg, three nights at ${K.usd(std.lodging)} and food at ${K.usd(std.mie)} per person per day, the total is about ${K.usd(total)}, or ${K.usd(total / people)} each, at the U.S. fuel price of ${K.usd(E.usGas, 3)}. Rooms and food weigh far more than fuel.` },
    { q: 'Why does the road trip calculator use $113 a night by default?', a: `Because it is a published, current figure: the GSA standard lodging rate for fiscal year 2027, from October 1, 2026, which applies in most U.S. counties for federal travelers. It is a neutral starting point, not a hotel price forecast. Replace it with your own estimate, or look up the federal rate of a specific city.` },
    { q: 'Can the road trip cost calculator split costs between friends?', a: `Yes. Enter the number of people sharing the car: fuel, tolls, rooms and food are added, rooms counted one per two travelers, and the result shows the total per person. For uneven splits, such as one person paying all the fuel, use the line amounts shown under the result.` },
    { q: 'Does the road trip calculator include tolls automatically?', a: `No. Tolls depend on the exact road, the time of day on some highways, the number of axles and the payment method, and they are set by many separate agencies. Enter the toll total you expect from your route planner or the toll authority websites; the tool adds it and splits it with the rest.` },
  ],
  related: ['gas-cost-calculator', 'home', 'per-diem-rates', 'ev-charging-cost-calculator', 'cost-per-mile-calculator'],
  sources: ['eia_gas', 'gsa_highlights', 'epa_fueleconomy', 'gsa_files'],
});
