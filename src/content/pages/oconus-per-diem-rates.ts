import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const share = K.P.mie.partialDayShare;
const above = K.P.mie.oconusSplitAbove;
const first = K.usd(Math.min(...Object.keys(K.OCONUS_TABLE).map(Number)));
const sp = K.P.mie.oconusSplit;
const ex1 = 140, ex2 = 300;
const o1 = K.oconus(ex1), o2 = K.oconus(ex2);
const tr = K.P.transportation;
const tiers = K.P.mie.tiers;
// Four nights at a hand-entered rate, for the worked example.
const lod = 250, nights = 4;
const exMie = ex1 * share * 2 + ex1 * (nights - 1);

export default definePage({
  id: 'oconus-per-diem-rates',
  group: 'perdiem',
  order: 50,
  slug: 'oconus-per-diem-rates',
  nav: 'OCONUS per diem rates',
  card: 'Where Alaska, Hawaii, territory and foreign rates are published, how their M&IE splits into meals, and a trip total.',
  title: 'OCONUS Per Diem Rates 2026-27: Alaska, Hawaii and Abroad',
  description: `OCONUS per diem rates 2026-27: DoD sets Alaska, Hawaii and territories, State sets foreign posts; M&IE split by the GSA table up to ${K.usd(above)}, then ${K.pct(sp.breakfast)}/${K.pct(sp.lunch)}/${K.pct(sp.dinner)}.`,
  h1: 'OCONUS per diem rates: where to find them and how to use them',
  intro: 'Type the lodging and M&IE rates you found on the DoD or State Department lookup: the tool totals the trip and splits the M&IE into meals.',
  resume: `OCONUS per diem rates, for travel outside the 48 contiguous states and the District of Columbia, are not in the GSA table. The Department of Defense, through its Defense Travel Management Office, sets the rates for Alaska, Hawaii, Puerto Rico, Guam, the U.S. Virgin Islands and the other territories and possessions, which the regulation calls non-foreign areas; the Department of State sets the rate for every foreign location. Both are used the same way as CONUS rates: a lodging ceiling per night, an M&IE amount per day, ${K.pct(share)} of it on the first and last day. What differs is the meal split and the hotel tax. GSA's OCONUS breakdown table covers M&IE rates from ${first} to ${K.usd(above)}; above that, breakfast takes ${K.pct(sp.breakfast)}, lunch ${K.pct(sp.lunch)}, dinner ${K.pct(sp.dinner)} and incidentals the rest. Foreign rates already include lodging taxes, while in Alaska, Hawaii and the territories the tax is claimed on top.`,
  tool: 'oconus',
  body: (h) => `
<h2>Two publishers, two lookups</h2>
<p>${h.src('dtmo_oconus', 'The DTMO per diem lookup')} is the place for Alaska, Hawaii, Puerto Rico, American Samoa, Guam, Midway, the Northern Mariana Islands, the U.S. Virgin Islands, Wake Island and the other non-foreign areas outside the continental United States. ${h.src('state_foreign', 'The State Department table')} covers foreign countries, city by city. Appendix A to part 301-11 of the Federal Travel Regulation points to both, and IRS ${h.src('irs_pub_463', 'Publication 463')} sends taxpayers to the same two addresses for the standard meal allowance outside CONUS.</p>
<p>This page does not copy either table: they are long and revised on their own schedules. The calculator above takes the two figures you read there, lodging and M&IE, and does the rest. It applies one lodging figure to every night, so when the published rate changes partway through your stay, price each block of nights on its own and add them. Note the date of the rate you used, since the table in force on the night of the stay is the one that counts, not the one online when you file.</p>
${h.mini('pdOconusTrip')}
<h2>Hotel tax: in the rate abroad, on top in U.S. areas</h2>
<p>The split follows ${h.src('ftr_301_11', '41 CFR 301-11.16')}. For CONUS and non-foreign OCONUS locations, lodging taxes are reimbursed as a miscellaneous expense, limited to the taxes on the reimbursable part of the room. For foreign areas, a separate claim for lodging tax is not allowed, because State Department rates were built with the tax left in. A week in Honolulu and a week in Tokyo look alike on the voucher until this line: the Hawaii traveler adds the tax, the Tokyo traveler does not.</p>
<h2>Splitting a high M&IE into meals</h2>
<p>OCONUS M&IE rates run far beyond the five CONUS tiers of ${K.usd(tiers[0])} to ${K.usd(tiers[tiers.length - 1])}, so GSA publishes a separate breakdown. For every whole-dollar rate from ${first} to ${K.usd(above)} a table gives the value of each meal; above ${K.usd(above)}, fixed shares apply. These values matter only when a meal is provided and must be deducted.</p>
${h.table(['M&IE rate', 'Breakfast', 'Lunch', 'Dinner', 'Incidentals', 'Method'], [[K.usd(ex1), K.usd(o1.breakfast), K.usd(o1.lunch), K.usd(o1.dinner), K.usd(o1.incidentals), 'GSA table'], [K.usd(ex2), K.usd(o2.breakfast), K.usd(o2.lunch), K.usd(o2.dinner), K.usd(o2.incidentals), `${K.pct(sp.breakfast)} / ${K.pct(sp.lunch)} / ${K.pct(sp.dinner)}, rest incidentals`]], `OCONUS M&IE breakdown, two example rates (${h.src('gsa_mie', 'GSA M&IE breakdowns')})`, ['l', 'r', 'r', 'r', 'r', 'l'])}
<p>Notice how much heavier the incidentals are abroad: ${K.usd(o1.incidentals)} out of ${K.usd(ex1)}, against a flat ${K.usd(K.tier(tiers[0]).incidentals)} at home. A conference that serves dinner on a ${K.usd(ex1)} day removes ${K.usd(o1.dinner)}, not a CONUS figure.</p>
<h2>A worked trip, and the long-flight rest stop</h2>
<p>Four nights at a lodging rate of ${K.usd(lod)} with ${K.usd(ex1)} of M&IE: ${K.usd(lod * nights)} for the rooms, and ${K.usd(exMie, 2)} of M&IE, since the departure and return days pay ${K.usd(ex1 * share, 2)} each. A foreign destination stops there; a non-foreign one adds the lodging tax on the ${K.usd(lod * nights)}.</p>
<p>Long itineraries bring one more rule. When the origin or the destination is outside CONUS and scheduled flight time, stopovers included, exceeds 14 hours in coach or premium economy, the agency may authorize a rest period of up to 24 hours on the way (41 CFR 301-11.12). The per diem for that stop is the rate of the rest stop location, which may be a third lookup.</p>
<h2>The tax rules that change outside CONUS</h2>
<p>The IRS high-low method stops at the border of the 48 states: an employer using it must still pay OCONUS travel by another method, at actual cost or at the federal per diem of the place (${h.src('irs_rp_2019_48', 'Rev. Proc. 2019-48')}, section 5.03). The special transportation industry rate is ${K.usd(tr.oconus)} outside CONUS against ${K.usd(tr.conus)} inside, per ${h.src('irs_notice_2026_60', 'Notice 2026-60')}. The ${h.a('high-low-per-diem-method', 'high-low page')} and the ${h.a('per-diem-for-truck-drivers', 'truck driver page')} give the details.</p>
`,
  faqs: [
    { q: 'Who publishes the per diem rates for Hawaii and Alaska?', a: `The Department of Defense, through the Defense Travel Management Office lookup, not GSA. The same lookup covers Puerto Rico, Guam, the U.S. Virgin Islands, American Samoa, the Northern Mariana Islands, Midway and Wake Island. IRS Publication 463 points taxpayers to it for the standard meal allowance in those places. Foreign city rates come from the State Department.` },
    { q: 'Are lodging taxes paid on top of OCONUS per diem in Puerto Rico or Guam?', a: `Yes. Puerto Rico and Guam are non-foreign areas, and 41 CFR 301-11.16(a) treats lodging taxes there as a miscellaneous expense, reimbursed on top of the per diem but only on the room cost up to the lodging rate. In a foreign country the answer is no: State Department rates already include the tax, so no separate claim is allowed.` },
    { q: `How is an OCONUS M&IE rate above ${K.usd(above)} split into meals?`, a: `By fixed shares from GSA: ${K.pct(sp.breakfast)} breakfast, ${K.pct(sp.lunch)} lunch, ${K.pct(sp.dinner)} dinner and the remainder to incidental expenses. A ${K.usd(ex2)} rate gives ${K.usd(o2.breakfast)}, ${K.usd(o2.lunch)}, ${K.usd(o2.dinner)} and ${K.usd(o2.incidentals)}. For rates of ${first} to ${K.usd(above)}, GSA publishes a dollar-by-dollar table instead, which the calculator on this page applies.` },
    { q: 'Can an employer use the high-low per diem method for trips to Alaska or abroad?', a: `No. Rev. Proc. 2019-48, section 5.03, limits high-low to travel within the continental United States. An employer that uses it for an employee must use it for all of that employee's CONUS trips in the calendar year, and may pay OCONUS trips at actual cost or at the DoD or State Department per diem of the place.` },
    { q: 'Which per diem applies during a rest stop on a long overseas flight?', a: `The rate of the rest stop city. Under 41 CFR 301-11.12, an agency may authorize a rest period of up to 24 hours when the trip starts or ends outside CONUS and scheduled flight time exceeds 14 hours in coach or premium economy. Lodging and M&IE for that stop come from the DoD or State Department rate of the stopover location.` },
  ],
  related: ['per-diem-rates', 'per-diem-calculator', 'meals-and-incidental-expenses', 'high-low-per-diem-method', 'per-diem-for-truck-drivers'],
  sources: ['dtmo_oconus', 'state_foreign', 'gsa_mie', 'ftr_301_11', 'irs_pub_463', 'irs_rp_2019_48'],
});
