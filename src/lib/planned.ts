/** Page ids planned for the site (CONTRIBUTING-PAGES.md). During construction, ALLOW_PLANNED=1 lets a page link
 *  to a planned page that is not written yet; the final check runs without it. */
export const PLANNED_PAGES = [
  'per-diem-rates', 'per-diem-calculator', 'meals-and-incidental-expenses', 'first-and-last-day-per-diem', 'oconus-per-diem-rates',
  'irs-mileage-rate', 'mileage-reimbursement-calculator', 'mileage-calculator', 'mileage-log', 'business-mileage-deduction', 'medical-and-charity-mileage', 'car-allowance-vs-mileage-reimbursement',
  'gas-cost-calculator', 'road-trip-cost-calculator', 'cost-per-mile-calculator', 'car-depreciation-calculator', 'ev-charging-cost-calculator', 'tesla-charging-cost', 'gas-vs-electric-car-calculator', 'cost-of-owning-a-car-calculator',
  'travel-reimbursement', 'high-low-per-diem-method', 'per-diem-for-truck-drivers',
];
export const PLANNED_STATES = ['alabama', 'arizona', 'arkansas', 'california', 'colorado', 'connecticut', 'delaware', 'district-of-columbia', 'florida', 'georgia', 'idaho', 'illinois', 'indiana', 'iowa', 'kansas', 'kentucky', 'louisiana', 'maine', 'maryland', 'massachusetts', 'michigan', 'minnesota', 'mississippi', 'missouri', 'montana', 'nebraska', 'nevada', 'new-hampshire', 'new-jersey', 'new-mexico', 'new-york', 'north-carolina', 'north-dakota', 'ohio', 'oklahoma', 'oregon', 'pennsylvania', 'rhode-island', 'south-carolina', 'south-dakota', 'tennessee', 'texas', 'utah', 'vermont', 'virginia', 'washington', 'west-virginia', 'wisconsin', 'wyoming'];
export const PLANNED_IDS = new Set([...PLANNED_PAGES, ...PLANNED_STATES.map((s) => `state:${s}`), 'home', 'method', 'about']);
