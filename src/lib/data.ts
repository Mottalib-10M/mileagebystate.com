/** Typed access to the data files (rebuilt by scripts/build-data.py) and to params-2026.json. Server side
 *  and tests only: calculators receive what they need as props, minis through `arg`. */
import PARAMS from '../data/params-2026.json';
import PERDIEM from '../data/perdiem.json';
import ENERGY from '../data/energy.json';
import VEHICLES from '../data/vehicles.json';
import OCONUS from '../data/oconus-mie.json';
import type { Tables, Dest } from './engine/perdiem';

export const P = PARAMS;
export const T = PERDIEM as unknown as Tables & { months: string[]; source: string };
export const OCONUS_TABLE = OCONUS as unknown as Record<string, number[]>;
export interface StateRef { abbr: string; name: string; slug: string; padd: string; gas: number; gasArea: string; diesel: number; dieselArea: string; elecCents: number }
export const STATE_LIST: StateRef[] = (ENERGY.states as StateRef[]).slice().sort((a, b) => a.name.localeCompare(b.name));
export const ENERGY_META = { gasWeek: ENERGY.gasWeek, usGas: ENERGY.usGas, usDiesel: ENERGY.usDiesel, elecPeriod: ENERGY.elecPeriod, usElecCents: ENERGY.usElecCents as number };
export const VEH = VEHICLES as { gas: Array<{ id: string; label: string; mpg: number; fuel: string }>; ev: Array<{ id: string; make: string; year: string; label: string; kwh100: number; range: number }> };
export function stateRef(slug: string): StateRef {
  const s = STATE_LIST.find((x) => x.slug === slug || x.abbr === slug);
  if (!s) throw new Error(`Unknown state ${slug}`);
  return s;
}
/** GSA lists the D.C. area under DC, MD and VA (same rates); dest records are keyed by state. */
export const destsOf = (abbr: string, fy: number): Array<{ i: number; d: Dest }> =>
  T.dest.map((d, i) => ({ i, d })).filter((x) => x.d.st === abbr && x.d.fy[String(fy)]);
export const destIndex = (abbr: string, name: string) => T.dest.findIndex((d) => d.st === abbr && d.name.toLowerCase() === name.toLowerCase());
export const CURRENT_FY = 2027;
export const PREVIOUS_FY = 2026;
import ZIPS from '../data/zips.json';
import PLACES from '../data/places.json';
/** Counts printed on the pages (server side only). */
export const ZIP_COUNT = (ZIPS as { data: string }).data.split(';').length;
export const PLACE_COUNT = (PLACES as { rows: unknown[] }).rows.length;
