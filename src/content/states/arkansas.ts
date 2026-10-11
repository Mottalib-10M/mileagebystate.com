import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import { T } from '../../lib/data';

const sum = K.stateSummary('arkansas');
const hs = K.nsas('AR').find((n) => n.name === 'Hot Springs')!;
const hsL = T.dest[hs.i].fy['2027'].lodging;
const std = sum.std, std26 = K.std(2026);
const m = (x: number) => K.usd(x, x % 1 ? 2 : 0);
const gap27 = hs.high - std.lodging, gap26 = hs.prev!.high - std26.lodging;
const share = K.P.mie.partialDayShare;
const lr = K.trip({ destIndex: -1, depart: '2026-11-16', ret: '2026-11-19' });
const hot = K.trip({ destIndex: hs.i, depart: '2026-11-16', ret: '2026-11-19' });
const elec = K.elec('arkansas'), usElec = K.ENERGY_META.usElecCents;
const gas = K.gas('arkansas');
const kwh100 = 28;

export default defineState({
  slug: 'arkansas',
  dest: 'Hot Springs',
  title: 'Per Diem Rates Arkansas 2026-27: Standard Rate Statewide',
  description: `Arkansas per diem 2026-27 (FY2027): ${K.usd(std.lodging)} lodging and ${K.usd(std.mie)} M&IE in every county but Garland, where Hot Springs gets ${K.usd(hs.high)}, just ${K.usd(gap27)} above the standard rate.`,
  intro: `Arkansas has a single GSA area in FY2027, Hot Springs, and it sits ${K.usd(gap27)} a night above the rate paid everywhere else in the state.`,
  resume: `Per diem in Arkansas for FY2027 is the standard CONUS rate almost everywhere: ${K.usd(std.lodging)} a night for lodging and ${K.usd(std.mie)} a day for M&IE, from October 1, 2026 to September 30, 2027. The one exception is Garland County, listed by GSA as Hot Springs, with ${K.usd(hs.high)} of lodging in every month and the same ${K.usd(hs.mie)} of M&IE. Little Rock, Fayetteville, Fort Smith, Jonesboro, Bentonville and Conway all take the standard figures. Three nights in Little Rock from November 16, 2026 come to ${m(lr.total)} at the federal maximum; the same stay in Hot Springs comes to ${m(hot.total)}, only ${m(hot.total - lr.total)} more. The premium shrank this year because the national standard went up ${K.usd(std.lodging - std26.lodging)} while Hot Springs moved ${K.usd(hs.high - hs.prev!.high)}. The calculator above opens on Hot Springs; enter any other Arkansas city to see the standard rate applied.`,
  body: (h) => `
<h2>One listed county, ${K.usd(gap27)} of difference</h2>
<p>In FY2026 Garland County paid ${K.usd(hs.prev!.high)} against a standard ${K.usd(std26.lodging)}, a premium of ${K.usd(gap26)} a night. For FY2027 the figures are ${K.usd(hs.high)} and ${K.usd(std.lodging)}, so the premium ${gap27 < gap26 ? 'is now' : 'stands at'} ${K.usd(gap27)}. Meals never differed: Hot Springs is on the lowest M&IE tier, ${K.usd(hs.mie)}, which is the standard amount. On a week-long assignment the whole advantage of the listed county comes to ${K.usd(gap27 * 7)} of lodging, and only if the room actually costs that much.</p>
<p>For a traveler that means the rate question in Arkansas is mostly settled before the trip starts. No month changes the cap, since Hot Springs is flat at ${K.usd(hs.low)} all year, and no Arkansas county sits on a higher meals tier. The only date that changes anything is October 1: a Hot Springs stay from September 29 to October 2, 2026 was paid ${K.usd(hs.prev!.high)} for the September nights and ${K.usd(hs.high)} from October 1, and in Little Rock the step was from ${K.usd(std26.lodging)} to ${K.usd(std.lodging)}.</p>
${h.mini('areaTrip', { area: 'Hot Springs, AR', lodging: hsL, mie: hs.mie })}
<h3>Northwest Arkansas and Little Rock on the standard rate</h3>
<p>Census place counts show the biggest Arkansas cities in Pulaski County (Little Rock, North Little Rock), Washington County (Fayetteville, Springdale), Benton County (Rogers, Bentonville), Sebastian County (Fort Smith), Craighead County (Jonesboro) and Faulkner County (Conway). None of those counties has a line in the FY2027 GSA file. A per diem policy that reimburses actual hotel cost up to the GSA cap therefore pays at most ${K.usd(std.lodging)} in Bentonville or Little Rock, and anything above that stays with the traveler unless the policy says otherwise. The ${h.a('first-and-last-day-per-diem', 'first and last day rule')} trims the M&IE to ${K.usd(std.mie * share, 2)} on the travel days.</p>
<h2>Cheap kilowatt-hours change the driving math</h2>
<p>Arkansas homes paid ${K.num(elec, 2)} cents per kWh on average over ${K.ENERGY_META.elecPeriod}, according to EIA, against ${K.num(usElec, 2)} cents for the United States. An electric car using ${kwh100} kWh per 100 miles therefore spends about ${K.usd((elec * kwh100) / 10000, 3)} a mile charged at home, while the IRS business rate pays ${K.centsWord(K.irs('2026-07-01'))}. Gasoline is not expensive either: EIA puts Arkansas in its ${K.stateRef('arkansas').gasArea} series at ${K.usd(gas, 3)} a gallon in the week of ${K.day(K.ENERGY_META.gasWeek)}. The ${h.a('ev-charging-cost-calculator', 'EV charging cost calculator')} uses the Arkansas electricity price.</p>
${h.mini('evCharge', { label: 'Arkansas', cents: elec, kwh100 })}
`,
  faqs: [
    { q: 'What is the per diem rate in Little Rock, Arkansas for FY2027?', a: `Little Rock is in Pulaski County, which has no GSA non-standard area, so the standard CONUS rate applies: ${K.usd(std.lodging)} of lodging and ${K.usd(std.mie)} of M&IE a day from October 1, 2026. On the day you arrive and the day you leave the M&IE is ${K.usd(std.mie * share, 2)}. In FY2026 the lodging figure was ${K.usd(std26.lodging)}.` },
    { q: 'How much more does Hot Springs, Arkansas pay than the standard per diem?', a: `${K.usd(gap27)} a night of lodging in FY2027: ${K.usd(hs.high)} in Garland County against ${K.usd(std.lodging)} elsewhere. The M&IE is the same ${K.usd(hs.mie)} in both. Last year the difference was ${K.usd(gap26)}, because the standard rate rose faster than the Hot Springs cap. The rate is flat, with no seasonal months.` },
    { q: 'Does Bentonville, Arkansas have a higher per diem rate?', a: `No. Bentonville and Rogers are in Benton County, Fayetteville and Springdale in Washington County, and neither county is listed in the FY2027 GSA table. Travelers there are reimbursed at the standard ${K.usd(std.lodging)} of lodging and ${K.usd(std.mie)} of M&IE, so a three-night stay comes to ${m(lr.total)} at the federal maximum.` },
  ],
  related: ['per-diem-rates', 'home', 'state:missouri', 'state:tennessee', 'state:louisiana', 'ev-charging-cost-calculator'],
});
