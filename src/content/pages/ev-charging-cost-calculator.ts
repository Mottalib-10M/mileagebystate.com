import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const E = K.ENERGY_META;
const byE = [...K.STATE_LIST].sort((a, b) => a.elecCents - b.elecCents);
const lo = byE[0], hi = byE[byE.length - 1];
const y = K.ev('2026 Tesla Model Y Long Range AWD');
const eq = K.ev('2027 Chevrolet Equinox EV FWD');
const cost = (miles: number, k: number, c: number) => (miles * k / 100) * c / 100;

export default definePage({
  id: 'ev-charging-cost-calculator',
  group: 'driving',
  order: 50,
  slug: 'ev-charging-cost-calculator',
  nav: 'EV charging cost calculator',
  card: 'EPA kWh per 100 miles of your model times the EIA electricity price of your state.',
  title: 'EV Charging Cost Calculator 2026: Price by State and Model',
  description: `EV charging cost calculator for 2026: EPA kWh per 100 miles of each model times the EIA home electricity price of your state, plus any public charging.`,
  h1: 'EV charging cost calculator',
  intro: 'Choose an electric model and a state: the cost of the miles you drive uses the EPA consumption of the car and the residential price EIA measured in your state.',
  resume: `Driving an electric car 1,000 miles costs about ${K.usd(cost(1000, y.kwh100, E.usElecCents), 2)} at home at the U.S. average residential price of ${K.num(E.usElecCents, 2)} cents per kWh (EIA, ${E.elecPeriod}), for a ${y.label} that draws ${K.num(y.kwh100, 1)} kWh per 100 miles from the outlet according to the EPA. The state moves that figure a lot: ${K.usd(cost(1000, y.kwh100, lo.elecCents), 2)} in ${lo.name} at ${K.num(lo.elecCents, 2)} cents, ${K.usd(cost(1000, y.kwh100, hi.elecCents), 2)} in ${hi.name} at ${K.num(hi.elecCents, 2)} cents. The calculator above starts from the residential average of the state you pick and from the EPA figure of the model; you can type the price on your own bill, and the share of charging you do at public stations with the price posted there. The EPA consumption already counts the energy lost while charging, so the result is what the meter records, not what reaches the battery.`,
  tool: 'ev',
  toolProps: { state: 'california' },
  body: (h) => `
<h2>Two numbers do all the work</h2>
<p>The first is consumption. The EPA publishes, for every electric model, the electricity needed to drive 100 miles in its combined test cycle, measured at the wall (${h.src('epa_fueleconomy', 'fueleconomy.gov')}). Efficient sedans sit near 25 kWh per 100 miles; large trucks and three-row SUVs above 40. The ${eq.label} is rated ${K.num(eq.kwh100, 1)} kWh per 100 miles. The second is price: the residential average of your state in the ${h.src('eia_epm', 'EIA Electric Power Monthly')}, cumulated from January to July 2026, which smooths out a single month's swings.</p>
<p>Multiply miles by consumption and divide by 100 to get kWh; multiply by the price per kWh to get dollars. The calculator also returns the cost per mile, the figure to compare with gasoline: at the U.S. average, the Model Y above costs ${K.rate(y.kwh100 / 100 * E.usElecCents / 100)} a mile in electricity.</p>
${h.mini('evCharge', { label: 'U.S. average', cents: E.usElecCents, kwh100: y.kwh100 })}
<h2>The model matters as much as the state</h2>
<p>Consumption spreads widely between electric models. Over 12,000 miles a year at the U.S. average price, the ${y.label} uses about ${K.num(12000 * y.kwh100 / 100)} kWh, or ${K.usd(cost(12000, y.kwh100, E.usElecCents))}; the ${eq.label} about ${K.num(12000 * eq.kwh100 / 100)} kWh, or ${K.usd(cost(12000, eq.kwh100, E.usElecCents))}. A heavy pickup can use half again as much as an efficient sedan for the same trips. When you compare cars before buying, run the calculator once per model with the same state and miles.</p>
<h2>Home rates, time of use and your own bill</h2>
<p>A state average hides a lot: utilities within a state charge differently, and many offer cheaper night rates for charging. The most accurate price is the one on your bill: divide the total of the bill by the kWh used, or use the off-peak rate if the car charges overnight on a time-of-use plan. Type it in the optional field and the state average is ignored.</p>
<h2>Public charging</h2>
<p>Fast chargers on highways price by kWh in most states, sometimes by minute, and their prices vary by network, location and membership. There is no public average of those prices comparable to EIA's, so the calculator asks for the price posted on the charger or in the app and the share of your charging done there. Someone who charges at home 90% of the time and on road trips the rest sees the public price weigh far less than its sticker suggests.</p>
<h2>EVs and the mileage rate</h2>
<p>The IRS mileage rates apply to electric cars as to gasoline ones: ${K.centsWord(K.irs('2026-07-01'))} a business mile since July 1, 2026. Because charging usually costs a fraction of that per mile, an EV driver reimbursed at the IRS rate keeps a larger share for depreciation and insurance. For a full budget, see the ${h.a('gas-vs-electric-car-calculator', 'gas versus electric comparison')} and the ${h.a('tesla-charging-cost', 'Tesla charging cost page')}.</p>
`,
  faqs: [
    { q: 'How much does it cost to charge an electric car at home per month?', a: `Multiply your monthly miles by the car's EPA kWh per 100 miles, divide by 100, then multiply by your price per kWh. For 1,000 miles a month in a car using ${K.num(y.kwh100, 1)} kWh per 100 miles at the U.S. average of ${K.num(E.usElecCents, 2)} cents, that is about ${K.usd(cost(1000, y.kwh100, E.usElecCents), 2)}.` },
    { q: 'Which state has the cheapest electricity for EV charging?', a: `In the EIA residential averages for ${E.elecPeriod}, ${lo.name} had the lowest price, ${K.num(lo.elecCents, 2)} cents per kWh, and ${hi.name} the highest, ${K.num(hi.elecCents, 2)} cents. Utilities and time-of-use plans inside a state can beat or exceed its average, so check your own bill before comparing.` },
    { q: 'Does the EPA kWh per 100 miles include charging losses?', a: `Yes. The EPA measures the electricity drawn from the outlet during testing, so losses in the charger and the battery are included. That makes the figure the right one for cost: it matches what your meter records. In cold weather or at highway speeds, real consumption is often higher than the combined rating.` },
    { q: 'Why does the EV charging calculator ask for a public charging price?', a: `Because public fast-charging prices are set by each network and location, and no federal agency publishes an average comparable to residential prices. Enter the price per kWh shown on the charger or in the app, and the share of your miles charged there; the calculator blends it with your home price.` },
  ],
  related: ['tesla-charging-cost', 'gas-vs-electric-car-calculator', 'gas-cost-calculator', 'cost-of-owning-a-car-calculator', 'irs-mileage-rate'],
  sources: ['epa_fueleconomy', 'eia_epm', 'irs_ir_2025_128', 'irs_ann_2026_11'],
});
