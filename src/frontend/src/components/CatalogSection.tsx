import { Skeleton } from "@/components/ui/skeleton";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { useAllStickers } from "../hooks/useQueries";
import StickerCard from "./StickerCard";

const FOLDERS_KEY = "sticknestFolders";

function getFolders(): string[] {
  try {
    const raw = localStorage.getItem(FOLDERS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.07,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.92, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    transition: { duration: 0.2 },
  },
};

// Section header with fun emoji lookup
const SECTION_EMOJIS: Record<string, string> = {
  funny: "😂",
  fun: "🎉",
  cute: "🥰",
  animals: "🐾",
  floral: "🌸",
  nature: "🌿",
  food: "🍕",
  sports: "⚽",
  love: "💜",
  travel: "✈️",
  music: "🎵",
  gaming: "🎮",
  holiday: "🎄",
  seasonal: "🍂",
  halloween: "🎃",
  school: "📚",
  work: "💼",
  motivational: "💪",
  aesthetic: "✨",
  meme: "😎",
};

function getSectionEmoji(name: string): string {
  const lower = name.toLowerCase();
  for (const [key, emoji] of Object.entries(SECTION_EMOJIS)) {
    if (lower.includes(key)) return emoji;
  }
  return "🎨";
}

export default function CatalogSection() {
  const { data: stickers, isLoading } = useAllStickers();
  const [folders, setFolders] = useState<string[]>(getFolders);

  // Listen for localStorage changes (from admin panel saving folders)
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === FOLDERS_KEY) {
        setFolders(getFolders());
      }
    };
    window.addEventListener("storage", handleStorage);

    // Polling fallback for same-tab changes
    const interval = setInterval(() => {
      setFolders(getFolders());
    }, 1500);

    return () => {
      window.removeEventListener("storage", handleStorage);
      clearInterval(interval);
    };
  }, []);

  return (
    <section id="catalog" className="py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-12"
        >
          <p className="font-body text-xs font-bold uppercase tracking-widest text-primary/70 mb-4">
            Sticknest
          </p>
          <h2 className="font-display text-4xl sm:text-5xl font-semibold text-foreground leading-[1.1] mb-4">
            The Collection
          </h2>
          {/* Editorial rule */}
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-12 bg-primary/30" />
            <span className="text-primary text-base">✦</span>
            <div className="h-px w-12 bg-primary/30" />
          </div>
          <p className="font-body text-muted-foreground text-base max-w-sm mx-auto leading-relaxed">
            Browse all designs — add your own from the admin panel.
          </p>
        </motion.div>

        {/* Loading state */}
        {isLoading && (
          <div
            data-ocid="catalog.loading_state"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {["sk1", "sk2", "sk3", "sk4", "sk5", "sk6", "sk7", "sk8"].map(
              (sk) => (
                <div key={sk} className="space-y-3">
                  <Skeleton className="w-full aspect-square rounded-3xl" />
                  <Skeleton className="h-4 w-3/4 rounded-full" />
                  <Skeleton className="h-3 w-1/2 rounded-full" />
                </div>
              ),
            )}
          </div>
        )}

        {/* Empty state */}
        {!isLoading && (!stickers || stickers.length === 0) && (
          <motion.div
            data-ocid="catalog.empty_state"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-24 text-center"
          >
            <motion.div
              animate={{ y: [-6, 6, -6], rotate: [-3, 3, -3] }}
              transition={{
                duration: 3,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
              className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mb-4"
            >
              <span className="text-3xl">🎨</span>
            </motion.div>
            <h3 className="font-display text-2xl font-semibold text-foreground mb-2">
              The nest is waiting to be filled
            </h3>
            <p className="font-body text-muted-foreground max-w-sm">
              New stickers are on the way. Visit the admin panel to add your
              designs.
            </p>
          </motion.div>
        )}

        {/* Sticker content — folder-based or flat */}
        {!isLoading && stickers && stickers.length > 0 && (
          <AnimatePresence mode="wait">
            {folders.length === 0 ? (
              /* Flat grid — no folders defined yet */
              <motion.div
                key="flat-grid"
                data-ocid="catalog.list"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              >
                {stickers.map((sticker, index) => (
                  <motion.div
                    key={sticker.id}
                    variants={itemVariants}
                    data-ocid={`catalog.item.${index + 1}`}
                    layout
                  >
                    <StickerCard sticker={sticker} />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              /* Folder-grouped sections */
              <motion.div
                key="folder-sections"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-16"
              >
                {folders.map((folder, folderIndex) => {
                  const folderStickers = stickers.filter(
                    (s) =>
                      s.category.toLowerCase().trim() ===
                      folder.toLowerCase().trim(),
                  );
                  if (folderStickers.length === 0) return null;
                  const emoji = getSectionEmoji(folder);

                  return (
                    <motion.div
                      key={folder}
                      initial={{ opacity: 0, y: 24 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{
                        duration: 0.55,
                        delay: folderIndex * 0.08,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                    >
                      {/* Folder section header */}
                      <div className="flex items-center gap-3 mb-7">
                        <div className="w-10 h-10 bg-primary/10 rounded-2xl flex items-center justify-center shrink-0">
                          <span className="text-lg">{emoji}</span>
                        </div>
                        <div>
                          <h3 className="font-heading font-bold text-xl text-foreground">
                            {folder}
                          </h3>
                          <p className="font-body text-xs text-muted-foreground">
                            {folderStickers.length}{" "}
                            {folderStickers.length === 1
                              ? "sticker"
                              : "stickers"}
                          </p>
                        </div>
                        <div className="flex-1 h-px bg-border/60 ml-2" />
                      </div>

                      <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                      >
                        {folderStickers.map((sticker, index) => (
                          <motion.div
                            key={sticker.id}
                            variants={itemVariants}
                            data-ocid={`catalog.item.${index + 1}`}
                            layout
                          >
                            <StickerCard sticker={sticker} />
                          </motion.div>
                        ))}
                      </motion.div>
                    </motion.div>
                  );
                })}

                {/* Uncategorized / "Other" section */}
                {(() => {
                  const folderNames = folders.map((f) =>
                    f.toLowerCase().trim(),
                  );
                  const otherStickers = stickers.filter(
                    (s) =>
                      !folderNames.includes(s.category.toLowerCase().trim()),
                  );
                  if (otherStickers.length === 0) return null;
                  return (
                    <motion.div
                      key="other"
                      initial={{ opacity: 0, y: 24 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{
                        duration: 0.55,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                    >
                      <div className="flex items-center gap-3 mb-7">
                        <div className="w-10 h-10 bg-accent/20 rounded-2xl flex items-center justify-center shrink-0">
                          <span className="text-lg">🎨</span>
                        </div>
                        <div>
                          <h3 className="font-heading font-bold text-xl text-foreground">
                            More Stickers
                          </h3>
                          <p className="font-body text-xs text-muted-foreground">
                            {otherStickers.length}{" "}
                            {otherStickers.length === 1
                              ? "sticker"
                              : "stickers"}
                          </p>
                        </div>
                        <div className="flex-1 h-px bg-border/60 ml-2" />
                      </div>
                      <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                      >
                        {otherStickers.map((sticker, index) => (
                          <motion.div
                            key={sticker.id}
                            variants={itemVariants}
                            data-ocid={`catalog.item.${index + 1}`}
                            layout
                          >
                            <StickerCard sticker={sticker} />
                          </motion.div>
                        ))}
                      </motion.div>
                    </motion.div>
                  );
                })()}
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    </section>
  );
}
