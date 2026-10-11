import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const b1 = K.irs('2026-06-30'), b2 = K.irs('2026-07-01');
const sample = [46 * b1, 31 * b2, 18 * b2];
const sampleTotal = sample.reduce((a, b) => a + b, 0);

export default definePage({
  id: 'mileage-log',
  group: 'mileage',
  order: 40,
  slug: 'mileage-log',
  nav: 'Mileage log (printable)',
  card: 'Fill a log in the browser, each trip priced at the IRS rate of its date, then print or download it.',
  title: 'Mileage Log 2026: Printable IRS Log, July Rate Change',
  description: `Mileage log for 2026 you fill in the browser: date, purpose, route and miles, each line priced at 72.5 or 76 cents, then printed or saved as CSV, never sent.`,
  h1: 'Mileage log, printable and downloadable',
  intro: 'Add one line per business trip; each line takes the IRS rate of its own date, and the log prints or downloads as a spreadsheet file.',
  resume: `A mileage log needs four things per business trip: the date, the place, the business purpose and the miles, written at or near the time of the drive, plus the total miles of the car for the year. The three sample lines above, one in June and two in July 2026, show why the date matters this year: the June trip is priced at ${K.centsWord(b1)} a mile and the July trips at ${K.centsWord(b2)}, for ${K.usd(sampleTotal, 2)} in all. The log on this page applies the right rate to every line, adds them up, and lets you print the table or download it as a CSV file for a spreadsheet, an accountant or an expense system. It runs in your browser: nothing is stored on a server, so download the file before you close the tab. The IRS accepts a log kept weekly as a timely record; a log rebuilt from memory at tax time carries far less weight.`,
  tool: 'log',
  body: (h) => `
<h2>What the IRS wants to see</h2>
<p>For car expenses, ${h.src('irs_pub_463', 'Publication 463')} asks for the amount of each business use (the miles), the time (the date of the trip), the place (where you went) and the business purpose. You should also keep the total miles driven during the year, because the business share of a car is a ratio of business miles to all miles. The publication says the elements should be recorded at or near the time of the use, and that a log kept weekly counts as timely. A copy of an expense report given to an employer can serve as the record if it was taken from such a log.</p>
<p>Purpose can be short: "client meeting, Smith Co.", "site inspection", "supplier pickup". When the purpose is obvious from the circumstances, a written explanation is not required, and a sales representative on a fixed route may record the route length once, then the date of each trip and the yearly total.</p>
<h2>Why a 2026 log must keep each date</h2>
<p>The IRS business rate changed on July 1, 2026 (${h.src('irs_ann_2026_11', 'Announcement 2026-11')}). A log that only keeps monthly totals still works, as long as June and July are not merged. The tool here keeps the exact date of each line and computes ${K.centsWord(b1)} or ${K.centsWord(b2)} accordingly, which is also how an employer must reimburse: miles driven before July 1 stay at the old rate even when paid later.</p>
${h.mini('mileSplit')}
<h2>From log to money</h2>
<p>An employee hands the log to the employer under an accountable plan: reimbursement up to the IRS rate is tax-free, and the ${h.a('mileage-reimbursement-calculator', 'reimbursement calculator')} shows what happens above or below it. A self-employed person keeps it with the tax records and carries the total to Schedule C, by the standard rate or by actual expenses times the business share; the ${h.a('business-mileage-deduction', 'deduction calculator')} compares the two. Medical and charity drives belong in separate logs, at their own rates.</p>
<h2>Paper, spreadsheet or app</h2>
<p>The form does not matter to the IRS: a notebook in the glove box, a spreadsheet or a phone app are all records if they hold the four elements and were kept on time. Apps that track GPS save typing but still need a purpose for each trip, and some charge a subscription. The log here is free and needs no account, at the cost of typing the trips yourself. Whatever the tool, keep the file with your return for as long as the return can be examined.</p>
<p>If your records are incomplete, the IRS asks for your own written or oral statement with specific details, backed by other evidence such as receipts, delivery records or calendar entries. That is weaker than a log, which is the whole reason to keep one.</p>
`,
  faqs: [
    { q: 'What must a mileage log include for the IRS?', a: `For each business trip: the date, the destination, the business purpose and the miles driven, recorded at or near the time. Add the total miles the car drove during the year, which sets the business share. IRS Publication 463 accepts a weekly log as a timely record. Receipts for parking and tolls go with it.` },
    { q: 'Do I need a separate mileage log line for every trip in 2026?', a: `Not always. A repeated route can be recorded once with its length, then the date of each trip. But keep June and July 2026 trips apart in any case, because miles before July 1 are worth ${K.centsWord(b1)} and miles from July 1 are worth ${K.centsWord(b2)}, and an employer must reimburse each at its own rate.` },
    { q: 'Is this online mileage log saved anywhere?', a: `No. The log lives in your browser tab only; nothing is sent to a server and nothing is kept when you close the page. Use "Download CSV" to save a file you can open in a spreadsheet, or "Print the log" to keep a paper copy for your records or your employer.` },
    { q: 'Can I rebuild a mileage log from my calendar at tax time?', a: `You can, but it is weaker evidence. The IRS gives more weight to a record made at or near the time of the drive. Without one, you must support each element with your own detailed statement and other evidence such as appointments, invoices or delivery records. A calendar entry with the client name helps; a guess of yearly miles does not.` },
  ],
  related: ['mileage-calculator', 'irs-mileage-rate', 'business-mileage-deduction', 'mileage-reimbursement-calculator', 'home'],
  sources: ['irs_pub_463', 'irs_ann_2026_11', 'irs_notice_2026_10'],
});
