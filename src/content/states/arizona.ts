import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import { T } from '../../lib/data';

const sum = K.stateSummary('arizona');
const area = (name: string) => K.nsas('AZ').find((n) => n.name === name)!;
const sed = area('Sedona'), phx = area('Phoenix / Scottsdale'), tus = area('Tucson'), gcf = area('Grand Canyon / Flagstaff'), kay = area('Kayenta');
const L = (n: { i: number }) => T.dest[n.i].fy['2027'].lodging;
const std = sum.std;
const m = (x: number) => K.usd(x, x % 1 ? 2 : 0);
const gas = K.gas('arizona');
const gasArea = K.stateRef('arizona').gasArea;
const share = K.P.mie.partialDayShare;
const feb = K.trip({ destIndex: phx.i, depart: '2027-02-08', ret: '2027-02-11' });
const jul = K.trip({ destIndex: phx.i, depart: '2027-07-12', ret: '2027-07-15' });
const tiers = sum.mieTiers;

export default defineState({
  slug: 'arizona',
  dest: 'Phoenix / Scottsdale',
  title: 'Per Diem Rates Arizona 2026-27: Phoenix, Sedona, Tucson',
  description: `Arizona per diem 2026-27 (FY2027): Phoenix and Scottsdale ${K.usd(phx.low)} to ${K.usd(phx.high)} a night by month, Sedona city limits up to ${K.usd(sed.high)}, M&IE ${K.usd(tiers[0])} to ${K.usd(tiers[tiers.length - 1])} across ${sum.count} areas.`,
  intro: `Arizona's ${sum.count} GSA areas use ${tiers.length} different M&IE tiers, and Maricopa County pays its lowest room cap in high summer.`,
  resume: `Federal per diem in Arizona for FY2027 depends on the month as much as the city: Maricopa County, which covers Phoenix, Scottsdale, Mesa, Tempe and Chandler, allows ${K.usd(phx.high)} a night in ${K.listOf(phx.highMonths)} but only ${K.usd(phx.low)} in ${K.listOf(phx.lowMonths)}, with ${K.usd(phx.mie)} of M&IE all year. Inside the city limits of Sedona the cap reaches ${K.usd(sed.high)} in ${K.listOf(sed.highMonths)}, the top figure in the state. In all, ${sum.count} Arizona areas are listed, valid from October 1, 2026 to September 30, 2027; any other county pays the standard ${K.usd(std.lodging)} and ${K.usd(std.mie)}. Booked for three nights from February 8, 2027, a Phoenix trip comes to ${m(feb.total)} at the federal maximum. The same three nights from July 12, 2027 come to ${m(jul.total)}, a difference of ${m(feb.total - jul.total)} that is all lodging. The calculator opens on Phoenix / Scottsdale; type any Arizona ZIP code to change it.`,
  body: (h) => `
<h2>Sedona is a city, not a county</h2>
<p>Most GSA areas are drawn along county lines. Sedona is drawn along municipal ones: the area is the "City Limits of Sedona", and the neighboring Grand Canyon / Flagstaff area covers "${gcf.counties}". A hotel inside Sedona is capped at ${K.usd(sed.low)} to ${K.usd(sed.high)} with ${K.usd(sed.mie)} of M&IE; step outside the limits into Coconino or Yavapai County and the cap becomes ${K.usd(gcf.low)} to ${K.usd(gcf.high)}, with ${K.usd(gcf.mie)} of M&IE. The meal gap alone is ${K.usd(sed.mie - gcf.mie)} a day. Sedona's calendar has four steps in FY2027: ${K.usd(L(sed)[0])} in the fall, ${K.usd(sed.low)} in ${K.listOf(sed.lowMonths)}, ${K.usd(sed.high)} in ${K.listOf(sed.highMonths)}, ${K.usd(L(sed)[7])} from May through August.</p>
<h3>Flagstaff in winter pays the national floor</h3>
<p>In ${K.listOf(gcf.lowMonths)} the Grand Canyon / Flagstaff cap is ${K.usd(gcf.low)}, ${gcf.low === std.lodging ? 'exactly the standard CONUS lodging rate' : `against a standard rate of ${K.usd(std.lodging)}`}. The area only earns its listing in the other months, at ${K.usd(gcf.high)}. Kayenta (${kay.counties} County) is the reverse case: one flat ${K.usd(kay.high)} every month, on the ${K.usd(kay.mie)} tier.</p>
<h2>Phoenix turns the usual season around</h2>
<p>Maricopa County's FY2027 table runs ${K.usd(L(phx)[0])} from October to January, ${K.usd(phx.high)} in ${K.listOf(phx.highMonths)}, ${K.usd(L(phx)[6])} in April and May, then ${K.usd(phx.low)} in ${K.listOf(phx.lowMonths)}. The ${K.usd(phx.high - phx.low)} gap between February and July is wider than the whole range of Tucson. Tucson (Pima County) moved most since last year: ${K.usd(tus.prev!.low)} to ${K.usd(tus.prev!.high)} in FY2026, ${K.usd(tus.low)} to ${K.usd(tus.high)} now, with its peak in ${K.listOf(tus.highMonths)}.</p>
${h.mini('areaTrip', { area: 'Phoenix / Scottsdale, AZ', lodging: L(phx), mie: phx.mie })}
<p>With ${sum.count} areas spread over ${tiers.length} M&IE levels (${K.listOf(tiers.map((t) => K.usd(t)))}), the arrival-day allowance ranges from ${K.usd(tiers[0] * share, 2)} in Kayenta to ${K.usd(tiers[tiers.length - 1] * share, 2)} in Sedona; the ${h.a('meals-and-incidental-expenses', 'M&IE breakdown')} shows what each tier gives per meal.</p>
<h2>Arizona gasoline is priced with the West Coast</h2>
<p>EIA groups Arizona in its "${gasArea}" series, which averaged ${K.usd(gas, 3)} a gallon for regular in the week of ${K.day(K.ENERGY_META.gasWeek)}, ${K.usd(gas - K.ENERGY_META.usGas, 3)} above the U.S. figure of ${K.usd(K.ENERGY_META.usGas, 3)}. At 30 miles per gallon that is ${K.usd(gas / 30, 3)} of fuel per mile, out of an IRS rate of ${K.centsWord(K.irs('2026-07-01'))}. The ${h.a('road-trip-cost-calculator', 'road trip cost calculator')} prices a Phoenix to Flagstaff drive with this series.</p>
${h.mini('fuelLeg', { label: 'Arizona (EIA West Coast ex. California)', price: gas })}
`,
  faqs: [
    { q: 'Why is the Phoenix, Arizona per diem lower in summer?', a: `Because GSA sets Maricopa County's FY2027 lodging cap by month, and ${K.listOf(phx.lowMonths)} carry the lowest figure, ${K.usd(phx.low)}, against ${K.usd(phx.high)} in ${K.listOf(phx.highMonths)}. The ${K.usd(phx.mie)} M&IE does not change. A traveler who rents a room in July for more than ${K.usd(phx.low)} pays the excess unless the employer approves actual expense.` },
    { q: 'Does Sedona, Arizona have its own per diem rate?', a: `Yes, but only inside the city limits. GSA lists Sedona as a separate area at ${K.usd(sed.low)} to ${K.usd(sed.high)} of lodging and ${K.usd(sed.mie)} of M&IE in FY2027. Addresses in Coconino or Yavapai County outside those limits use the Grand Canyon / Flagstaff rate, ${K.usd(gcf.low)} to ${K.usd(gcf.high)} with ${K.usd(gcf.mie)} of M&IE.` },
    { q: 'How much did the Tucson, Arizona per diem go up for FY2027?', a: `Pima County's lodging range went from ${K.usd(tus.prev!.low)} to ${K.usd(tus.prev!.high)} in FY2026 to ${K.usd(tus.low)} to ${K.usd(tus.high)} in FY2027, a rise of ${K.usd(tus.high - tus.prev!.high)} at the top and ${K.usd(tus.low - tus.prev!.low)} at the bottom. M&IE stays at ${K.usd(tus.mie)}. The highest cap falls in ${K.listOf(tus.highMonths)}; every other month carries ${K.usd(tus.low)}. No other Arizona area gained as much at the top of its range.` },
    { q: 'Which Arizona cities use the standard per diem?', a: `Every place outside Maricopa, Pima, Coconino, Yavapai and Navajo counties, since those five hold all the Arizona areas in FY2027. Yuma County, for example, has no line and pays ${K.usd(std.lodging)} of lodging and ${K.usd(std.mie)} of M&IE. Inside Navajo County the Kayenta rate of ${K.usd(kay.high)} applies to the whole county.` },
  ],
  related: ['per-diem-rates', 'home', 'state:california', 'state:nevada', 'state:new-mexico', 'road-trip-cost-calculator'],
});
