import React, { useEffect, useState } from 'react';
import { useEventBus } from '../../core/events/eventBus';

type Toast = { id: string; text: string };

export const Toasts: React.FC = () => {
  const bus = useEventBus();
  const [list, setList] = useState<Toast[]>([]);

  useEffect(() => {
    const unsub = bus.on('TOAST', (t: Toast) => {
      setList((l) => [...l, t]);
      setTimeout(() => setList((l) => l.filter((x) => x.id !== t.id)), 3500);
    });
    return () => unsub();
  }, [bus]);

  return (
    <div className="toast-stack" aria-live="assertive" data-ui>
      {list.map((t) => (
        <div key={t.id} className="toast">
          {t.text}
        </div>
      ))}
    </div>
  );
};

