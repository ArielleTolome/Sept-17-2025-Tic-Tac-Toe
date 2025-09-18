import { describe, it, expect } from 'vitest'
import { createStore, initPreferences } from '../../src/store/prefs'

describe('token switching', () => {
  it('updates root classes and font scale', () => {
    const root = document.createElement('div')
    root.className = 'ttt-enhancer-root'
    document.body.appendChild(root)
    const s = createStore(initPreferences())
    s.setState({ prefs: { ...s.getState().prefs, theme: 'high-contrast', fontScale: 1.1, dyslexiaFont: true } })
    expect(root.classList.contains('theme-high-contrast')).toBe(true)
    expect(root.classList.contains('font-dyslexia')).toBe(true)
    expect(root.style.getPropertyValue('--font-scale')).toBe('1.1')
  })
})
