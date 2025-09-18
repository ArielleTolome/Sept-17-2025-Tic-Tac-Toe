import { useEffect, useState } from 'react';

export const useCountdown = (expiresAt?: number | null): number => {
  const [remaining, setRemaining] = useState(0);

  useEffect(() => {
    if (!expiresAt) {
      setRemaining(0);
      return undefined;
    }

    const update = () => {
      setRemaining(Math.max(0, expiresAt - Date.now()));
    };

    update();
    const interval = window.setInterval(update, 200);
    return () => window.clearInterval(interval);
  }, [expiresAt]);

  return remaining;
};
