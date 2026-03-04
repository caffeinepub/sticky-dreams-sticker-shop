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
            Revnya
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
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-4">
              <svg
                viewBox="0 0 48 48"
                className="w-10 h-10"
                fill="none"
                aria-hidden="true"
              >
                <ellipse
                  cx="24"
                  cy="24"
                  rx="12"
                  ry="18"
                  fill="oklch(0.85 0.07 145)"
                  opacity="0.6"
                  transform="rotate(-15, 24, 24)"
                />
                <ellipse
                  cx="24"
                  cy="24"
                  rx="10"
                  ry="15"
                  fill="oklch(0.65 0.1 140)"
                  opacity="0.4"
                  transform="rotate(15, 24, 24)"
                />
                <line
                  x1="24"
                  y1="6"
                  x2="24"
                  y2="42"
                  stroke="oklch(0.55 0.1 140)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <h3 className="font-display text-2xl font-semibold text-foreground mb-2">
              The collection blooms soon
            </h3>
            <p className="font-body text-muted-foreground max-w-sm">
              New designs are taking shape. Visit the admin panel to add your
              stickers.
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
