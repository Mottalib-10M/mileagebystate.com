/**
 * Charging cost with the EPA kWh per 100 miles of each model (charging losses included) and the EIA
 * residential price of your state. mode "tesla": cost of a full charge for each Tesla model; "compare":
 * a gasoline car against an EV over a year.
 */
import { useEffect, useState } from 'react';
import NumberField from '../ui/NumberField';
import SelectField from '../ui/SelectField';
import ENERGY from '../../data/energy.json';
import VEH from '../../data/vehicles.json';
import PARAMS from '../../data/params-2026.json';
import { evBlend, fuelTrip } from '../../lib/engine/vehicle';
import { readParams, num as pnum, str as pstr, updateURL } from '../../lib/url-state';
import { Card, Result, Rows, Note, Actions, usd, num, rate } from './parts';

const STATES = [...ENERGY.states].sort((a, b) => a.name.localeCompare(b.name));
interface Props { mode?: 'ev' | 'tesla' | 'compare'; state?: string; methodHref: string; idPrefix?: string }

export default function EvCalc({ mode = 'ev', state = 'california', methodHref, idPrefix = 'ev' }: Props) {
  const p = idPrefix;
  const list = mode === 'tesla' ? VEH.ev.filter((e) => e.make === 'Tesla') : VEH.ev;
  const def = list.find((e) => e.label.includes('Model Y Long Range AWD'))?.id ?? list[0].id;
  const [st, setSt] = useState(state);
  const [model, setModel] = useState(def);
  const [miles, setMiles] = useState(mode === 'compare' ? 12000 : 1000);
  const [home, setHome] = useState(0);
  const [pub, setPub] = useState(0);
  const [pubPrice, setPubPrice] = useState(0);
  const [mpg, setMpg] = useState(30);
  const [gas, setGas] = useState(0);
  useEffect(() => {
    const u = readParams(window.location.search);
    setSt(pstr(u, 'st', state)); setModel(pstr(u, 'v', def)); setMiles(pnum(u, 'mi', mode === 'compare' ? 12000 : 1000)); setHome(pnum(u, 'hp', 0)); setPub(pnum(u, 'ps', 0)); setPubPrice(pnum(u, 'pp', 0)); setMpg(pnum(u, 'mpg', 30)); setGas(pnum(u, 'g', 0));
  }, []);
  useEffect(() => { updateURL({ st, v: model, mi: miles, hp: home || undefined, ps: pub || undefined, pp: pubPrice || undefined, mpg: mode === 'compare' ? mpg : undefined, g: gas || undefined }); }, [st, model, miles, home, pub, pubPrice, mpg, gas]);
  const S = STATES.find((s) => s.slug === st) ?? STATES[0];
  const v = list.find((e) => e.id === model) ?? list[0];
  const cents = home > 0 ? home : S.elecCents;
  const share = Math.min(100, pub) / 100;
  const r = evBlend(miles, v.kwh100, cents, pubPrice > 0 ? pubPrice : cents, pubPrice > 0 ? share : 0);
  const full = evBlend(v.range, v.kwh100, cents, cents, 0);
  const g = fuelTrip(miles, mpg, gas > 0 ? gas : S.gas);
  return (
    <Card cols={3} form={<>
      <SelectField id={`${p}-v`} label={mode === 'tesla' ? 'Tesla model (EPA)' : 'Electric vehicle (EPA)'} value={model} onChange={setModel} options={list.map((e) => ({ value: e.id, label: `${e.label}: ${num(e.kwh100, 1)} kWh/100 mi` }))} />
      <SelectField id={`${p}-st`} label="State" value={st} onChange={setSt} options={STATES.map((s) => ({ value: s.slug, label: s.name }))} help={`EIA residential, ${ENERGY.elecPeriod.replace(/^.*Year-to-Date through /i, 'Jan. to ').replace(/ and 2025.*$/, '')}: ${num(S.elecCents, 2)}¢/kWh`} />
      <NumberField id={`${p}-mi`} label={mode === 'compare' ? 'Miles per year' : 'Miles to drive'} value={miles} onChange={setMiles} unit="mi" max={200000} />
      <NumberField id={`${p}-hp`} label="Your home price (optional)" value={home} onChange={setHome} unit="¢/kWh" max={200} decimals={2} help="From your bill: total ÷ kWh" />
      {mode !== 'compare' && <><NumberField id={`${p}-ps`} label="Share charged in public" value={pub} onChange={setPub} unit="%" max={100} /><NumberField id={`${p}-pp`} label="Public charger price" value={pubPrice} onChange={setPubPrice} unit="¢/kWh" max={200} decimals={2} help="As posted on the charger or app" /></>}
      {mode === 'compare' && <><NumberField id={`${p}-mpg`} label="Gasoline car MPG" value={mpg} onChange={setMpg} unit="mpg" max={150} decimals={1} /><NumberField id={`${p}-g`} label="Gas price (optional)" value={gas} onChange={setGas} unit="$/gal" max={20} decimals={2} help={`EIA week of ${ENERGY.gasWeek}: ${rate(S.gas)}`} /></>}
    </>}>
      {mode === 'compare'
        ? <Result label="Yearly energy saving with the EV" figure={usd(g.cost - r.cost)} sub={`${usd(r.cost)} of electricity against ${usd(g.cost)} of gasoline`}>
            <Rows rows={[['EV cost per mile', rate(r.perMile)], ['Gasoline cost per mile', rate(g.perMile)], ['Five years at this mileage', usd((g.cost - r.cost) * 5)]]} />
            <Note methodHref={methodHref}>Energy only: purchase price, insurance and maintenance are in the cost of ownership calculator.</Note><Actions />
          </Result>
        : <Result label={mode === 'tesla' ? `Full charge of a ${v.label}` : `Charging cost for ${num(miles)} miles`} figure={usd(mode === 'tesla' ? full.cost : r.cost, 2)} sub={mode === 'tesla' ? `${num(v.range)} miles of EPA range · ${num(full.kwh, 1)} kWh from the wall at ${num(cents, 2)}¢` : `${num(r.kwh)} kWh · ${rate(r.perMile)} a mile`}>
            <Rows rows={[...(mode === 'tesla' ? [[`${num(miles)} miles`, usd(r.cost, 2)] as [string, string]] : [[`Full EPA range (${num(v.range)} mi)`, usd(full.cost, 2)] as [string, string]]), ['Per 100 miles', usd(r.perMile * 100, 2)], ['Home part', usd(r.home, 2)], ['Public part', usd(r.public, 2)], ['Same miles at the IRS business rate', usd(miles * PARAMS.mileage.irs[0].business, 2)]]} />
            <Note methodHref={methodHref}>EPA kWh/100 mi counts the energy drawn from the outlet, charging losses included. A full charge here means the EPA range from empty, a slight overstatement of a real 10 to 90% session.</Note><Actions />
          </Result>}
    </Card>
  );
}
