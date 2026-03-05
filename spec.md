# Sticknest

## Current State
A sticker showcase website (no selling) with:
- Public homepage: Hero, Featured stickers, Catalog with folder-based sections, About/My Story, Brand Values (Cozy/Artistic/Expressive), Footer with social links
- Admin panel at /admin: PIN-protected (default 1234), auto-locks on tab hide, folders management, sticker CRUD with image+video upload, change PIN, online site link, social media links (Pinterest/Instagram)
- Backend: Motoko canister storing stickers (id, title, description, category, imageUrl, price[used for videoUrl], amazonLink, pinterestLink, featured, createdAt)
- blob-storage and authorization components installed

## Requested Changes (Diff)

### Add
- Nothing new — this is a fresh rebuild of the same app to get a new clean URL

### Modify
- Rebuild as a new project named "Sticknest" to generate a fresh URL

### Remove
- Nothing — all features preserved exactly

## Implementation Plan
1. Generate new Sticknest logo image
2. Select blob-storage and authorization components
3. Generate Motoko backend with sticker storage (id, title, description, category, imageUrl, videoUrl, featured, createdAt) and CRUD operations
4. Build full frontend:
   - Navbar (no login button, no admin link)
   - HeroSection with fun vibrant background
   - FeaturedSection
   - CatalogSection (folder-based sections from localStorage)
   - AboutSection (My Story + 4 fun cards)
   - BrandValuesSection (Cozy, Artistic, Expressive)
   - Footer with social links from localStorage
   - AdminPage: PIN lock (default 1234), auto-lock on tab hide, folders CRUD, sticker CRUD with image+video upload, change PIN, site link, social links
   - StickerCard with full-view modal on click
   - StickerFormModal with image+video upload via blob-storage
