# Resconate Brand Colors Guide

## Primary Brand Colors

### Primary Color: Indigo
- **Hex**: `#6366F1`
- **RGB**: `rgb(99, 102, 241)`
- **Usage**: Primary actions, links, highlights, main brand elements

### Secondary Color: Pink/Magenta
- **Hex**: `#EC4899`
- **RGB**: `rgb(236, 72, 153)`
- **Usage**: Secondary actions, accents, complementary elements

## Brand Gradient

The signature Resconate gradient combines both brand colors:
```css
background: linear-gradient(135deg, #6366F1 0%, #EC4899 100%);
```

**Usage**: Buttons, hero sections, brand logos, call-to-action elements

## Color Palette

### Primary Scale
- `--primary-50`: `#eef2ff` (Lightest)
- `--primary-100`: `#e0e7ff`
- `--primary-200`: `#c7d2fe`
- `--primary-300`: `#a5b4fc`
- `--primary-400`: `#818cf8`
- `--primary-500`: `#6366f1` ⭐ **Main brand color**
- `--primary-600`: `#4f46e5`
- `--primary-700`: `#4338ca`
- `--primary-800`: `#3730a3`
- `--primary-900`: `#312e81` (Darkest)

### Secondary Scale
- `--secondary-50`: `#fdf2f8` (Lightest)
- `--secondary-100`: `#fce7f3`
- `--secondary-200`: `#fbcfe8`
- `--secondary-300`: `#f9a8d4`
- `--secondary-400`: `#f472b6`
- `--secondary-500`: `#ec4899` ⭐ **Secondary brand color**
- `--secondary-600`: `#db2777`
- `--secondary-700`: `#be185d`
- `--secondary-800`: `#9f1239`
- `--secondary-900`: `#831843` (Darkest)

## CSS Variables

Use these CSS variables for consistency:

```css
/* Brand Colors */
--brand-primary: #6366f1;
--brand-primary-dark: #4f46e5;
--brand-primary-light: #818cf8;

--brand-secondary: #ec4899;
--brand-secondary-dark: #db2777;
--brand-secondary-light: #f472b6;

/* Brand Gradients */
--brand-gradient: linear-gradient(135deg, #6366F1 0%, #EC4899 100%);
--brand-gradient-hover: linear-gradient(135deg, #4f46e5 0%, #db2777 100%);
```

## Tailwind Classes

The brand colors are available as Tailwind classes:

```html
<!-- Primary Colors -->
<div class="bg-primary-500 text-white">Primary Background</div>
<div class="text-primary-500">Primary Text</div>
<div class="border-primary-500">Primary Border</div>

<!-- Secondary Colors -->
<div class="bg-secondary-500 text-white">Secondary Background</div>
<div class="text-secondary-500">Secondary Text</div>

<!-- Brand Gradient -->
<div class="bg-brand-gradient">Gradient Background</div>

<!-- Brand Utilities -->
<button class="btn-brand">Brand Button</button>
<button class="btn-brand-primary">Primary Button</button>
<button class="btn-brand-secondary">Secondary Button</button>
```

## Usage Guidelines

### ✅ DO
- Use brand gradient for primary CTAs and hero sections
- Use primary color for links and interactive elements
- Use secondary color for accents and highlights
- Use CSS variables or Tailwind classes (not hardcoded colors)
- Maintain consistent color usage across all pages

### ❌ DON'T
- Don't use hardcoded hex colors (`#6366F1`, `#EC4899`) directly
- Don't use generic colors like `blue-600`, `pink-500` - use brand colors instead
- Don't mix brand colors with unrelated color palettes
- Don't modify brand colors without approval

## Examples

### Buttons
```html
<!-- Primary Button -->
<button class="btn-primary">Click Me</button>

<!-- Secondary Button -->
<button class="btn-secondary">Secondary Action</button>

<!-- Brand Gradient Button -->
<button class="btn-brand">Brand CTA</button>
```

### Links
```html
<a href="#" class="text-primary-500 hover:text-primary-600">Link Text</a>
```

### Cards with Brand Accent
```html
<div class="card border-l-4 border-primary-500">
  <h3 class="text-primary-500">Card Title</h3>
</div>
```

## Implementation

All brand colors are defined in:
- `frontend/src/styles/brand-colors.css` - Brand color definitions
- `frontend/src/styles/main.css` - CSS variables
- `frontend/tailwind.config.js` - Tailwind configuration

---

*Last Updated: December 30, 2024*

