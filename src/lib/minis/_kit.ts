/**
 * Shared tools for the mini-simulators (ignored by the registry: "_" prefix).
 * RULE: a mini imports only small data (params-2026.json, the M&IE tiers); figures of an area or a state
 * arrive through `arg` (JSON written by the page with the kit).
 */
import { formatMoney, formatNumber } from '../format';
import PARAMS from '../../data/params-2026.json';
export { PARAMS };
export const usd = (x: number, d = 0) => formatMoney(x, d);
export const money = (x: number) => (Math.abs(x * 100 - Math.round(x) * 100) < 0.5 ? formatMoney(x, 0) : formatMoney(x, 2));
export const num = (x: number, d = 0) => formatNumber(x, d);
export const rate = (x: number) => (Math.round(x * 1000) % 10 ? usd(x, 3) : usd(x, 2));
export const TIERS = PARAMS.mie.breakdown as unknown as Record<string, [number, number, number, number]>;
export const yesNo = [{ value: '0', label: 'No' }, { value: '1', label: 'Yes' }];
export function parseArg<T>(arg: string | undefined, fallback: T): T {
  if (!arg) return fallback;
  try { return JSON.parse(arg) as T; } catch { return fallback; }
}
