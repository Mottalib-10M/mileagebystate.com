import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import { T } from '../../lib/data';

const sum = K.stateSummary('georgia');
const list = K.nsas('GA');
const area = (name: string) => list.find((n) => n.name === name)!;
const jek = area('Jekyll Island / Brunswick'), atl = area('Atlanta'), sav = area('Savannah'), ath = area('Athens'), aug = area('Augusta'), mar = area('Marietta');
const L = (n: { i: number }) => T.dest[n.i].fy['2027'].lodging;
const std = sum.std;
const m = (x: number) => K.usd(x, x % 1 ? 2 : 0);
const share = K.P.mie.partialDayShare;
const gas = K.gas('georgia');
const atlFeb = K.trip({ destIndex: atl.i, depart: '2027-02-15', ret: '2027-02-18' });
const marFeb = K.trip({ destIndex: mar.i, depart: '2027-02-15', ret: '2027-02-18' });
const gwFeb = K.trip({ destIndex: -1, depart: '2027-02-15', ret: '2027-02-18' });
const jekMay = K.trip({ destIndex: jek.i, depart: '2027-05-10', ret: '2027-05-13' });

export default defineState({
  slug: 'georgia',
  dest: 'Atlanta',
  title: 'Per Diem Rates Georgia 2026-27: Atlanta, Jekyll, Savannah',
  description: `Georgia per diem 2026-27 (FY2027): Atlanta ${K.usd(atl.low)} to ${K.usd(atl.high)} a night, Jekyll Island up to ${K.usd(jek.high)}, Cobb County ${K.usd(mar.high)}, Gwinnett on the ${K.usd(std.lodging)} standard, M&IE to ${K.usd(atl.mie)}.`,
  intro: `Georgia's highest FY2027 room cap is on the coast at Jekyll Island, not in Atlanta, and metro Atlanta itself is split across three different rates.`,
  resume: `Georgia per diem for FY2027 peaks at ${K.usd(jek.high)} of lodging a night in Glynn County (Jekyll Island / Brunswick) from ${K.listOf(jek.highMonths)}, ${K.usd(jek.high - atl.high)} above Atlanta's best month. Fulton and DeKalb counties, listed as Atlanta, run from ${K.usd(atl.low)} to ${K.usd(atl.high)}, highest in ${K.listOf(atl.highMonths)}, with ${K.usd(atl.mie)} of M&IE. Cobb County (Marietta) is a separate area at ${K.usd(mar.high)} and ${K.usd(mar.mie)}, and Gwinnett County is not listed at all, so it pays the standard ${K.usd(std.lodging)} and ${K.usd(std.mie)}. ${sum.count} areas have their own rate from October 1, 2026 to September 30, 2027. For three nights from February 15, 2027 the federal maximum is ${m(atlFeb.total)} in Atlanta, ${m(marFeb.total)} in Marietta and ${m(gwFeb.total)} in Peachtree Corners. Three nights on Jekyll Island from May 10, 2027 total ${m(jekMay.total)}. The calculator opens on Atlanta; search any Georgia ZIP code to switch.`,
  body: (h) => `
<h2>Metro Atlanta on three different rates</h2>
<p>Where the hotel sits matters more in the Atlanta region than in most of the state. Fulton and DeKalb, including Atlanta, Sandy Springs, Roswell and South Fulton, share ${K.usd(atl.mie)} of M&IE and a cap of ${K.usd(atl.low)} rising to ${K.usd(atl.high)} in ${K.listOf(atl.highMonths)}. Cobb County, listed as Marietta, gets a flat ${K.usd(mar.high)} with ${K.usd(mar.mie)} of M&IE, ${K.usd(atl.mie - mar.mie)} a day less for meals. Gwinnett, Cherokee (Woodstock), Douglas (Douglasville) and Fayette (Peachtree City) counties have no listing, so they fall to ${K.usd(std.lodging)} and ${K.usd(std.mie)}. A sales team visiting clients in all three can owe three different per diems in one week, which is why the ZIP code search is worth the extra second.</p>
${h.mini('areaTrip', { area: 'Atlanta, GA', lodging: L(atl), mie: atl.mie })}
<h2>The Glynn County coast outranks Atlanta</h2>
<p>Jekyll Island / Brunswick holds ${K.usd(jek.low)} from ${K.listOf(jek.lowMonths.slice(0, 1))} through February and again in August and September, then ${K.usd(jek.high)} for ${jek.highMonths.length} straight months, ${K.listOf(jek.highMonths)}, a spring and early summer season rather than a winter one. Savannah (Chatham County) peaks only in ${K.listOf(sav.highMonths)}, at ${K.usd(sav.high)}, and sits at ${K.usd(sav.low)} otherwise, with ${K.usd(sav.mie)} of M&IE.</p>
<h3>Augusta's spring dip to the standard rate</h3>
<p>Richmond County, listed as Augusta, is capped at ${K.usd(aug.high)} for most of the year, but in ${K.listOf(aug.lowMonths)} the figure drops to ${K.usd(aug.low)}${aug.low === std.lodging ? ', identical to the standard CONUS rate' : ''}. Those two months are the only time a listed Georgia area pays no more than an unlisted one. Athens (Clarke County) made the biggest jump of the year, from ${K.usd(ath.prev!.high)} to a flat ${K.usd(ath.high)}.</p>
<h2>Columbus, Macon and Valdosta pay the floor rate</h2>
<p>Several of the larger Georgia cities in the Census file pay the standard rate: Columbus (Muscogee County), Macon-Bibb County, Warner Robins (Houston County), Albany (Dougherty County) and Valdosta (Lowndes County). Gasoline there follows EIA's ${K.stateRef('georgia').gasArea} series, ${K.usd(gas, 3)} a gallon for regular in the week of ${K.day(K.ENERGY_META.gasWeek)}, while the IRS pays ${K.centsWord(K.irs('2026-07-01'))} a mile. The ${h.a('mileage-reimbursement-calculator', 'mileage reimbursement calculator')} prices an Atlanta to Savannah drive, and the ${h.a('first-and-last-day-per-diem', 'first and last day rule')} cuts the Atlanta M&IE to ${K.usd(atl.mie * share, 2)} on travel days.</p>
`,
  faqs: [
    { q: 'What is the Atlanta, Georgia per diem for FY2027?', a: `Fulton and DeKalb counties have ${K.usd(atl.mie)} of M&IE a day and a lodging cap of ${K.usd(atl.low)}, rising to ${K.usd(atl.high)} in ${K.listOf(atl.highMonths)}. These GSA rates apply from October 1, 2026 to September 30, 2027, up from a range of ${K.usd(atl.prev!.low)} to ${K.usd(atl.prev!.high)} in FY2026. Cobb and Gwinnett counties are not part of the Atlanta area.` },
    { q: 'Is Marietta, Georgia on the Atlanta per diem rate?', a: `No. Cobb County is its own GSA area, Marietta, with a flat ${K.usd(mar.high)} of lodging a night and ${K.usd(mar.mie)} of M&IE in FY2027. That is ${K.usd(atl.mie - mar.mie)} a day less for meals than in Fulton or DeKalb, and between ${K.usd(atl.low - mar.high)} and ${K.usd(atl.high - mar.high)} less for the room, depending on the month.` },
    { q: 'When does Jekyll Island, Georgia have its highest per diem?', a: `From ${K.listOf(jek.highMonths)}, when Glynn County lodging is capped at ${K.usd(jek.high)} a night, the highest figure in Georgia for FY2027. The rest of the year the cap is ${K.usd(jek.low)}. M&IE stays at ${K.usd(jek.mie)}, the same tier as Atlanta. Brunswick shares the Jekyll Island rate.` },
    { q: 'What per diem applies in Gwinnett County, Georgia?', a: `The standard CONUS rate: ${K.usd(std.lodging)} of lodging and ${K.usd(std.mie)} of M&IE a day in FY2027, because Gwinnett County has no GSA non-standard area. A three-night February 2027 stay in Peachtree Corners therefore comes to ${m(gwFeb.total)} at the federal maximum, against ${m(atlFeb.total)} for the same nights in Atlanta.` },
  ],
  related: ['per-diem-rates', 'home', 'state:florida', 'state:alabama', 'state:south-carolina', 'mileage-reimbursement-calculator'],
});
