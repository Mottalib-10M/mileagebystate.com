/** Standard mileage rates (IRS) and POV rates (GSA), chosen by the date the miles were driven. */
export interface IrsPeriod { from: string; to: string; business: number; medical: number; moving: number; charity: number }
export type Purpose = 'business' | 'medical' | 'moving' | 'charity';
export function irsRate(periods: IrsPeriod[], date: string, purpose: Purpose): number {
  const p = periods.find((x) => date >= x.from && date <= x.to);
  if (!p) throw new Error(`No IRS rate published for ${date}`);
  return p[purpose];
}
export interface PovPeriod { from: string; automobile: number; govCarAvailable: number; motorcycle: number; airplane: number }
export function povRate(periods: PovPeriod[], date: string, kind: 'automobile' | 'govCarAvailable' | 'motorcycle' | 'airplane'): number {
  const p = [...periods].sort((a, b) => b.from.localeCompare(a.from)).find((x) => date >= x.from);
  if (!p) throw new Error(`No GSA POV rate for ${date}`);
  return p[kind];
}
/** Miles split around July 1, 2026 (Announcement 2026-11): each part at its own rate. */
export function splitValue(periods: IrsPeriod[], milesBefore: number, milesAfter: number, purpose: Purpose, year = 2026) {
  const a = irsRate(periods, `${year}-03-01`, purpose), b = irsRate(periods, `${year}-09-01`, purpose);
  return { before: milesBefore * a, after: milesAfter * b, total: milesBefore * a + milesAfter * b, rateBefore: a, rateAfter: b };
}
/** Employer reimbursement under an accountable plan: what exceeds the IRS business rate is wages
 *  unless the employee returns it (Rev. Proc. 2019-46, Pub. 463). Paying less is allowed; the
 *  difference is not deductible for an employee (unreimbursed employee expenses are suspended). */
export function reimbursement(miles: number, employerRate: number, irsBusinessRate: number) {
  const paid = miles * employerRate, federal = miles * irsBusinessRate;
  return { paid, federal, taxableExcess: Math.max(0, paid - federal), shortfall: Math.max(0, federal - paid) };
}
/** Basis reduction for depreciation when the business standard mileage rate is used (Notice 2026-10). */
export function basisReduction(milesByYear: Record<string, number>, centsByYear: Record<string, number>) {
  let total = 0;
  for (const [y, m] of Object.entries(milesByYear)) { const c = centsByYear[y]; if (c === undefined) throw new Error(`No depreciation component for ${y}`); total += (m * c) / 100; }
  return total;
}
