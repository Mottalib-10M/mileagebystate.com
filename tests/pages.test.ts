/**
 * Every page file is checked before it reaches the build (CONTRIBUTING-PAGES.md): snippet lengths,
 * answer block, FAQ length and uniqueness, links, sources, banned phrases, prose length.
 * Some pages only: PAGE_FILES=state:texas,irs-mileage-rate npx vitest run tests/pages.test.ts
 */
import { describe, it, expect } from 'vitest';
import { PAGES, STATE_PAGES, stateId } from '../src/lib/pages';
import { HOME } from '../src/content/home';
import { helpers, SOURCES } from '../src/lib/helpers';
import { MINIS } from '../src/lib/mini-specs';
import { ROUTES } from '../src/i18n/routes';
import { stateRef, T } from '../src/lib/data';
import { PLANNED_IDS, PLANNED_PAGES, PLANNED_STATES } from '../src/lib/planned';

const only = (process.env.PAGE_FILES ?? '').split(',').filter(Boolean);
const pages = only.length ? PAGES.filter((p) => only.includes(p.id)) : PAGES;
const states = only.length ? STATE_PAGES.filter((p) => only.includes(stateId(p.slug))) : STATE_PAGES;
const words = (s: string) => s.replace(/<!--[\s\S]*?-->/g, ' ').replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
const BANNED = [/—/, /–/, /&mdash;/, /&ndash;/, /it[’']s important to note/i, /dive into/i, /whether you[’']re/i, /in today[’']s world/i, /\bMoreover\b/, /\bAdditionally\b/, /\bFurthermore\b/, /navigat(e|ing) the/i, /\bdelve\b/i, /taxineo/i, /\bINSEAD\b/, /\bMines\b/, /linkedin/i, /\bgame[- ]changer\b/i, /\bunlock\b/i];
const allQ = [...HOME.faqs.map((f) => f.q), ...PAGES.flatMap((p) => p.faqs.map((f) => f.q)), ...STATE_PAGES.flatMap((p) => p.faqs.map((f) => f.q))];
const allTitles = [HOME.title, ...PAGES.map((p) => p.title), ...STATE_PAGES.map((p) => p.title)];
const allDesc = [HOME.description, ...PAGES.map((p) => p.description), ...STATE_PAGES.map((p) => p.description)];
const ids = new Set([...ROUTES.map((r) => r.id), ...(process.env.ALLOW_PLANNED ? PLANNED_IDS : [])]);
const h = helpers();
const snippet = (title: string, description: string) => {
  expect(title.length, title).toBeGreaterThanOrEqual(50); expect(title.length, title).toBeLessThanOrEqual(60);
  expect(description.length, description).toBeGreaterThanOrEqual(150); expect(description.length, description).toBeLessThanOrEqual(160);
  expect(title).toMatch(/2026/); expect(description).toMatch(/2026/);
  expect(title, 'key term first, never a tool word, a question or the country (RECETTE §11)').not.toMatch(/^(calculator|calculate|how|what|when|why|is|about|faq|methodology|us |usa|u\.s\.|united states|american)\b/i);
  expect(allTitles.filter((t) => t === title).length, title).toBe(1);
  expect(allDesc.filter((t) => t === description).length, description).toBe(1);
};
const faqCheck = (faqs: Array<{ q: string; a: string }>, min: number, max: number) => {
  expect(faqs.length).toBeGreaterThanOrEqual(min); expect(faqs.length).toBeLessThanOrEqual(max);
  for (const f of faqs) {
    const n = words(f.a); expect(n, f.q).toBeGreaterThanOrEqual(42); expect(n, f.q).toBeLessThanOrEqual(88);
    expect(allQ.filter((q) => q === f.q).length, f.q).toBe(1);
  }
};
const clean = (text: string) => {
  for (const b of BANNED) expect(text, String(b)).not.toMatch(b);
  expect(text).not.toMatch(/NaN|undefined|\[object|Infinity|null\b/);
};
const minis = (html: string) => { for (const m of html.matchAll(/<!--mini:([A-Za-z0-9_-]+)(?:\|([A-Za-z0-9+/=]+))?-->/g)) { expect(MINIS[m[1]], m[1]).toBeTruthy(); const arg = m[2] ? Buffer.from(m[2], 'base64').toString('utf8') : undefined; const spec = MINIS[m[1]](arg); const out = spec.run(Object.fromEntries(spec.inputs.map((i) => [i.id, i.def]))); expect(out.head[1], m[1]).not.toMatch(/NaN|undefined/); } };

describe('home', () => {
  it('snippets, answer block, FAQ, sections', () => {
    snippet(HOME.title, HOME.description);
    expect(words(HOME.resume)).toBeGreaterThanOrEqual(120);
    faqCheck(HOME.faqs, 6, 8);
    const secs = HOME.sections(h);
    expect(secs.length).toBeGreaterThanOrEqual(5);
    clean([HOME.resume, HOME.intro, ...HOME.today(h).flatMap((p) => [p.label, p.figure, p.note]), ...HOME.timeline(h).map((t) => t.text), ...secs.map((s) => s.title + s.html), ...HOME.faqs.flatMap((f) => [f.q, f.a])].join(' '));
    for (const k of HOME.sources) expect(SOURCES[k], k).toBeTruthy();
  });
});

describe.each(pages.map((p) => [p.id, p] as const))('page %s', (_id, p) => {
  it('snippets (RECETTE §11)', () => { snippet(p.title, p.description); expect(p.slug).toMatch(/^[a-z0-9-]+$/); });
  it('answer block of 120 words or more (RECETTE §21)', () => expect(words(p.resume)).toBeGreaterThanOrEqual(120));
  it('FAQ: 4 to 8, unique, 42 to 88 words (RECETTE §7)', () => faqCheck(p.faqs, 4, 8));
  it('links and sources', () => {
    expect(() => p.body(h)).not.toThrow();
    for (const r of p.related) expect(ids.has(r), `related ${r}`).toBe(true);
    expect(p.related.length).toBeGreaterThanOrEqual(3);
    expect(p.sources.length).toBeGreaterThanOrEqual(3);
    for (const s of p.sources) expect(!!SOURCES[s], s).toBe(true);
    minis(p.body(h));
  });
  it('no banned phrase, no dash', () => clean([p.title, p.description, p.h1, p.intro, p.resume, p.card, ...p.faqs.flatMap((f) => [f.q, f.a]), p.body(h)].join(' ')));
  it('body: 450+ words of prose outside tables (tool page, RECETTE §9)', () => {
    expect(words(p.body(h).replace(/<table[\s\S]*?<\/table>/g, ''))).toBeGreaterThanOrEqual(450);
  });
});

describe.each(states.map((p) => [stateId(p.slug), p] as const))('state page %s', (_s, p) => {
  const name = stateRef(p.slug).name;
  it('snippets (RECETTE §11)', () => { snippet(p.title, p.description); expect(p.title.startsWith('Per Diem'), 'title starts with the key term').toBe(true); expect(p.title.includes(name) || p.title.includes(stateRef(p.slug).abbr), 'title names the state').toBe(true); });
  it('answer block of 120 words or more (RECETTE §21)', () => expect(words(p.resume)).toBeGreaterThanOrEqual(120));
  it('FAQ: 3 to 5, unique, 42 to 88 words, state named', () => { faqCheck(p.faqs, 3, 5); for (const f of p.faqs) expect(f.q.includes(name) || f.q.includes(stateRef(p.slug).abbr), f.q).toBe(true); });
  it('prose: 300+ words written for this state, related pages exist', () => {
    expect(words(p.body(h).replace(/<table[\s\S]*?<\/table>/g, ''))).toBeGreaterThanOrEqual(300);
    if (p.dest) expect(T.dest.some((d) => d.st === stateRef(p.slug).abbr && d.name === p.dest), `dest ${p.dest}`).toBe(true);
    expect(p.related.length).toBeGreaterThanOrEqual(3);
    for (const r of p.related) expect(ids.has(r), `related ${r}`).toBe(true);
    minis(p.body(h));
  });
  it('no banned phrase, no dash', () => clean([p.title, p.description, p.intro, p.resume, ...p.faqs.flatMap((f) => [f.q, f.a]), p.body(h)].join(' ')));
});

it('slugs are unique', () => { const s = [...PAGES.map((p) => p.slug), ...STATE_PAGES.map((p) => `state/${p.slug}`)]; expect(new Set(s).size).toBe(s.length); });

it('every planned page exists (final check, without ALLOW_PLANNED)', () => { if (process.env.ALLOW_PLANNED || only.length) return; for (const id of PLANNED_PAGES) expect(PAGES.some((p) => p.id === id), id).toBe(true); for (const s of PLANNED_STATES) expect(STATE_PAGES.some((p) => p.slug === s), s).toBe(true); });
