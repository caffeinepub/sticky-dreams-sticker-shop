import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "motion/react";
import { useState } from "react";
import { useStickersByCategory } from "../hooks/useQueries";
import StickerCard from "./StickerCard";

const CATEGORIES = ["All", "Cute Animals", "Floral", "Fun Phrases", "Seasonal"];

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

export default function CatalogSection() {
  const [activeCategory, setActiveCategory] = useState("All");
  const { data: stickers, isLoading } = useStickersByCategory(activeCategory);

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
            The Shop
          </p>
          <h2 className="font-display text-4xl sm:text-5xl font-semibold text-foreground leading-[1.1] mb-4">
            Browse the Collection
          </h2>
          {/* Editorial rule */}
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-12 bg-primary/30" />
            <span className="text-primary text-base">✦</span>
            <div className="h-px w-12 bg-primary/30" />
          </div>
          <p className="font-body text-muted-foreground text-base max-w-sm mx-auto leading-relaxed">
            Find your perfect match — there's something for everyone 🌈
          </p>
        </motion.div>

        {/* Category tabs */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="flex flex-wrap justify-center gap-2 mb-12"
        >
          {CATEGORIES.map((cat) => (
            <button
              type="button"
              key={cat}
              data-ocid="catalog.tab"
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full font-body font-semibold text-sm transition-all duration-200 ${
                activeCategory === cat
                  ? "bg-primary text-primary-foreground shadow-cozy scale-[1.06] ring-2 ring-primary/20 ring-offset-1"
                  : "bg-card border border-border/80 text-foreground/65 hover:bg-secondary hover:text-foreground hover:border-border hover:scale-[1.03]"
              }`}
            >
              {cat}
            </button>
          ))}
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
                  <div className="flex gap-2">
                    <Skeleton className="h-9 flex-1 rounded-xl" />
                    <Skeleton className="h-9 flex-1 rounded-xl" />
                  </div>
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
            <div className="w-20 h-20 bg-muted rounded-3xl flex items-center justify-center mb-4 text-4xl">
              🎨
            </div>
            <h3 className="font-display text-2xl font-semibold text-foreground mb-2">
              No stickers found
            </h3>
            <p className="font-body text-muted-foreground max-w-sm">
              We're adding new designs all the time! Check back soon or browse
              another category.
            </p>
          </motion.div>
        )}

        {/* Sticker grid */}
        {!isLoading && stickers && stickers.length > 0 && (
          <motion.div
            data-ocid="catalog.list"
            key={activeCategory}
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
        )}
      </div>
    </section>
  );
}
