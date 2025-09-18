interface RoomTokenState {
  token: string;
  wsUrl: string;
}

const STORAGE_KEY = 'ttt-room-tokens';

const getStore = (): Record<string, RoomTokenState> => {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as Record<string, RoomTokenState>;
  } catch (error) {
    console.error('Failed to parse room token store', error);
    return {};
  }
};

const writeStore = (store: Record<string, RoomTokenState>) => {
  if (typeof window === 'undefined') return;
  window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(store));
};

export const saveRoomToken = (roomId: string, state: RoomTokenState) => {
  const store = getStore();
  store[roomId] = state;
  writeStore(store);
};

export const getRoomToken = (roomId: string): RoomTokenState | undefined => {
  const store = getStore();
  return store[roomId];
};

export const listRoomTokens = (): Record<string, RoomTokenState> => getStore();

export const clearRoomToken = (roomId: string) => {
  const store = getStore();
  delete store[roomId];
  writeStore(store);
};
