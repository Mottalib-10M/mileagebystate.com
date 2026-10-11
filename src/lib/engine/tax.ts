/** Tax-side rules of travel: high-low method, transportation industry M&IE, meals limit, medical floor. */
export function highLow(o: { highNights: number; lowNights: number; high: number; low: number; mieHigh: number; mieLow: number }) {
  const total = o.highNights * o.high + o.lowNights * o.low;
  const meals = o.highNights * o.mieHigh + o.lowNights * o.mieLow;
  return { total, meals, lodgingAndIncidentals: total - meals };
}
/** Days away × special M&IE rate, deductible at 80% for workers under DOT hours-of-service limits (Pub. 463),
 *  50% otherwise. Partial days at 75% (Rev. Proc. 2019-48, 6.04(1), required for a deduction). */
export function driverMeals(o: { fullDays: number; partialDays: number; rate: number; deductibleShare: number; partialShare: number }) {
  const amount = o.fullDays * o.rate + o.partialDays * o.rate * o.partialShare;
  return { amount, deductible: amount * o.deductibleShare };
}
/** Medical miles: only the part of total medical costs above the AGI floor is deductible (Pub. 502). */
export function medicalMiles(o: { miles: number; rate: number; parkingTolls: number; otherMedical: number; agi: number; floor: number }) {
  const transport = o.miles * o.rate + o.parkingTolls;
  const total = transport + o.otherMedical;
  const threshold = o.agi * o.floor;
  return { transport, total, threshold, deductible: Math.max(0, total - threshold) };
}
/** Per diem paid by an employer against the federal rate: the excess is wages if not returned (Pub. 463). */
export function perDiemExcess(paid: number, federal: number) {
  return { taxable: Math.max(0, paid - federal), withinRate: Math.min(paid, federal) };
}
