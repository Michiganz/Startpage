# Design System Document

## 1. Overview & Creative North Star
This design system is built to transform a browsing utility into a premium architectural experience. The **Creative North Star** for this system is **"The Monolith"**. Much like the ancient structures that inspired the brand, the UI is characterized by weight, precision, and an interplay of light and shadow on dark surfaces.

We break away from the "template" look by rejecting standard grid-based containment in favor of **Tonal Architecture**. Instead of using lines to separate the search bar, the "site" widgets, and navigation, we use varying depths of obsidian and emerald. The interface should feel like a single, carved object where elements emerge through lighting (primary accents) rather than being pasted on top.

## 2. Colors
The palette is rooted in a deep, nocturnal foundation with a vibrant, high-energy emerald core.

### The Foundation
*   **Surface / Background (`#131313`)**: The absolute base. All depth is built upward from here.
*   **Primary (`#63dcae`)**: Used sparingly for high-intent actions, active states, and brand signatures.
*   **Primary Container (`#1ba47a`)**: A muted version of the primary for larger surfaces that require brand presence without overwhelming the user.

### The Rules of Engagement
*   **The "No-Line" Rule:** 1px solid borders are strictly prohibited for sectioning. To separate the URL bar from the content area or the "custom" footer from the main stage, use background color shifts. For example, a search bar should be a `surface_container_high` floating on a `surface` background.
*   **Surface Hierarchy & Nesting:** Use the `surface_container` tiers (Lowest to Highest) to create physical layering.
    *   *Lowest Tier:* Background and secondary dashboard areas.
    *   *Highest Tier:* Modals, Search Inputs, and Active Widgets.
*   **The "Glass & Gradient" Rule:** Floating UI elements (like the "Custom" button or active tab) must utilize Glassmorphism. Apply a semi-transparent `surface_variant` with a 20px backdrop-blur to allow the content behind to bleed through subtly.
*   **Signature Textures:** For the main search CTA or hero-state icons, use a linear gradient from `primary` to `primary_container` at a 135-degree angle to provide a "gemstone" polish.

## 3. Typography
The typography strategy pairs technical precision with editorial flair.

*   **Display & Headlines (Space Grotesk):** This font’s geometric, slightly idiosyncratic glyphs echo the "Pyramid" logo's sharp angles. Use `display-lg` for the clock and `headline-md` for major section headers.
*   **Body & Labels (Manrope):** A sleek, high-readability sans-serif. Its modern proportions ensure that even at `body-sm`, the browser’s metadata remains crisp.
*   **Editorial Intent:** Use wide letter-spacing (tracking) for `label-md` and `label-sm` to create an "expensive" feel in the navigation and metadata tags.

## 4. Elevation & Depth
In "The Monolith" system, depth is a result of light, not lines.

*   **The Layering Principle:** Stacking determines importance. A "Site Widget" from the sketch should be `surface_container_low`. When hovered, it transitions to `surface_container_highest` to create a "lift" effect.
*   **Ambient Shadows:** For floating elements like tooltips or the "Custom" menu, use a shadow with a blur of `32px`, offset by `8px` on the Y-axis, at `8%` opacity. The shadow color should be a dark emerald-tinted black (`#001008`) to feel integrated with the brand.
*   **The "Ghost Border" Fallback:** If accessibility requires a container edge, use a `1px` stroke of `outline_variant` at **15% opacity**. It should be felt, not seen.
*   **Rounding:** All containers must use the `lg` (0.5rem) or `xl` (0.75rem) tokens. This creates a "soft geometric" look—clean but never sharp, modern but never circular.

## 5. Components

### Search Bar (The Central Monolith)
*   **Style:** `surface_container_highest` background.
*   **Shape:** `xl` (0.75rem) roundedness.
*   **Interaction:** On focus, the `outline` token animates in at 20% opacity with a soft `primary` glow (glow radius: 10px).

### Buttons & Chips
*   **Primary Button:** `primary` background with `on_primary` text. Use `full` rounding only for small action chips; use `md` for standard buttons.
*   **Secondary/Custom Button:** As seen in the sketch footer, use a `surface_bright` background with a `Ghost Border`.
*   **Site Widgets (Grid Items):** These are "floating" squares with `lg` rounding. Use `surface_container_low`. Do not use icons alone; use a combination of a high-res favicon and `label-md` text.

### Inputs & Fields
*   **Input States:** Inactive states should have no border. Active/Error states use the `primary` or `error` tokens respectively, but only as a bottom-weighted "glow" or a ghost border.
*   **No Dividers:** In lists or menus, forbid horizontal lines. Use `spacing-4` (1rem) as a vertical gutter to let the "Monolith" breathe.

### Navigation (The Top Bar)
*   **Style:** Minimalist. The back/forward arrows should be `on_surface_variant` and scale to `primary` on hover. The URL text uses `body-md` with `0.05em` letter spacing.

## 6. Do's and Don'ts

### Do
*   **Do** use asymmetrical spacing. If the clock is centered, let the secondary "Mail/App" links sit offset to the right to create a dynamic, modern layout.
*   **Do** use `primary_fixed_dim` for icons to ensure they don't "vibrate" against the dark background.
*   **Do** utilize the `surface_container_lowest` for the background of the browser's "content area" to make the active browser window feel like it is recessed into the UI.

### Don't
*   **Don't** use 100% white (`#FFFFFF`). Always use `on_background` (`#e5e2e1`) for text to prevent eye strain in dark mode.
*   **Don't** use standard "drop shadows." If an element needs to stand out, use tonal contrast (lighter surface colors).
*   **Don't** use full circles for any container unless it is a small notification badge. The "Pyramid" identity is geometric and structured.
*   **Don't** crowd the sketch's "Site" widget area. Use the `spacing-8` scale to ensure each site icon has significant "breathing room."