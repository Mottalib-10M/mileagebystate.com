import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import { destIndex, T } from '../../lib/data';
import PLACES from '../../data/places.json';

const sum = K.stateSummary('iowa');
const ref = K.stateRef('iowa');
const area = (name: string) => K.nsas('IA').find((n) => n.name === name)!;
const dm = area('Des Moines'), dal = area('Dallas');
const dalRow = T.dest[destIndex('IA', 'Dallas')].fy['2027'];
const std26 = K.std(2026);
const gapNow = dm.high - sum.std.lodging, gapThen = dm.prev!.high - std26.lodging;
const placeRows = (PLACES as { rows: Array<[string, string, string, number, number, number]> }).rows.filter((r) => r[1] === 'IA');
const stdRows = placeRows.filter((r) => r[3] === -1 && !sum.list.some((n) => n.counties.includes(r[2].replace(' County', '')))).slice(0, 6);
const stdCities = stdRows.slice(0, 4).map((r) => r[0]);
const dallasTown = placeRows.find((r) => r[2] === 'Dallas County' && r[3] >= 0)?.[0] ?? 'Waukee';
const ex = K.trip({ destIndex: destIndex('IA', 'Des Moines'), depart: '2027-03-08', ret: '2027-03-11' });
const exStd = K.trip({ destIndex: -1, depart: '2027-03-08', ret: '2027-03-11' });
const gas = K.gas('iowa');

export default defineState({
  slug: 'iowa',
  dest: 'Des Moines',
  title: 'Per Diem Rates Iowa 2026-27: Des Moines and Dallas County',
  description: `Iowa per diem rates for 2026-27: Polk County pays ${K.usd(dm.high)} a night, Dallas County ${K.usd(dal.high)}, both with ${K.usd(dm.mie)} M&IE; every other county gets the standard ${K.usd(sum.std.lodging)} plus ${K.usd(sum.std.mie)}.`,
  intro: `Iowa has only ${sum.count} GSA areas in FY2027, Polk and Dallas counties, and neither one changes price during the year.`,
  resume: `Iowa per diem in FY2027 is ${K.usd(dm.high)} of lodging and ${K.usd(dm.mie)} of M&IE in Polk County (Des Moines), ${K.usd(dal.high)} and ${K.usd(dal.mie)} in Dallas County, and the standard ${K.usd(sum.std.lodging)} plus ${K.usd(sum.std.mie)} in every other county. Those rates hold from October 1, 2026 to September 30, 2027, with the same maximum in every month: GSA gives Iowa no seasonal area at all. A three-night stay in Des Moines from March 8 to 11, 2027 is worth ${K.usd(ex.total, 2)} at the federal maximum, against ${K.usd(exStd.total, 2)} for the same dates in a standard-rate city such as ${stdCities[0]}. The difference comes from the room and from the meal tier, since Polk County sits one notch above the base M&IE. Lodging taxes are claimed apart from the cap. The calculator above opens on Des Moines; type an Iowa city or ZIP code to change it.`,
  body: (h) => `
<h2>A Dallas that is not in Texas</h2>
<p>The second Iowa line in the GSA file is simply called "Dallas", and it means Dallas County, Iowa. Travel software that matches on the city name alone can return the Texas rate instead, so check the state code before you file. ${dallasTown} is the largest Census place in the county; a trip there is paid ${K.usd(dal.high)} a night in FY2027, ${K.usd(dm.high - dal.high)} less than across the line in Polk County, with the same ${K.usd(dal.mie)} meal allowance. The ZIP search of the calculator above settles the question by address, which is the safest route for any suburb that sits near a county boundary.</p>
${h.mini('areaTrip', { area: 'Dallas, IA', lodging: dalRow.lodging, mie: dalRow.mie })}
<h2>Why the Des Moines premium shrank this year</h2>
<p>Polk County moved from ${K.usd(dm.prev!.high)} in FY2026 to ${K.usd(dm.high)} in FY2027, a rise of ${K.usd(dm.high - dm.prev!.high)}. Dallas County gained ${K.usd(dal.high - dal.prev!.high)}. Over the same change of fiscal year the national standard lodging rate went from ${K.usd(std26.lodging)} to ${K.usd(sum.std.lodging)}. The result is a thinner margin for Polk County: ${K.usd(gapThen)} above the standard last year, ${K.usd(gapNow)} now. For an employee who spends a week a month in Des Moines, that is a small number per night but a visible one over a year of expense reports, and it is a reason not to reuse last year's spreadsheet.</p>
<h3>${K.listOf(stdCities.slice(0, 3))} on the national rate</h3>
<p>Every Census place of 15,000 people or more outside Polk and Dallas counties takes the standard rate in Iowa, ${K.listOf(stdCities)} among them. A night there is reimbursed at ${K.usd(sum.std.lodging)} and a full day of meals at ${K.usd(sum.std.mie)}, ${K.usd(sum.std.mie * K.P.mie.partialDayShare, 2)} on the day you leave home and the day you return. If a hotel near a plant or a campus costs more than that, the excess is the traveler's unless the employer approves actual expenses, a rule set by the ${h.src('ftr_301_11', 'Federal Travel Regulation')} for federal staff; private employers write their own.</p>
<p>For drivers, Iowa has no EIA series of its own; the ${ref.gasArea} average for regular gasoline was ${K.usd(gas, 3)} a gallon in the week of ${K.day(K.ENERGY_META.gasWeek)}, below the national ${K.usd(K.ENERGY_META.usGas, 3)}. The ${h.a('mileage-reimbursement-calculator', 'mileage reimbursement calculator')} turns your miles into dollars at ${K.centsWord(K.irs('2026-10-01'))} a mile.</p>
`,
  faqs: [
    { q: 'Is the Dallas per diem in Iowa the same as Dallas, Texas?', a: `No. The Iowa area named Dallas is Dallas County, Iowa, at ${K.usd(dal.high)} of lodging and ${K.usd(dal.mie)} of M&IE for FY2027. Dallas, Texas is a separate GSA area with its own rate. Search by ZIP code or check that the state code reads IA before you claim, because a lookup by city name can mix the two.` },
    { q: 'What is the Des Moines, Iowa per diem for a full travel day in FY2027?', a: `A full day in Polk County is ${K.usd(dm.high + dm.mie)}: ${K.usd(dm.high)} for the room and ${K.usd(dm.mie)} for meals and incidentals. The rate is the same in all twelve months from October 2026 to September 2027. On the first and last day of the trip the M&IE drops to ${K.usd(dm.mie * K.P.mie.partialDayShare, 2)}, three quarters of the daily amount.` },
    { q: `Does ${stdRows[0][0]} or ${stdRows[1][0]} have its own per diem in Iowa?`, a: `No. Neither ${stdRows[0][2]} nor ${stdRows[1][2]} appears in the GSA file, so both cities take the standard CONUS rate: ${K.usd(sum.std.lodging)} of lodging and ${K.usd(sum.std.mie)} of M&IE a day in FY2027. Only Polk and Dallas counties have a higher rate in Iowa. The same applies to ${K.listOf(stdRows.slice(2).map((r) => r[0]))}.` },
  ],
  related: ['per-diem-rates', 'home', 'mileage-reimbursement-calculator', 'state:nebraska', 'state:minnesota', 'state:missouri'],
});
