/**
 * GSA rate card: search a city, county, area or ZIP, pick FY2027 or FY2026, read the twelve monthly lodging
 * maximums, the M&IE tier and its meal breakdown. With `state`, the state's areas are listed under the card.
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import Toggle from '../ui/Toggle';
import PERDIEM from '../../data/perdiem.json';
import PARAMS from '../../data/params-2026.json';
import type { Tables } from '../../lib/engine/perdiem';
import { search, type Hit } from '../../lib/search';
import { readParams, num as pnum, str as pstr, updateURL } from '../../lib/url-state';
import { Result, Note, Actions, usd } from './parts';

const T = PERDIEM as unknown as Tables & { months: string[] };
interface Props { d27?: number; d26?: number; label?: string; state?: string; methodHref: string; idPrefix?: string }

export default function RatesLookup({ d27 = -1, d26 = -1, label = 'Standard CONUS rate', state, methodHref, idPrefix = 'rates' }: Props) {
  const p = idPrefix;
  const [pick, setPick] = useState({ label, d27, d26 });
  const [fy, setFy] = useState('2027');
  const [query, setQuery] = useState('');
  const [hits, setHits] = useState<Hit[]>([]);
  const seq = useRef(0);
  useEffect(() => {
    const u = readParams(window.location.search);
    if (u.has('d27')) setPick({ label: pstr(u, 'lab', 'Shared destination'), d27: pnum(u, 'd27', -1), d26: pnum(u, 'd26', -1) });
    setFy(pstr(u, 'fy', '2027'));
  }, []);
  useEffect(() => { const id = ++seq.current; if (query.trim().length < 2) { setHits([]); return; } search(query, T.dest).then((h) => { if (id === seq.current) setHits(h); }); }, [query]);
  useEffect(() => { updateURL({ lab: pick.label, d27: pick.d27, d26: pick.d26, fy: fy !== '2027' ? fy : undefined }); }, [pick, fy]);

  const idx = fy === '2027' ? pick.d27 : pick.d26;
  const d = idx >= 0 ? T.dest[idx] : undefined;
  const r = d?.fy[fy];
  const std = T.standard[fy];
  const lodging = r ? r.lodging : Array(12).fill(std.lodging);
  const mie = r ? r.mie : std.mie;
  const t = T.tiers[String(mie)];
  const hi = Math.max(...lodging), lo = Math.min(...lodging);
  const share = PARAMS.mie.partialDayShare;
  const list = useMemo(() => state ? T.dest.map((x, i) => ({ x, i })).filter(({ x }) => x.st === state && x.fy[fy]).sort((a, b) => Math.max(...b.x.fy[fy].lodging) - Math.max(...a.x.fy[fy].lodging)) : [], [state, fy]);
  const months = T.months;
  const choose = (h: { label: string; d27: number; d26: number }) => { setPick({ label: h.label, d27: h.d27, d26: h.d26 }); setQuery(''); setHits([]); };

  return (
    <div className="rechner rounded-xl border border-navy-200 bg-white p-4 sm:p-6">
      <form className="grid content-start gap-x-5 gap-y-4 sm:grid-cols-[1fr_auto]" onSubmit={(e) => e.preventDefault()}>
        <div className="relative grid grid-rows-subgrid row-span-3 content-start gap-y-0">
          <label htmlFor={`${p}-q`} className="mb-1 block text-sm font-medium text-navy-700">City, county, GSA area or ZIP code</label>
          <input id={`${p}-q`} type="text" role="combobox" aria-autocomplete="list" aria-expanded={hits.length > 0} autoComplete="off" value={query} onChange={(e) => setQuery(e.target.value)} placeholder={pick.label}
            className="h-12 w-full rounded-lg border border-navy-300 bg-white px-4 text-navy-900 placeholder:text-navy-700 focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-500/20" />
          <p className="mt-1 text-xs text-navy-500">Try “Denver”, “Miami-Dade”, “Sedona AZ” or “20001”</p>
          {hits.length > 0 && (
            <ul className="absolute top-[4.6rem] z-20 max-h-72 w-full overflow-y-auto rounded-lg border border-navy-200 bg-white shadow-lg">
              {hits.map((h) => <li key={h.key}><button type="button" onClick={() => choose(h)} className="block w-full px-4 py-2 text-left hover:bg-accent-50"><span className="font-medium text-navy-900">{h.label}</span><span className="block text-xs text-navy-600">{h.detail}</span></button></li>)}
            </ul>
          )}
        </div>
        <Toggle id={`${p}-fy`} label="Fiscal year" value={fy} onChange={setFy} options={[{ value: '2027', label: 'FY2027' }, { value: '2026', label: 'FY2026' }]} />
      </form>
      <Result label={`${pick.label}: maximum per diem, FY${fy}`} figure={`${usd(hi + mie)} a day`} sub={d ? `GSA area ${d.name}, ${d.st} · ${d.counties}` : `Standard CONUS rate: ${usd(std.lodging)} lodging + ${usd(std.mie)} M&IE`}>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-sm font-semibold text-navy-900">Lodging maximum by month {lo !== hi ? `(${usd(lo)} to ${usd(hi)})` : `(${usd(hi)} all year)`}</p>
            <div className="overflow-x-auto"><table className="journal mt-2 w-full text-sm"><tbody>
              {[0, 6].map((s) => <tr key={s}>{months.slice(s, s + 6).map((m, k) => <td key={m} className="border-b border-navy-100 px-1 py-1 text-center"><span className="block text-xs text-navy-600">{m}</span><span className={`tabular-nums ${lodging[s + k] === hi && lo !== hi ? 'font-bold text-navy-900' : 'text-navy-800'}`}>{usd(lodging[s + k])}</span></td>)}</tr>)}
            </tbody></table></div>
            <p className="mt-1 text-xs text-navy-600">Fiscal year {fy}: October {Number(fy) - 1} to September {fy}. Taxes on the room are reimbursed on top.</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-navy-900">M&IE {usd(mie)} a day, and what each meal is worth</p>
            <table className="journal mt-2 w-full text-sm"><tbody className="divide-y divide-navy-200">
              {([['Breakfast', t.breakfast], ['Lunch', t.lunch], ['Dinner', t.dinner], ['Incidental expenses', t.incidentals]] as Array<[string, number]>).map(([l, v]) => <tr key={l}><td className="py-1 text-navy-700">{l}</td><td className="tabular-nums py-1 text-right text-navy-900">{usd(v)}</td></tr>)}
              <tr><td className="py-1 font-semibold text-navy-900">First and last day ({share * 100}%)</td><td className="tabular-nums py-1 text-right font-semibold text-navy-900">{usd(mie * share, 2)}</td></tr>
            </tbody></table>
          </div>
        </div>
        <Note methodHref={methodHref}>GSA {fy === '2027' ? 'FY2027 files published September 3, 2026' : 'FY2026 files published August 14, 2025'}. A county not listed by GSA takes the standard rate.</Note>
        <Actions />
      </Result>
      {list.length > 0 && (
        <div className="mt-6">
          <p className="text-sm font-semibold text-navy-900">Every GSA area in this state, FY{fy} (tap to load)</p>
          <div className="overflow-x-auto"><table className="journal mt-2 w-full text-sm">
            <thead><tr><th scope="col" className="px-2 py-1 text-left">Area</th><th scope="col" className="px-2 py-1 text-left">Counties</th><th scope="col" className="px-2 py-1 text-right">Lodging</th><th scope="col" className="px-2 py-1 text-right">M&IE</th></tr></thead>
            <tbody>{list.map(({ x, i }) => { const l = x.fy[fy].lodging; const a = Math.min(...l), b = Math.max(...l); return (
              <tr key={i} className="border-b border-navy-100"><td className="px-2 py-1"><button type="button" className="text-left font-medium text-accent-700 underline-offset-2 hover:underline" onClick={() => choose({ label: `${x.name}, ${x.st}`, d27: x.fy['2027'] ? i : -1, d26: x.fy['2026'] ? i : -1 })}>{x.name}</button></td><td className="px-2 py-1 text-navy-700">{x.counties}</td><td className="tabular-nums px-2 py-1 text-right">{a === b ? usd(a) : `${usd(a)} to ${usd(b)}`}</td><td className="tabular-nums px-2 py-1 text-right">{usd(x.fy[fy].mie)}</td></tr>); })}</tbody>
          </table></div>
        </div>
      )}
    </div>
  );
}
