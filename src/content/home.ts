/** Home page text. Every figure comes from the kit (h / K): never typed. */
import type { Helpers, FAQ } from '../lib/page-types';
import { KIT as K } from '../lib/kit';
import { destIndex, T } from '../lib/data';

const s27 = K.std(2027), s26 = K.std(2026);
const hl = K.P.highLow['2027'];
const irsH1 = K.irs('2026-06-30'), irsH2 = K.irs('2026-07-01');
const share = K.P.mie.partialDayShare;
const dc = destIndex('DC', 'District of Columbia');
const dcRate = T.dest[dc].fy['2027'];
const ex = K.trip({ destIndex: dc, depart: '2026-11-16', ret: '2026-11-19' });
const exMiles = 240;
const tiers = K.P.mie.tiers;

export const HOME = {
  title: 'Per Diem Calculator 2026-27: GSA Rates and IRS Mileage',
  description: `Per diem calculator for FY2027: GSA lodging by month, M&IE with the 75% travel days, meals provided and IRS mileage at 76 cents since July 2026, on one screen.`,
  h1: 'Per diem and mileage calculator for a whole trip',
  intro: 'Pick a city, county or ZIP code and your dates: lodging night by night, meals and incidentals, provided meals and miles add up on one screen.',
  resume: `A three-night trip to Washington, DC in November 2026 is worth ${K.usd(ex.total, 2)} in federal per diem: ${K.usd(ex.lodging)} of lodging at the FY2027 maximum of ${K.usd(dcRate.lodging[1])} a night, plus ${K.usd(ex.mie, 2)} of meals and incidental expenses, with the departure and return days paid at ${K.pct(share)}. Driving ${exMiles} miles of it in your own car adds ${K.usd(exMiles * irsH2, 2)} at the IRS rate of ${K.centsWord(irsH2)} a mile in force since July 1, 2026. The calculator above does that arithmetic for any city in the 48 contiguous states and the District of Columbia: it reads the GSA table of the fiscal year of each night (FY2026 until September 30, 2026, FY2027 from October 1), the lodging maximum of the month, the M&IE tier of the area and its meal breakdown, then takes off any meal paid by the government or a conference fee without ever dropping a day below the ${K.usd(K.tier(68).incidentals)} of incidentals. This site does better than the first Google result for per diem searches because it computes the full reimbursement of a trip in one screen, where gsa.gov gives a rate per city and leaves the trip, the provided meals and the miles to you.`,
  todayTitle: 'Rates in force on October 11, 2026',
  today: (_h: Helpers) => [
    { label: 'Standard CONUS per diem', figure: `${K.usd(s27.lodging)} + ${K.usd(s27.mie)}`, note: `Lodging + M&IE from October 1, 2026 (was ${K.usd(s26.lodging)} + ${K.usd(s26.mie)})` },
    { label: 'IRS business mileage', figure: K.centsWord(irsH2), note: `A mile, since July 1, 2026 (${K.centsWord(irsH1)} before)` },
    { label: 'M&IE tiers', figure: `${K.usd(tiers[0])} to ${K.usd(tiers[tiers.length - 1])}`, note: `${K.pct(share)} on the first and last day of travel` },
    { label: 'IRS high-low method', figure: `${K.usd(hl.high)} / ${K.usd(hl.low)}`, note: `High-cost and other localities, ${hl.notice}` },
  ],
  timelineTitle: 'What changed for travel expenses in 2025-2026',
  timeline: (h: Helpers) => [
    { date: '2025-12-08', text: `The Federal Travel Regulation part on subsistence was rewritten (FTR Case 2025-05). The 75% rule now sits in ${h.src('ftr_301_11', '41 CFR 301-11.20')} and the deduction of provided meals in § 301-11.21; older guides still cite § 301-11.101.` },
    { date: '2026-01-01', text: `The IRS business rate rose to ${K.centsWord(irsH1)} a mile, medical and military moving fell to ${K.centsWord(K.irs('2026-01-01', 'medical'))}, charity stayed at ${K.centsWord(K.irs('2026-01-01', 'charity'))} (${h.src('irs_notice_2026_10', 'Notice 2026-10')}).` },
    { date: '2026-07-01', text: `Mid-year increase blamed on fuel prices: ${K.centsWord(irsH2)} for business, ${K.centsWord(K.irs('2026-07-01', 'medical'))} for medical and moving (${h.src('irs_ann_2026_11', 'Announcement 2026-11')}). GSA moved its POV rate the same day. A trip in late June and one in early July are paid at different rates.` },
    { date: '2026-10-01', text: `GSA fiscal year 2027 began: standard lodging ${K.usd(s26.lodging)} → ${K.usd(s27.lodging)}, M&IE tiers unchanged, ${K.P.fiscalYears['2027'].nsa} non-standard areas, ${K.P.fiscalYears['2027'].leftNsa} back to the standard rate. The IRS high-low rates became ${K.usd(hl.high)} and ${K.usd(hl.low)} (${h.src('irs_notice_2026_60', hl.notice)}).` },
  ],
  foldTitle: 'How the numbers are put together',
  sections: (h: Helpers) => [
    {
      title: 'Lodging is paid night by night, at the maximum of that month',
      html: `<p>GSA does not publish one hotel figure per city: it publishes twelve, one per month of the federal fiscal year, and seasonal areas swing hard. ${K.listOf(K.nsas('WY').slice(0, 1).map((n) => `${n.name}, Wyoming runs from ${K.usd(n.low)} to ${K.usd(n.high)}`))}, and beach and ski towns do the same in the other direction. The calculator takes each night separately, so a stay from September 29 to October 2 counts two nights at the FY2026 rate and one at FY2027. If the room cost less than the maximum, type the price: you are paid what you spent, never more than the cap. Lodging taxes are not in the maximum and are reimbursed apart, which is why they have their own field.</p><p>The ${h.a('per-diem-rates', 'rate lookup')} shows the twelve months of any area, and each ${h.a('state:california', 'state page')} lists every area of the state with its FY2026 and FY2027 figures side by side.</p>`,
    },
    {
      title: 'Why the date of every day changes the total',
      html: `<p>Two calendars cross in a business trip. The federal fiscal year turns on October 1, and with it the lodging table. The IRS calendar year carried a second break in 2026: on July 1 the business rate went from ${K.centsWord(irsH1)} to ${K.centsWord(irsH2)} a mile. Most calculators keep one rate for the whole trip. Here every day reads its own table, every night its own month, and the mileage line uses the rate of the departure date (the ${h.a('mileage-reimbursement-calculator', 'mileage reimbursement calculator')} splits a year of miles around July 1).</p><p>That is the data advantage of the site: ${T.dest.length} GSA records with twelve monthly lodging figures for two fiscal years, ${K.num(K.ZIP_COUNT)} ZIP codes, and ${K.num(K.PLACE_COUNT)} cities of 15,000 people or more matched to their county by Census files, so that typing "Lancaster, CA" or "93534" finds the Los Angeles area rate instead of the standard one.</p>`,
    },
    {
      title: 'Meals and incidentals: the 75% days and the meals someone else paid',
      html: `<p>Each GSA area has one of five M&IE rates, from ${K.usd(tiers[0])} to ${K.usd(tiers[tiers.length - 1])}. On the day you leave and the day you come back, you receive ${K.pct(share)} of it, whatever the hours; the days in between are paid in full. A trip that starts and ends on the same day pays ${K.pct(share)} if it lasts more than ${K.P.mie.travelMinHours} hours, nothing otherwise.</p><p>When the government or a conference fee pays a meal, its value comes off: at ${K.usd(80)} M&IE a lunch is worth ${K.usd(K.tier(80).lunch)}, a dinner ${K.usd(K.tier(80).dinner)}. On a 75% day the full value comes off the reduced amount, and no day falls below the ${K.usd(K.tier(80).incidentals)} of incidental expenses. An airline snack or a free hotel breakfast is not deducted. The ${h.a('meals-and-incidental-expenses', 'M&IE page')} shows the breakdown of every tier.</p>`,
    },
    {
      title: 'Federal travelers, private employers and the self-employed',
      html: `<p>For a federal employee these rates are the law of the trip: the agency pays lodging up to the cap and M&IE at the rate, following the travel authorization. A private employer is free to pay less, more or its own flat amount; what the federal rates decide for it is the tax side. Under an accountable plan, per diem up to the federal rate and mileage up to the IRS rate need no receipts for the amount and stay off the W-2, and anything above is wages unless it is returned (${h.src('irs_pub_463', 'IRS Publication 463')}). The ${h.a('travel-reimbursement', 'travel reimbursement page')} computes that excess.</p><p>A self-employed person deducts business travel on Schedule C and may use the M&IE rate instead of meal receipts, with the meal part limited to 50% (80% for drivers under Department of Transportation hours of service, see the ${h.a('per-diem-for-truck-drivers', 'truck driver page')}). Lodging always needs receipts.</p>`,
    },
    {
      title: 'What the calculator does not do',
      html: `<p>It covers the 48 contiguous states and the District of Columbia, the area GSA calls CONUS. Alaska, Hawaii and the territories are set by the Department of Defense and foreign cities by the Department of State; the ${h.a('oconus-per-diem-rates', 'OCONUS page')} computes a trip from the rates you read there. It does not apply the actual expense method, which can reach ${K.num(K.P.mie.actualExpenseCap * 100)}% of the per diem when an agency approves it, nor the reduced rates some agencies set for long stays. It cannot know your employer's policy. And it never sends what you type anywhere: the arithmetic runs in this page, which is why the share link carries your inputs in its address.</p>`,
    },
    {
      title: 'Where the figures come from and when they change',
      html: `<p>Lodging and M&IE come from the ${h.src('gsa_files', 'GSA per diem files')} (FY2027 ZIP file published September 3, 2026), meal values from the ${h.src('gsa_mie', 'GSA breakdown')}, the day rules from the ${h.src('ftr_301_11', 'Federal Travel Regulation')}, mileage from the ${h.src('irs_rates_page', 'IRS')} and ${h.src('gsa_pov', 'GSA POV')} pages, fuel and electricity prices from the EIA, vehicle consumption from the EPA. GSA publishes the next fiscal year in August or September, the IRS its mileage rates in December (and in 2026, a second time in June). The ${h.a('method', 'method page')} lists every rule with the test cases that check it.</p>`,
    },
  ],
  faqs: [
    { q: 'How do I calculate per diem for a three-day trip?', a: `Add the nights at the lodging maximum of their month, then the M&IE: 75% of the daily rate on the first and last day, 100% for the day in between. In the standard CONUS area for FY2027 that is 2 × ${K.usd(s27.lodging)} of lodging plus ${K.usd(s27.mie * share)} + ${K.usd(s27.mie)} + ${K.usd(s27.mie * share)} of M&IE, ${K.usd(2 * s27.lodging + s27.mie * (1 + 2 * share))} in all.` },
    { q: 'What is the standard per diem rate for 2027?', a: `From October 1, 2026 to September 30, 2027 the standard CONUS rate is ${K.usd(s27.lodging + s27.mie)} a day: ${K.usd(s27.lodging)} for lodging and ${K.usd(s27.mie)} for meals and incidental expenses. It applies in every county GSA does not list as a non-standard area. Lodging rose ${K.usd(s27.lodging - s26.lodging)} from FY2026; the M&IE tiers did not move and are due for review in FY2028.` },
    { q: 'Which mileage rate applies to a trip in October 2026?', a: `The IRS business rate of ${K.centsWord(irsH2)} a mile, in force from July 1 to December 31, 2026 under Announcement 2026-11. Federal employees driving their own car get the same ${K.usd(K.pov('2026-10-01'), 2)} from GSA, or ${K.usd(K.pov('2026-10-01', 'govCarAvailable'), 3)} when a government car was available and they chose their own. The 2027 rates will be announced by the IRS in late December.` },
    { q: 'Do I get per diem if I travel for less than a day?', a: `Under federal rules only if you are in travel status for more than ${K.P.mie.travelMinHours} hours: you then receive 75% of the M&IE rate for that day and no lodging. At the standard rate that is ${K.usd(s27.mie * share)}. Twelve hours or less gives nothing. Many private employers copy this rule, but some pay meals only on overnight trips, so check your policy.` },
    { q: 'Is a free hotel breakfast deducted from my per diem?', a: `No. A complimentary breakfast included in the room rate, or a meal served by an airline, does not reduce your M&IE (41 CFR 301-11.21(c)). Only meals paid by the government or included in a registration fee are deducted, at the GSA breakdown value: ${K.usd(K.tier(68).breakfast)} for breakfast at the ${K.usd(68)} tier, ${K.usd(K.tier(92).breakfast)} at ${K.usd(92)}.` },
    { q: 'Does my employer have to pay the GSA per diem rates?', a: `No private employer is bound to them. They matter for taxes: per diem up to the federal rate for the place, paid under an accountable plan, is not wages and needs no receipts for the amount. Pay more and the excess goes on your W-2 unless you return it. Pay less and the difference is not deductible for an employee, since unreimbursed employee travel is no longer deductible.` },
    { q: 'Why does the calculator ask for a ZIP code or a county?', a: `Because GSA rates follow counties, not city names. A city can sit in a listed county and get its rate even if GSA never names it, and a few rates stop at city limits, like Santa Monica or Sedona. The search knows the GSA ZIP files and ${K.num(K.PLACE_COUNT)} cities of 15,000 people or more matched to their county, so Bakersfield gets the Kern County area and Fargo the standard rate.` },
  ] satisfies FAQ[],
  sources: ['gsa_files', 'gsa_highlights', 'gsa_mie', 'ftr_301_11', 'irs_ann_2026_11', 'irs_notice_2026_10', 'gsa_pov', 'irs_notice_2026_60', 'irs_pub_463'],
};
