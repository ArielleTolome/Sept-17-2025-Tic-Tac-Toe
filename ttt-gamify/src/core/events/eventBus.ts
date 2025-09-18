type Handler = (payload?: any) => void;

export type BusEvent =
  | 'SESSION_START'
  | 'GAME_START'
  | 'MOVE'
  | 'WIN'
  | 'DRAW'
  | 'ABORT'
  | 'REPLAY_VIEW'
  | 'TIME_TO_MOVE'
  | 'LEVEL_UP'
  | 'SUMMARY_UPDATED'
  | 'TOAST';

class EventBus {
  private map = new Map<BusEvent, Set<Handler>>();
  on<T = any>(evt: BusEvent, h: (payload: T) => void) {
    if (!this.map.has(evt)) this.map.set(evt, new Set());
    const set = this.map.get(evt)!;
    set.add(h as Handler);
    return () => set.delete(h as Handler);
  }
  emit<T = any>(evt: BusEvent, payload?: T) {
    const set = this.map.get(evt);
    if (!set) return;
    for (const h of set) h(payload);
  }
}

const bus = new EventBus();
export const useEventBus = () => bus;
export const eventBus = bus;

