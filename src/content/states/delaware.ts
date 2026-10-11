import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import { T } from '../../lib/data';

const sum = K.stateSummary('delaware');
const area = (name: string) => K.nsas('DE').find((n) => n.name === name)!;
const lew = area('Lewes'), wil = area('Wilmington');
const lewL = T.dest[lew.i].fy['2027'].lodging;
const std = sum.std, std26 = K.std(2026);
const m = (x: number) => K.usd(x, x % 1 ? 2 : 0);
const share = K.P.mie.partialDayShare;
const gas = K.gas('delaware');
const july = K.trip({ destIndex: lew.i, depart: '2027-07-12', ret: '2027-07-16' });
const wilT = K.trip({ destIndex: wil.i, depart: '2027-07-12', ret: '2027-07-16' });
const dover = K.trip({ destIndex: -1, depart: '2027-07-12', ret: '2027-07-16' });

export default defineState({
  slug: 'delaware',
  dest: 'Lewes',
  title: 'Per Diem Rates Delaware 2026-27: Lewes Summer, Wilmington',
  description: `Delaware per diem 2026-27 (FY2027): Lewes ${K.usd(lew.high)} a night in ${lew.highMonths[0]} to ${lew.highMonths[lew.highMonths.length - 1]} and ${K.usd(lew.low)} otherwise, Wilmington unchanged at ${K.usd(wil.high)}, Dover on the ${K.usd(std.lodging)} standard rate.`,
  intro: `Delaware's ${sum.count} GSA areas pull in opposite directions for FY2027: Sussex County's summer cap went down, New Castle County's did not move at all.`,
  resume: `Delaware per diem for FY2027 has ${sum.count} listed areas, both on the ${K.usd(lew.mie)} M&IE tier. In Sussex County, listed as Lewes, lodging is capped at ${K.usd(lew.high)} a night in ${K.listOf(lew.highMonths)} and ${K.usd(lew.low)} in every other month. In New Castle County, listed as Wilmington, it is ${K.usd(wil.high)} all year, exactly the FY2026 figure. Kent County, home to Dover, has no listing and pays the standard ${K.usd(std.lodging)} of lodging and ${K.usd(std.mie)} of M&IE. These rates apply from October 1, 2026 to September 30, 2027. For four nights from July 12, 2027 the federal maximum comes to ${m(july.total)} in Lewes, ${m(wilT.total)} in Wilmington and ${m(dover.total)} in Dover. Off season the order flips: Lewes is ${K.usd(wil.high - lew.low)} below Wilmington. Pick any Delaware town in the calculator to compare.`,
  body: (h) => `
<h2>Wilmington's rate stood still</h2>
<p>New Castle County kept ${K.usd(wil.high)} from FY2026 to FY2027. Meanwhile the national standard rate went from ${K.usd(std26.lodging)} to ${K.usd(std.lodging)}, so the edge a Wilmington, Newark or Middletown address has over an unlisted county shrank from ${K.usd(wil.prev!.high - std26.lodging)} to ${K.usd(wil.high - std.lodging)} a night. Over a five-night week that is ${K.usd((wil.high - std.lodging) * 5)} of extra lodging room, not much once hotel taxes are added. The meals figure is ${K.usd(wil.mie)}, ${K.usd(wil.mie - std.mie)} above the standard. Split by meal, the ${K.usd(wil.mie)} tier gives ${K.usd(K.tier(wil.mie).breakfast)} for breakfast, ${K.usd(K.tier(wil.mie).lunch)} for lunch, ${K.usd(K.tier(wil.mie).dinner)} for dinner and ${K.usd(K.tier(wil.mie).incidentals)} of incidentals, which is what gets deducted when a meeting in Wilmington or Lewes provides one of those meals. Both Delaware areas use that same tier, so the meal side of a trip never depends on which of the two counties you sleep in.</p>
<h2>Sussex County: summer down, the rest up</h2>
<p>The Lewes calendar has two steps. From October through May and again in September the cap is ${K.usd(lew.low)}, up ${K.usd(lew.low - lew.prev!.low)} from last year. In ${K.listOf(lew.highMonths)} it is ${K.usd(lew.high)}, ${K.usd(lew.prev!.high - lew.high)} lower than the FY2026 summer figure of ${K.usd(lew.prev!.high)}. A project team spending the last week of May and the first of June in Sussex County sees the cap jump by ${K.usd(lew.high - lew.low)} overnight on June 1, and the per diem calculator prices each night with its own month.</p>
${h.mini('areaTrip', { area: 'Lewes, DE', lodging: lewL, mie: lew.mie })}
<h3>Dover and the rest of Kent County</h3>
<p>Dover is the one Census place of 15,000 people or more in Delaware that falls outside both areas; it is in Kent County. The standard ${K.usd(std.lodging)} lodging cap applies, with ${K.usd(std.mie)} of M&IE, or ${K.usd(std.mie * share, 2)} on a day of departure or return. A trip that starts in Wilmington and continues to Dover is paid at the rate of each night's location, not at the rate of the first stop.</p>
<h2>Gasoline on the Central Atlantic scale</h2>
<p>EIA reports Delaware within its ${K.stateRef('delaware').gasArea} series. Regular averaged ${K.usd(gas, 3)} a gallon in the week of ${K.day(K.ENERGY_META.gasWeek)}, against ${K.usd(K.ENERGY_META.usGas, 3)} for the country. On a round trip between Wilmington and Lewes, the mileage reimbursement at ${K.centsWord(K.irs('2026-07-01'))} a mile is the same whatever the pump price; the ${h.a('mileage-reimbursement-calculator', 'mileage reimbursement calculator')} works it out from the distance.</p>
${h.mini('fuelLeg', { label: 'Delaware (EIA Central Atlantic)', price: gas })}
`,
  faqs: [
    { q: 'What is the per diem in Lewes, Delaware in summer 2027?', a: `In ${K.listOf(lew.highMonths)} 2027 the Sussex County cap is ${K.usd(lew.high)} of lodging a night with ${K.usd(lew.mie)} of M&IE. That is ${K.usd(lew.prev!.high - lew.high)} less than the FY2026 summer figure. From October through May and in September the lodging cap is ${K.usd(lew.low)}. Four July nights total ${m(july.total)} at the federal maximum.` },
    { q: 'Did the Wilmington, Delaware per diem change for FY2027?', a: `No. New Castle County stays at ${K.usd(wil.high)} of lodging a night and ${K.usd(wil.mie)} of M&IE, the same as in FY2026. Because the standard CONUS lodging rate rose to ${K.usd(std.lodging)}, the gap between Wilmington and an unlisted county is now ${K.usd(wil.high - std.lodging)}. Newark and Middletown share the Wilmington rate.` },
    { q: 'What per diem applies in Dover, Delaware?', a: `Dover is in Kent County, which has no GSA non-standard area for FY2027, so the standard rate applies: ${K.usd(std.lodging)} of lodging and ${K.usd(std.mie)} of M&IE a day from October 1, 2026. The first and last day of travel get ${K.usd(std.mie * share, 2)} of M&IE. A four-night stay comes to ${m(dover.total)} at the federal maximum.` },
  ],
  related: ['per-diem-rates', 'home', 'state:maryland', 'state:pennsylvania', 'state:new-jersey', 'mileage-reimbursement-calculator'],
});
