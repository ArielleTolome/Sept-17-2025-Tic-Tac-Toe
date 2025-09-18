import { Discovery } from '../dom/discovery'

export type Preferences = {
  theme: 'light'|'dark'|'high-contrast'|'protanopia'|'deuteranopia'|'tritanopia'
  fontScale: number // 0.9..1.3
  reduceMotion: boolean
  ghostMarks: boolean
  sounds: boolean
  volume: number
  haptics: boolean
  tooltips: boolean
  tipsOnStart: boolean
  dyslexiaFont: boolean
}

export type State = {
  prefs: Preferences
  discovery: Discovery
  panelOpen: boolean
  shortcutsOpen: boolean
}

export type Store = {
  getState(): State
  setState(p: Partial<State>): void
  subscribe(fn: (s: State) => void): () => void
}

const KEY = 'ttt-ui-enhancer:v1'

type SafeStorage = { getItem(k: string): string | null; setItem(k: string, v: string): void }
function getSafeStorage(): SafeStorage {
  try {
    // Access can throw under opaque origins (about:blank) or sandboxed iframes
    const t = '__ttt_test__'
    window.localStorage.setItem(t, '1')
    window.localStorage.removeItem(t)
    return window.localStorage
  } catch {
    let mem: Record<string, string> = {}
    return {
      getItem: (k) => (k in mem ? mem[k] : null),
      setItem: (k, v) => { mem[k] = String(v) }
    }
  }
}
const storage = getSafeStorage()

export function initPreferences(): State {
  const stored = storage.getItem(KEY)
  const base: State = {
    prefs: {
      theme: 'dark', fontScale: 1, reduceMotion: matchMedia('(prefers-reduced-motion: reduce)').matches,
      ghostMarks: true, sounds: false, volume: 0.3, haptics: false, tooltips: true, tipsOnStart: true, dyslexiaFont: false
    },
    discovery: { board: null, cells: [], outcome: null, debug: { candidates: [], chosen: null } },
    panelOpen: false,
    shortcutsOpen: false,
  }
  if (stored) {
    try {
      const parsed = JSON.parse(stored)
      Object.assign(base.prefs, parsed.prefs || parsed) // accept old shape
    } catch {}
  }
  return base
}

export function createStore(initial: State): Store {
  let state = initial
  const subs = new Set<(s: State) => void>()
  const api: Store = {
    getState: () => state,
    setState: (p) => {
      state = { ...state, ...p, prefs: { ...state.prefs, ...(p as any).prefs } }
      persist(state.prefs)
      subs.forEach(fn => safeCall(() => fn(state)))
    },
    subscribe: (fn) => { subs.add(fn); return () => subs.delete(fn) }
  }
  // initial persist and apply tokens
  persist(state.prefs)
  applyTokens(state.prefs)
  return api
}

export function persist(prefs: Preferences) {
  storage.setItem(KEY, JSON.stringify({ prefs }))
  applyTokens(prefs)
}

function applyTokens(prefs: Preferences) {
  const root = document.documentElement
  const enhancerRoot = document.querySelector('.ttt-enhancer-root') as HTMLElement | null
  const classList = enhancerRoot?.classList
  if (!classList) return
  classList.remove('theme-light','theme-dark','theme-high-contrast','theme-protanopia','theme-deuteranopia','theme-tritanopia','font-dyslexia')
  classList.add(`theme-${prefs.theme}`)
  if (prefs.dyslexiaFont) classList.add('font-dyslexia')
  enhancerRoot!.style.setProperty('--font-scale', String(prefs.fontScale))
}

function safeCall(fn: () => void) { try { fn() } catch {} }
