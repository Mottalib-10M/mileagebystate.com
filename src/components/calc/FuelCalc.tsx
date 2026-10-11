/**
 * Fuel for a trip, priced at the EIA retail average of the week for your state (or its region), with the
 * EPA combined MPG of common 2026 models. mode "roadtrip" adds nights, meals, tolls and splits the total.
 */
import { useEffect, useState } from 'react';
import NumberField from '../ui/NumberField';
import SelectField from '../ui/SelectField';
import Toggle from '../ui/Toggle';
import ENERGY from '../../data/energy.json';
import VEH from '../../data/vehicles.json';
import PARAMS from '../../data/params-2026.json';
import { fuelTrip } from '../../lib/engine/vehicle';
import { readParams, num as pnum, str as pstr, updateURL } from '../../lib/url-state';
import { Card, Result, Rows, Note, Actions, SplitBar, COLORS, usd, num, rate } from './parts';

const STATES = [...ENERGY.states].sort((a, b) => a.name.localeCompare(b.name));
const CARS = [{ value: 'own', label: 'Enter my own MPG' }, ...VEH.gas.map((v) => ({ value: v.id, label: `${v.label}: ${v.mpg} mpg` }))];
const week = new Date(`${ENERGY.gasWeek}T00:00:00Z`).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
interface Props { mode?: 'fuel' | 'roadtrip'; state?: string; methodHref: string; idPrefix?: string }

export default function FuelCalc({ mode = 'fuel', state = 'texas', methodHref, idPrefix = 'fuel' }: Props) {
  const p = idPrefix;
  const [st, setSt] = useState(state);
  const [miles, setMiles] = useState(mode === 'fuel' ? 250 : 900);
  const [round, setRound] = useState(mode === 'fuel' ? '1' : '0');
  const [car, setCar] = useState('own');
  const [mpg, setMpg] = useState(28);
  const [fuel, setFuel] = useState('gas');
  const [price, setPrice] = useState(0);
  const [people, setPeople] = useState(mode === 'fuel' ? 1 : 2);
  const [nights, setNights] = useState(3);
  const [room, setRoom] = useState(PARAMS.fiscalYears['2027'].standard.lodging);
  const [meals, setMeals] = useState(PARAMS.fiscalYears['2027'].standard.mie);
  const [tolls, setTolls] = useState(0);
  useEffect(() => {
    const u = readParams(window.location.search);
    setSt(pstr(u, 'st', state)); setMiles(pnum(u, 'mi', mode === 'fuel' ? 250 : 900)); setRound(pstr(u, 'rt', mode === 'fuel' ? '1' : '0')); setCar(pstr(u, 'car', 'own')); setMpg(pnum(u, 'mpg', 28)); setFuel(pstr(u, 'f', 'gas')); setPrice(pnum(u, 'pr', 0));
    setPeople(pnum(u, 'pp', mode === 'fuel' ? 1 : 2)); setNights(pnum(u, 'n', 3)); setRoom(pnum(u, 'room', PARAMS.fiscalYears['2027'].standard.lodging)); setMeals(pnum(u, 'meal', PARAMS.fiscalYears['2027'].standard.mie)); setTolls(pnum(u, 'toll', 0));
  }, []);
  useEffect(() => { updateURL({ st, mi: miles, rt: round, car, mpg, f: fuel, pr: price || undefined, pp: people, n: mode === 'roadtrip' ? nights : undefined, room: mode === 'roadtrip' ? room : undefined, meal: mode === 'roadtrip' ? meals : undefined, toll: tolls || undefined }); }, [st, miles, round, car, mpg, fuel, price, people, nights, room, meals, tolls]);
  const S = STATES.find((s) => s.slug === st) ?? STATES[0];
  const preset = VEH.gas.find((v) => v.id === car);
  const useMpg = preset ? preset.mpg : mpg;
  const eia = fuel === 'diesel' ? S.diesel : S.gas;
  const ppg = price > 0 ? price : eia;
  const f = fuelTrip(miles, useMpg, ppg, round === '1');
  const lodging = mode === 'roadtrip' ? nights * room * Math.ceil(people / 2) : 0;
  const food = mode === 'roadtrip' ? (nights + 1) * meals * people : 0;
  const total = f.cost + tolls + lodging + food;
  return (
    <Card cols={3} form={<>
      <NumberField id={`${p}-mi`} label={mode === 'fuel' ? 'Trip distance' : 'Total driving distance'} value={miles} onChange={setMiles} unit="mi" max={20000} />
      <Toggle id={`${p}-rt`} label="Distance is" value={round} onChange={setRound} options={[{ value: '0', label: 'Total' }, { value: '1', label: 'One way ×2' }]} />
      <SelectField id={`${p}-st`} label="Where you fill up" value={st} onChange={setSt} options={STATES.map((s) => ({ value: s.slug, label: s.name }))} help={`EIA, week of ${week}: ${rate(eia)}/gal (${fuel === 'diesel' ? S.dieselArea : S.gasArea})`} />
      <SelectField id={`${p}-car`} label="Vehicle (EPA combined MPG)" value={car} onChange={setCar} options={CARS} />
      {!preset && <NumberField id={`${p}-mpg`} label="Your MPG" value={mpg} onChange={setMpg} unit="mpg" max={150} decimals={1} />}
      <Toggle id={`${p}-f`} label="Fuel" value={fuel} onChange={setFuel} options={[{ value: 'gas', label: 'Regular' }, { value: 'diesel', label: 'Diesel' }]} />
      <NumberField id={`${p}-pr`} label="Price you pay (optional)" value={price} onChange={setPrice} unit="$/gal" max={20} decimals={2} help="Leave empty to use the EIA average" />
      <NumberField id={`${p}-pp`} label="People sharing the cost" value={people} onChange={setPeople} max={9} />
      <NumberField id={`${p}-toll`} label="Tolls and parking" value={tolls} onChange={setTolls} unit="$" max={10000} />
      {mode === 'roadtrip' && <>
        <NumberField id={`${p}-n`} label="Nights on the road" value={nights} onChange={setNights} max={90} />
        <NumberField id={`${p}-room`} label="Room per night (2 people a room)" value={room} onChange={setRoom} unit="$" max={2000} help="Default: GSA standard lodging, FY2027" />
        <NumberField id={`${p}-meal`} label="Food per person per day" value={meals} onChange={setMeals} unit="$" max={500} help="Default: federal M&IE standard rate" />
      </>}
    </>}>
      <Result label={mode === 'fuel' ? 'Fuel cost of the trip' : 'Road trip budget'} figure={usd(mode === 'fuel' ? f.cost + tolls : total)} sub={people > 1 ? `${usd((mode === 'fuel' ? f.cost + tolls : total) / people)} per person` : `${num(f.miles)} miles at ${num(useMpg, 1)} mpg`}>
        {mode === 'roadtrip' && <SplitBar parts={[{ label: 'Fuel', value: f.cost, color: COLORS.miles }, { label: 'Rooms', value: lodging, color: COLORS.lodging }, { label: 'Food', value: food, color: COLORS.mie }, { label: 'Tolls', value: tolls, color: COLORS.other }]} />}
        <Rows rows={[[`Fuel: ${num(f.gallons, 1)} gal × ${rate(ppg)}`, usd(f.cost)], ['Fuel cost per mile', rate(f.perMile)], ...(mode === 'roadtrip' ? [[`Rooms: ${nights} night${nights === 1 ? '' : 's'} × ${Math.ceil(people / 2)} room${Math.ceil(people / 2) > 1 ? 's' : ''}`, usd(lodging)] as [string, string], [`Food: ${nights + 1} days × ${people}`, usd(food)] as [string, string]] : []), ['Tolls and parking', usd(tolls)], ['Same miles at the IRS business rate', usd(f.miles * PARAMS.mileage.irs[0].business)]]} />
        <Note methodHref={methodHref}>The IRS rate also pays for wear, insurance and depreciation, so it is higher than fuel alone. Prices: EIA retail averages; states without their own EIA series use their region.</Note>
        <Actions />
      </Result>
    </Card>
  );
}
