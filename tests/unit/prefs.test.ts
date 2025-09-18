import { describe, it, expect } from 'vitest'
import { createStore, initPreferences } from '../../src/store/prefs'

describe('preferences store', () => {
  it('persists and applies tokens', () => {
    const s = createStore(initPreferences())
    s.setState({ prefs: { ...s.getState().prefs, theme: 'light', fontScale: 1.2 } })
    expect(s.getState().prefs.theme).toBe('light')
    expect(s.getState().prefs.fontScale).toBe(1.2)
  })
})
