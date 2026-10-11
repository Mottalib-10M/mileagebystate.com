/**
 * One page = ONE content file (CONTRIBUTING-PAGES.md):
 *  - a calculator page: `src/content/pages/<id>.ts` (PageDef), with its calculator (`tool`);
 *  - a state per diem page: `src/content/states/<slug>.ts` (StateDef), at /en/per-diem-rates/<slug>/.
 * Routes, menus, footer, sitemap, schemas and internal links read these files alone.
 */
import type { Kit } from './kit';

export interface FAQ { q: string; a: string }

export interface Helpers extends Kit {
  /** Internal link by page id ("irs-mileage-rate", "state:texas", "method"…). An unknown id fails the page test. */
  a: (id: string, text: string) => string;
  /** Ledger table; numbers are formatted, strings are inserted as HTML. */
  table: (headers: string[], rows: Array<Array<string | number>>, caption?: string, align?: Array<'l' | 'r'>) => string;
  /** Link to a source of params-2026.json (key), with optional text. */
  src: (key: string, text?: string) => string;
  /** Link to any official URL. */
  ext: (url: string, text: string) => string;
  /** Ruled note. */
  box: (title: string, html: string) => string;
  /** Inline mini-simulator: `<!--mini:kind|arg-->`, rendered as an island. */
  mini: (kind: string, arg?: unknown) => string;
}

export type Group = 'perdiem' | 'mileage' | 'driving' | 'rules';
export type ToolKind =
  | 'trip' | 'perdiem' | 'rates' | 'meals' | 'firstlast' | 'oconus' | 'highlow' | 'driver' | 'excess'
  | 'irs-rate' | 'reimb' | 'odometer' | 'log' | 'deduction' | 'medical' | 'allowance'
  | 'fuel' | 'roadtrip' | 'cpm' | 'depreciation' | 'tco' | 'ev' | 'tesla' | 'compare';
export interface ToolProps { state?: string; dest?: string }

export interface PageDef {
  id: string;
  group: Group;
  order: number;
  /** URL segment, lowercase and dashes, no year. */
  slug: string;
  nav: string;
  card: string;
  /** 50 to 60 characters, key term first, 2026 included (RECETTE §11). */
  title: string;
  /** 150 to 160 characters, 2026 included. */
  description: string;
  h1: string;
  intro: string;
  /** ONE paragraph of 120 words or more: the direct answer with the figures (RECETTE §21). */
  resume: string;
  faqs: FAQ[];
  body: (h: Helpers) => string;
  tool: ToolKind;
  toolProps?: ToolProps;
  related: string[];
  /** Keys of params-2026.json > sources. */
  sources: string[];
}
export const definePage = (p: PageDef): PageDef => p;

export interface StateDef {
  /** = file name = state slug. */
  slug: string;
  /** 50–60 characters, starts with "Per Diem Rates <State>" (or "<State> Per Diem" never: key term first), 2026 included. */
  title: string;
  /** 150–160 characters, 2026 included, at least one figure computed from the data. */
  description: string;
  intro: string;
  /** ONE paragraph of 120 words or more, figures computed from the data. */
  resume: string;
  /** Prose written for this state only. */
  body: (h: Helpers) => string;
  faqs: FAQ[];
  related: string[];
  /** GSA area preselected in the state's calculator (exact GSA name; default: the area with the highest lodging maximum). */
  dest?: string;
  /** Official pages read for this state (state travel office, statute). */
  extraSources?: Array<{ name: string; url: string }>;
}
export const defineState = (s: StateDef): StateDef => s;
