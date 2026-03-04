# Sticky Dreams Sticker Showcase

## Current State
- Sticker showcase site with hero, featured section, catalog, about, footer
- Admin panel at `/admin` locked by a hardcoded 4-digit PIN (`1234`)
- PIN is hardcoded in `AdminPage.tsx` – cannot be changed by the user
- Stickers have: id, title, description, category (4 fixed categories), imageUrl, featured, price, amazonLink, pinterestLink, createdAt
- `StickerFormModal` only supports image uploads (no video)
- Categories are fixed: Cute Animals, Floral, Fun Phrases, Seasonal
- No video support anywhere in the stack
- Background uses blush pinks / lavender palette

## Requested Changes (Diff)

### Add
- **Video support**: Each sticker item can optionally have a video (short clip like a WhatsApp sticker or funny video). `Sticker` type gains a `videoUrl: Text` field.
- **Video upload in admin form**: File picker supports both image and video files. Video preview plays inline (muted, looping). Admin can add/replace/remove video separately from image.
- **Video display on public pages**: StickerCard shows a play icon overlay if a video is present. Clicking a card that has video opens a modal that plays the video (with controls, muted autoplay loop). Image is used as poster/fallback.
- **PIN change feature in admin panel**: A "Change PIN" section in the admin dashboard that lets the admin enter current PIN, new PIN, confirm new PIN, and save. New PIN replaces old one (stored in localStorage). Works like Instagram/Facebook password change flow.
- **Free-form custom categories**: Replace the 4 fixed categories dropdown with a free-text input so the admin can type any category name they want.
- **Light, fun, eye-comfortable background**: Warm soft cream/white with gentle pastel accents – not pink/lavender. Think warm sunlight, lemon yellow, mint, soft sky – feels funny, lively but gentle on the eyes.

### Modify
- `Sticker` backend type: add `videoUrl: Text` field
- `StickerFormModal`: add video upload section (file input + preview), replace category Select with free-text Input
- `StickerCard`: show video indicator badge/overlay; modal shows video player if videoUrl present
- `AdminPage`: add "Change PIN" tab/section; remove hardcoded PIN, read from localStorage with fallback `"1234"`
- Color palette in `index.css`: shift to warm cream/lemon/mint palette
- Stats card in AdminPage: replace "Categories" with "Videos" count

### Remove
- Fixed `CATEGORIES` array in `StickerFormModal`
- Price, amazonLink, pinterestLink fields (already empty strings – ensure they remain invisible/removed from UI)

## Implementation Plan
1. Update `main.mo`: add `videoUrl` field to `Sticker` type and all related functions
2. Regenerate `backend.d.ts` to reflect the new field
3. Update `index.css`: replace color tokens with warm cream/lemon/mint palette
4. Update `StickerFormModal`: add video upload, replace category dropdown with text input
5. Update `StickerCard`: show video play overlay, update modal to show video player
6. Update `AdminPage`: add Change PIN section, read PIN from localStorage, update stats
7. Update `CatalogSection`/`FeaturedSection` if category filter tabs need updating (remove fixed categories, show dynamic ones or remove filter entirely)
