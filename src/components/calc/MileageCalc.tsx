/**
 * Mileage at the IRS rates of 2026 (72.5 cents to June 30, 76 cents from July 1, Announcement 2026-11).
 * mode "rate": one trip, purpose and date; "reimb": an employer's rate against the IRS rate, miles on each
 * side of July 1; "odometer": miles from odometer readings or a commute pattern, valued at the rate.
 */
import { useEffect, useState } from 'react';
import NumberField from '../ui/NumberField';
import SelectField from '../ui/SelectField';
import Toggle from '../ui/Toggle';
import PARAMS from '../../data/params-2026.json';
import { irsRate, splitValue, reimbursement, type Purpose } from '../../lib/engine/mileage';
import { readParams, num as pnum, str as pstr, updateURL } from '../../lib/url-state';
import { Card, DateField, Result, Rows, Note, Actions, usd, num, rate } from './parts';

const PURPOSES = [{ value: 'business', label: 'Business' }, { value: 'medical', label: 'Medical' }, { value: 'moving', label: 'Military move' }, { value: 'charity', label: 'Charity' }];
const safeRate = (d: string, p: Purpose) => { try { return irsRate(PARAMS.mileage.irs, d, p); } catch { return irsRate(PARAMS.mileage.irs, '2026-12-31', p); } };
interface Props { mode: 'rate' | 'reimb' | 'odometer'; methodHref: string; idPrefix?: string; purpose?: Purpose }

export default function MileageCalc({ mode, methodHref, idPrefix = 'mi', purpose: p0 = 'business' }: Props) {
  const p = idPrefix;
  const [date, setDate] = useState('2026-10-01');
  const [purpose, setPurpose] = useState<string>(p0);
  const [miles, setMiles] = useState(mode === 'rate' ? 120 : 0);
  const [before, setBefore] = useState(3200);
  const [after, setAfter] = useState(3800);
  const [empRate, setEmpRate] = useState(0.725);
  const [src, setSrc] = useState('odo');
  const [odoA, setOdoA] = useState(48210); const [odoB, setOdoB] = useState(48562);
  const [oneWay, setOneWay] = useState(18); const [perWeek, setPerWeek] = useState(3); const [weeks, setWeeks] = useState(48);
  const [parking, setParking] = useState(0);
  useEffect(() => {
    const u = readParams(window.location.search);
    setDate(pstr(u, 'd', new Date().toISOString().slice(0, 10) > '2026-12-31' ? '2026-12-31' : new Date().toISOString().slice(0, 10)));
    setPurpose(pstr(u, 'p', p0)); setMiles(pnum(u, 'm', mode === 'rate' ? 120 : 0)); setBefore(pnum(u, 'b', 3200)); setAfter(pnum(u, 'a', 3800)); setEmpRate(pnum(u, 'er', 0.725));
    setSrc(pstr(u, 's', 'odo')); setOdoA(pnum(u, 'o1', 48210)); setOdoB(pnum(u, 'o2', 48562)); setOneWay(pnum(u, 'ow', 18)); setPerWeek(pnum(u, 'pw', 3)); setWeeks(pnum(u, 'wk', 48)); setParking(pnum(u, 'pk', 0));
  }, []);
  useEffect(() => { updateURL({ d: date, p: purpose, m: miles, b: before, a: after, er: empRate, s: src, o1: odoA, o2: odoB, ow: oneWay, pw: perWeek, wk: weeks, pk: parking }); }, [date, purpose, miles, before, after, empRate, src, odoA, odoB, oneWay, perWeek, weeks, parking]);

  if (mode === 'reimb') {
    const s = splitValue(PARAMS.mileage.irs, before, after, 'business');
    const paid = (before + after) * empRate;
    const r = reimbursement(before + after, empRate, s.total / Math.max(1, before + after));
    return (
      <Card form={<>
        <NumberField id={`${p}-b`} label="Business miles, Jan. 1 to June 30, 2026" value={before} onChange={setBefore} unit="mi" max={200000} help={`IRS rate ${rate(s.rateBefore)}`} />
        <NumberField id={`${p}-a`} label="Business miles, July 1 to Dec. 31, 2026" value={after} onChange={setAfter} unit="mi" max={200000} help={`IRS rate ${rate(s.rateAfter)}`} />
        <NumberField id={`${p}-er`} label="What your employer pays per mile" value={empRate} onChange={setEmpRate} unit="$/mi" max={5} decimals={3} help="Use 0 if nothing is paid" />
        <NumberField id={`${p}-pk`} label="Business parking and tolls" value={parking} onChange={setParking} unit="$" max={100000} help="Reimbursable on top of the rate" />
      </>}>
        <Result label="Reimbursement at the IRS rates" figure={usd(s.total + parking)} sub={`${num(before + after)} miles · ${rate(s.rateBefore)} then ${rate(s.rateAfter)}`}>
          <Rows rows={[[`First half: ${num(before)} mi × ${rate(s.rateBefore)}`, usd(s.before)], [`Second half: ${num(after)} mi × ${rate(s.rateAfter)}`, usd(s.after)], ['Parking and tolls', usd(parking)], [`Your employer pays ${rate(empRate)} a mile`, usd(paid + parking)],
            [r.taxableExcess > 0 ? 'Part above the IRS rates (wages unless returned)' : 'Gap below the IRS rates (not deductible by an employee)', usd(r.taxableExcess > 0 ? r.taxableExcess : r.shortfall), true]]} />
          <Note methodHref={methodHref}>Under an accountable plan the IRS rates are the most an employer can pay tax free without receipts for actual costs; the rate in force on the day of the drive applies.</Note>
          <Actions />
        </Result>
      </Card>
    );
  }
  const totalMiles = mode === 'odometer' ? (src === 'odo' ? Math.max(0, odoB - odoA) : oneWay * 2 * perWeek * weeks) : miles;
  const r1 = safeRate(date, purpose as Purpose);
  const value = totalMiles * r1 + parking;
  return (
    <Card form={<>
      {mode === 'odometer' && <Toggle id={`${p}-s`} label="Count the miles from" value={src} onChange={setSrc} options={[{ value: 'odo', label: 'Odometer' }, { value: 'pattern', label: 'Weekly trips' }]} />}
      {mode === 'odometer' && src === 'odo' && <><NumberField id={`${p}-o1`} label="Odometer at the start" value={odoA} onChange={setOdoA} unit="mi" max={999999} /><NumberField id={`${p}-o2`} label="Odometer at the end" value={odoB} onChange={setOdoB} unit="mi" max={999999} help={odoB < odoA ? 'The end reading must be higher' : undefined} /></>}
      {mode === 'odometer' && src === 'pattern' && <><NumberField id={`${p}-ow`} label="One-way distance to the work site" value={oneWay} onChange={setOneWay} unit="mi" max={2000} help="Not your regular commute: home to your usual office is personal" /><NumberField id={`${p}-pw`} label="Round trips per week" value={perWeek} onChange={setPerWeek} max={50} /><NumberField id={`${p}-wk`} label="Weeks" value={weeks} onChange={setWeeks} max={52} /></>}
      {mode === 'rate' && <NumberField id={`${p}-m`} label="Miles driven" value={miles} onChange={setMiles} unit="mi" max={200000} />}
      <SelectField id={`${p}-p`} label="Purpose" value={purpose} onChange={setPurpose} options={PURPOSES} />
      <DateField id={`${p}-d`} label="Date driven" value={date} onChange={setDate} min="2025-01-01" max="2026-12-31" help={`IRS rate that day: ${rate(r1)} a mile`} />
      <NumberField id={`${p}-pk`} label="Parking and tolls" value={parking} onChange={setParking} unit="$" max={100000} />
    </>}>
      <Result label={`${PURPOSES.find((x) => x.value === purpose)?.label} mileage value`} figure={usd(value)} sub={`${num(totalMiles)} miles × ${rate(r1)} + ${usd(parking)} parking and tolls`}>
        <Rows rows={PARAMS.mileage.irs.slice(0, 2).map((x) => [`Same miles at the rate of ${x.from.slice(5) === '07-01' ? 'July 1 to Dec. 31, 2026' : 'Jan. 1 to June 30, 2026'}`, usd(totalMiles * (x as Record<string, number | string>)[purpose] as number)] as [string, string])} />
        <Note methodHref={methodHref}>{purpose === 'charity' ? 'The charity rate is fixed by law (26 U.S.C. 170(i)) and did not change on July 1.' : purpose === 'medical' ? 'Medical miles only count in the part of your medical costs above 7.5% of your AGI, and only if you itemize.' : 'Rates from IRS Notice 2026-10 and Announcement 2026-11.'}</Note>
        <Actions />
      </Result>
    </Card>
  );
}
