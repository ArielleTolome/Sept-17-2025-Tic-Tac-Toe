import React from 'react';
import { getCatalog, buyItem, getOwned, equipItem, getEquipped } from '../../../core/cosmetics/store';

export const StoreTab: React.FC = () => {
  const catalog = getCatalog();
  const owned = new Set(getOwned().map((i) => i.id));
  const equipped = getEquipped();
  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">Cosmetic Store</h2>
      <div className="grid grid-cols-auto gap-3">
        {catalog.map((c) => {
          const isOwned = owned.has(c.id);
          const isEquipped = equipped[c.slot] === c.id;
          return (
            <div key={c.id} className="panel p-3 rounded border border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded bg-white/10 grid place-items-center" aria-hidden><span>{c.icon}</span></div>
                <div>
                  <div className="font-semibold">{c.name}</div>
                  <div className="text-xs opacity-80">{c.rarity} • {c.slot}</div>
                </div>
                <div className="ml-auto tag">{c.price} ★</div>
              </div>
              <div className="mt-2 flex gap-2">
                {!isOwned ? (
                  <button className="btn btn-primary" onClick={() => buyItem(c.id)}>Buy</button>
                ) : (
                  <button className="btn btn-ghost" onClick={() => equipItem(c.id)} disabled={isEquipped}>{isEquipped ? 'Equipped' : 'Equip'}</button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

