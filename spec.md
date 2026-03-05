# Sticknest

## Current State
A sticker showcase website with a warm honey-amber palette. Features:
- Hero section, featured section, full catalog, about section, brand values section, footer
- Admin panel at /admin with PIN auth, sticker add/edit/delete, featured toggle, seed, change PIN, site link, social links
- Stickers organized by category (free text field)
- The word "Colourful" still appears as a chip in HeroSection
- The background/palette is warm honey-amber (cozy but not super fun/vibrant)
- CatalogSection shows all stickers in a flat grid with no folder/category grouping sections

## Requested Changes (Diff)

### Add
- **Folder system in admin**: A "Folders" section in the admin panel where admin can create new folders (custom category names) and delete empty ones. Folders are stored in localStorage.
- **Category-based sections on homepage**: CatalogSection should read all unique categories from stickers and render each as its own titled section (e.g. "Funny", "Desi Vibes"). Empty folders (no stickers) are hidden on public site.
- **Fun, vibrant background**: New color palette — bright, eye-catching, fun vibe that makes visitors want to return. Think bold purples, electric blues, lively pinks, or warm sunset gradients — energetic not muted. Keep readability and cozy feel but add playful energy.
- **Fun micro-interactions**: Bouncy sticker hover effects, confetti/sparkle animations, playful section transitions.

### Modify
- **Remove "Colourful" chip** from HeroSection hero chips (keep "Cozy" and "Expressive", optionally replace with something fun)
- **New logo** (generated): Fun, playful nest-with-stickers logo to match new vibe
- **New hero image**: Fun, vibrant background matching new palette
- **Update CSS palette** in index.css to match fun/vibrant direction
- **CatalogSection**: Instead of flat grid, render grouped sections by category — each category gets a header and its own sticker row/grid. A flat "All Stickers" fallback for uncategorized.
- **AdminPage**: Add a "Folders" card section with create/delete folder functionality stored in localStorage.

### Remove
- Nothing to remove beyond the "Colourful" chip

## Implementation Plan
1. Generate new fun Sticknest logo and hero image
2. Update index.css color palette to vibrant fun direction
3. Update tailwind.config.js shadows/colors to match new palette
4. Update HeroSection: remove "Colourful" chip, swap hero image reference, update chip icons
5. Update CatalogSection: group stickers by category into separate titled sections
6. Add folder management to AdminPage: "Folders" card with create/delete, stored in localStorage (FOLDERS_KEY)
7. Admin sticker form: show existing folders as quick-select suggestions for category field
8. All copy/branding stays Sticknest — no Revnya/Sticknest brand name changes needed
