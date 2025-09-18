import { kv, K } from '../storage';
import { eventBus } from '../events/eventBus';
import { noteCosmeticOwned, noteThemeEquipped } from '../achievements/engine';

export type Cosmetic = { id: string; name: string; slot: 'board'|'piece'|'confetti'|'sound'|'background'; rarity: 'common'|'rare'|'epic'|'legendary'; price: number; icon: string; cssVar?: Record<string,string> };
export type Ownership = { id: string; at: number };
export type Equipped = { [slot in Cosmetic['slot']]?: string };

const CATALOG: Cosmetic[] = [
  { id: 'board-neon', name: 'Neon Board', slot: 'board', rarity: 'epic', price: 80, icon: '💡', cssVar: { '--ttt-accent': '#10b981' }},
  { id: 'board-royal', name: 'Royal Board', slot: 'board', rarity: 'rare', price: 60, icon: '👑', cssVar: { '--ttt-accent': '#8b5cf6' }},
  { id: 'piece-serif', name: 'Serif Pieces', slot: 'piece', rarity: 'common', price: 30, icon: 'X/O' },
  { id: 'confetti-stars', name: 'Star Confetti', slot: 'confetti', rarity: 'rare', price: 50, icon: '✨' },
  { id: 'sound-chime', name: 'Chime Pack', slot: 'sound', rarity: 'common', price: 25, icon: '🔔' },
  { id: 'bg-grid', name: 'Grid Background', slot: 'background', rarity: 'common', price: 20, icon: '🧵' },
];

let owned: Ownership[] = [];
let equipped: Equipped = {};

export async function loadCosmetics() {
  owned = await kv.get<Ownership[]>(K.INVENTORY, []);
  equipped = await kv.get<Equipped>(K.EQUIPPED, {});
}

export function getCatalog() { return CATALOG; }
export function getOwned() { return owned; }
export function getEquipped() { return equipped; }

export function buyItem(id: string) {
  if (owned.some(o => o.id === id)) return;
  owned.push({ id, at: Date.now() });
  kv.set(K.INVENTORY, owned);
  noteCosmeticOwned(owned.length);
  eventBus.emit('TOAST', { id: 'buy-'+id, text: `Purchased ${CATALOG.find(c=>c.id===id)?.name}` });
}

export function equipItem(id: string) {
  const item = CATALOG.find(c => c.id === id);
  if (!item) return;
  equipped[item.slot] = id;
  kv.set(K.EQUIPPED, equipped);
  // Apply CSS variables overlay-only
  if (item.cssVar) {
    const root = document.querySelector('.ttt-gamify-root') as HTMLElement | null;
    if (root) Object.entries(item.cssVar).forEach(([k,v]) => root.style.setProperty(k, v));
    noteThemeEquipped();
  }
}

