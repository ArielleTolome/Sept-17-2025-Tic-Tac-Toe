import { useCallback, useEffect, useState } from 'react';

const INDEX_MAP = {
  ArrowUp: -3,
  ArrowDown: 3,
  ArrowLeft: -1,
  ArrowRight: 1,
} as const;

type DirectionKey = keyof typeof INDEX_MAP;

export const useGameboardNavigation = (availableCells: number[]) => {
  const [focusedIndex, setFocusedIndex] = useState<number>(() => 4);

  useEffect(() => {
    if (!availableCells.includes(focusedIndex)) {
      setFocusedIndex((prev) => {
        const fallback = availableCells[0] ?? prev;
        return fallback ?? prev;
      });
    }
  }, [availableCells, focusedIndex]);

  const onKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLButtonElement>) => {
      const key = event.key as DirectionKey;
      if (key in INDEX_MAP) {
        event.preventDefault();
        setFocusedIndex((prev) => {
          const next = prev + INDEX_MAP[key];
          if (next < 0 || next > 8) {
            return prev;
          }
          return next;
        });
      }
    },
    [],
  );

  return { focusedIndex, setFocusedIndex, onKeyDown };
};
