import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import { T } from '../../lib/data';

const sum = K.stateSummary('idaho');
const area = (name: string) => K.nsas('ID').find((n) => n.name === name)!;
const sv = area('Sun Valley / Ketchum'), boi = area('Boise'), cda = area("Coeur d'Alene");
const L = (n: { i: number }) => T.dest[n.i].fy['2027'].lodging;
const svL = L(sv);
const svSummer = svL[8];
const svSummerMonths = K.MONTHS_FY.filter((_, m) => svL[m] === svSummer);
const svFall = svL[0];
const std = sum.std;
const m = (x: number) => K.usd(x, x % 1 ? 2 : 0);
const share = K.P.mie.partialDayShare;
const gas = K.gas('idaho');
const svJan = K.trip({ destIndex: sv.i, depart: '2027-01-25', ret: '2027-01-28' });
const svJul = K.trip({ destIndex: sv.i, depart: '2027-07-19', ret: '2027-07-22' });
const svMay = K.trip({ destIndex: sv.i, depart: '2027-05-03', ret: '2027-05-06' });
const boiJul = K.trip({ destIndex: boi.i, depart: '2027-07-19', ret: '2027-07-22' });
const nampa = K.trip({ destIndex: -1, depart: '2027-07-19', ret: '2027-07-22' });

export default defineState({
  slug: 'idaho',
  dest: 'Sun Valley / Ketchum',
  title: 'Per Diem Rates Idaho 2026-27: Sun Valley and Coeur d\'Alene',
  description: `Idaho per diem 2026-27 (FY2027): Sun Valley / Ketchum ${K.usd(sv.high)} in winter and ${K.usd(svSummer)} in summer, Boise M&IE ${K.usd(boi.mie)}, Coeur d'Alene up to ${K.usd(cda.high)}, ${K.usd(std.lodging)} in other counties.`,
  intro: `Idaho's ${sum.count} GSA areas sit on ${sum.mieTiers.length} different M&IE tiers in FY2027, and Sun Valley has not one high season but two.`,
  resume: `Idaho per diem for FY2027 reaches ${K.usd(sv.high)} of lodging a night in the Sun Valley / Ketchum area (Blaine and Elmore counties) in ${K.listOf(sv.highMonths)}, and a second peak of ${K.usd(svSummer)} from ${svSummerMonths[0]} to ${svSummerMonths[svSummerMonths.length - 1]}; only ${K.listOf(sv.lowMonths)} and the fall months drop near ${K.usd(sv.low)}. Boise (Ada County) has the richest meals allowance in the state, ${K.usd(boi.mie)}, though its room cap tops out at ${K.usd(boi.high)}. Coeur d'Alene (Kootenai County) peaks at ${K.usd(cda.high)} in ${K.listOf(cda.highMonths)}. Nampa, Idaho Falls, Pocatello and Twin Falls take the standard ${K.usd(std.lodging)} and ${K.usd(std.mie)}. The FY2027 rates run from October 1, 2026 to September 30, 2027. In Sun Valley three nights at the federal maximum total ${m(svJan.total)} from January 25, 2027, ${m(svJul.total)} from July 19 and ${m(svMay.total)} from May 3. The calculator opens on Sun Valley.`,
  body: (h) => `
<h2>Blaine County has a winter peak and a summer one</h2>
<p>Sun Valley / Ketchum has two expensive seasons, not one. Its FY2027 calendar reads ${K.usd(svFall)} in October and November, ${K.usd(sv.high)} in ${K.listOf(sv.highMonths)}, ${K.usd(sv.low)} in ${K.listOf(sv.lowMonths)}, then ${K.usd(svSummer)} in ${K.listOf(svSummerMonths)}. The summer step is only ${K.usd(sv.high - svSummer)} under the winter top, so the cheap windows are short: two months in autumn, two in spring. Compared with FY2026 the winter cap went up ${K.usd(sv.high - sv.prev!.high)}. M&IE is ${K.usd(sv.mie)} all year.</p>
${h.mini('areaTrip', { area: 'Sun Valley / Ketchum, ID', lodging: svL, mie: sv.mie })}
<h3>Mountain Home rides on the Sun Valley rate</h3>
<p>GSA draws the area as "${sv.counties}", and Elmore County carries the same caps as Blaine. The Census file places Mountain Home in Elmore County, so lodging there follows the Sun Valley calendar too, up to ${K.usd(sv.high)} in winter, even though the town is listed under neither name. A traveler checking only the city list would assume the standard ${K.usd(std.lodging)}; the ZIP code search gives the right answer.</p>
<h2>Boise: modest rooms, top meal tier</h2>
<p>Ada County, which covers Boise and Meridian, is the only Idaho area on the ${K.usd(boi.mie)} M&IE tier. Its lodging moves from ${K.usd(boi.low)} in ${K.listOf(boi.lowMonths)} to ${K.usd(boi.high)} in ${K.listOf(boi.highMonths)}. Canyon County, home to Nampa and Caldwell, has no listing. Three July 2027 nights cost ${m(boiJul.total)} at the federal maximum in Boise against ${m(nampa.total)} in Nampa, a difference of ${m(boiJul.total - nampa.total)} that is partly meals: ${K.usd(boi.mie - std.mie)} a day more on full days. Coeur d'Alene and Post Falls (Kootenai County) sit on the ${K.usd(cda.mie)} tier with a summer peak of ${K.usd(cda.high)}, up from ${K.usd(cda.prev!.high)}.</p>
<h2>Fuel and power in Idaho</h2>
<p>EIA counts Idaho in its ${K.stateRef('idaho').gasArea} region, where regular gasoline averaged ${K.usd(gas, 3)} a gallon in the week of ${K.day(K.ENERGY_META.gasWeek)}, ${gas > K.ENERGY_META.usGas ? `${K.usd(gas - K.ENERGY_META.usGas, 3)} above` : `${K.usd(K.ENERGY_META.usGas - gas, 3)} below`} the U.S. figure. Electricity is cheap: ${K.num(K.elec('idaho'), 2)} cents per kWh for households over ${K.ENERGY_META.elecPeriod}, against ${K.num(K.ENERGY_META.usElecCents, 2)} cents nationally. On a Boise to Ketchum drive the IRS rate of ${K.centsWord(K.irs('2026-07-01'))} is the same either way; the ${h.a('gas-cost-calculator', 'gas cost calculator')} shows what the fuel takes from it.</p>
${h.mini('fuelLeg', { label: 'Idaho (EIA Rocky Mountain)', price: gas })}
`,
  faqs: [
    { q: 'What is the Sun Valley, Idaho per diem in summer 2027?', a: `From ${svSummerMonths[0]} to ${svSummerMonths[svSummerMonths.length - 1]} 2027 the Sun Valley / Ketchum lodging cap is ${K.usd(svSummer)} a night, with ${K.usd(sv.mie)} of M&IE. That is ${K.usd(sv.high - svSummer)} less than the winter cap of ${K.usd(sv.high)} and well above the ${K.usd(sv.low)} of ${K.listOf(sv.lowMonths)}. Three July nights total ${m(svJul.total)} at the federal maximum.` },
    { q: 'Why does Boise, Idaho get more M&IE than Sun Valley?', a: `In the FY2027 GSA table Ada County is on the ${K.usd(boi.mie)} M&IE tier and Blaine and Elmore counties on the ${K.usd(sv.mie)} tier, while Kootenai is on ${K.usd(cda.mie)}. Lodging and meals are set separately, so a cheaper room cap does not mean a lower meals allowance. On a full day in Boise you receive ${K.usd(boi.mie - sv.mie)} more for meals.` },
    { q: 'Is Mountain Home, Idaho on the standard per diem rate?', a: `No. Mountain Home is in Elmore County, which GSA includes in the Sun Valley / Ketchum area for FY2027. Lodging is capped at ${K.usd(sv.low)} to ${K.usd(sv.high)} depending on the month, with ${K.usd(sv.mie)} of M&IE. The standard ${K.usd(std.lodging)} applies only in Idaho counties outside the three listed areas, such as Canyon or Bonneville.` },
  ],
  related: ['per-diem-rates', 'home', 'state:washington', 'state:montana', 'state:utah', 'gas-cost-calculator'],
});
