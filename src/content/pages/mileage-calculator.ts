import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const b2 = K.irs('2026-07-01');
const odo = 48562 - 48210;
const weekly = 18 * 2 * 3 * 48;

export default definePage({
  id: 'mileage-calculator',
  group: 'mileage',
  order: 30,
  slug: 'mileage-calculator',
  nav: 'Business mileage calculator',
  card: 'Miles from two odometer readings or a weekly pattern, valued at the IRS rate of the day.',
  title: 'Mileage Calculator 2026: Business Miles and Their IRS Value',
  description: `Mileage calculator for 2026: count business miles from odometer readings or weekly trips, see which drives count, and value them at 76 cents since July 1.`,
  h1: 'Business mileage calculator',
  intro: 'Count the miles two ways, from the odometer or from a weekly pattern, choose the purpose and the date, and read their value at the IRS rate.',
  resume: `Two odometer readings, 48,210 and 48,562, make ${K.num(odo)} miles; driven for business after July 1, 2026, they are worth ${K.usd(odo * b2, 2)} at the IRS rate of ${K.centsWord(b2)}. A weekly pattern works too: a site visit 18 miles away, three round trips a week for 48 weeks, adds up to ${K.num(weekly)} miles, or ${K.usd(weekly * b2)} at the same rate. What decides whether those miles count is not their number but where they go. The IRS treats the drive between home and your regular workplace as commuting, never deductible and never tax-free if an employer pays it. Drives from one work site to another, to a client, or from home to a temporary work location when you have a regular workplace elsewhere are business miles. The calculator above values whatever you count; the paragraphs below help you count only what qualifies.`,
  tool: 'odometer',
  body: (h) => `
<h2>Which drives are business miles</h2>
<p>${h.src('irs_pub_463', 'IRS Publication 463')} draws the line with a chart. Home to your main or regular place of work: personal commuting, whatever the distance. Home to a temporary work location, when you also have a regular workplace: deductible, "regardless of distance". Regular workplace to a temporary location or to a second job: deductible. A temporary location is one where the work is realistically expected to last, and does last, one year or less. If you have no regular place of work, only temporary locations outside your metropolitan area count from home.</p>
<p>Two practical cases follow. A nurse who drives from home to a different clinic each week, with no fixed base, counts nothing inside her metro area and everything beyond it. A consultant with an office downtown who drives from home straight to a client for a three-month project counts the whole round trip. And when your home is your principal place of business, the drive from home to any other work location is business from the first mile.</p>
<h2>Odometer or pattern?</h2>
<p>Odometer readings are the strongest proof when a car is used for one long business drive: write the reading before and after, with the date and the purpose. A pattern suits a repeated route. The IRS gives the example of a sales representative on an established route, who may record the length of the route once, the date of each trip and the total miles for the year instead of explaining every drive. For anything else, the ${h.a('mileage-log', 'mileage log')} is the safer tool: one line per trip, kept at or near the time, which the IRS says carries more weight than a statement rebuilt later.</p>
${h.mini('mileSplit')}
<h2>Distance between two cities</h2>
<p>Many people searching for a mileage calculator want the road distance between two places. This site runs entirely in the browser and has no map service, so it does not compute routes; read the distance from a map application, then type it here as a one-way distance with the round-trip pattern. For airfare claims by private plane, GSA asks federal travelers to convert nautical miles with a factor of 1.15077945 and points to the Department of Transportation inter-airport distance tool.</p>
<h2>What the value means</h2>
<p>The figure in the result is what the miles are worth at the IRS standard rate for the purpose you chose: ${K.centsWord(b2)} for business, ${K.centsWord(K.irs('2026-07-01', 'medical'))} for medical care or a military move, ${K.centsWord(K.irs('2026-07-01', 'charity'))} for volunteer driving, since July 1, 2026 (${h.src('irs_ann_2026_11', 'Announcement 2026-11')}). For an employee it is the ceiling of a tax-free reimbursement; for a self-employed person it is a Schedule C deduction; for medical and charity miles it is an itemized deduction subject to its own limits. Parking and tolls on business trips come on top. To price a whole trip with lodging and meals, use the ${h.a('home', 'trip calculator')}; to split the year around July 1, the ${h.a('mileage-reimbursement-calculator', 'reimbursement calculator')}.</p>
`,
  faqs: [
    { q: 'Do miles from home to my regular office count as business mileage?', a: `No. The IRS calls the drive between your home and your main or regular place of work commuting, a personal expense, even if you take calls on the way or carry tools. It cannot be reimbursed tax-free or deducted. Drives from that office to clients or other sites, and from home to a temporary work location, are business miles.` },
    { q: 'How do I calculate mileage from odometer readings for taxes?', a: `Subtract the starting reading from the ending one for each business trip, then multiply by the IRS rate of the date: ${K.centsWord(b2)} for business miles driven from July 1, 2026, ${K.centsWord(K.irs('2026-06-30'))} before. Write the date, the destination and the purpose with each pair of readings, at or near the time, and keep the total miles of the year too.` },
    { q: 'Can this mileage calculator find the distance between two cities?', a: `No. The site computes everything in your browser and uses no map or routing service, so it cannot measure a road distance. Look up the one-way distance in a map application, enter it with the number of round trips, and the calculator values the miles at the IRS rate for the purpose and date you pick.` },
    { q: 'What counts as a temporary work location for mileage?', a: `A place where the work is realistically expected to last, and does last, one year or less, according to IRS Publication 463. If you also have a regular workplace, the daily round trip from home to a temporary location is deductible regardless of distance. Once the job is expected to last more than a year, it stops being temporary from that date.` },
  ],
  related: ['irs-mileage-rate', 'mileage-log', 'mileage-reimbursement-calculator', 'business-mileage-deduction', 'gas-cost-calculator'],
  sources: ['irs_pub_463', 'irs_ann_2026_11', 'irs_rates_page', 'gsa_pov'],
});
