import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import { destIndex, T } from '../../lib/data';

const s27 = K.std(2027), s26 = K.std(2026);
const fy = K.fy(2027);
const nyc = T.dest[destIndex('NY', 'New York City')].fy['2027'];
const all27 = T.dest.filter((d) => d.fy['2027']);
const peak = all27.map((d) => ({ d, hi: Math.max(...d.fy['2027'].lodging) })).sort((a, b) => b.hi - a.hi)[0];
const tierCount = (m: number) => new Set(all27.filter((d) => d.fy['2027'].mie === m).map((d) => d.name)).size;
const seasonal = new Set(all27.filter((d) => new Set(d.fy['2027'].lodging).size > 1).map((d) => d.name)).size;
const share = K.P.mie.partialDayShare;

export default definePage({
  id: 'per-diem-rates',
  group: 'perdiem',
  order: 10,
  slug: 'per-diem-rates',
  nav: 'GSA per diem rates lookup',
  card: 'Every city and ZIP code, FY2027 and FY2026, twelve months of lodging and the meal breakdown.',
  title: 'Per Diem Rates 2026-27: GSA FY2027 Lodging and M&IE Lookup',
  description: `Per diem rates for FY2027 (October 2026 to September 2027): $113 lodging and $68 M&IE standard, 295 GSA areas by month, search by city or ZIP, FY2026 too.`,
  h1: 'GSA per diem rates, FY2027 and FY2026',
  intro: 'Type a city, a county, a GSA area or a ZIP code: the twelve monthly lodging maximums, the M&IE rate and the value of each meal appear at once.',
  resume: `From October 1, 2026 to September 30, 2027, the federal per diem in most of the continental United States is ${K.usd(s27.lodging + s27.mie)} a day: ${K.usd(s27.lodging)} for lodging and ${K.usd(s27.mie)} for meals and incidental expenses, up from ${K.usd(s26.lodging)} of lodging in fiscal year 2026. ${fy.nsa} non-standard areas pay more, each with its own lodging maximum for every month and one of five M&IE rates between ${K.usd(K.P.mie.tiers[0])} and ${K.usd(K.P.mie.tiers[K.P.mie.tiers.length - 1])}. New York City tops out at ${K.usd(Math.max(...nyc.lodging))} a night in the fall, and the highest maximum of the year is ${K.usd(peak.hi)} in ${peak.d.name}, ${peak.d.st}. Rates follow counties, not city names, so a town GSA never mentions can still sit in a listed county. The lookup above reads the GSA files of both fiscal years, places cities in their county with Census data, and shows the FY2026 table for a trip that started before October 1, 2026.`,
  tool: 'rates',
  body: (h) => `
<h2>How to read a GSA rate</h2>
<p>A GSA rate has two parts that behave differently. Lodging is a ceiling per night: you are reimbursed what the room cost, up to the maximum of that month, and the taxes on the room come on top. M&IE is a flat daily amount that covers meals and the small tips around them; nobody asks for meal receipts, but the first and last day pay ${K.pct(share)} and a meal paid by someone else is taken off. Add the two parts and you get the "maximum per diem" figure the card shows, which is what a full day costs the government at most.</p>
<p>The fiscal year runs from October to September, so GSA tables are named after the year in which they end. FY2027 is the one in force today. A trip from late September into October uses both tables, which the ${h.a('home', 'trip calculator')} handles night by night.</p>
<h2>Why most of the country pays the standard rate</h2>
<p>GSA gives a county its own rate when hotel prices there run above the standard figure; everywhere else, ${K.usd(s27.lodging)} and ${K.usd(s27.mie)} apply. That is why a large share of counties in the Plains or the South have no line in the table, and why North Dakota has no non-standard area at all. In FY2027, ${K.fy(2027).leftNsa} dropped back to the standard rate.</p>
<p>The five M&IE tiers are uneven in practice: ${tierCount(80)} area names sit at ${K.usd(80)}, ${tierCount(86)} at ${K.usd(86)}, ${tierCount(74)} at ${K.usd(74)}, ${tierCount(92)} at ${K.usd(92)} and only ${tierCount(68)} at the bottom tier among the non-standard areas. ${seasonal} areas change their lodging maximum during the year: beaches peak in summer, ski counties in winter, desert resorts in spring.</p>
${h.mini('areaTrip', { area: `New York City, NY`, lodging: nyc.lodging, mie: nyc.mie })}
<h2>Searching by city, county or ZIP code</h2>
<p>GSA writes its table by key city and county. If you search by a city name, the tool first looks at the GSA area names and county lists, then at ${K.num(K.PLACE_COUNT)} cities of 15,000 people or more placed in their county from Census files. Typing a five-digit ZIP code uses the GSA ZIP files directly, which is the most exact method when a city spreads over two counties. A few areas stop at city limits rather than county lines: Santa Monica inside Los Angeles County, Sedona across two Arizona counties. Their own name finds them.</p>
<h2>FY2027 compared with FY2026</h2>
<p>The headline change is the standard lodging rate, ${K.usd(s26.lodging)} to ${K.usd(s27.lodging)}. The M&IE tiers did not move: GSA last revised them in FY${K.P.mie.tiersRevisedFy} and plans the next review for FY${K.P.mie.tiersNextReviewFy}. Inside the non-standard areas most lodging maximums rose a few dollars, some fell, and the seasons of some resorts shifted by a month. Each ${h.a('state:florida', 'state page')} prints both years side by side so that a traveler with a September voucher and another with an October one can each find their figure.</p>
<h2>Outside the 48 states</h2>
<p>Alaska, Hawaii, Puerto Rico, Guam and the other territories are not in the GSA table: the Department of Defense sets those rates, and the Department of State sets foreign ones. The ${h.a('oconus-per-diem-rates', 'OCONUS page')} explains where to read them and turns them into a trip total with the OCONUS meal breakdown.</p>
`,
  faqs: [
    { q: 'What is the GSA lodging rate for a county that is not listed?', a: `The standard CONUS rate: ${K.usd(s27.lodging)} a night for FY2027 trips (October 1, 2026 to September 30, 2027) and ${K.usd(s27.mie)} of M&IE a day. In FY2026 it was ${K.usd(s26.lodging)} for lodging with the same M&IE. GSA notes that a city missing from the table may still be inside a listed county, so check the county before using the standard figure.` },
    { q: 'Where can I find last year’s per diem rates?', a: `Switch the lookup to FY2026: the table that applied from October 1, 2025 to September 30, 2026 stays available for vouchers of trips taken in that period. Use the date of each night, not the date you file the claim. GSA also keeps older fiscal years in its per diem files, as spreadsheets, for audits and late claims.` },
    { q: 'Why does the lodging rate change from month to month?', a: `Because GSA sets seasonal maximums where hotel prices swing during the year. ${seasonal} FY2027 areas have more than one figure. A summer beach town or a winter ski county can pay twice as much in its peak months. The night you sleep there decides the cap, so a stay across two seasons mixes two rates.` },
    { q: 'Are hotel taxes included in the GSA lodging rate?', a: `No. The maximum covers the room alone. For travel in the 48 states and other U.S. areas, lodging taxes on the reimbursable part of the room are paid on top as a miscellaneous expense (41 CFR 301-11.16). Foreign per diem rates from the State Department are different: they already include taxes, so no separate claim is allowed.` },
    { q: 'How often does GSA publish new per diem rates?', a: `Once a year, for the fiscal year that starts on October 1; GSA says the next year's rates are usually announced in mid-August. The FY2027 ZIP code file is dated September 3, 2026. The IRS publishes its own special per diem notice each year for the high-low method and the transportation industry rate, Notice 2026-60 for FY2027.` },
  ],
  related: ['home', 'meals-and-incidental-expenses', 'first-and-last-day-per-diem', 'state:california', 'oconus-per-diem-rates'],
  sources: ['gsa_rates', 'gsa_files', 'gsa_highlights', 'gsa_mie', 'ftr_301_11'],
});
