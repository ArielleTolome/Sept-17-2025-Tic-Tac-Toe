export const now = () => Date.now();
export const startOfDay = (t = now()) => new Date(new Date(t).toDateString()).getTime();
export const isBetweenHours = (start: number, end: number, t = new Date()) => {
  const h = t.getHours();
  if (start <= end) return h >= start && h < end;
  // overnight range like 22-3
  return h >= start || h < end;
};

