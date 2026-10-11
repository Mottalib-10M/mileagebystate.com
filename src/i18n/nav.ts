import { route, type Locale } from './routes';
import { PAGES, pageById, statePageById, stateId, STATE_PAGES } from '../lib/pages';
import { stateRef } from '../lib/data';
import type { Group } from '../lib/page-types';
export interface NavLink { href: string; label: string } export interface NavCategory { label: string; links: NavLink[] }
const CORE: Record<string, string> = { home: 'Trip calculator', method: 'Rules and data', about: 'About', widget: 'Embed the calculator', contact: 'Contact', editorial: 'Editorial policy', privacy: 'Privacy', terms: 'Legal notice', cookies: 'Cookies' };
export const GROUPS: Array<{ id: Group; label: string }> = [
  { id: 'perdiem', label: 'Per diem' },
  { id: 'mileage', label: 'Mileage' },
  { id: 'driving', label: 'Fuel and car costs' },
  { id: 'rules', label: 'Tax rules' },
];
export const label = (id: string, _lang?: Locale) => {
  if (CORE[id]) return CORE[id];
  const p = pageById(id); if (p) return p.nav;
  const s = statePageById(id); if (s) return `Per diem in ${stateRef(s.slug).name}`;
  return id;
};
const link = (id: string, lang: Locale): NavLink => ({ href: route(id, lang), label: label(id) });
export const inGroup = (g: Group, lang: Locale): NavLink[] => PAGES.filter((p) => p.group === g).map((p) => link(p.id, lang));
export function navCategories(lang: Locale): NavCategory[] {
  return GROUPS.map((g) => ({ label: g.label, links: inGroup(g.id, lang) })).filter((c) => c.links.length);
}
export const navDirect = (lang: Locale): NavLink[] => [link('method', lang)];
export const footerColumns = (lang: Locale): NavCategory[] => [
  ...GROUPS.map((g) => ({ label: g.label, links: inGroup(g.id, lang) })).filter((c) => c.links.length),
  { label: 'This site', links: ['home', 'method', 'about', 'contact', 'editorial', 'widget', 'terms', 'privacy', 'cookies'].map((i) => link(i, lang)) },
];
/** Every state per diem page in the footer row: each is one click from anywhere (RECETTE §18.2). */
export const popularLinks = (lang: Locale): NavLink[] => STATE_PAGES.map((s) => ({ href: route(stateId(s.slug), lang), label: stateRef(s.slug).abbr }));
