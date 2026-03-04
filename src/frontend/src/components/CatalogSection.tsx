import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "motion/react";
import { useAllStickers } from "../hooks/useQueries";
import StickerCard from "./StickerCard";

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
  const { data: stickers, isLoading } = useAllStickers();

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
            Showcase
          </p>
          <h2 className="font-display text-4xl sm:text-5xl font-semibold text-foreground leading-[1.1] mb-4">
            My Sticker Collection
          </h2>
          {/* Editorial rule */}
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-12 bg-primary/30" />
            <span className="text-primary text-base">✦</span>
            <div className="h-px w-12 bg-primary/30" />
          </div>
          <p className="font-body text-muted-foreground text-base max-w-sm mx-auto leading-relaxed">
            Original handmade designs — funny, expressive, made with love 😂🎨
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
            <div className="w-20 h-20 bg-muted rounded-3xl flex items-center justify-center mb-4 text-4xl">
              🎨
            </div>
            <h3 className="font-display text-2xl font-semibold text-foreground mb-2">
              No stickers yet
            </h3>
            <p className="font-body text-muted-foreground max-w-sm">
              New designs are being crafted! Check back soon.
            </p>
          </motion.div>
        )}

        {/* Sticker grid */}
        {!isLoading && stickers && stickers.length > 0 && (
          <motion.div
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
        )}
      </div>
    </section>
  );
}
