import type { Sticker } from "../backend.d";

const STORAGE_KEY = "revnya_stickers";

// Seed data with placeholder images
const SEED_STICKERS: Sticker[] = [
  {
    id: "seed-1",
    title: "Cherry Blossom Dreams",
    description:
      "Delicate pink cherry blossoms in full bloom — perfect for planners, journals, and anything that deserves a touch of spring.",
    category: "Floral",
    imageUrl: "https://placehold.co/400x400/f9c5d1/5a3e4a?text=🌸",
    featured: true,
    createdAt: BigInt(Date.now() - 5 * 24 * 60 * 60 * 1000),
    price: "",
    amazonLink: "",
    pinterestLink: "",
  },
  {
    id: "seed-2",
    title: "Laughing to Tears",
    description:
      "That face you make when something is too funny to handle. Highly expressive, endlessly relatable.",
    category: "Funny",
    imageUrl: "https://placehold.co/400x400/ffe0b3/7a4a00?text=😂",
    featured: true,
    createdAt: BigInt(Date.now() - 4 * 24 * 60 * 60 * 1000),
    price: "",
    amazonLink: "",
    pinterestLink: "",
  },
  {
    id: "seed-3",
    title: "Botanical Leaf Cluster",
    description:
      "A lush arrangement of tropical leaves — minimal, elegant, and gorgeous on water bottles or laptop lids.",
    category: "Nature",
    imageUrl: "https://placehold.co/400x400/c8e6c0/2e5a1e?text=🌿",
    featured: false,
    createdAt: BigInt(Date.now() - 3 * 24 * 60 * 60 * 1000),
    price: "",
    amazonLink: "",
    pinterestLink: "",
  },
  {
    id: "seed-4",
    title: "Mood: Unimpressed",
    description:
      "Side-eye energy. For every moment when words just aren't enough to express your feelings.",
    category: "Expressive",
    imageUrl: "https://placehold.co/400x400/e8d5f0/4a2a6a?text=🙄",
    featured: true,
    createdAt: BigInt(Date.now() - 2 * 24 * 60 * 60 * 1000),
    price: "",
    amazonLink: "",
    pinterestLink: "",
  },
  {
    id: "seed-5",
    title: "Sunflower Pop",
    description:
      "Bright, bold, and impossible to ignore — a cheerful sunflower that brings warmth to any surface.",
    category: "Floral",
    imageUrl: "https://placehold.co/400x400/fff3b0/6b5000?text=🌻",
    featured: false,
    createdAt: BigInt(Date.now() - 1 * 24 * 60 * 60 * 1000),
    price: "",
    amazonLink: "",
    pinterestLink: "",
  },
  {
    id: "seed-6",
    title: "This is Fine 🔥",
    description:
      'The iconic "this is fine" energy — because sometimes you just need to acknowledge the chaos and move on.',
    category: "Funny",
    imageUrl: "https://placehold.co/400x400/ffccaa/7a2000?text=🔥",
    featured: false,
    createdAt: BigInt(Date.now()),
    price: "",
    amazonLink: "",
    pinterestLink: "",
  },
];

// Serialize sticker for localStorage (BigInt → string)
interface SerializedSticker extends Omit<Sticker, "createdAt"> {
  createdAt: string;
}

function serialize(sticker: Sticker): SerializedSticker {
  return {
    ...sticker,
    createdAt: sticker.createdAt.toString(),
  };
}

function deserialize(raw: SerializedSticker): Sticker {
  return {
    ...raw,
    createdAt: BigInt(raw.createdAt || Date.now()),
  };
}

// ── Core store functions ──────────────────────────────────────────────────────

export function getAllStickers(): Sticker[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: SerializedSticker[] = JSON.parse(raw);
    return parsed.map(deserialize);
  } catch {
    return [];
  }
}

function saveAll(stickers: Sticker[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stickers.map(serialize)));
}

export function getFeaturedStickers(): Sticker[] {
  return getAllStickers().filter((s) => s.featured);
}

export function getStickersByCategory(category: string): Sticker[] {
  if (category === "All") return getAllStickers();
  return getAllStickers().filter((s) => s.category === category);
}

export function addSticker(sticker: Sticker): void {
  const all = getAllStickers();
  saveAll([...all, sticker]);
}

export function updateSticker(sticker: Sticker): void {
  const all = getAllStickers();
  saveAll(all.map((s) => (s.id === sticker.id ? sticker : s)));
}

export function deleteSticker(id: string): void {
  const all = getAllStickers();
  saveAll(all.filter((s) => s.id !== id));
}

export function toggleFeatured(id: string): void {
  const all = getAllStickers();
  saveAll(all.map((s) => (s.id === id ? { ...s, featured: !s.featured } : s)));
}

export function seedStickers(): void {
  // Only seed if empty
  const current = getAllStickers();
  if (current.length === 0) {
    saveAll(SEED_STICKERS);
  }
}
