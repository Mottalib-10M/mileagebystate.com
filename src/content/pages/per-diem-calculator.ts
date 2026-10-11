import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import { destIndex, T } from '../../lib/data';

const share = K.P.mie.partialDayShare;
const s27 = K.std(2027), s26 = K.std(2026);
const chiI = destIndex('IL', 'Chicago');
const chi = T.dest[chiI].fy;
const cross = K.trip({ destIndex: chiI, depart: '2026-09-28', ret: '2026-10-02' });
const n26 = cross.days.filter((d) => d.fy === 2026 && d.lodging > 0).length;
const n27 = cross.nights - n26;
const sepLod = chi['2026'].lodging[11], octLod = chi['2027'].lodging[0];
// Same stay with a room booked below the cap and a conference lunch on the second day.
const roomPaid = octLod - 30;
const capped = K.trip({ destIndex: chiI, depart: '2026-09-28', ret: '2026-10-02', roomCost: roomPaid, meals: { breakfast: 0, lunch: 1, dinner: 0 } });
const t92 = K.tier(92);
const dayTrip = s27.mie * share;
const over = 40; // dollars above the cap in the tax example
const cap = K.P.mie.actualExpenseCap;

export default definePage({
  id: 'per-diem-calculator',
  group: 'perdiem',
  order: 20,
  slug: 'per-diem-calculator',
  nav: 'Per diem calculator',
  card: 'Dates and destination in, a night-by-night and day-by-day federal per diem total out, across fiscal years.',
  title: 'Per Diem Calculator 2026-27: GSA Trip Total, Night by Night',
  description: `Per diem calculator for 2026-27: each night at its month's GSA cap, M&IE at ${K.pct(share)} on travel days, provided meals off, FY2026 and FY2027 mixed by trip date.`,
  h1: 'Per diem calculator for a whole trip',
  intro: 'Pick the destination and the two dates: every night gets the lodging cap of its own month and fiscal year, every day its M&IE.',
  resume: `A federal per diem total is the sum of two separate counts: each night at the lodging maximum of the month and fiscal year that night falls in, plus each calendar day at the M&IE rate, cut to ${K.pct(share)} on the day you leave and the day you come back. That is why a trip has one more day than it has nights. In the standard CONUS area for FY2027 a night is capped at ${K.usd(s27.lodging)} and a full day pays ${K.usd(s27.mie)}. A stay that straddles September 30 mixes two GSA tables: four nights in Chicago from September 28 to October 2, 2026 put ${n26} nights at ${K.usd(sepLod)} and ${n27} at ${K.usd(octLod)}, for ${K.usd(cross.total)} at the federal maximum. The calculator also takes away meals paid by the government or a conference fee, caps a cheaper room at what you really paid, keeps lodging taxes on a separate line, and handles a same-day trip of more than ${K.P.mie.travelMinHours} hours.`,
  tool: 'perdiem',
  body: (h) => `
<h2>Four nights in Chicago, two fiscal years</h2>
<p>${K.usd(cross.total)}. That is the most a federal traveler could claim for a Chicago stay from Monday, September 28 to Friday, October 2, 2026, before lodging taxes. The first ${n26} nights belong to FY2026, when the September cap for Cook and Lake counties was ${K.usd(sepLod)}; the night of October 1 belongs to FY2027, whose October cap is ${K.usd(octLod)}. Chicago's M&IE stayed at ${K.usd(chi['2027'].mie)} in both years, so only the travel days move that column: ${K.usd(chi['2027'].mie * share, 2)} on Monday and on Friday, the full amount in between.</p>
${h.table(['Date', 'Fiscal year', 'Lodging', 'M&IE paid'], cross.days.map((d) => [K.day(d.date), `FY${d.fy}`, d.lodging ? K.usd(d.lodging) : 'no night', K.usd(d.mieNet, 2)]), `Chicago, September 28 to October 2, 2026, at the GSA maximum (${h.src('gsa_files', 'GSA per diem files')})`, ['l', 'l', 'r', 'r'])}
<p>A claim filed this month for that trip is still built from two tables. Nothing about the filing date changes it: what counts is the date of each night and each day.</p>
${h.mini('pdSeptCross', { area: 'Chicago, IL', sep: sepLod, oct: octLod, mie26: chi['2026'].mie, mie27: chi['2027'].mie })}
<h2>Counting nights and days without double counting</h2>
<p>Lodging is a nightly figure; meals and incidentals are a calendar-day figure. Leave on the 3rd, return on the 7th and you have four nights of lodging but five days of M&IE. Under the Federal Travel Regulation the entitlement starts the day you leave your home or office and stops the day you get back (${h.src('ftr_301_11', '41 CFR 301-11.5')}), and the rate follows the temporary duty location, not your home city. One wrinkle the date fields cover: when you reach the hotel after midnight, the FTR lets you claim that room on the previous calendar day, so enter the departure date of the evening you set off.</p>
<p>Seasonal areas need the same care. A resort whose cap jumps on the first of a month gives two different nightly figures inside one week, and the day-by-day table in the calculator lists each one. A single rate typed once for the whole stay, which is what a quick lookup invites, overpays or underpays every night that sits on the other side of the change.</p>
<h2>Room below the cap, meals already paid</h2>
<p>The lodging figure is a ceiling. If your room cost less, type the nightly price and the calculator uses it wherever it sits under the cap. Book Chicago at ${K.usd(roomPaid)} a night for that same week and the September nights stay at ${K.usd(roomPaid)}, while October 1 is also under its ${K.usd(octLod)} cap. Add a lunch served at a conference on Tuesday and ${K.usd(t92.lunch)} comes off that day at the ${K.usd(92)} tier. The trip then totals ${K.usd(capped.total, 2)}.</p>
<p>The meal fields are split in two on purpose. A meal served on a travel day is deducted at its full GSA value from the reduced ${K.pct(share)} amount, and no day can fall below the incidentals, so the calculator needs to know which day it was. Airline snacks and a breakfast included in the room price are not counted; the ${h.a('meals-and-incidental-expenses', 'M&IE breakdown page')} lists the value of each meal by tier.</p>
<h2>Lodging taxes sit outside the per diem</h2>
<p>Hotel taxes in the 48 states, Alaska, Hawaii and the territories are reimbursed as a miscellaneous expense, apart from the per diem, but only the tax on the part of the room that is itself reimbursable. Pay ${K.usd(octLod + over)} for a Chicago room capped at ${K.usd(octLod)} and the tax on the extra ${K.usd(over)} stays with you. That is why the tax field takes the amount you actually paid for the reimbursable part, and why the result shows it on its own line.</p>
<h2>Same-day trips and what this tool does not price</h2>
<p>Set the return date equal to the departure date and an hours field appears. Past ${K.P.mie.travelMinHours} hours in travel status, the FTR pays ${K.pct(share)} of the M&IE for that single day and no lodging: ${K.usd(dayTrip, 2)} at the standard rate. At ${K.P.mie.travelMinHours} hours or fewer the result drops to zero.</p>
<p>Mileage, airfare and parking are left to the ${h.a('home', 'full trip calculator')}, which adds them to this same per diem. Travel to Alaska, Hawaii or abroad uses rates that are not in the GSA table; the ${h.a('oconus-per-diem-rates', 'OCONUS calculator')} takes them by hand. Actual expense reimbursement, which an agency can approve up to ${K.pct(cap)} of the per diem when a city's rate is too low for an event, is not modeled. For FY2026, the standard lodging figure was ${K.usd(s26.lodging)}, ${K.usd(s27.lodging - s26.lodging)} under today's.</p>
`,
  faqs: [
    { q: 'How does the per diem calculator handle a trip that crosses September 30?', a: `It prices every night and every day with the GSA table of its own date. Nights through September 30, 2026 take the FY2026 caps, nights from October 1 take FY2027. A Chicago stay from September 28 to October 2, 2026 mixes ${n26} nights at ${K.usd(sepLod)} with ${n27} at ${K.usd(octLod)}. The date you file the voucher plays no part.` },
    { q: 'Can the per diem calculator use the room price I actually paid?', a: `Yes. Type the nightly price in the room field and each night is paid at that price or at the GSA cap for its month, whichever is lower, as 41 CFR 301-11.19 provides. Leave it at zero and the calculator assumes the full cap, which is the most a federal traveler can receive. The M&IE column is a flat rate and does not depend on what you spend.` },
    { q: 'Why does a per diem calculation show one more day than nights?', a: `Because lodging is paid per night and M&IE per calendar day. A trip from Monday to Friday has four hotel nights and five days of meals. The first and last of those days are paid at ${K.pct(share)} under 41 CFR 301-11.20, so five days at the standard ${K.usd(s27.mie)} rate give ${K.usd(s27.mie * share * 2 + s27.mie * 3, 2)}, not ${K.usd(s27.mie * 5)}.` },
    { q: 'How are lodging taxes counted when the room costs more than the GSA cap?', a: `Only the tax on the reimbursable part of the room is paid back. If a room costs ${K.usd(octLod + over)} where the cap is ${K.usd(octLod)}, the tax on the ${K.usd(over)} above the cap is yours to bear (41 CFR 301-11.16). In this calculator, enter the tax that matches the capped room price; it is added on a separate line, outside the per diem.` },
    { q: 'What does the per diem calculator give for a 14-hour day trip?', a: `With the same departure and return date and 14 hours in travel status, it pays ${K.pct(share)} of the M&IE rate of the destination for that day and no lodging. At the FY2027 standard rate that is ${K.usd(dayTrip, 2)}; in a ${K.usd(92)} area it is ${K.usd(92 * share, 2)}. Enter ${K.P.mie.travelMinHours} hours or fewer and the result is zero under 41 CFR 301-11.1.` },
  ],
  related: ['home', 'per-diem-rates', 'meals-and-incidental-expenses', 'first-and-last-day-per-diem', 'oconus-per-diem-rates', 'state:illinois'],
  sources: ['gsa_files', 'gsa_rates', 'ftr_301_11', 'gsa_mie'],
});
