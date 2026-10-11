import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import { T } from '../../lib/data';

const sum = K.stateSummary('texas');
const std = sum.std;
const area = (name: string) => K.nsas('TX').find((x) => x.name === name)!;
const tar = area('Arlington / Fort Worth / Grapevine'), aus = area('Austin'), dal = area('Dallas'), sa = area('San Antonio');
const hou = area('Houston'), big = area('Big Spring'), mid = area('Midland / Odessa'), pec = area('Pecos');
const spi = area('South Padre Island'), gal = area('Galveston');
const L = (n: { i: number }, fy = '2027') => T.dest[n.i].fy[fy].lodging;
const winter26 = (n: { i: number; prev?: { high: number } }) => K.MONTHS_FY.filter((_, m) => L(n, '2026')[m] === n.prev!.high);
const sameAsHou = sum.list.filter((x) => x.high === hou.high && !x.seasonal).map((x) => x.name);
const feb27 = K.trip({ destIndex: dal.i, depart: '2027-02-08', ret: '2027-02-11' });
const feb26 = K.trip({ destIndex: dal.i, depart: '2026-02-09', ret: '2026-02-12' });
const gas = K.gas('texas');
const ref = K.stateRef('texas');
const share = K.P.mie.partialDayShare;
const m2 = (x: number) => K.usd(x, x % 1 ? 2 : 0);

export default defineState({
  slug: 'texas',
  dest: 'Arlington / Fort Worth / Grapevine',
  title: 'Per Diem Rates Texas 2026-27: Fort Worth, Dallas, Houston',
  description: `Texas per diem 2026-27: ${sum.count} GSA areas, Fort Worth and Grapevine top at ${K.usd(tar.high)}, Dallas and Austin ${K.usd(dal.high)} all year, Houston ${K.usd(hou.high)}, Big Spring up ${K.usd(big.high - big.prev!.high)} from FY2026.`,
  intro: `Texas has ${sum.count} GSA areas in FY2027, and the dearest one is Tarrant County, not Dallas, Austin or Houston.`,
  resume: `Tarrant County and the city of Grapevine carry the top Texas per diem for FY2027, ${K.usd(tar.high)} a night all year with ${K.usd(tar.mie)} of M&IE, ahead of Dallas and Austin at ${K.usd(dal.high)} and well ahead of Houston at ${K.usd(hou.high)}. Dallas, Austin and San Antonio all dropped the winter peak they had in FY2026 and now hold one figure for twelve months. Out in Howard County, Big Spring rose ${K.usd(big.high - big.prev!.high)} to ${K.usd(big.high)}, the same cap as Houston, and Midland and Odessa reached ${K.usd(mid.high)}. El Paso, Lubbock, Corpus Christi and Laredo are not listed and take the standard ${K.usd(std.lodging)} and ${K.usd(std.mie)}. Run through the FY2027 table, three nights in Dallas from February 8 to February 11, 2027 cost ${m2(feb27.total)} at the federal maximum; the same February trip in 2026, under FY2026 rates, came to ${m2(feb26.total)}. Two travel days at ${K.pct(share)} of M&IE are included in both totals.`,
  body: (h) => `
<h2>Houston, Plano and Big Spring share one cap</h2>
<p>Here is the oddity of the Texas table: ${K.listOf(sameAsHou)} all print ${K.usd(hou.high)} for lodging in FY2027. Harris, Fort Bend and Montgomery counties, Collin County and Howard County end up with the same nightly ceiling, and Pecos (${pec.counties} County) is only ${K.usd(hou.high - pec.high)} below them. The meals rate is what separates them: ${K.usd(hou.mie)} in Houston and Plano, ${K.usd(big.mie)} in Big Spring, which is the standard M&IE and the lowest of the ${sum.mieTiers.length} Texas tiers. Big Spring is also the area that climbed most, from ${K.usd(big.prev!.high)} to ${K.usd(big.high)}, while Midland and Odessa went from a range of ${K.usd(mid.prev!.low)} to ${K.usd(mid.prev!.high)} to a flat ${K.usd(mid.high)}.</p>
<h3>Grapevine counts by city limits</h3>
<p>GSA defines the top area as "${tar.counties}". The city is listed next to the county, so for a Grapevine hotel the city limits matter as much as the county line, and both lead to ${K.usd(tar.high)}. Next door, the Dallas area is Dallas County alone at ${K.usd(dal.high)}, Plano in Collin County is ${K.usd(hou.high)}, and Denton, in Denton County, has no listing: ${K.usd(std.lodging)}. A ZIP code search in the calculator settles a hotel near any of these lines.</p>
${h.mini('areaTrip', { area: 'Fort Worth, TX', lodging: L(tar), mie: tar.mie })}
<h2>Winter peaks gone in Dallas, Austin and San Antonio</h2>
<p>In FY2026 Dallas paid ${K.usd(dal.prev!.high)} in ${K.listOf(winter26(dal))}, Austin ${K.usd(aus.prev!.high)} in ${K.listOf(winter26(aus))}, and San Antonio ${K.usd(sa.prev!.high)} in ${K.listOf(winter26(sa))}. FY2027 replaces each with one figure: ${K.usd(dal.high)}, ${K.usd(aus.high)} and ${K.usd(sa.high)}. The off-season months gained ${K.usd(dal.high - dal.prev!.low)} in Dallas and ${K.usd(aus.high - aus.prev!.low)} in Austin. Only the Gulf beaches keep a season: South Padre Island (${spi.counties} County) peaks at ${K.usd(spi.high)} in ${K.listOf(spi.highMonths)}, Galveston at ${K.usd(gal.high)} in ${K.listOf(gal.highMonths)}.</p>
<h2>Texas has its own EIA gasoline price</h2>
<p>EIA publishes a weekly series for Texas alone rather than folding it into a region. Regular gasoline averaged ${K.usd(gas, 3)} a gallon there in the week of ${K.day(K.ENERGY_META.gasWeek)}, ${K.usd(K.ENERGY_META.usGas - gas, 3)} under the national ${K.usd(K.ENERGY_META.usGas, 3)}. Diesel is priced in the ${ref.dieselArea} series at ${K.usd(ref.diesel, 3)}, which matters for the ${h.a('per-diem-for-truck-drivers', 'truck driver per diem')} and fuel budgets. A 500-mile Texas drive at 25 miles per gallon burns ${K.usd((500 / 25) * gas, 2)} of gasoline at that price, while the IRS rate of ${K.centsWord(K.irs('2026-07-01'))} pays ${K.usd(500 * K.irs('2026-07-01'), 2)}.</p>
${h.mini('fuelLeg', { label: 'Texas', price: gas })}
`,
  faqs: [
    { q: 'What is the per diem for Fort Worth and Grapevine, Texas in FY2027?', a: `${K.usd(tar.high)} of lodging per night in every month and ${K.usd(tar.mie)} of M&IE per day, under GSA's FY2027 rates for Tarrant County and the City of Grapevine. That is the highest lodging cap in Texas, ${K.usd(tar.high - dal.high)} above Dallas. Arrival and departure days pay ${K.usd(tar.mie * share, 2)} of M&IE, before any provided meals are deducted.` },
    { q: 'Does Dallas, Texas still have a higher per diem in winter?', a: `Not in FY2027. Dallas County pays ${K.usd(dal.high)} a night in every month from October 2026 to September 2027, after a FY2026 schedule with ${K.usd(dal.prev!.high)} in ${K.listOf(winter26(dal))} and ${K.usd(dal.prev!.low)} the rest of the year. M&IE is ${K.usd(dal.mie)}. Austin and San Antonio were flattened the same way.` },
    { q: 'Which Texas cities use the standard per diem rate?', a: `Every city outside the ${sum.count} listed areas, including El Paso, Corpus Christi, Lubbock, Laredo, Amarillo, Killeen, McAllen and Denton. In FY2027 they take ${K.usd(std.lodging)} for lodging and ${K.usd(std.mie)} for M&IE. These cities sit in counties that GSA does not name, according to the Census city file used by this site's search.` },
    { q: 'Why is the Big Spring, Texas per diem as high as Houston?', a: `Because GSA raised Howard County from ${K.usd(big.prev!.high)} in FY2026 to ${K.usd(big.high)} in FY2027, the same cap as Harris, Fort Bend and Montgomery counties. The meals rate stays lower: ${K.usd(big.mie)} in Big Spring against ${K.usd(hou.mie)} in Houston, so a three-night stay in Big Spring pays ${K.usd((hou.mie - big.mie) * (2 + 2 * share), 2)} less M&IE than one in Houston.` },
  ],
  related: ['per-diem-rates', 'home', 'state:oklahoma', 'state:new-mexico', 'state:louisiana', 'per-diem-for-truck-drivers'],
});
