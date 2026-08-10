---
name: Sanctuary
colors:
  surface: '#fcf9f8'
  surface-dim: '#dcd9d9'
  surface-bright: '#fcf9f8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3f2'
  surface-container: '#f0eded'
  surface-container-high: '#eae7e7'
  surface-container-highest: '#e4e2e1'
  on-surface: '#1b1c1c'
  on-surface-variant: '#424842'
  inverse-surface: '#303030'
  inverse-on-surface: '#f3f0f0'
  outline: '#737972'
  outline-variant: '#c2c8c0'
  surface-tint: '#496550'
  primary: '#47624d'
  on-primary: '#ffffff'
  primary-container: '#5f7b65'
  on-primary-container: '#f6fff4'
  inverse-primary: '#afceb4'
  secondary: '#745b25'
  on-secondary: '#ffffff'
  secondary-container: '#ffdb99'
  on-secondary-container: '#795f29'
  tertiary: '#615b51'
  on-tertiary: '#ffffff'
  tertiary-container: '#7a7468'
  on-tertiary-container: '#fffbff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#cbead0'
  primary-fixed-dim: '#afceb4'
  on-primary-fixed: '#052010'
  on-primary-fixed-variant: '#324d39'
  secondary-fixed: '#ffdea3'
  secondary-fixed-dim: '#e4c283'
  on-secondary-fixed: '#261900'
  on-secondary-fixed-variant: '#5a430f'
  tertiary-fixed: '#eae1d3'
  tertiary-fixed-dim: '#cec5b8'
  on-tertiary-fixed: '#1f1b13'
  on-tertiary-fixed-variant: '#4b463c'
  background: '#fcf9f8'
  on-background: '#1b1c1c'
  surface-variant: '#e4e2e1'
  background-canvas: '#F9F8F5'
  glass-surface: rgba(255, 255, 255, 0.6)
  success-leaf: '#8DA18F'
  gold-glow: '#DBC49A'
typography:
  display-lg:
    fontFamily: Playfair Display
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 36px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.3'
  headline-sm:
    fontFamily: Playfair Display
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.05em
  caption:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: '1.4'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  container-max: 1200px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 40px
  unit-xs: 4px
  unit-sm: 8px
  unit-md: 16px
  unit-lg: 24px
  unit-xl: 48px
  unit-2xl: 80px
---

## Brand & Style

The design system is built for a personal growth platform that bridges the gap between spiritual intention and psychological action. The brand personality is **nurturing, luminous, and disciplined**. It avoids the cluttered, "magic-fix" aesthetic of typical manifestation sites in favor of a sophisticated, high-end wellness experience.

The chosen design style is a blend of **Minimalism** and **Glassmorphism**. It utilizes heavy whitespace and a restricted, nature-inspired palette to create a sense of mental clarity. Translucent glass layers are used specifically for navigation and overlays to evoke a sense of "airiness" and depth, while crisp typography ensures the platform feels authoritative and grounded in science.

The UI should evoke an emotional response of **composed optimism**—the feeling of a quiet, sunlit room at dawn. All visual elements are designed to reduce cognitive load, encouraging users to focus on introspection and daily commitment.

## Colors

The palette is rooted in an organic, earthy foundation. 

- **Primary (Sage Green):** Used for primary actions, progress indicators, and active states. It symbolizes growth and tranquility.
- **Secondary (Warm Gold):** Reserved for "moments of delight," achievements, and premium highlights. It represents the "light" of realized intentions.
- **Tertiary (Beige):** Used for secondary surfaces, subtle card backgrounds, and dividing elements to maintain warmth without the starkness of pure white.
- **Neutral (Dark Text):** A softened charcoal used for high legibility and grounding the lighter elements.

The background is a curated off-white (#F9F8F5) that prevents eye strain. Soft gradients should transition between Sage Green and Beige to create a sense of movement and "ambient sunlight" across the interface.

## Typography

This design system employs a classic serif-and-sans pairing to balance the spiritual and the scientific. 

**Playfair Display** is used for all headlines and display text. It brings a literary, timeless quality that suggests wisdom and prestige. It should be used with slightly tighter letter-spacing in larger formats to maintain a premium "editorial" feel.

**Inter** handles all functional and body text. Its neutral, systematic nature ensures that instructions, journals, and data-heavy dashboards remain clear and actionable.

Hierarchy is strictly enforced through size and weight; use `body-lg` for introductory paragraphs and `label-md` (uppercase) for category tags or small buttons to create a rhythmic distinction between content and UI.

## Layout & Spacing

The layout follows a **Fixed Grid** model for desktop to maintain the "sanctuary" feeling—content is contained and centered, surrounded by generous margins that act as "breathable air." 

- **Desktop:** A 12-column grid with 24px gutters. Content is typically centered in an 8-column span for readability, or utilizes the full 12 columns for dashboard views.
- **Mobile:** A single-column fluid layout with 16px side margins.

Spacing follows an 8px base unit. To achieve the minimalist aesthetic, err on the side of "over-spacing." Sections should be separated by `unit-2xl` (80px) to ensure no two concepts feel crowded. Content within cards should use `unit-lg` (24px) padding to reflect the external card radius.

## Elevation & Depth

Hierarchy is achieved through **Tonal Layers** and **Ambient Shadows** rather than high-contrast borders.

1.  **Canvas:** The base layer (#F9F8F5) is flat.
2.  **Surface:** Cards and containers use a pure white background with a very soft, diffused shadow (`0 10px 30px rgba(45, 45, 45, 0.05)`).
3.  **Floating Elements:** Global navigation and active modals use **Glassmorphism**. This includes a `backdrop-filter: blur(12px)` and a subtle 1px white border at 20% opacity to define the edge against moving background gradients.
4.  **Interaction:** On hover, cards should lift slightly using a more pronounced but still soft shadow, paired with a subtle upward translation (4px).

## Shapes

The shape language is defined by **large, soft radii**. The core intent is to eliminate sharp "aggressive" corners, reinforcing the calming brand mood.

- **Primary Cards:** 24px radius.
- **Secondary Elements (Buttons/Inputs):** 12px to 16px radius.
- **Interactive Icons:** Circular (pill-shaped) containers are used for icon buttons to provide a soft, organic touchpoint.

Images and illustrations should always respect the 24px corner radius when placed inside containers, or use organic, "blob-like" masks when floating freely.

## Components

### Buttons
- **Primary:** Sage Green background, white text. Large (16px) padding, 12px radius.
- **Secondary:** Transparent background with a 1px Sage Green or Warm Gold border.
- **Ghost:** No border or background; text-only with a subtle underline or icon.

### Cards
Cards are the primary vessel for all content. They must have a 24px corner radius, a white or Beige (#EFE6D8) background, and the "Ambient Shadow" defined in Section 5. For the **Manifestation Techniques**, cards should feature a subtle hover animation where a soft Sage Green gradient fades into the background.

### Inputs & Forms
Inputs should use the Beige (#EFE6D8) color for the background with no border in their default state. Upon focus, they transition to a white background with a 1px Sage Green border and a soft glow.

### Navigation (Glassmorphic)
The sticky navigation bar must be translucent. It acts as a lens over the content, using a heavy blur and a "Warm Gold" bottom-border (1px) at low opacity to separate it from the page.

### Progress Indicators
Progress rings and bars should use the Sage Green for the "filled" state and Tertiary Beige for the "unfilled" track. High-achievement milestones should trigger a subtle "confetti" animation using Warm Gold and Sage Green particles.

### Daily Checklists
Checkboxes should be circular rather than square. When checked, the circle fills with Sage Green and the text receives a light strike-through with 50% opacity.