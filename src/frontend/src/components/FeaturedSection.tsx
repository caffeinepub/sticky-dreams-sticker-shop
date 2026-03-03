import { Skeleton } from "@/components/ui/skeleton";
import { Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { useFeaturedStickers } from "../hooks/useQueries";
import StickerCard from "./StickerCard";

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  },
};

export default function FeaturedSection() {
  const { data: featured, isLoading } = useFeaturedStickers();

  if (!isLoading && (!featured || featured.length === 0)) {
    return null;
  }

  return (
    <section
      id="featured"
      className="py-20 gradient-featured relative overflow-hidden"
    >
      {/* Decorative blobs */}
      <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full blur-3xl opacity-40 bg-[oklch(0.9_0.06_310)]" />
      <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full blur-3xl opacity-30 bg-[oklch(0.92_0.06_30)]" />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm rounded-full px-4 py-1.5 text-xs font-body font-bold uppercase tracking-widest text-primary mb-5 border border-white/60">
            <Sparkles className="w-3 h-3" />
            Staff Picks
          </div>
          <h2 className="font-display text-4xl sm:text-5xl font-semibold text-foreground leading-[1.1] mb-4">
            Featured Favorites
          </h2>
          {/* Editorial rule */}
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-12 bg-primary/30" />
            <span className="text-primary text-base">✦</span>
            <div className="h-px w-12 bg-primary/30" />
          </div>
          <p className="font-body text-muted-foreground text-base max-w-sm mx-auto leading-relaxed">
            Our most-loved designs, chosen with extra care 💕
          </p>
        </motion.div>

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {["sk1", "sk2", "sk3", "sk4"].map((sk) => (
              <div key={sk} className="space-y-3">
                <Skeleton className="w-full aspect-square rounded-3xl" />
                <Skeleton className="h-4 w-3/4 rounded-full" />
                <Skeleton className="h-3 w-1/2 rounded-full" />
              </div>
            ))}
          </div>
        ) : (
          <motion.div
            data-ocid="featured.list"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {featured?.map((sticker, index) => (
              <motion.div
                key={sticker.id}
                variants={itemVariants}
                data-ocid={`featured.item.${index + 1}`}
              >
                <StickerCard sticker={sticker} featured />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
