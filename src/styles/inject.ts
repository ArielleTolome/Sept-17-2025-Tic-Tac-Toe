import baseCss from './tokens.css?inline'
import themeLight from '../themes/light.css?inline'
import themeDark from '../themes/dark.css?inline'
import themeHC from '../themes/high-contrast.css?inline'
import themePro from '../themes/protanopia.css?inline'
import themeDeu from '../themes/deuteranopia.css?inline'
import themeTri from '../themes/tritanopia.css?inline'
import dyslexia from '../themes/dyslexia.css?inline'

export function ensureStyles(id: string) {
  if (document.getElementById(id)) return
  const style = document.createElement('style')
  style.id = id
  style.textContent = [baseCss, themeLight, themeDark, themeHC, themePro, themeDeu, themeTri, dyslexia].join('\n\n')
  document.head.appendChild(style)
}
