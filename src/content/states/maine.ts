import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import { destIndex, T } from '../../lib/data';
import PLACES from '../../data/places.json';

const sum = K.stateSummary('maine');
const ref = K.stateRef('maine');
const area = (name: string) => K.nsas('ME').find((n) => n.name === name)!;
const prev = (name: string) => K.nsas('ME', 2026).find((n) => n.name === name)!;
const bar = area('Bar Harbor / Rockport'), york = area('Kennebunk / Kittery / Sanford'), pwm = area('Portland');
const row = (name: string) => T.dest[destIndex('ME', name)].fy['2027'];
const row26 = (name: string) => T.dest[destIndex('ME', name)].fy['2026'];
const barRow = row(bar.name), yorkRow = row(york.name), yorkRow26 = row26(york.name);
const pwmPrev = prev('Portland');
const newPeak = pwm.highMonths.filter((m) => !pwmPrev.highMonths.includes(m));
type Place = [string, string, string, number, number, number];
const rows = (PLACES as { rows: Place[] }).rows.filter((r) => r[1] === 'ME');
const stdRows = rows.filter((r) => r[3] === -1);
const share = K.P.mie.partialDayShare;
const cty = sum.list.flatMap((n) => n.counties.split(' / '));
const aug = K.trip({ destIndex: destIndex('ME', bar.name), depart: '2027-08-02', ret: '2027-08-05' });
const feb = K.trip({ destIndex: destIndex('ME', bar.name), depart: '2027-02-01', ret: '2027-02-04' });
const elec = K.elec('maine');

export default defineState({
  slug: 'maine',
  dest: 'Bar Harbor / Rockport',
  title: 'Per Diem Rates Maine 2026-27: Bar Harbor, York and Portland',
  description: `Maine per diem for 2026-27: all ${sum.count} GSA areas are seasonal, from ${K.usd(bar.low)} to ${K.usd(bar.high)} a night in Bar Harbor; meals run ${K.usd(sum.mieTiers[0])} to ${K.usd(sum.mieTiers[sum.mieTiers.length - 1])}, standard ${K.usd(sum.std.lodging)} in other counties.`,
  intro: `Every one of Maine's ${sum.count} GSA areas changes its lodging rate with the calendar, which no flat per diem table can show.`,
  resume: `Maine per diem in FY2027 depends on the month as much as on the place. Bar Harbor and Rockport (Hancock and Knox counties) pay ${K.usd(bar.high)} a night in ${K.listOf(bar.highMonths)} and ${K.usd(bar.low)} from ${bar.lowMonths[0]} to ${bar.lowMonths[bar.lowMonths.length - 1]}, with ${K.usd(bar.mie)} of M&IE. York County peaks at ${K.usd(york.high)}, the Portland area (Cumberland and Sagadahoc) at ${K.usd(pwm.high)}. All other counties take the standard ${K.usd(sum.std.lodging)} and ${K.usd(sum.std.mie)} for the whole fiscal year, October 1, 2026 to September 30, 2027. The swing is wide enough to change a budget: three nights in Bar Harbor from August 2 to 5, 2027 reach ${K.usd(aug.total, 2)} at the federal maximum, while the same three nights from February 1 to 4 are capped at ${K.usd(feb.total, 2)}. The calculator above starts on Bar Harbor / Rockport; type a Maine town or ZIP code to move it.`,
  body: (h) => `
<h2>Every Maine area runs on a calendar</h2>
<p>${sum.seasonalCount === sum.count ? `All ${sum.count} Maine areas are seasonal` : `${sum.seasonalCount} of the ${sum.count} Maine areas are seasonal`}, and no two use the same steps. Bar Harbor / Rockport has four price levels: ${K.usd(barRow.lodging[0])} in October and September, ${K.usd(bar.low)} through the winter, ${K.usd(barRow.lodging[7])} in May and June, ${K.usd(bar.high)} in ${K.listOf(bar.highMonths)}. Its M&IE is ${K.usd(bar.mie)}, the top federal tier. Portland pays ${K.usd(pwm.high)} in ${K.listOf(pwm.highMonths)} and ${K.usd(pwm.low)} otherwise, on the ${K.usd(pwm.mie)} tier.${newPeak.length ? ` In FY2026 its peak covered only ${K.listOf(pwmPrev.highMonths)}; ${K.listOf(newPeak)} joined it this year, so a fall conference in Portland now carries the summer figure.` : ''}</p>
${h.mini('areaTrip', { area: 'Bar Harbor / Rockport, ME', lodging: barRow.lodging, mie: barRow.mie })}
<h2>York County's late-summer jump</h2>
<p>Kennebunk, Kittery and Sanford form the York County area. Its winter and spring rate barely moved, ${K.usd(Math.min(...yorkRow26.lodging))} to ${K.usd(york.low)}, but the peak rose from ${K.usd(york.prev!.high)} to ${K.usd(york.high)}, and the October and September shoulder from ${K.usd(yorkRow26.lodging[0])} to ${K.usd(yorkRow.lodging[0])}. That is the biggest move of any Maine line this year. York's low season is long, ${K.listOf(york.lowMonths.slice(0, 1))} through ${york.lowMonths[york.lowMonths.length - 1]}, so a project that can slide by a few weeks out of ${K.listOf(york.highMonths)} saves ${K.usd(york.high - york.low)} a night on the cap. Census places such as ${K.listOf(rows.filter((r) => r[2] === 'York County').slice(0, 3).map((r) => r[0]))} all fall in this county.</p>
<h3>${K.listOf(stdRows.slice(0, 3).map((r) => r[0]))}: one rate all year</h3>
<p>Away from these ${cty.length} counties the Maine per diem is flat: ${K.usd(sum.std.lodging)} a night and ${K.usd(sum.std.mie)} of M&IE in ${K.listOf(stdRows.slice(0, 4).map((r) => `${r[0]} (${r[2]})`))} and every other town GSA does not list, ${K.usd(sum.std.mie * share, 2)} on travel days. Electricity is the cost that stands out for an electric car: Maine homes paid ${K.cents(elec)} per kWh over ${K.ENERGY_META.elecPeriod}, according to the ${h.src('eia_epm', 'EIA')}, against ${K.cents(K.ENERGY_META.usElecCents)} nationally. Even at that price, home charging covers a mile for a small slice of the ${K.centsWord(K.irs('2026-10-01'))} IRS rate, as the mini calculator below shows.</p>
${h.mini('evCharge', { label: 'Maine', cents: elec })}
<p>The ${h.a('ev-charging-cost-calculator', 'EV charging cost calculator')} lets you set your own model and price.</p>
`,
  faqs: [
    { q: 'When is the Bar Harbor, Maine per diem at its highest?', a: `In ${K.listOf(bar.highMonths)} 2027, at ${K.usd(bar.high)} a night for Hancock and Knox counties. October and September pay ${K.usd(barRow.lodging[0])}, May and June ${K.usd(barRow.lodging[7])}, and the winter months ${K.usd(bar.low)}. The ${K.usd(bar.mie)} M&IE stays the same all year, ${K.usd(bar.mie * share, 2)} on the first and last day. Book with the month of each night in mind, not the arrival date alone.` },
    { q: 'Does Portland, Maine have a seasonal per diem in FY2027?', a: `Yes. Cumberland and Sagadahoc counties pay ${K.usd(pwm.high)} a night in ${K.listOf(pwm.highMonths)} and ${K.usd(pwm.low)} from ${pwm.lowMonths[0]} to ${pwm.lowMonths[pwm.lowMonths.length - 1]}, with ${K.usd(pwm.mie)} of M&IE a day. Each night of a stay is paid at the maximum of its own month, so a trip at the turn of a season mixes the two.` },
    { q: 'Which Maine cities use the standard per diem rate?', a: `Any town outside ${K.listOf(cty)} counties, including ${K.listOf(stdRows.slice(0, 4).map((r) => r[0]))}. In FY2027 they get ${K.usd(sum.std.lodging)} of lodging and ${K.usd(sum.std.mie)} of M&IE every day of the year, with no seasonal change. The standard lodging figure was ${K.usd(K.std(2026).lodging)} in FY2026, so these towns gained ${K.usd(sum.std.lodging - K.std(2026).lodging)} a night on October 1, 2026.` },
  ],
  related: ['per-diem-rates', 'home', 'ev-charging-cost-calculator', 'state:new-hampshire', 'state:massachusetts', 'state:vermont'],
});
