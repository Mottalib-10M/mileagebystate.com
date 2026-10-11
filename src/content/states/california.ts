import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import { destIndex, T } from '../../lib/data';

const sum = K.stateSummary('california');
const at = (name: string) => T.dest[destIndex('CA', name)].fy['2027'];
const sf = at('San Francisco'), la = at('Los Angeles'), sm = at('Santa Monica'), tahoe = at('South Lake Tahoe'), bak = at('Bakersfield / Ridgecrest');
const hi = (r: { lodging: number[] }) => Math.max(...r.lodging), lo = (r: { lodging: number[] }) => Math.min(...r.lodging);
const sfPeak = K.nsas('CA').find((n) => n.name === 'San Francisco')!;
const bakPrev = T.dest[destIndex('CA', 'Bakersfield / Ridgecrest')].fy['2026'];
const gas = K.gas('california');
const share = K.P.mie.partialDayShare;
const ex = K.trip({ destIndex: destIndex('CA', 'San Francisco'), depart: '2026-10-12', ret: '2026-10-15' });

export default defineState({
  slug: 'california',
  dest: 'San Francisco',
  title: 'Per Diem Rates California 2026-27: GSA FY2027 by County',
  description: `Per diem rates in California for 2026-27 (FY2027): ${sum.count} GSA areas, up to ${K.usd(sfPeak.high)} a night in San Francisco, M&IE ${K.usd(sum.mieTiers[0])} to ${K.usd(sum.mieTiers[sum.mieTiers.length - 1])}, standard ${K.usd(sum.std.lodging)} lodging elsewhere.`,
  intro: `California has ${sum.count} GSA areas in FY2027, more than any other state, and the dearest night is in San Francisco.`,
  resume: `Federal per diem in California runs from the standard ${K.usd(sum.std.lodging)} of lodging and ${K.usd(sum.std.mie)} of M&IE in counties GSA does not list, up to ${K.usd(sfPeak.high)} a night in San Francisco in ${K.listOf(sfPeak.highMonths)}, with ${K.usd(sf.mie)} of M&IE. ${sum.count} areas have their own FY2027 rate, from October 1, 2026 to September 30, 2027. Los Angeles, Orange and Ventura counties share one area at ${K.usd(hi(la))} all year, but the city of Santa Monica is carved out at ${K.usd(hi(sm))}. Seasonal swings are widest at South Lake Tahoe (${K.usd(lo(tahoe))} to ${K.usd(hi(tahoe))}) and Monterey. A three-night trip to San Francisco in mid-October 2026 comes to ${K.usd(ex.total, 2)} at the federal maximum, before lodging taxes. The calculator above starts on San Francisco; search any California city or ZIP code to switch.`,
  body: (h) => `
<h2>Two Californias in the GSA table</h2>
<p>The coast and the big valleys do not live on the same scale. Most Bay Area counties sit in non-standard areas, with San Francisco, Santa Clara, Alameda and Marin at the top ${K.usd(92)} M&IE tier, while Kern County (Bakersfield and Ridgecrest) and San Joaquin County (Stockton) are at ${K.usd(74)}. Bakersfield is the area that moved most this year: ${K.usd(bakPrev ? Math.max(...bakPrev.lodging) : hi(bak))} of lodging in FY2026, ${K.usd(hi(bak))} in FY2027. Large parts of the Sierra foothills, the northern interior and the Imperial Valley have no line at all and take the standard ${K.usd(sum.std.lodging)}.</p>
<h3>The Santa Monica exception and Edwards Air Force Base</h3>
<p>The Los Angeles area is defined as Los Angeles, Orange and Ventura counties plus Edwards Air Force Base, "less the city of Santa Monica." A meeting in Santa Monica is paid at ${K.usd(hi(sm))} and ${K.usd(sm.mie)}, one in Culver City next door at ${K.usd(hi(la))} and ${K.usd(la.mie)}. Edwards sits in Kern County but is attached to the Los Angeles rate, which is why the ZIP search here is the safest way to check a base or an address near a county line.</p>
<h2>Seasons: Tahoe, Monterey and the desert</h2>
<p>South Lake Tahoe pays its highest maximum in ${K.listOf(K.nsas('CA').find((n) => n.name === 'South Lake Tahoe')!.highMonths)}, Mammoth Lakes in the ski months, Palm Springs in ${K.listOf(K.nsas('CA').find((n) => n.name === 'Palm Springs')!.highMonths)}, and Monterey in ${K.listOf(K.nsas('CA').find((n) => n.name === 'Monterey')!.highMonths)}. San Francisco is the odd one: its top maximum falls in ${K.listOf(sfPeak.highMonths)}, not in summer. A traveler who books Tahoe across a season change gets two different caps in the same week, and the day-by-day table of the calculator shows each night.</p>
${h.mini('areaTrip', { area: 'South Lake Tahoe, CA', lodging: tahoe.lodging, mie: tahoe.mie })}
<h2>Driving in California: the rate is national, the fuel is not</h2>
<p>The IRS mileage rate does not change at the state line: ${K.centsWord(K.irs('2026-07-01'))} a mile since July 1, 2026. What changes is what a mile really costs you. California regular gasoline averaged ${K.usd(gas, 3)} a gallon in the EIA survey of ${K.day(K.ENERGY_META.gasWeek)}, against ${K.usd(K.ENERGY_META.usGas, 3)} for the country. At 28 miles per gallon that is ${K.usd(gas / 28, 3)} a mile of fuel alone, so an employer paying a flat 50 cents leaves a California driver with little for insurance and wear. The ${h.a('gas-cost-calculator', 'gas cost calculator')} uses the California series by default.</p>
${h.mini('fuelLeg', { label: 'California', price: gas })}
<p>For the meals, the rule is the federal one: ${K.pct(share)} of the M&IE on the travel days, provided conference meals deducted at the ${h.a('meals-and-incidental-expenses', 'GSA breakdown')}.</p>
`,
  faqs: [
    { q: 'What is the per diem rate for San Francisco, California in FY2027?', a: `San Francisco County has ${K.usd(sf.mie)} of M&IE a day and a lodging maximum of ${K.usd(lo(sf))} to ${K.usd(hi(sf))} depending on the month, the highest in ${K.listOf(sfPeak.highMonths)}. These FY2027 figures apply from October 1, 2026 to September 30, 2027. On the day you arrive and the day you leave, the M&IE is ${K.usd(sf.mie * share, 2)}.` },
    { q: 'Does Santa Monica have a different per diem than Los Angeles in California?', a: `Yes. GSA defines the Los Angeles area as Los Angeles, Orange and Ventura counties plus Edwards AFB, less the city of Santa Monica, which has its own rate. In FY2027 Santa Monica pays ${K.usd(hi(sm))} a night and ${K.usd(sm.mie)} of M&IE, the rest of the area ${K.usd(hi(la))} and ${K.usd(la.mie)}. Use the address of the work site.` },
    { q: 'Which California counties use the standard per diem rate?', a: `Every county GSA does not list. In FY2027 that means ${K.usd(sum.std.lodging)} of lodging and ${K.usd(sum.std.mie)} of M&IE, for example in Imperial, Shasta, Butte or Merced counties, which have no non-standard area. The table at the bottom of this page lists the ${sum.count} California areas that pay more; any other county takes the standard rate.` },
    { q: 'Is the mileage rate higher in California because of gas prices?', a: `No. The IRS business rate is national: ${K.centsWord(K.irs('2026-07-01'))} a mile from July 1, 2026, ${K.centsWord(K.irs('2026-06-30'))} before. The July increase followed a rise in fuel prices across the country, and there is no state supplement. Your employer may pay more; anything above the IRS rate is then taxable wages.` },
  ],
  related: ['per-diem-rates', 'home', 'gas-cost-calculator', 'meals-and-incidental-expenses', 'state:nevada', 'state:oregon'],
});
