/**
 * Mileage log you can fill, print or download as CSV: one line per trip, the IRS rate of each trip's date
 * applied automatically. Nothing leaves the browser; the lines live in this page only.
 */
import { useState } from 'react';
import PARAMS from '../../data/params-2026.json';
import { irsRate } from '../../lib/engine/mileage';
import { Result, Rows, Note, usd, num, rate } from './parts';

interface Line { date: string; purpose: string; route: string; miles: number }
const START: Line[] = [
  { date: '2026-06-23', purpose: 'Client visit', route: 'Office to Smith Co. and back', miles: 46 },
  { date: '2026-07-08', purpose: 'Site inspection', route: 'Office to Riverside job site', miles: 31 },
  { date: '2026-07-15', purpose: 'Supplier pickup', route: 'Office to warehouse', miles: 18 },
];
const r = (d: string) => { try { return irsRate(PARAMS.mileage.irs, d, 'business'); } catch { return 0; } };

export default function LogBuilder({ methodHref }: { methodHref: string }) {
  const [lines, setLines] = useState<Line[]>(START);
  const set = (i: number, k: keyof Line, v: string) => setLines((ls) => ls.map((l, j) => (j === i ? { ...l, [k]: k === 'miles' ? Math.max(0, Number(v.replace(/[^0-9.]/g, '')) || 0) : v } : l)));
  const total = lines.reduce((s, l) => s + l.miles, 0);
  const value = lines.reduce((s, l) => s + l.miles * r(l.date), 0);
  const csv = () => {
    const rows = [['Date', 'Business purpose', 'From / to', 'Miles', 'IRS rate', 'Value'], ...lines.map((l) => [l.date, l.purpose, l.route, String(l.miles), String(r(l.date)), (l.miles * r(l.date)).toFixed(2)])];
    const blob = new Blob([rows.map((x) => x.map((c) => `"${c.replace(/"/g, '""')}"`).join(',')).join('\n')], { type: 'text/csv' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'mileage-log-2026.csv'; a.click(); URL.revokeObjectURL(a.href);
  };
  const cell = 'h-12 w-full rounded-lg border border-navy-300 bg-white px-2 text-sm text-navy-900 focus:border-accent-500 focus:outline-none';
  return (
    <div className="rechner rounded-xl border border-navy-200 bg-white p-4 sm:p-6">
      <form onSubmit={(e) => e.preventDefault()}><div className="relative overflow-x-auto"><table className="journal w-full min-w-[640px] text-sm">
        <thead><tr><th scope="col" className="px-1 py-1 text-left">Date</th><th scope="col" className="px-1 py-1 text-left">Business purpose</th><th scope="col" className="px-1 py-1 text-left">From and to</th><th scope="col" className="px-1 py-1 text-right">Miles</th><th scope="col" className="px-1 py-1 text-right">Value</th><th scope="col" className="sr-only">Remove</th></tr></thead>
        <tbody>{lines.map((l, i) => (
          <tr key={i}>
            <td className="px-1 py-1"><label className="sr-only" htmlFor={`lg-d${i}`}>Date</label><input id={`lg-d${i}`} type="date" min="2025-01-01" max="2026-12-31" value={l.date} onChange={(e) => e.target.value && set(i, 'date', e.target.value)} className={cell} /></td>
            <td className="px-1 py-1"><label className="sr-only" htmlFor={`lg-p${i}`}>Purpose</label><input id={`lg-p${i}`} value={l.purpose} onChange={(e) => set(i, 'purpose', e.target.value)} className={cell} /></td>
            <td className="px-1 py-1"><label className="sr-only" htmlFor={`lg-r${i}`}>From and to</label><input id={`lg-r${i}`} value={l.route} onChange={(e) => set(i, 'route', e.target.value)} className={cell} /></td>
            <td className="px-1 py-1"><label className="sr-only" htmlFor={`lg-m${i}`}>Miles</label><input id={`lg-m${i}`} inputMode="decimal" value={l.miles ? String(l.miles) : ''} onChange={(e) => set(i, 'miles', e.target.value)} className={`${cell} text-right tabular-nums`} /></td>
            <td className="tabular-nums px-1 py-1 text-right">{usd(l.miles * r(l.date))}</td>
            <td className="px-1 py-1 text-right"><button type="button" onClick={() => setLines((ls) => ls.filter((_, j) => j !== i))} className="rounded border border-navy-300 px-2 py-1 text-xs text-navy-700 hover:bg-navy-50" aria-label={`Remove line ${i + 1}`}>Remove</button></td>
          </tr>))}</tbody>
      </table></div></form>
      <div className="mt-3 flex flex-wrap gap-2 text-sm">
        <button type="button" onClick={() => setLines((ls) => [...ls, { date: ls[ls.length - 1]?.date ?? '2026-07-01', purpose: '', route: '', miles: 0 }])} className="rounded-lg border border-accent-600 bg-accent-600 px-3 py-1.5 font-medium text-white hover:bg-accent-700">Add a trip</button>
        <button type="button" onClick={csv} className="rounded-lg border border-navy-300 bg-white px-3 py-1.5 font-medium text-navy-800 hover:bg-navy-50">Download CSV</button>
        <button type="button" onClick={() => window.print()} className="rounded-lg border border-navy-300 bg-white px-3 py-1.5 font-medium text-navy-800 hover:bg-navy-50">Print the log</button>
      </div>
      <Result label="Business miles logged" figure={`${num(total)} mi`} sub={`Worth ${usd(value)} at the IRS business rates`}>
        <Rows rows={[['Trips', num(lines.length)], ['Rate before July 1, 2026', rate(r('2026-06-30'))], ['Rate from July 1, 2026', rate(r('2026-07-01'))]]} />
        <Note methodHref={methodHref}>Each line keeps the rate of its own date. The log stays in this browser tab; download the CSV before closing it.</Note>
      </Result>
    </div>
  );
}
