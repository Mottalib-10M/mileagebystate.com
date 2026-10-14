/** Shared pieces of the calculators: card, result ledger, rows, date field, share and print actions. */
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { formatMoney, formatNumber } from '../../lib/format';

export const usd = (n: number, d = 0) => formatMoney(Number.isFinite(n) ? n : 0, d);
export const num = (n: number, d = 0) => formatNumber(Number.isFinite(n) ? n : 0, d);
/** Per-mile or per-kWh prices keep their published decimals: $0.725, $4.35. */
/** Amounts built from official half-dollar figures (75% of an M&IE tier) keep their cents; others none. */
export const money = (n: number) => (Math.abs(n * 100 - Math.round(n) * 100) < 0.5 ? usd(n) : usd(n, 2));
export const rate = (n: number) => (Math.round(n * 1000) % 10 ? usd(n, 3) : usd(n, 2));
export const dayLabel = (iso: string) => new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', timeZone: 'UTC' });
export interface Opt { value: string; label: string }

/**
 * Calculator card. From lg up, fields on the left and the result on the right, so the question and the
 * answer share the first screen (RECETTE §5, rule of 2026-10-11). Below lg, the result follows the fields.
 */
export function Card({ children, form }: { children: ReactNode; form: ReactNode; cols?: 2 | 3 }) {
  return (
    <div className="rechner rounded-xl border border-navy-200 bg-white p-4 sm:p-6 lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-6">
      <form className="grid content-start gap-x-5 gap-y-4 sm:grid-cols-2" onSubmit={(e) => e.preventDefault()}>{form}</form>
      <div className="lg:sticky lg:top-20 lg:[&>[data-resultat]]:mt-0">{children}</div>
    </div>
  );
}

export function DateField({ id, label, value, onChange, min, max, help }: { id: string; label: string; value: string; onChange: (v: string) => void; min?: string; max?: string; help?: string }) {
  return (
    <div className="grid grid-rows-subgrid row-span-3 content-start gap-y-0">
      <label htmlFor={id} className="mb-1 block text-sm font-medium text-navy-700">{label}</label>
      <input id={id} type="date" value={value} min={min} max={max} onChange={(e) => e.target.value && onChange(e.target.value)} aria-describedby={help ? `${id}-help` : undefined}
        className="tabular-nums h-12 w-full rounded-lg border border-navy-300 bg-white px-3 text-navy-900 focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-500/20" />
      {help && <p id={`${id}-help`} className="mt-1 text-xs text-navy-500">{help}</p>}
    </div>
  );
}

/**
 * Result block, marked data-resultat. On a phone, while the calculator is on screen but its figure is not,
 * a bar fixed to the bottom shows the figure and scrolls to the details on tap (RECETTE §5).
 */
export function Result({ label, figure, sub, children }: { label: string; figure: string; sub?: ReactNode; children?: ReactNode }) {
  const box = useRef<HTMLDivElement>(null);
  const fig = useRef<HTMLParagraphElement>(null);
  const [bar, setBar] = useState(false);
  useEffect(() => {
    const card = box.current?.closest('.rechner');
    if (!fig.current || !card || typeof IntersectionObserver === 'undefined') return;
    let cardIn = false, figIn = true;
    const o = new IntersectionObserver((es) => {
      for (const e of es) { if (e.target === card) cardIn = e.isIntersecting; else figIn = e.isIntersecting; }
      setBar(cardIn && !figIn);
    });
    o.observe(card); o.observe(fig.current);
    return () => o.disconnect();
  }, []);
  return (
    <div ref={box} data-resultat aria-live="polite" className="mt-6 rounded-xl bg-accent-50 p-4 sm:p-5">
      <p className="text-sm font-medium text-navy-700">{label}</p>
      <p ref={fig} className="tabular-nums mt-1 text-4xl font-bold text-navy-900">{figure}</p>
      {sub && <p className="ledger-range mt-1 text-sm">{sub}</p>}
      {children}
      <button type="button" onClick={() => box.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })} aria-hidden={!bar} tabIndex={bar ? 0 : -1}
        className={`${bar ? 'flex' : 'hidden'} fixed inset-x-0 bottom-0 z-30 items-center justify-between gap-3 border-t border-navy-200 bg-white px-4 py-2 text-left shadow-[0_-2px_8px_rgba(0,0,0,0.08)] lg:hidden`}>
        <span className="min-w-0 truncate text-xs text-navy-700">{label}</span>
        <span className="tabular-nums shrink-0 text-xl font-bold text-navy-900">{figure}</span>
      </button>
    </div>
  );
}

export function Rows({ rows }: { rows: Array<[string, string] | [string, string, boolean]> }) {
  return (
    <table className="mt-4 w-full text-sm"><tbody className="divide-y divide-navy-200">
      {rows.map(([l, v, strong]) => <tr key={l}><td className={`py-1.5 pr-3 ${strong ? 'font-semibold text-navy-900' : 'text-navy-700'}`}>{l}</td><td className={`tabular-nums py-1.5 text-right text-navy-900 ${strong ? 'font-semibold' : ''}`}>{v}</td></tr>)}
    </tbody></table>
  );
}

export function Note({ children, methodHref }: { children: ReactNode; methodHref?: string }) {
  return <p className="mt-3 text-xs text-navy-700">{children}{methodHref && <> <a className="underline" href={methodHref}>How this is calculated</a>.</>}</p>;
}

export function Actions({ extra }: { extra?: ReactNode }) {
  const [copied, setCopied] = useState(false);
  const copy = () => { navigator.clipboard?.writeText(window.location.href).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1500); }); };
  return (
    <div className="mt-3 flex flex-wrap gap-2 text-sm">
      <button type="button" onClick={copy} className="rounded-lg border border-navy-300 bg-white px-3 py-1.5 font-medium text-navy-800 hover:bg-navy-50">{copied ? 'Link copied' : 'Copy share link'}</button>
      <button type="button" onClick={() => window.print()} className="rounded-lg border border-navy-300 bg-white px-3 py-1.5 font-medium text-navy-800 hover:bg-navy-50">Print</button>
      {extra}
    </div>
  );
}

/** Proportional bar of a total split into parts. */
export function SplitBar({ parts }: { parts: Array<{ label: string; value: number; color: string }> }) {
  const total = parts.reduce((s, p) => s + Math.max(0, p.value), 0);
  if (total <= 0) return null;
  return (
    <div className="mt-4" role="img" aria-label={parts.map((p) => `${p.label} ${Math.round((p.value / total) * 100)} percent`).join(', ')}>
      <div className="flex h-3 overflow-hidden rounded-full">{parts.map((p) => <div key={p.label} style={{ width: `${(Math.max(0, p.value) / total) * 100}%`, backgroundColor: p.color }} />)}</div>
      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">{parts.map((p) => <span key={p.label} className="flex items-center gap-1.5 text-xs text-navy-700"><span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: p.color }} aria-hidden="true" />{p.label} {Math.round((Math.max(0, p.value) / total) * 100)}%</span>)}</div>
    </div>
  );
}
export const COLORS = { lodging: '#2B3A67', mie: '#B22234', miles: '#64748b', other: '#cbd5e1' };
