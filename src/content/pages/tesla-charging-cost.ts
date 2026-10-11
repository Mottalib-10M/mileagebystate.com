import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const E = K.ENERGY_META;
const teslas = K.VEH.ev.filter((e) => e.make === 'Tesla');
const byE = [...K.STATE_LIST].sort((a, b) => a.elecCents - b.elecCents);
const lo = byE[0], hi = byE[byE.length - 1];
const full = (e: { kwh100: number; range: number }, c: number) => (e.range * e.kwh100 / 100) * c / 100;
const y = K.ev('2026 Tesla Model Y Long Range AWD');
const m3 = K.ev('2026 Tesla Model 3 Standard RWD');
const ct = K.ev('2026 Tesla Cybertruck AWD');
const pick = ['2026 Tesla Model 3 Standard RWD', '2026 Tesla Model 3 Premium AWD', '2026 Tesla Model Y Standard RWD (18in Wheels)', '2026 Tesla Model Y Long Range AWD', '2026 Tesla Model S', '2026 Tesla Model X', '2026 Tesla Cybertruck AWD'].map((l) => K.ev(l));

export default definePage({
  id: 'tesla-charging-cost',
  group: 'driving',
  order: 60,
  slug: 'tesla-charging-cost',
  nav: 'Tesla charging cost',
  card: 'What a full charge of each 2026 Tesla costs at home, state by state, from EPA and EIA figures.',
  title: 'Tesla Charging Cost 2026: Full Charge at Home, by State',
  description: `Tesla charging cost for 2026: a full EPA-range charge of a Model Y Long Range costs about ${K.usd(full(y, E.usElecCents))} at the U.S. home price, from ${K.usd(full(y, lo.elecCents))} to ${K.usd(full(y, hi.elecCents))} by state. Every model.`,
  h1: 'How much it costs to charge a Tesla at home',
  intro: 'Pick a Tesla and a state: the cost of a full charge and of the miles you drive comes from the EPA consumption of the model and the EIA home electricity price.',
  resume: `Charging a 2026 Tesla Model Y Long Range AWD from empty to its full EPA range of ${K.num(y.range)} miles takes about ${K.num(y.range * y.kwh100 / 100)} kWh from the outlet, which costs ${K.usd(full(y, E.usElecCents), 2)} at the U.S. average residential price of ${K.num(E.usElecCents, 2)} cents per kWh (EIA, ${E.elecPeriod}). In ${lo.name}, where the average is ${K.num(lo.elecCents, 2)} cents, the same charge costs ${K.usd(full(y, lo.elecCents), 2)}; in ${hi.name}, at ${K.num(hi.elecCents, 2)} cents, ${K.usd(full(y, hi.elecCents), 2)}. The figure depends on two published numbers only: the EPA kWh per 100 miles of the exact version, which includes charging losses, and the average price where you live. A Model 3 Standard RWD needs less, a Cybertruck far more. The calculator above lists every 2026 and 2027 Tesla in the EPA data; type the price from your own bill for an exact answer, and add a share of Supercharging at the price shown in your app.`,
  tool: 'tesla',
  toolProps: { state: 'california' },
  body: (h) => `
<h2>Why "a full charge" is computed from range</h2>
<p>Tesla does not publish battery capacities in its specifications the way it publishes range, and the usable capacity differs from the nominal one. The EPA, on the other hand, publishes for every version both the range and the electricity drawn from the outlet per 100 miles (${h.src('epa_fueleconomy', 'fueleconomy.gov')}). Range times consumption gives the energy needed to drive the full rated range from empty, charging losses included. Real sessions rarely run from 0 to 100%; a typical top-up from 20% to 80% costs about 60% of the figure shown.</p>
<h2>Every 2026 Tesla, three prices</h2>
${h.table(['Model (EPA)', 'kWh/100 mi', 'EPA range', `U.S. average (${K.num(E.usElecCents, 2)}¢)`, `${lo.name} (${K.num(lo.elecCents, 2)}¢)`, `${hi.name} (${K.num(hi.elecCents, 2)}¢)`], pick.map((e) => [e.label.replace('2026 Tesla ', ''), K.num(e.kwh100, 1), `${K.num(e.range)} mi`, K.usd(full(e, E.usElecCents), 2), K.usd(full(e, lo.elecCents), 2), K.usd(full(e, hi.elecCents), 2)]), 'Cost of driving the full EPA range from empty, at EIA residential averages, January to July 2026.', ['l', 'r', 'r', 'r', 'r', 'r'])}
<p>The cheapest version to run in the EPA list is the Model 3 Standard RWD at ${K.num(m3.kwh100, 1)} kWh per 100 miles; the Cybertruck AWD needs ${K.num(ct.kwh100, 1)}. Over 1,000 miles at the U.S. average that is ${K.usd(m3.kwh100 * 10 * E.usElecCents / 100)} against ${K.usd(ct.kwh100 * 10 * E.usElecCents / 100)}. Larger wheels on the same model raise consumption, which is why the EPA lists them separately.</p>
${h.mini('evCharge', { label: 'U.S. average', cents: E.usElecCents, kwh100: y.kwh100 })}
<h2>Reading the price of your state</h2>
<p>The three price columns use EIA residential averages, which mix every utility of a state, flat and time-of-use plans alike. Many owners charge overnight on a cheaper off-peak rate, which can sit well below the state average; others pay a higher tier in summer. The fastest way to an exact figure is your last bill: divide the dollars by the kWh, and type that price into the calculator. The cost then follows your plan instead of the state's.</p>
<p>Home charging equipment changes speed, not price: a wall connector on a 240-volt circuit fills the battery faster than a standard outlet, but the kWh bought, and therefore the cost, depend only on the miles. What the equipment costs to buy and install is a separate, one-time expense.</p>
<p>Cold weather raises consumption, because the battery and the cabin need heat; high highway speeds do too. The EPA combined figure is a fair middle, and a winter month can run above it. If your car's trip computer shows your real consumption, type it as the kWh per 100 miles in the EV calculator.</p>
<h2>Superchargers and other public stations</h2>
<p>Supercharger prices are set per site and often per time of day, and they are shown in the car and the app before you plug in. No public dataset averages them, so this site does not print a national Supercharger price. Enter the price you see and the share of your miles charged there: for an owner who charges at home almost every night, the public price changes the monthly total far less than its sticker suggests.</p>
<h2>Per month and per mile</h2>
<p>For a monthly budget, use miles rather than full charges: 1,000 miles in a Model Y Long Range AWD use about ${K.num(y.kwh100 * 10)} kWh. At the U.S. average that is ${K.usd(y.kwh100 * 10 * E.usElecCents / 100, 2)}, or ${K.rate(y.kwh100 / 100 * E.usElecCents / 100)} a mile. The ${h.a('gas-vs-electric-car-calculator', 'gas versus electric calculator')} puts that next to a gasoline car in the same state, and the ${h.a('ev-charging-cost-calculator', 'EV charging calculator')} covers other makes. A Tesla used for work is reimbursed or deducted at the same IRS rate as any car, ${K.centsWord(K.irs('2026-07-01'))} a mile since July 1, 2026.</p>
`,
  faqs: [
    { q: 'How much does it cost to fully charge a Tesla Model Y at home?', a: `For the 2026 Model Y Long Range AWD, about ${K.num(y.range * y.kwh100 / 100)} kWh from the outlet for the full EPA range of ${K.num(y.range)} miles: ${K.usd(full(y, E.usElecCents), 2)} at the U.S. average residential price of ${K.num(E.usElecCents, 2)} cents per kWh. Your state's average and your own utility rate change it; the calculator uses both.` },
    { q: 'What is the cheapest Tesla to charge in 2026?', a: `In the EPA data, the 2026 Model 3 Standard RWD has the lowest consumption among Tesla versions, ${K.num(m3.kwh100, 1)} kWh per 100 miles, so it costs the least per mile at any electricity price. At the U.S. average that is about ${K.rate(m3.kwh100 / 100 * E.usElecCents / 100)} a mile.` },
    { q: 'Is charging a Tesla cheaper than buying gas?', a: `At home, usually. A Model Y Long Range AWD costs about ${K.rate(y.kwh100 / 100 * E.usElecCents / 100)} a mile at the U.S. average electricity price, while a 30 mpg gasoline car costs about ${K.rate(E.usGas / 30)} a mile at the EIA gasoline average of ${K.usd(E.usGas, 3)}. Frequent fast charging narrows or reverses the gap, depending on the price at the station.` },
    { q: 'Does the Tesla charging cost include energy lost while charging?', a: `Yes. The EPA kWh per 100 miles is measured at the wall, so the losses of the onboard charger and the battery are inside the figure. That is why it is higher than the energy the battery stores, and why it is the right basis for the cost you will see on your electricity bill.` },
  ],
  related: ['ev-charging-cost-calculator', 'gas-vs-electric-car-calculator', 'cost-of-owning-a-car-calculator', 'gas-cost-calculator'],
  sources: ['epa_fueleconomy', 'eia_epm', 'eia_gas', 'irs_ann_2026_11'],
});
