import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import { T } from '../../lib/data';

const sum = K.stateSummary('vermont');
const std = sum.std;
const area = (name: string) => K.nsas('VT').find((x) => x.name === name)!;
const mp = area('Montpelier'), man = area('Manchester'), btv = area('Burlington'), stowe = area('Stowe'), wrj = area('White River Junction');
const L = (n: { i: number }, fy = '2027') => T.dest[n.i].fy[fy].lodging;
const octPeak = sum.list.filter((x) => x.seasonal && x.highMonths.includes('October')).map((x) => x.name);
const stoweDip26 = stowe.prev!.low;
const stoweDipMonths = K.MONTHS_FY.filter((_, m) => L(stowe, '2026')[m] === stoweDip26);
const mpMid = L(mp)[8];
const mpMidMonths = K.MONTHS_FY.filter((_, m) => L(mp)[m] === mpMid);
const mpMid26 = L(mp, '2026')[8];
const btvMid = L(btv)[7];
const btvMidMonths = K.MONTHS_FY.filter((_, m) => L(btv)[m] === btvMid);
const man26High = K.MONTHS_FY.filter((_, m) => L(man, '2026')[m] === man.prev!.high);
const oct = K.trip({ destIndex: btv.i, depart: '2026-10-05', ret: '2026-10-08' });
const feb = K.trip({ destIndex: btv.i, depart: '2027-02-15', ret: '2027-02-18' });
const tMp = K.tier(mp.mie), tBtv = K.tier(btv.mie);
const elec = K.elec('vermont');
const share = K.P.mie.partialDayShare;
const CAL = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const span = (ms: string[]) => { const set = new Set(ms.map((x) => CAL.indexOf(x))); const start = [...set].find((i) => !set.has((i + 11) % 12)); if (start === undefined) return 'all year'; let end = start, n = 1; while (set.has((end + 1) % 12)) { end = (end + 1) % 12; n++; } return n !== set.size ? K.listOf(ms) : n === 1 ? CAL[start] : `${CAL[start]} to ${CAL[end]}`; };
const W = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve'];
const m2 = (x: number) => K.usd(x, x % 1 ? 2 : 0);

export default defineState({
  slug: 'vermont',
  dest: 'Burlington',
  title: 'Per Diem Rates VT 2026-27: Burlington, Stowe, Montpelier',
  description: `Vermont per diem 2026-27: Montpelier up to ${K.usd(mp.high)}, Manchester ${K.usd(man.high)}, Burlington ${K.usd(btv.high)} in peak months, Stowe ${K.usd(stowe.high)} flat; ${sum.count} areas, standard ${K.usd(std.lodging)} lodging elsewhere.`,
  intro: `In FY2027 Stowe gave up its seasonal rate and White River Junction took one on, out of Vermont's ${sum.count} GSA areas.`,
  resume: `Vermont's highest FY2027 lodging cap belongs to the Montpelier area, ${K.usd(mp.high)} a night in ${K.listOf(mp.highMonths)}, yet its meals rate is ${K.usd(mp.mie)}, a tier below the ${K.usd(btv.mie)} paid in Burlington, Stowe, Manchester and White River Junction. ${octPeak.length === sum.seasonalCount ? `All ${sum.seasonalCount} seasonal areas count October among their top months.` : ''} Stowe, in Lamoille County, now has one cap of ${K.usd(stowe.high)} for the whole year, whereas Windsor County moved the other way and now swings between ${K.usd(wrj.low)} and ${K.usd(wrj.high)}. Rutland and every county GSA leaves out take ${K.usd(std.lodging)} and ${K.usd(std.mie)}. Put through the FY2027 table, three nights in Burlington from October 5 to October 8, 2026 total ${m2(oct.total)} at the federal maximum, and the same stay in February 2027 ${m2(feb.total)}. The arrival and departure days are paid at ${K.pct(share)} of M&IE in both.`,
  body: (h) => `
<h2>Stowe flattened, White River Junction split</h2>
<p>Two Vermont areas swapped behaviors between the fiscal years. Lamoille County had ${K.usd(stowe.prev!.high)} most of FY2026 and a dip to ${K.usd(stoweDip26)} in ${K.listOf(stoweDipMonths)}; FY2027 sets ${K.usd(stowe.high)} in all twelve months, so spring trips gain ${K.usd(stowe.high - stoweDip26)} a night. Windsor County did the reverse. It held a flat ${K.usd(wrj.prev!.high)} last year; now it pays ${K.usd(wrj.high)} in ${K.listOf(wrj.highMonths)} and ${K.usd(wrj.low)} in ${K.listOf(wrj.lowMonths)}. A winter visit to White River Junction therefore allows ${K.usd(wrj.prev!.high - wrj.low)} a night less than before, a summer one ${K.usd(wrj.high - wrj.prev!.high)} more.</p>
${h.mini('areaTrip', { area: 'Burlington, VT', lodging: L(btv), mie: btv.mie })}
<h3>The capital area: top room cap, lower meals tier</h3>
<p>Washington County, which GSA labels Montpelier, reaches ${K.usd(mp.high)} in ${K.listOf(mp.highMonths)} and adds a middle level of ${K.usd(mpMid)} for ${K.listOf(mpMidMonths)}, up from ${K.usd(mpMid26)} in FY2026. Its M&IE of ${K.usd(mp.mie)} splits into ${K.usd(tMp.breakfast)}, ${K.usd(tMp.lunch)} and ${K.usd(tMp.dinner)} plus ${K.usd(tMp.incidentals)}; Chittenden County's ${K.usd(btv.mie)} gives ${K.usd(tBtv.breakfast)}, ${K.usd(tBtv.lunch)} and ${K.usd(tBtv.dinner)}. Over a five-day trip the difference is ${K.usd((btv.mie - mp.mie) * (3 + 2 * share), 2)} in Burlington's favor, even though its room cap is lower.</p>
<p>Burlington itself has three levels: ${K.usd(btv.high)} in ${K.listOf(btv.highMonths)}, ${K.usd(btvMid)} in ${K.listOf(btvMidMonths)} and ${K.usd(btv.low)} from ${span(btv.lowMonths)}. Bennington County, the Manchester area, peaks at ${K.usd(man.high)} in ${K.listOf(man.highMonths)}. Its upper band covered only ${K.listOf(man26High)} in FY2026, at ${K.usd(man.prev!.high)}, so July is the month that changed most there: ${K.usd(L(man)[9] - L(man, '2026')[9])} more per night than in July 2026. The winter floor of ${K.usd(man.low)} is the highest off-season figure of any Vermont area, which keeps a January trip to Manchester above a January trip to Burlington by ${K.usd(man.low - btv.low)} a night.</p>
<h2>Rutland, and charging costs</h2>
<p>Rutland is the only Vermont place above 15,000 people in the Census file that lies outside every GSA area, so it is paid at the standard ${K.usd(std.lodging)}. Residential electricity in Vermont averaged ${K.num(elec, 2)} cents per kWh over ${K.ENERGY_META.elecPeriod}, against ${K.num(K.ENERGY_META.usElecCents, 2)} cents nationally, which raises the true cost of an electric car paid at ${K.centsWord(K.irs('2026-07-01'))} a mile; the ${h.a('gas-vs-electric-car-calculator', 'gas vs electric comparison')} uses that state figure.</p>
`,
  faqs: [
    { q: 'What is the Burlington, Vermont per diem in October 2026?', a: `${K.usd(L(btv)[0])} of lodging per night and ${K.usd(btv.mie)} of M&IE per day, under GSA's FY2027 rates for Chittenden County. October is one of the top months with ${K.listOf(btv.highMonths.filter((x) => x !== 'October'))}. From ${span(btv.lowMonths)} the cap is ${K.usd(btv.low)}. The first and last day of travel pay ${K.usd(btv.mie * share, 2)} of M&IE.` },
    { q: 'Does Stowe, Vermont still have a seasonal per diem?', a: `No. In FY2027 Lamoille County pays ${K.usd(stowe.high)} a night in every month, with ${K.usd(stowe.mie)} of M&IE, or ${K.usd(stowe.mie * share, 2)} on travel days. FY2026 had ${K.usd(stowe.prev!.high)} for most months and ${K.usd(stoweDip26)} in ${K.listOf(stoweDipMonths)}. The new single figure applies from October 1, 2026 to September 30, 2027.` },
    { q: 'Why is the Montpelier, Vermont M&IE lower than Burlington?', a: `GSA places Washington County in the ${K.usd(mp.mie)} M&IE tier for FY2027 and Chittenden County in the ${K.usd(btv.mie)} tier. The room cap goes the other way: up to ${K.usd(mp.high)} in Montpelier against ${K.usd(btv.high)} in Burlington. The meals gap is ${K.usd(btv.mie - mp.mie)} per full day, mostly in dinner (${K.usd(tMp.dinner)} against ${K.usd(tBtv.dinner)}).` },
  ],
  related: ['per-diem-rates', 'home', 'state:new-hampshire', 'state:new-york', 'state:massachusetts', 'gas-vs-electric-car-calculator'],
});
