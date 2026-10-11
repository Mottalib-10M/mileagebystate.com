/** Fuel, electricity and ownership costs of driving. Pure arithmetic on what the user enters or on EPA/EIA figures. */
export function fuelTrip(miles: number, mpg: number, pricePerGallon: number, roundTrip = false) {
  const m = roundTrip ? miles * 2 : miles;
  const gallons = mpg > 0 ? m / mpg : 0;
  return { miles: m, gallons, cost: gallons * pricePerGallon, perMile: mpg > 0 ? pricePerGallon / mpg : 0 };
}
export function evTrip(miles: number, kwhPer100: number, centsPerKwh: number) {
  const kwh = (miles * kwhPer100) / 100;
  return { kwh, cost: (kwh * centsPerKwh) / 100, perMile: (kwhPer100 / 100) * (centsPerKwh / 100) };
}
/** EV energy: home and public charging blended by share (0..1 public). */
export function evBlend(miles: number, kwhPer100: number, homeCents: number, publicCents: number, publicShare: number) {
  const kwh = (miles * kwhPer100) / 100;
  const home = kwh * (1 - publicShare) * homeCents / 100, pub = kwh * publicShare * publicCents / 100;
  return { kwh, home, public: pub, cost: home + pub, perMile: kwh > 0 ? (home + pub) / miles : 0 };
}
/** Cost per mile: running costs per mile + yearly fixed costs spread over the miles driven. */
export function costPerMile(o: { milesPerYear: number; mpg: number; fuelPrice: number; maintenancePerMile: number; insurance: number; registration: number; depreciation: number; financing: number; parkingTolls: number }) {
  const fuel = o.mpg > 0 ? o.fuelPrice / o.mpg : 0;
  const fixed = o.insurance + o.registration + o.depreciation + o.financing + o.parkingTolls;
  const perMile = o.milesPerYear > 0 ? fuel + o.maintenancePerMile + fixed / o.milesPerYear : 0;
  return { fuel, maintenance: o.maintenancePerMile, fixedPerMile: o.milesPerYear > 0 ? fixed / o.milesPerYear : 0, perMile, yearly: perMile * o.milesPerYear };
}
/** Value after n years at a constant yearly loss rate (the rate is the user's assumption). */
export function depreciate(price: number, ratePerYear: number, years: number) {
  const rows: Array<{ year: number; value: number; loss: number }> = [];
  let v = price;
  for (let y = 1; y <= years; y++) { const nv = v * (1 - ratePerYear); rows.push({ year: y, value: nv, loss: v - nv }); v = nv; }
  return { value: v, lost: price - v, rows };
}
/** Total cost of ownership over a number of years. */
export function ownership(o: { years: number; price: number; resaleRate: number; milesPerYear: number; energyPerMile: number; maintenancePerMile: number; insurance: number; registration: number; interest: number }) {
  const dep = depreciate(o.price, o.resaleRate, o.years);
  const energy = o.energyPerMile * o.milesPerYear * o.years, maint = o.maintenancePerMile * o.milesPerYear * o.years;
  const ins = o.insurance * o.years, reg = o.registration * o.years;
  const total = dep.lost + energy + maint + ins + reg + o.interest;
  return { depreciation: dep.lost, energy, maintenance: maint, insurance: ins, registration: reg, interest: o.interest, total, perMile: o.milesPerYear * o.years > 0 ? total / (o.milesPerYear * o.years) : 0, perYear: total / Math.max(1, o.years) };
}
/** Car allowance (taxable wages) against mileage reimbursed at the IRS rate (tax free under an accountable plan). */
export function allowanceVsMileage(o: { allowanceMonthly: number; businessMilesYear: number; irsRate: number; marginalRate: number; payrollRate: number }) {
  const gross = o.allowanceMonthly * 12;
  const taxes = gross * (o.marginalRate + o.payrollRate);
  const allowanceNet = gross - taxes;
  const mileage = o.businessMilesYear * o.irsRate;
  return { gross, taxes, allowanceNet, mileage, difference: mileage - allowanceNet, breakEvenMiles: o.irsRate > 0 ? allowanceNet / o.irsRate : 0 };
}
