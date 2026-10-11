/** Engine checks on official reference values (GSA tables, FTR examples, IRS notices). */
import { describe, it, expect } from 'vitest';
import { KIT as K } from '../src/lib/kit';
import { T, P, destIndex } from '../src/lib/data';
import { fiscalYear, fiscalMonth } from '../src/lib/engine/dates';
import { highLow, driverMeals, medicalMiles, perDiemExcess } from '../src/lib/engine/tax';
import { fuelTrip, evTrip, costPerMile, depreciate, allowanceVsMileage, ownership, evBlend } from '../src/lib/engine/vehicle';
import { basisReduction } from '../src/lib/engine/mileage';

describe('fiscal year', () => {
  it('October 1 starts the next fiscal year', () => {
    expect(fiscalYear('2026-09-30')).toBe(2026); expect(fiscalYear('2026-10-01')).toBe(2027);
    expect(fiscalMonth('2026-10-01')).toBe(0); expect(fiscalMonth('2027-09-30')).toBe(11);
  });
});
describe('GSA tables', () => {
  it('standard CONUS rates: FY2027 $113 + $68, FY2026 $110 + $68 (GSA FY 2027 highlights)', () => {
    expect(T.standard['2027']).toEqual({ lodging: 113, mie: 68 }); expect(T.standard['2026']).toEqual({ lodging: 110, mie: 68 });
  });
  it('295 non-standard areas in FY2027, 296 in FY2026 (Allentown left)', () => {
    const n = (fy: string) => new Set(T.dest.filter((d) => d.fy[fy]).map((d) => d.name + '|' + d.counties)).size;
    expect(Math.abs(n('2027') - P.fiscalYears['2027'].nsa)).toBeLessThanOrEqual(6);
    expect(T.dest.some((d) => d.name.startsWith('Allentown') && d.fy['2026'] && !d.fy['2027'])).toBe(true);
  });
  it('first and last day amounts of the GSA breakdown: 51, 55.50, 60, 64.50, 69', () => {
    expect(P.mie.tiers.map((m) => m * P.mie.partialDayShare)).toEqual([51, 55.5, 60, 64.5, 69]);
    expect(K.tier(68)).toEqual({ breakfast: 16, lunch: 19, dinner: 28, incidentals: 5 });
    expect(K.tier(92)).toEqual({ breakfast: 23, lunch: 26, dinner: 38, incidentals: 5 });
  });
  it('the breakdown in params matches the GSA tiers of the data file', () => { for (const [m, v] of Object.entries(P.mie.breakdown)) { const t = K.tier(Number(m)); expect([t.breakfast, t.lunch, t.dinner, t.incidentals]).toEqual(v); } });
  it('seasonal lodging: Gulf Shores, AL FY2027 is $221 in June 2027 and $144 in October 2026 (GSA FY2027 file)', () => {
    const i = destIndex('AL', 'Gulf Shores');
    expect(K.rateOn(i, '2027-06-15').lodging).toBe(221); expect(K.rateOn(i, '2026-10-15').lodging).toBe(144);
  });
  it('Jackson / Pinedale, WY peaks at $441 in summer 2027', () => expect(K.rateOn(destIndex('WY', 'Jackson / Pinedale'), '2027-07-01').lodging).toBe(441));
  it('a destination missing from the fiscal year falls back to the standard rate', () => {
    const i = T.dest.findIndex((d) => d.name.startsWith('Allentown'));
    expect(K.rateOn(i, '2026-11-01')).toMatchObject({ lodging: 113, mie: 68, standard: true });
  });
});
describe('trip (FTR §§ 301-11.20, 301-11.21)', () => {
  it('4 days at $92 M&IE: 2 × $69 + 2 × $92 = $322', () => {
    const i = T.dest.findIndex((d) => d.fy['2027']?.mie === 92);
    const r = K.trip({ destIndex: i, depart: '2026-11-02', ret: '2026-11-05' });
    expect(r.mie).toBe(322); expect(r.nights).toBe(3);
  });
  it('standard CONUS, 2 nights in FY2027: 2 × $113 + 51 + 68 + 51', () => {
    const r = K.trip({ destIndex: -1, depart: '2026-10-05', ret: '2026-10-07' });
    expect(r.lodging).toBe(226); expect(r.mie).toBe(170); expect(r.total).toBe(396);
  });
  it('a trip across September 30 uses each fiscal year: $110 + $110 + $113', () => {
    const r = K.trip({ destIndex: -1, depart: '2026-09-29', ret: '2026-10-02' });
    expect(r.lodging).toBe(333); expect(r.crossesFy).toBe(true);
  });
  it('same day: 12 hours or less pays nothing, more than 12 hours pays 75%', () => {
    expect(K.trip({ destIndex: -1, depart: '2026-10-05', ret: '2026-10-05', hours: 12 }).mie).toBe(0);
    expect(K.trip({ destIndex: -1, depart: '2026-10-05', ret: '2026-10-05', hours: 13 }).mie).toBe(51);
  });
  it('a provided lunch on a full $80 day removes $22; all three meals leave the $5 incidentals', () => {
    const i = T.dest.findIndex((d) => d.fy['2027']?.mie === 80);
    const a = K.trip({ destIndex: i, depart: '2026-11-02', ret: '2026-11-04', meals: { breakfast: 0, lunch: 1, dinner: 0 } });
    expect(a.days[1].mieNet).toBe(58);
    const b = K.trip({ destIndex: i, depart: '2026-11-02', ret: '2026-11-04', meals: { breakfast: 1, lunch: 1, dinner: 1 } });
    expect(b.days[1].mieNet).toBe(5);
  });
  it('on a 75% day the full meal cost comes off the reduced amount ($60 − $33 = $27), floor $5', () => {
    const i = T.dest.findIndex((d) => d.fy['2027']?.mie === 80);
    const a = K.trip({ destIndex: i, depart: '2026-11-02', ret: '2026-11-04', mealsOnTravelDays: { breakfast: 0, lunch: 0, dinner: 1 } });
    expect(a.days[0].mieNet).toBe(27);
    const b = K.trip({ destIndex: i, depart: '2026-11-02', ret: '2026-11-04', mealsOnTravelDays: { breakfast: 2, lunch: 2, dinner: 2 } });
    expect(b.days[0].mieNet).toBe(5); expect(b.days[2].mieNet).toBe(5);
  });
  it('a room paid below the maximum is reimbursed at cost', () => {
    expect(K.trip({ destIndex: -1, depart: '2026-10-05', ret: '2026-10-07', roomCost: 99 }).lodging).toBe(198);
    expect(K.trip({ destIndex: -1, depart: '2026-10-05', ret: '2026-10-07', roomCost: 150 }).lodging).toBe(226);
  });
});
describe('mileage (Notice 2026-10, Announcement 2026-11, GSA POV)', () => {
  it('IRS rates around July 1, 2026', () => {
    expect(K.irs('2026-06-30')).toBe(0.725); expect(K.irs('2026-07-01')).toBe(0.76);
    expect(K.irs('2026-06-30', 'medical')).toBe(0.205); expect(K.irs('2026-07-01', 'medical')).toBe(0.235);
    expect(K.irs('2026-12-31', 'charity')).toBe(0.14); expect(K.irs('2025-05-01')).toBe(0.7);
  });
  it('GSA POV: $0.76 from July 1, 2026, $0.235 when a government car was available', () => {
    expect(K.pov('2026-08-01')).toBe(0.76); expect(K.pov('2026-08-01', 'govCarAvailable')).toBe(0.235); expect(K.pov('2026-03-01')).toBe(0.725);
  });
  it('GSA example: 100 miles × $0.76 = $76', () => expect(100 * K.pov('2026-10-01')).toBeCloseTo(76, 6));
  it('miles split around July 1', () => { const v = K.splitValue(1000, 1000); expect(v.total).toBeCloseTo(1485, 6); });
  it('reimbursement above the IRS rate is taxable', () => { const r = K.reimbursement(1000, 0.8, 0.76); expect(r.taxableExcess).toBeCloseTo(40, 6); });
  it('basis reduction: 35 cents a mile in 2026', () => expect(basisReduction({ '2026': 10000 }, P.mileage.depreciationCents)).toBe(3500));
});
describe('OCONUS breakdown (GSA)', () => {
  it('table up to $265, 15/25/40% above', () => {
    expect(K.oconus(265)).toMatchObject({ breakfast: 40, lunch: 66, dinner: 106, incidentals: 53 });
    expect(K.oconus(300)).toMatchObject({ breakfast: 45, lunch: 75, dinner: 120, incidentals: 60 });
    for (let m = 1; m <= 265; m++) { const o = K.oconus(m); expect(o.breakfast + o.lunch + o.dinner + o.incidentals).toBe(m); }
  });
});
describe('tax rules', () => {
  it('high-low FY2027: 3 high nights + 2 low nights', () => expect(highLow({ highNights: 3, lowNights: 2, high: 329, low: 230, mieHigh: 86, mieLow: 74 })).toEqual({ total: 1447, meals: 406, lodgingAndIncidentals: 1041 }));
  it('transportation industry: 20 full days + 2 partial at $80, 80% deductible', () => { const r = driverMeals({ fullDays: 20, partialDays: 2, rate: 80, deductibleShare: 0.8, partialShare: 0.75 }); expect(r.amount).toBe(1720); expect(r.deductible).toBeCloseTo(1376, 6); });
  it('medical miles above 7.5% of AGI', () => expect(medicalMiles({ miles: 2000, rate: 0.235, parkingTolls: 30, otherMedical: 6000, agi: 80000, floor: 0.075 }).deductible).toBeCloseTo(500, 6));
  it('per diem above the federal rate is wages', () => expect(perDiemExcess(250, 181).taxable).toBe(69));
});
describe('vehicle arithmetic', () => {
  it('fuel: 300 miles at 30 mpg and $4.20 = $42', () => expect(fuelTrip(300, 30, 4.2).cost).toBeCloseTo(42, 6));
  it('round trip doubles', () => expect(fuelTrip(150, 30, 4.2, true).cost).toBeCloseTo(42, 6));
  it('EV: 1,000 miles at 25 kWh/100 mi and 16 cents = $40', () => expect(evTrip(1000, 25, 16).cost).toBeCloseTo(40, 6));
  it('EV blend', () => expect(evBlend(1000, 25, 16, 48, 0.5).cost).toBeCloseTo(80, 6));
  it('cost per mile', () => expect(costPerMile({ milesPerYear: 10000, mpg: 25, fuelPrice: 4, maintenancePerMile: 0.1, insurance: 1500, registration: 200, depreciation: 3000, financing: 0, parkingTolls: 300 }).perMile).toBeCloseTo(0.76, 6));
  it('depreciation 15% a year over 2 years', () => expect(depreciate(40000, 0.15, 2).value).toBeCloseTo(28900, 6));
  it('allowance vs mileage', () => expect(allowanceVsMileage({ allowanceMonthly: 500, businessMilesYear: 8000, irsRate: 0.76, marginalRate: 0.22, payrollRate: 0.0765 }).allowanceNet).toBeCloseTo(4221, 6));
  it('ownership', () => expect(ownership({ years: 5, price: 30000, resaleRate: 0.15, milesPerYear: 12000, energyPerMile: 0.14, maintenancePerMile: 0.09, insurance: 1600, registration: 150, interest: 3000 }).total).toBeGreaterThan(30000));
});
describe('energy data', () => {
  it('49 jurisdictions with gas, diesel and electricity prices', () => {
    expect(K.STATE_LIST.length).toBe(49);
    for (const s of K.STATE_LIST) { expect(s.gas).toBeGreaterThan(2); expect(s.diesel).toBeGreaterThan(2); expect(s.elecCents).toBeGreaterThan(5); }
  });
  it('EIA week of October 5, 2026: U.S. regular $4.354, California $6.227', () => { expect(K.ENERGY_META.usGas).toBe(4.354); expect(K.gas('california')).toBe(6.227); expect(K.ENERGY_META.gasWeek).toBe('2026-10-05'); });
  it('EPA: 2026 Tesla Model Y Long Range AWD uses 27.5 kWh/100 mi', () => expect(K.ev('2026 Tesla Model Y Long Range AWD').kwh100).toBeCloseTo(27.5, 1));
});
