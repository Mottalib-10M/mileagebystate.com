/** llms.txt (RECETTE §21), generated at build from the page registry: always in sync with the site. */
import { PAGES, STATE_PAGES, stateId } from '../lib/pages';
import { SITE_URL, LAST_UPDATED, SITE_NAMES } from '../data/site-config';
import { route } from '../i18n/routes';
import { GROUPS } from '../i18n/nav';
import { stateRef } from '../lib/data';
export function GET() {
  const lines = [
    `# ${SITE_NAMES.en}`,
    '',
    `> Federal per diem and mileage for U.S. business trips, computed in the browser: GSA lodging and M&IE rates for fiscal years 2026 and 2027 (monthly lodging maximums for every non-standard area, standard CONUS rate $113 + $68 from October 1, 2026), the Federal Travel Regulation rules of 41 CFR 301-11.20 and 301-11.21 (75% on the first and last day, provided meals deducted, $5 incidentals floor), IRS standard mileage rates (72.5 cents a mile to June 30, 2026, 76 cents from July 1, 2026), IRS high-low and transportation industry rates (Notice 2026-60), fuel prices from EIA and vehicle consumption from EPA. Search by city, county, GSA area or ZIP. Published by Radif Partners. Last updated ${LAST_UPDATED}.`,
    '',
    ...GROUPS.flatMap((g) => [`## ${g.label}`, ...PAGES.filter((p) => p.group === g.id).map((p) => `- [${p.nav}](${SITE_URL}${route(p.id, 'en')}): ${p.card}`), '']),
    '## Per diem rates by state',
    ...STATE_PAGES.map((s) => `- [${stateRef(s.slug).name}](${SITE_URL}${route(stateId(s.slug), 'en')}): ${s.intro}`),
    '',
    '## About',
    `- [Rules and data](${SITE_URL}${route('method', 'en')})`,
    `- [About](${SITE_URL}${route('about', 'en')})`,
  ];
  return new Response(lines.join('\n') + '\n', { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
