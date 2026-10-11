/**
 * The whole trip on one screen: GSA lodging night by night, M&IE with the 75% first and last day, provided
 * meals deducted at the GSA breakdown, then the miles at the IRS or GSA rate of the travel date and any other
 * cost. mode "perdiem" hides the transport lines. First render = build defaults (RECETTE §17.5), the share
 * link and today's dates are applied after mount.
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import NumberField from '../ui/NumberField';
import SelectField from '../ui/SelectField';
import PERDIEM from '../../data/perdiem.json';
import PARAMS from '../../data/params-2026.json';
import { trip, type Tables } from '../../lib/engine/perdiem';
import { irsRate, povRate } from '../../lib/engine/mileage';
import { addDays, daysBetween, fiscalYear } from '../../lib/engine/dates';
import { search, destLabel, type Hit } from '../../lib/search';
import { readParams, num as pnum, str as pstr, updateURL } from '../../lib/url-state';
import { Card, DateField, Result, Rows, Note, Actions, SplitBar, COLORS, usd, num, rate, money, dayLabel } from './parts';

const T = PERDIEM as unknown as Tables;
interface Pick { label: string; detail: string; d27: number; d26: number }
interface Props { mode?: 'trip' | 'perdiem'; dest?: Pick; methodHref: string; idPrefix?: string; nights?: number; lead?: number }

const STD: Pick = { label: 'Standard CONUS rate', detail: 'Any county GSA does not list', d27: -1, d26: -1 };
const RATE_OPTS = [
  { value: 'irs', label: 'IRS business rate of the travel date' },
  { value: 'gov', label: 'GSA rate, government car was available' },
  { value: 'custom', label: 'My employer’s own rate' },
];

export default function TripCalc({ mode = 'trip', dest = STD, methodHref, idPrefix = 'trip', nights = 3, lead = 14 }: Props) {
  const p = idPrefix;
  const [pick, setPick] = useState<Pick>(dest);
  const [query, setQuery] = useState('');
  const [hits, setHits] = useState<Hit[]>([]);
  const [depart, setDepart] = useState(addDays(__BUILD_DAY__, lead));
  const [ret, setRet] = useState(addDays(__BUILD_DAY__, lead + nights));
  const [hours, setHours] = useState(14);
  const [miles, setMiles] = useState(mode === 'trip' ? 240 : 0);
  const [rateKind, setRateKind] = useState('irs');
  const [custom, setCustom] = useState(0.6);
  const [other, setOther] = useState(0);
  const [mb, setMb] = useState(0); const [ml, setMl] = useState(0); const [md, setMd] = useState(0);
  const [tb, setTb] = useState(0); const [tl, setTl] = useState(0); const [td, setTd] = useState(0);
  const [room, setRoom] = useState(0);
  const [tax, setTax] = useState(0);
  const seq = useRef(0);

  useEffect(() => {
    const u = readParams(window.location.search);
    const today = new Date().toISOString().slice(0, 10);
    setDepart(pstr(u, 'dep', addDays(today, lead))); setRet(pstr(u, 'ret', addDays(today, lead + nights)));
    if (u.has('d27')) setPick({ label: pstr(u, 'lab', 'Shared destination'), detail: 'From a shared link', d27: pnum(u, 'd27', -1), d26: pnum(u, 'd26', -1) });
    setHours(pnum(u, 'h', 14)); setMiles(pnum(u, 'mi', mode === 'trip' ? 240 : 0)); setRateKind(pstr(u, 'rt', 'irs')); setCustom(pnum(u, 'cr', 0.6)); setOther(pnum(u, 'oth', 0));
    setMb(pnum(u, 'mb', 0)); setMl(pnum(u, 'ml', 0)); setMd(pnum(u, 'md', 0)); setTb(pnum(u, 'tb', 0)); setTl(pnum(u, 'tl', 0)); setTd(pnum(u, 'td', 0)); setRoom(pnum(u, 'room', 0)); setTax(pnum(u, 'tax', 0));
  }, []);

  useEffect(() => {
    const id = ++seq.current;
    if (query.trim().length < 2) { setHits([]); return; }
    search(query, T.dest).then((h) => { if (id === seq.current) setHits(h); });
  }, [query]);

  const span = daysBetween(depart, ret);
  const validDates = span >= 0 && span <= 180;
  const r = useMemo(() => validDates ? trip(T, PARAMS.mie, {
    destIndex: { '2027': pick.d27, '2026': pick.d26 }, depart, ret, hours,
    meals: { breakfast: mb, lunch: ml, dinner: md }, mealsOnTravelDays: { breakfast: tb, lunch: tl, dinner: td }, roomCost: room,
  }) : null, [pick, depart, ret, hours, mb, ml, md, tb, tl, td, room, validDates]);

  let perMile = 0;
  try { perMile = rateKind === 'custom' ? custom : rateKind === 'gov' ? povRate(PARAMS.mileage.gsaPov, depart, 'govCarAvailable') : irsRate(PARAMS.mileage.irs, depart, 'business'); } catch { perMile = rateKind === 'custom' ? custom : 0; }
  const transport = mode === 'trip' ? miles * perMile : 0;
  const extra = mode === 'trip' ? other : 0;
  const total = (r?.total ?? 0) + transport + extra + tax;

  useEffect(() => { updateURL({ lab: pick.label, d27: pick.d27, d26: pick.d26, dep: depart, ret, h: span === 0 ? hours : undefined, mi: mode === 'trip' ? miles : undefined, rt: rateKind !== 'irs' ? rateKind : undefined, cr: rateKind === 'custom' ? custom : undefined, oth: other || undefined, mb: mb || undefined, ml: ml || undefined, md: md || undefined, tb: tb || undefined, tl: tl || undefined, td: td || undefined, room: room || undefined, tax: tax || undefined }); },
    [pick, depart, ret, hours, miles, rateKind, custom, other, mb, ml, md, tb, tl, td, room, tax]);

  const choose = (h: Hit) => { setPick({ label: h.label, detail: h.detail, d27: h.d27, d26: h.d26 }); setQuery(''); setHits([]); };
  const fyNote = r?.crossesFy ? `This trip crosses September 30: nights and days before October 1, 2026 use the FY2026 table, the rest FY2027.` : `Rates of fiscal year ${fiscalYear(depart)} (${fiscalYear(depart) === 2027 ? 'October 1, 2026 to September 30, 2027' : fiscalYear(depart) === 2026 ? 'October 1, 2025 to September 30, 2026' : 'outside the published tables: nearest year used'}).`;
  const areaNow = (() => { const i = fiscalYear(depart) >= 2027 ? pick.d27 : pick.d26; return i >= 0 ? `GSA area ${destLabel(T.dest[i])}` : 'standard CONUS rate'; })();

  return (
    <Card form={<>
      <div className="relative sm:col-span-2">
        <label htmlFor={`${p}-q`} className="mb-1 block text-sm font-medium text-navy-700">Destination: city, county, GSA area or ZIP</label>
        <input id={`${p}-q`} type="text" role="combobox" aria-autocomplete="list" aria-expanded={hits.length > 0} autoComplete="off" value={query} onChange={(e) => setQuery(e.target.value)} placeholder={pick.label}
          className="h-12 w-full rounded-lg border border-navy-300 bg-white px-4 text-navy-900 placeholder:text-navy-700 focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-500/20" aria-describedby={`${p}-q-help`} />
        <p id={`${p}-q-help`} className="mt-1 text-xs text-navy-500">Selected: <strong className="text-navy-800">{pick.label}</strong> · {areaNow}</p>
        {hits.length > 0 && (
          <ul className="absolute z-20 mt-1 max-h-72 w-full overflow-y-auto rounded-lg border border-navy-200 bg-white shadow-lg" role="listbox">
            {hits.map((h) => <li key={h.key}><button type="button" onClick={() => choose(h)} className="block w-full px-4 py-2 text-left hover:bg-accent-50"><span className="font-medium text-navy-900">{h.label}</span><span className="block text-xs text-navy-600">{h.detail}</span></button></li>)}
            <li><button type="button" onClick={() => choose({ ...STD, key: 'std' })} className="block w-full px-4 py-2 text-left text-sm text-navy-700 hover:bg-accent-50">Not listed: use the standard CONUS rate</button></li>
          </ul>
        )}
      </div>
      <DateField id={`${p}-dep`} label="Departure day" value={depart} onChange={(v) => { setDepart(v); if (daysBetween(v, ret) < 0) setRet(v); }} min="2025-10-01" max="2027-09-30" />
      <DateField id={`${p}-ret`} label="Return day" value={ret} onChange={setRet} min={depart} max="2027-09-30" help={validDates ? `${span} night${span === 1 ? '' : 's'}, ${span + 1} travel day${span === 0 ? '' : 's'}` : 'The return must be on or after the departure, within 180 days'} />
      {span === 0 && <NumberField id={`${p}-h`} label="Hours in travel status (same-day trip)" value={hours} onChange={setHours} unit="h" max={24} help="More than 12 hours pays 75% of the M&IE; 12 or less pays none" />}
      {mode === 'trip' && <>
        <NumberField id={`${p}-mi`} label="Miles driven in your own car" value={miles} onChange={setMiles} unit="mi" max={20000} help="Round trip, business miles only" />
        <SelectField id={`${p}-rt`} label="Mileage rate" value={rateKind} onChange={setRateKind} options={RATE_OPTS} help={rateKind === 'custom' ? undefined : `${rate(perMile)} a mile on ${dayLabel(depart)}`} />
        {rateKind === 'custom' && <NumberField id={`${p}-cr`} label="Employer rate per mile" value={custom} onChange={setCustom} unit="$/mi" max={5} decimals={3} />}
        <NumberField id={`${p}-oth`} label="Airfare, rental car, parking, tolls" value={other} onChange={setOther} unit="$" max={100000} help="Receipts at cost" />
      </>}
      <details className="sm:col-span-2 rounded-lg border border-navy-200 px-4 py-2">
        <summary className="cursor-pointer text-sm font-semibold text-navy-800">Meals provided, room price, lodging tax</summary>
        <div className="mt-3 grid gap-x-5 gap-y-4 sm:grid-cols-3">
          <NumberField id={`${p}-mb`} label="Breakfasts on full days" value={mb} onChange={setMb} max={180} />
          <NumberField id={`${p}-ml`} label="Lunches on full days" value={ml} onChange={setMl} max={180} />
          <NumberField id={`${p}-md`} label="Dinners on full days" value={md} onChange={setMd} max={180} />
          <NumberField id={`${p}-tb`} label="Breakfasts, first and last day" value={tb} onChange={setTb} max={2} />
          <NumberField id={`${p}-tl`} label="Lunches, first and last day" value={tl} onChange={setTl} max={2} />
          <NumberField id={`${p}-td`} label="Dinners, first and last day" value={td} onChange={setTd} max={2} />
          <NumberField id={`${p}-room`} label="Room price paid per night" value={room} onChange={setRoom} unit="$" max={3000} help="0 = assume the GSA maximum" />
          <NumberField id={`${p}-tax`} label="Lodging taxes paid, whole stay" value={tax} onChange={setTax} unit="$" max={20000} help="Reimbursed apart (FTR § 301-11.16)" />
        </div>
        <p className="mt-2 text-xs text-navy-600">Meals from an airline or a free hotel breakfast are not deducted. Count only meals paid by the government or included in a conference fee.</p>
      </details>
    </>}>
      {r ? <Result label={mode === 'trip' ? 'Total reimbursement for the trip' : 'Federal per diem for the trip'} figure={usd(total)} sub={`${pick.label} · ${dayLabel(depart)} to ${dayLabel(ret)}`}>
        <SplitBar parts={[{ label: 'Lodging', value: r.lodging + tax, color: COLORS.lodging }, { label: 'M&IE', value: r.mie, color: COLORS.mie }, ...(mode === 'trip' ? [{ label: 'Mileage', value: transport, color: COLORS.miles }, { label: 'Other', value: extra, color: COLORS.other }] : [])]} />
        <Rows rows={[
          [`Lodging, ${r.nights} night${r.nights === 1 ? '' : 's'}${room ? ' (room price, capped)' : ' at the GSA maximum'}`, usd(r.lodging)],
          ...(tax ? [['Lodging taxes', usd(tax)] as [string, string]] : []),
          ['M&IE before meal deductions', money(r.mieGross)],
          ...(r.deductions ? [['Provided meals deducted', `−${money(r.deductions)}`] as [string, string]] : []),
          ['M&IE paid', money(r.mie)],
          ...(mode === 'trip' ? [[`Mileage, ${num(miles)} mi × ${rate(perMile)}`, usd(transport)] as [string, string], ['Other costs at receipt', usd(extra)] as [string, string]] : []),
          ['Total', usd(total), true],
        ]} />
        {!r.eligible && <Note>A same-day trip of 12 hours or less gives no federal M&IE (41 CFR 301-11.1(c)); many private employers follow the same rule.</Note>}
        <Note methodHref={methodHref}>{fyNote}</Note>
        <details className="mt-3">
          <summary className="cursor-pointer text-sm font-semibold text-navy-800">Day by day</summary>
          <div className="overflow-x-auto"><table className="journal mt-2 w-full text-sm">
            <thead><tr><th scope="col" className="px-2 py-1 text-left">Day</th><th scope="col" className="px-2 py-1 text-right">Lodging</th><th scope="col" className="px-2 py-1 text-right">M&IE rate</th><th scope="col" className="px-2 py-1 text-right">Share</th><th scope="col" className="px-2 py-1 text-right">Meals off</th><th scope="col" className="px-2 py-1 text-right">M&IE paid</th></tr></thead>
            <tbody>{r.days.map((d) => <tr key={d.date} className="border-b border-navy-100"><td className="px-2 py-1">{dayLabel(d.date)} <span className="text-navy-700">FY{d.fy}</span></td><td className="tabular-nums px-2 py-1 text-right">{d.lodging ? usd(d.lodging) : '–'}</td><td className="tabular-nums px-2 py-1 text-right">{usd(d.mie)}</td><td className="tabular-nums px-2 py-1 text-right">{num(d.share * 100)}%</td><td className="tabular-nums px-2 py-1 text-right">{d.deduction ? money(d.deduction) : '–'}</td><td className="tabular-nums px-2 py-1 text-right">{money(d.mieNet)}</td></tr>)}</tbody>
          </table></div>
        </details>
        <Actions />
      </Result> : <Result label="Check the dates" figure="–" sub="The return day must be on or after the departure day, at most 180 days later." />}
    </Card>
  );
}
