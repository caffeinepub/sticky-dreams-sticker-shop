import { Leaf, Palette, Sparkles } from "lucide-react";
import { motion } from "motion/react";

const brandValues = [
  {
    icon: Leaf,
    label: "Botanical",
    tagline: "Rooted in Nature",
    description:
      "Inspired by nature's beauty — leaves, branches, and organic shapes that give every design a natural, elegant feeling.",
    color: "text-[oklch(0.42_0.1_145)]",
    iconBg: "bg-[oklch(0.88_0.055_145)]",
    cardBg: "bg-[oklch(0.96_0.02_145)]",
    borderColor: "border-[oklch(0.82_0.06_145)]",
    accentBar: "bg-[oklch(0.65_0.09_145)]",
    decorEmoji: "🌿",
  },
  {
    icon: Palette,
    label: "Artistic",
    tagline: "Every Sticker, a Canvas",
    description:
      "Created with creativity and a sense of beauty — each sticker is a small piece of art that shows personal style and intention.",
    color: "text-[oklch(0.44_0.1_10)]",
    iconBg: "bg-[oklch(0.93_0.04_15)]",
    cardBg: "bg-[oklch(0.97_0.02_15)]",
    borderColor: "border-[oklch(0.86_0.05_15)]",
    accentBar: "bg-[oklch(0.62_0.1_10)]",
    decorEmoji: "🎨",
  },
  {
    icon: Sparkles,
    label: "Expressive",
    tagline: "Words You Can Peel & Stick",
    description:
      "Stickers that communicate feelings, moods, and personality — because sometimes a sticker says everything words can't.",
    color: "text-[oklch(0.45_0.1_290)]",
    iconBg: "bg-[oklch(0.92_0.04_290)]",
    cardBg: "bg-[oklch(0.96_0.02_290)]",
    borderColor: "border-[oklch(0.84_0.05_290)]",
    accentBar: "bg-[oklch(0.58_0.12_290)]",
    decorEmoji: "✨",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  },
};

export default function BrandValuesSection() {
  return (
    <section
      id="brand-values"
      data-ocid="brand_values.section"
      className="py-28 relative overflow-hidden"
      style={{
        background:
          "linear-gradient(170deg, oklch(0.96 0.025 15) 0%, oklch(0.95 0.03 20) 35%, oklch(0.93 0.04 145 / 0.4) 65%, oklch(0.96 0.02 290 / 0.25) 100%)",
      }}
    >
      {/* Soft decorative orbs */}
      <div
        className="absolute -top-24 -left-16 w-[480px] h-[480px] rounded-full blur-3xl pointer-events-none"
        style={{ background: "oklch(0.9 0.04 15 / 0.35)" }}
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-20 -right-12 w-[400px] h-[400px] rounded-full blur-3xl pointer-events-none"
        style={{ background: "oklch(0.88 0.055 145 / 0.3)" }}
        aria-hidden="true"
      />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full blur-3xl pointer-events-none opacity-20"
        style={{ background: "oklch(0.9 0.04 290 / 0.4)" }}
        aria-hidden="true"
      />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="max-w-5xl mx-auto">
          {/* Section header */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="text-center mb-16"
          >
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2.5 bg-white/70 backdrop-blur-sm rounded-full px-5 py-2 text-sm font-body font-semibold text-[oklch(0.44_0.1_10)] mb-5 border border-white/60 shadow-sm">
              <span className="text-base leading-none">🌸</span>
              The Revnya Way
            </div>

            {/* Title */}
            <h2 className="font-display text-4xl sm:text-5xl font-semibold text-foreground mb-5 leading-tight">
              What Makes{" "}
              <span
                className="italic"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.52 0.12 10), oklch(0.5 0.08 145))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Revnya
              </span>{" "}
              Special
            </h2>

            <p className="font-body text-lg text-foreground/65 leading-relaxed max-w-xl mx-auto">
              Three words. Three promises. Every design you see here carries all
              three.
            </p>
          </motion.div>

          {/* Cards */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8"
          >
            {brandValues.map((value, index) => (
              <motion.div
                key={value.label}
                variants={cardVariants}
                data-ocid={`brand_values.card.${index + 1}`}
                whileHover={{ y: -6, transition: { duration: 0.25 } }}
                className={`group relative rounded-3xl p-8 border ${value.cardBg} ${value.borderColor} shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden cursor-default`}
              >
                {/* Subtle inner glow on hover */}
                <div
                  className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none"
                  style={{
                    background:
                      "radial-gradient(circle at 30% 20%, oklch(1 0 0 / 0.5), transparent 65%)",
                  }}
                  aria-hidden="true"
                />

                {/* Decorative large emoji — soft, background layer */}
                <div
                  className="absolute top-4 right-5 text-5xl opacity-10 group-hover:opacity-20 transition-opacity duration-300 select-none pointer-events-none"
                  aria-hidden="true"
                >
                  {value.decorEmoji}
                </div>

                {/* Accent top bar */}
                <div
                  className={`absolute top-0 left-8 right-8 h-0.5 rounded-b-full ${value.accentBar} opacity-60 group-hover:opacity-100 transition-opacity duration-300`}
                  aria-hidden="true"
                />

                {/* Icon */}
                <div
                  className={`w-14 h-14 ${value.iconBg} rounded-2xl flex items-center justify-center mb-6 shadow-xs group-hover:scale-105 transition-transform duration-300`}
                >
                  <value.icon className={`w-6 h-6 ${value.color}`} />
                </div>

                {/* Tag */}
                <p
                  className={`font-body text-xs font-bold tracking-widest uppercase mb-2 ${value.color} opacity-80`}
                >
                  {value.tagline}
                </p>

                {/* Title */}
                <h3 className="font-display text-2xl font-semibold text-foreground mb-3 leading-tight">
                  {value.label}
                </h3>

                {/* Description */}
                <p className="font-body text-sm text-foreground/65 leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </motion.div>

          {/* Bottom flourish */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-center mt-14"
          >
            <p className="font-body text-base text-foreground/50 italic">
              "Little pieces of art that say everything words can't."
            </p>
            <div className="flex items-center justify-center gap-3 mt-4">
              <div className="h-px w-16 bg-foreground/15 rounded-full" />
              <span className="text-xl">🌸</span>
              <div className="h-px w-16 bg-foreground/15 rounded-full" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
