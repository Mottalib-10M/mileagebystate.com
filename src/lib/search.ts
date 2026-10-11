/**
 * Destination search in the browser: GSA area names (always loaded with the rates), Census places of
 * 15,000 people or more and the GSA ZIP files (each loaded on first use, from this site, never a third party).
 * A match gives the index of the GSA destination for FY2027 and FY2026 (-1 = standard CONUS rate).
 */
import type { Dest } from './engine/perdiem';

export interface Hit { label: string; detail: string; d27: number; d26: number; key: string }
let placesP: Promise<Array<[string, string, string, number, number, number]>> | null = null;
let zipsP: Promise<Map<string, [number, number]>> | null = null;
const loadPlaces = () => (placesP ??= import('../data/places.json').then((m) => (m.default as unknown as { rows: Array<[string, string, string, number, number, number]> }).rows));
const loadZips = () => (zipsP ??= import('../data/zips.json').then((m) => {
  const map = new Map<string, [number, number]>(); let z = 0;
  for (const e of (m.default as { data: string }).data.split(';')) {
    const [dz, a, b] = e.split(','); z += parseInt(dz, 16);
    map.set(String(z).padStart(5, '0'), a === undefined ? [-1, -1] : [parseInt(a, 16) - 2, parseInt(b, 16) - 2]);
  }
  return map;
}));
const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
export const destLabel = (d: Dest) => `${d.name}, ${d.st}`;

export async function search(q: string, dest: Dest[], limit = 8): Promise<Hit[]> {
  const t = q.trim();
  if (/^\d{5}$/.test(t)) {
    const z = (await loadZips()).get(t);
    if (!z) return [];
    const [a, b] = z;
    const d = a >= 0 ? dest[a] : b >= 0 ? dest[b] : undefined;
    return [{ label: `ZIP ${t}`, detail: d ? `${destLabel(d)} (${d.counties})` : 'Standard CONUS rate', d27: a === -2 ? -1 : a, d26: b === -2 ? -1 : b, key: `z${t}` }];
  }
  const n = norm(t); if (n.length < 2) return [];
  const [qName, qSt] = n.includes(' ') && /\s[a-z]{2}$/.test(n) ? [n.slice(0, -3), n.slice(-2)] : [n, ''];
  const out: Hit[] = [];
  dest.forEach((d, i) => {
    if (qSt && d.st.toLowerCase() !== qSt) return;
    if (norm(d.name).includes(qName) || norm(d.counties).includes(qName)) out.push({ label: destLabel(d), detail: `GSA area: ${d.counties}`, d27: d.fy['2027'] ? i : -1, d26: d.fy['2026'] ? i : -1, key: `d${i}` });
  });
  const places = await loadPlaces();
  for (const [name, st, county, a, b] of places) {
    if (out.length >= limit * 3) break;
    if (qSt && st.toLowerCase() !== qSt) continue;
    if (!norm(name).startsWith(qName)) continue;
    out.push({ label: `${name}, ${st}`, detail: `${county}: ${a >= 0 ? `GSA area ${dest[a].name}` : 'standard CONUS rate'}`, d27: a, d26: b, key: `p${name}${st}` });
  }
  // Exact name starts first, then GSA areas, then places by population (already sorted).
  return out.sort((x, y) => Number(!norm(x.label).startsWith(qName)) - Number(!norm(y.label).startsWith(qName))).slice(0, limit);
}
