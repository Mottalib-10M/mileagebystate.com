/**
 * What a car costs to run. mode "cpm": cost per mile against the IRS rate; "depreciation": value after n
 * years at your own yearly loss, plus the tax basis reduction of the standard mileage rate (35 cents a
 * mile in 2026); "tco": five-year cost of ownership; "allowance": a taxable car allowance against mileage
 * at the IRS rate; "deduction": standard mileage rate against actual expenses for a business vehicle.
 */
import { useEffect, useState } from 'react';
import NumberField from '../ui/NumberField';
import SelectField from '../ui/SelectField';
import ENERGY from '../../data/energy.json';
import PARAMS from '../../data/params-2026.json';
import { costPerMile, depreciate, ownership, allowanceVsMileage } from '../../lib/engine/vehicle';
import { readParams, num as pnum, updateURL } from '../../lib/url-state';
import { Card, Result, Rows, Note, Actions, SplitBar, COLORS, usd, num, rate } from './parts';

type Mode = 'cpm' | 'depreciation' | 'tco' | 'allowance' | 'deduction';
interface Props { mode: Mode; methodHref: string; idPrefix?: string }
const IRS = PARAMS.mileage.irs[0].business;
const IRS_H1 = PARAMS.mileage.irs[1].business;
const DEP = PARAMS.mileage.depreciationCents as Record<string, number>;
const DEF: Record<string, number> = { miles: 12000, mpg: 28, fuel: ENERGY.usGas, maint: 0.1, ins: 1800, reg: 250, dep: 3500, fin: 900, park: 300, price: 36000, rate: 15, years: 5, bizMiles: 8000, allow: 500, marg: 22, payroll: PARAMS.payroll.employeeShare * 100, bizShare: 60, actual: 9500, milesH1: 4000, interest: 3200, energy: 0.16 };

export default function CarCostCalc({ mode, methodHref, idPrefix = 'car' }: Props) {
  const p = idPrefix;
  const [v, setV] = useState<Record<string, number>>(DEF);
  useEffect(() => { const u = readParams(window.location.search); setV(Object.fromEntries(Object.keys(DEF).map((k) => [k, pnum(u, k, DEF[k])]))); }, []);
  useEffect(() => { updateURL(Object.fromEntries(Object.entries(v).filter(([k, x]) => x !== DEF[k]))); }, [v]);
  const f = (k: string, label: string, unit?: string, max = 1e7, decimals = 0, help?: string) => <NumberField key={k} id={`${p}-${k}`} label={label} value={v[k]} onChange={(x) => setV((o) => ({ ...o, [k]: x }))} unit={unit} max={max} decimals={decimals} help={help} />;

  if (mode === 'cpm') {
    const r = costPerMile({ milesPerYear: v.miles, mpg: v.mpg, fuelPrice: v.fuel, maintenancePerMile: v.maint, insurance: v.ins, registration: v.reg, depreciation: v.dep, financing: v.fin, parkingTolls: v.park });
    return <Card cols={3} form={<>{f('miles', 'Miles per year', 'mi', 200000)}{f('mpg', 'MPG', 'mpg', 150, 1)}{f('fuel', 'Fuel price', '$/gal', 20, 2, `EIA U.S. regular, week of ${ENERGY.gasWeek}`)}{f('maint', 'Maintenance and tires per mile', '$/mi', 5, 2)}{f('ins', 'Insurance per year', '$', 50000)}{f('reg', 'Registration and fees per year', '$', 10000)}{f('dep', 'Loss of value per year', '$', 100000)}{f('fin', 'Loan interest per year', '$', 100000)}{f('park', 'Parking and tolls per year', '$', 100000)}</>}>
      <Result label="Your cost per mile" figure={rate(r.perMile)} sub={`${usd(r.yearly)} a year · IRS business rate ${rate(IRS)}`}>
        <SplitBar parts={[{ label: 'Fuel', value: r.fuel, color: COLORS.miles }, { label: 'Maintenance', value: r.maintenance, color: COLORS.other }, { label: 'Fixed costs', value: r.fixedPerMile, color: COLORS.lodging }]} />
        <Rows rows={[['Fuel per mile', rate(r.fuel)], ['Maintenance per mile', rate(r.maintenance)], ['Fixed costs per mile', rate(r.fixedPerMile)], [r.perMile > IRS ? 'Above the IRS rate by' : 'Below the IRS rate by', rate(Math.abs(r.perMile - IRS)), true]]} />
        <Note methodHref={methodHref}>Fixed costs fall per mile as you drive more: that is why a low-mileage car often costs more per mile than the IRS rate.</Note><Actions />
      </Result></Card>;
  }
  if (mode === 'depreciation') {
    const d = depreciate(v.price, v.rate / 100, Math.round(v.years));
    const basis = (v.bizMiles * (DEP['2026'] ?? 0)) / 100;
    return <Card cols={3} form={<>{f('price', 'Purchase price', '$', 500000)}{f('rate', 'Yearly loss of value (your assumption)', '%', 60, 1, 'A rate you choose: no official table exists')}{f('years', 'Years kept', 'yr', 20)}{f('bizMiles', 'Business miles per year (standard rate)', 'mi', 200000)}</>}>
      <Result label={`Estimated value after ${Math.round(v.years)} years`} figure={usd(d.value)} sub={`${usd(d.lost)} lost · ${num(v.rate, 1)}% a year`}>
        <Rows rows={[...d.rows.slice(0, 6).map((r) => [`End of year ${r.year}`, usd(r.value)] as [string, string]), [`Tax basis reduction per year at ${DEP['2026']} cents a business mile (2026)`, usd(basis), true]]} />
        <Note methodHref={methodHref}>With the standard mileage rate, part of each mile counts as depreciation and lowers the car's tax basis (Notice 2026-10): {Object.entries(DEP).map(([y, c]) => `${c}¢ in ${y}`).join(', ')}.</Note><Actions />
      </Result></Card>;
  }
  if (mode === 'tco') {
    const fuelMile = v.mpg > 0 ? v.fuel / v.mpg : 0;
    const r = ownership({ years: Math.round(v.years), price: v.price, resaleRate: v.rate / 100, milesPerYear: v.miles, energyPerMile: fuelMile, maintenancePerMile: v.maint, insurance: v.ins, registration: v.reg, interest: v.interest });
    return <Card cols={3} form={<>{f('price', 'Purchase price', '$', 500000)}{f('years', 'Years kept', 'yr', 20)}{f('miles', 'Miles per year', 'mi', 200000)}{f('rate', 'Yearly loss of value (your assumption)', '%', 60, 1)}{f('mpg', 'MPG', 'mpg', 150, 1)}{f('fuel', 'Fuel price', '$/gal', 20, 2)}{f('maint', 'Maintenance per mile', '$/mi', 5, 2)}{f('ins', 'Insurance per year', '$', 50000)}{f('reg', 'Registration per year', '$', 10000)}{f('interest', 'Total loan interest', '$', 200000)}</>}>
      <Result label={`Cost of owning the car for ${Math.round(v.years)} years`} figure={usd(r.total)} sub={`${usd(r.perYear)} a year · ${rate(r.perMile)} a mile`}>
        <SplitBar parts={[{ label: 'Depreciation', value: r.depreciation, color: COLORS.lodging }, { label: 'Fuel', value: r.energy, color: COLORS.miles }, { label: 'Insurance', value: r.insurance, color: COLORS.mie }, { label: 'Other', value: r.maintenance + r.registration + r.interest, color: COLORS.other }]} />
        <Rows rows={[['Depreciation', usd(r.depreciation)], ['Fuel', usd(r.energy)], ['Maintenance and tires', usd(r.maintenance)], ['Insurance', usd(r.insurance)], ['Registration and fees', usd(r.registration)], ['Loan interest', usd(r.interest)]]} />
        <Note methodHref={methodHref}>Every input is yours; the fuel price defaults to the EIA U.S. average of the week of {ENERGY.gasWeek}.</Note><Actions />
      </Result></Card>;
  }
  if (mode === 'allowance') {
    const r = allowanceVsMileage({ allowanceMonthly: v.allow, businessMilesYear: v.bizMiles, irsRate: IRS, marginalRate: v.marg / 100, payrollRate: v.payroll / 100 });
    return <Card cols={3} form={<>{f('allow', 'Car allowance per month', '$', 10000)}{f('bizMiles', 'Business miles per year', 'mi', 200000)}{f('marg', 'Your federal + state income tax rate', '%', 60, 1)}{f('payroll', 'Social Security and Medicare', '%', 20, 2, 'Employee share: 7.65% up to the wage base')}</>}>
      <Result label={r.difference >= 0 ? 'Mileage reimbursement pays more by' : 'The allowance pays more by'} figure={usd(Math.abs(r.difference))} sub={`Allowance after tax ${usd(r.allowanceNet)} · mileage at ${rate(IRS)}: ${usd(r.mileage)} tax free`}>
        <Rows rows={[['Allowance before tax', usd(r.gross)], ['Taxes withheld on it', `−${usd(r.taxes)}`], ['Allowance you keep', usd(r.allowanceNet)], ['Mileage reimbursed (accountable plan)', usd(r.mileage)], ['Miles where both are equal', num(r.breakEvenMiles)]]} />
        <Note methodHref={methodHref}>A flat allowance without mileage records is wages (IRS Publication 15-B and 463); mileage reimbursed at or under the IRS rate with a log is not.</Note><Actions />
      </Result></Card>;
  }
  // deduction: standard rate vs actual expenses, business share
  const std = v.milesH1 * IRS_H1 + Math.max(0, v.bizMiles - v.milesH1) * IRS + v.park;
  const act = v.actual * (v.bizShare / 100) + v.park;
  return <Card cols={3} form={<>{f('bizMiles', 'Business miles in 2026', 'mi', 200000)}{f('milesH1', 'Of which before July 1', 'mi', 200000, 0, `${rate(IRS_H1)} before, ${rate(IRS)} after`)}{f('bizShare', 'Business share of all miles', '%', 100)}{f('actual', 'Actual car costs for the year', '$', 500000, 0, 'Gas, oil, repairs, insurance, registration, lease or depreciation')}{f('park', 'Business parking and tolls', '$', 100000)}</>}>
    <Result label={std >= act ? 'The standard mileage rate gives more' : 'Actual expenses give more'} figure={usd(Math.max(std, act))} sub={`Standard ${usd(std)} · actual ${usd(act)}`}>
      <Rows rows={[['Standard mileage deduction', usd(std)], [`Actual expenses × ${num(v.bizShare)}%`, usd(act)], ['Difference', usd(Math.abs(std - act)), true]]} />
      <Note methodHref={methodHref}>Self-employed people deduct on Schedule C. The standard rate must be chosen in the car's first business year to keep the option later (IR-2025-128).</Note><Actions />
    </Result></Card>;
}
