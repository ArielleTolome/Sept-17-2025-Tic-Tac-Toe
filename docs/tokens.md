# Design Tokens Reference

All tokens are exposed as CSS custom properties under the `.ttt-enhancer` namespace. Themes toggle by adding classes to the enhancer root.

## Tokens
- --color-bg: Background
- --color-surface: Surface layer
- --color-text: Primary text
- --color-muted: Muted text
- --color-accent: Accent color
- --color-win: Winning line color
- --color-lose: Losing state color
- --color-draw: Draw state color
- --ring-focus: Focus ring box-shadow
- --shadow-sm/md/lg: Elevation shadows
- --radius-sm/md/lg/xl: Radii
- --space-1..8: Spacing scale
- --font-sans: Default font stack
- --font-dyslexia: Dyslexia-friendly font fallback
- --font-scale: Root font multiplier (0.9–1.3)

## Themes (classes on .ttt-enhancer-root)
- theme-light
- theme-dark
- theme-high-contrast
- theme-protanopia
- theme-deuteranopia
- theme-tritanopia
- font-dyslexia (opt-in)

## Example
```css
.ttt-enhancer .my-card {
  background: var(--color-surface);
  color: var(--color-text);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  padding: var(--space-4);
}
```

