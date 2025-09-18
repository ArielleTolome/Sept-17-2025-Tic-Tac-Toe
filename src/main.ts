/*
  Entry that auto-attaches enhancer at document load.
*/
import { attachEnhancer } from './module/index'

(() => {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => attachEnhancer())
  } else {
    attachEnhancer()
  }
})()

export { attachEnhancer }
