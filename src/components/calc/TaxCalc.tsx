/**
 * Per diem rules that sit outside the trip: the M&IE of a day with provided meals ("meals"), the first and
 * last day rule over a trip ("firstlast"), the IRS high-low method ("highlow"), the transportation industry
 * rate ("driver"), medical and charity miles ("medical"), per diem paid above the federal rate ("excess")
 * and foreign or OCONUS rates entered by hand ("oconus").
 */
import { useEffect, useState } from 'react';
import NumberField from '../ui/NumberField';
import SelectField from '../ui/SelectField';
import Toggle from '../ui/Toggle';
import PARAMS from '../../data/params-2026.json';
import PERDIEM from '../../data/perdiem.json';
import OCONUS from '../../data/oconus-mie.json';
import { highLow, driverMeals, medicalMiles, perDiemExcess } from '../../lib/engine/tax';
import { oconusSplit, flatTrip } from '../../lib/engine/perdiem';
import { readParams, num as pnum, str as pstr, updateURL } from '../../lib/url-state';
import { Card, Result, Rows, Note, Actions, usd, num, rate } from './parts';

type Mode = 'meals' | 'firstlast' | 'highlow' | 'driver' | 'medical' | 'excess' | 'oconus';
interface Props { mode: Mode; methodHref: string; idPrefix?: string }
const TIERS = PERDIEM.tiers as Record<string, { breakfast: number; lunch: number; dinner: number; incidentals: number }>;
const SHARE = PARAMS.mie.partialDayShare;
const DEF: Record<string, number> = { tier: 74, b: 0, l: 1, d: 0, days: 4, high: 2, low: 3, full: 18, part: 2, hos: 1, oc: 0, miles: 1200, pk: 40, other: 5000, agi: 70000, paid: 250, fed: PARAMS.fiscalYears['2027'].standard.lodging + PARAMS.fiscalYears['2027'].standard.mie, nights: 4, olodge: 280, omie: 140, purpose: 0, fy: 2027 };

export default function TaxCalc({ mode, methodHref, idPrefix = 'tx' }: Props) {
  const p = idPrefix;
  const [v, setV] = useState<Record<string, number>>(DEF);
  const [day, setDay] = useState('full');
  useEffect(() => { const u = readParams(window.location.search); setV(Object.fromEntries(Object.keys(DEF).map((k) => [k, pnum(u, k, DEF[k])]))); setDay(pstr(u, 'day', 'full')); }, []);
  useEffect(() => { updateURL({ ...Object.fromEntries(Object.entries(v).filter(([k, x]) => x !== DEF[k])), day: day !== 'full' ? day : undefined }); }, [v, day]);
  const set = (k: string) => (x: number) => setV((o) => ({ ...o, [k]: x }));
  const f = (k: string, label: string, unit?: string, max = 1e7, decimals = 0, help?: string) => <NumberField key={k} id={`${p}-${k}`} label={label} value={v[k]} onChange={set(k)} unit={unit} max={max} decimals={decimals} help={help} />;
  const sel = (k: string, label: string, options: Array<{ value: string; label: string }>, help?: string) => <SelectField key={k} id={`${p}-${k}`} label={label} value={String(v[k])} onChange={(x) => set(k)(Number(x))} options={options} help={help} />;
  const tierOpts = PARAMS.mie.tiers.map((t) => ({ value: String(t), label: `$${t} M&IE` }));

  if (mode === 'meals') {
    const t = TIERS[String(v.tier)]; const share = day === 'full' ? 1 : SHARE;
    const allowed = v.tier * share; const off = Math.min(1, v.b) * t.breakfast + Math.min(1, v.l) * t.lunch + Math.min(1, v.d) * t.dinner;
    const net = Math.max(Math.min(t.incidentals, allowed), allowed - off);
    return <Card cols={3} form={<>{sel('tier', 'M&IE rate of the location', tierOpts)}<Toggle id={`${p}-day`} label="Day" value={day} onChange={setDay} options={[{ value: 'full', label: 'Full day' }, { value: 'travel', label: 'First or last' }]} />{sel('b', 'Breakfast provided?', [{ value: '0', label: 'No' }, { value: '1', label: 'Yes' }])}{sel('l', 'Lunch provided?', [{ value: '0', label: 'No' }, { value: '1', label: 'Yes' }])}{sel('d', 'Dinner provided?', [{ value: '0', label: 'No' }, { value: '1', label: 'Yes' }])}</>}>
      <Result label="M&IE for that day" figure={usd(net, 2)} sub={`${usd(v.tier)} × ${num(share * 100)}% = ${usd(allowed, 2)}, minus ${usd(allowed - net, 2)} for provided meals`}>
        <Rows rows={[['Breakfast value', usd(t.breakfast)], ['Lunch value', usd(t.lunch)], ['Dinner value', usd(t.dinner)], ['Incidental expenses (never deducted)', usd(t.incidentals)]]} />
        <Note methodHref={methodHref}>On the first and last day the full value of a provided meal comes off the 75% amount; the day never pays less than the incidentals (41 CFR 301-11.21(b)).</Note><Actions />
      </Result></Card>;
  }
  if (mode === 'firstlast') {
    const days = Math.max(1, Math.round(v.days)); const full = Math.max(0, days - 2);
    const total = days === 1 ? v.tier * SHARE : v.tier * SHARE * 2 + v.tier * full;
    return <Card cols={3} form={<>{sel('tier', 'M&IE rate', tierOpts)}{f('days', 'Calendar days in travel status', 'days', 365, 0, 'Departure and return days included')}</>}>
      <Result label="M&IE for the trip" figure={usd(total, 2)} sub={days === 1 ? `One day of more than 12 hours: 75% of ${usd(v.tier)}` : `2 travel days at ${usd(v.tier * SHARE, 2)} + ${full} full day${full === 1 ? '' : 's'} at ${usd(v.tier)}`}>
        <Rows rows={[['If every day were paid in full', usd(v.tier * days)], ['Cost of the 75% rule', usd(v.tier * days - total, 2)], ['Average per day', usd(total / days, 2)]]} />
        <Note methodHref={methodHref}>Federal rule: 41 CFR 301-11.20. For tax purposes a payor may use this rule or another method applied consistently (Rev. Proc. 2019-48, section 6.04).</Note><Actions />
      </Result></Card>;
  }
  if (mode === 'highlow') {
    const y = PARAMS.highLow[String(v.fy) as '2027'];
    const r = highLow({ highNights: v.high, lowNights: v.low, high: y.high, low: y.low, mieHigh: y.mieHigh, mieLow: y.mieLow });
    return <Card cols={3} form={<>{sel('fy', 'Period', [{ value: '2027', label: 'Oct. 1, 2026 to Sep. 30, 2027' }, { value: '2026', label: 'Oct. 1, 2025 to Sep. 30, 2026' }])}{f('high', 'Days in high-cost localities', 'days', 366)}{f('low', 'Days anywhere else in CONUS', 'days', 366)}</>}>
      <Result label="Per diem under the high-low method" figure={usd(r.total)} sub={`${usd(y.high)} high, ${usd(y.low)} low (${y.notice})`}>
        <Rows rows={[['Meal part (subject to the 50% limit)', usd(r.meals)], ['Lodging and incidentals part', usd(r.lodgingAndIncidentals)], ['Meal part deductible at 50%', usd(r.meals * PARAMS.transportation.mealsDeductible)]]} />
        <Note methodHref={methodHref}>High-cost localities are those with a federal per diem of {usd(y.threshold)} or more for the period listed in the notice. Full and partial days follow the payor's method.</Note><Actions />
      </Result></Card>;
  }
  if (mode === 'driver') {
    const rateD = v.oc ? PARAMS.transportation.oconus : PARAMS.transportation.conus;
    const share = v.hos ? PARAMS.transportation.hoursOfServiceDeductible : PARAMS.transportation.mealsDeductible;
    const r = driverMeals({ fullDays: v.full, partialDays: v.part, rate: rateD, deductibleShare: share, partialShare: SHARE });
    return <Card cols={3} form={<>{f('full', 'Full days away from home', 'days', 366)}{f('part', 'Departure and return days', 'days', 366)}{sel('oc', 'Where', [{ value: '0', label: `CONUS (${usd(PARAMS.transportation.conus)})` }, { value: '1', label: `Outside CONUS (${usd(PARAMS.transportation.oconus)})` }])}{sel('hos', 'Subject to DOT hours of service?', [{ value: '1', label: 'Yes: 80% deductible' }, { value: '0', label: 'No: 50% deductible' }])}</>}>
      <Result label="Meals and incidentals for the year" figure={usd(r.amount)} sub={`Deductible part: ${usd(r.deductible)}`}>
        <Rows rows={[[`Full days × ${usd(rateD)}`, usd(v.full * rateD)], [`Partial days × 75%`, usd(v.part * rateD * SHARE, 2)], [`Deductible share`, `${num(share * 100)}%`]]} />
        <Note methodHref={methodHref}>Special rate of Notice 2026-60 (from October 1, 2026); a deduction must prorate partial days at 75% (Rev. Proc. 2019-48, 6.04(1)). Employees get it only through an employer plan.</Note><Actions />
      </Result></Card>;
  }
  if (mode === 'medical') {
    const purpose = v.purpose ? 'charity' : 'medical';
    const r1 = PARAMS.mileage.irs[0][purpose]; const r0 = PARAMS.mileage.irs[1][purpose];
    const m = medicalMiles({ miles: v.miles, rate: r1, parkingTolls: v.pk, otherMedical: v.other, agi: v.agi, floor: PARAMS.medical.agiFloor });
    const charity = v.miles * r1 + v.pk;
    return <Card cols={3} form={<>{sel('purpose', 'Purpose', [{ value: '0', label: 'Medical care' }, { value: '1', label: 'Volunteering for a charity' }])}{f('miles', 'Miles in 2026 (after June 30)', 'mi', 100000, 0, `${rate(r1)} a mile (before July 1: ${rate(r0)})`)}{f('pk', 'Parking and tolls', '$', 100000)}{!v.purpose && <>{f('other', 'Other medical costs paid', '$', 1e6)}{f('agi', 'Adjusted gross income', '$', 1e7)}</>}</>}>
      {v.purpose ? <Result label="Charitable mileage deduction" figure={usd(charity, 2)} sub={`${num(v.miles)} miles × ${rate(r1)} + parking and tolls`}><Note methodHref={methodHref}>The charity rate is set by law at 14 cents and did not move in July. Deductible only if you itemize, with a written record of the drives.</Note><Actions /></Result>
        : <Result label="Medical costs you can deduct" figure={usd(m.deductible)} sub={`Driving ${usd(m.transport, 2)} + other ${usd(v.other)} − 7.5% of AGI (${usd(m.threshold)})`}><Rows rows={[['Medical driving', usd(m.transport, 2)], ['Total medical costs', usd(m.total)], ['Floor: 7.5% of AGI', usd(m.threshold)]]} /><Note methodHref={methodHref}>IRS Publication 502: only costs above the floor count, and only when you itemize.</Note><Actions /></Result>}
    </Card>;
  }
  if (mode === 'excess') {
    const r = perDiemExcess(v.paid * v.days, v.fed * v.days);
    return <Card cols={3} form={<>{f('paid', 'Per diem your employer pays per day', '$', 5000)}{f('fed', 'Federal per diem of the place per day', '$', 5000, 0, 'Lodging + M&IE from the rate lookup')}{f('days', 'Days', 'days', 366)}</>}>
      <Result label="Part treated as wages" figure={usd(r.taxable)} sub={`Paid ${usd(v.paid * v.days)} · federal limit ${usd(v.fed * v.days)}`}>
        <Rows rows={[['Tax-free part (deemed substantiated)', usd(r.withinRate)], ['Excess, on the W-2 unless returned', usd(r.taxable)]]} />
        <Note methodHref={methodHref}>Under an accountable plan, per diem up to the federal rate needs no receipts for amount; any excess is wages subject to withholding (IRS Publication 463).</Note><Actions />
      </Result></Card>;
  }
  // oconus
  const nights = Math.max(0, Math.round(v.nights));
  const ft = flatTrip(v.olodge, v.omie, nights, SHARE);
  const sp = oconusSplit(v.omie, OCONUS as unknown as Record<string, number[]>, PARAMS.mie.oconusSplit);
  return <Card cols={3} form={<>{f('olodge', 'Lodging rate (State Dept or DoD)', '$', 5000)}{f('omie', 'M&IE rate', '$', 2000)}{f('nights', 'Nights', 'nights', 365)}</>}>
    <Result label="Per diem for the trip" figure={usd(ft.total, 2)} sub={`${nights} nights × ${usd(v.olodge)} + M&IE with 75% on travel days`}>
      <Rows rows={[['Lodging', usd(ft.lodging)], ['M&IE', usd(ft.mie, 2)], ['Breakfast value', usd(sp.breakfast)], ['Lunch value', usd(sp.lunch)], ['Dinner value', usd(sp.dinner)], ['Incidentals', usd(sp.incidentals)]]} />
      <Note methodHref={methodHref}>{sp.fromTable ? 'Meal values from the GSA OCONUS breakdown table.' : 'Above $265: 15% breakfast, 25% lunch, 40% dinner, the rest incidentals (GSA).'} Foreign lodging rates already include taxes.</Note><Actions />
    </Result></Card>;
}
