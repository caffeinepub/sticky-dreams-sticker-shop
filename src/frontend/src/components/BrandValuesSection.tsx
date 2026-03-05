import { Home, Palette, Sparkles } from "lucide-react";
import { motion } from "motion/react";

const brandValues = [
  {
    icon: Home,
    label: "Cozy",
    tagline: "Your Happy Little Nest",
    description:
      "Sticknest is your warm, cozy home for stickers that make you smile. Every visit should feel like finding something you didn't know you needed.",
    color: "text-[oklch(0.45_0.14_55)]",
    iconBg: "bg-[oklch(0.95_0.06_70)]",
    cardBg: "bg-[oklch(0.98_0.03_75)]",
    borderColor: "border-[oklch(0.9_0.05_70)]",
    decorEmoji: "🏠",
  },
  {
    icon: Palette,
    label: "Artistic",
    tagline: "Every Sticker, a Canvas",
    description:
      "Created with creativity and a sense of beauty — each sticker is a small piece of art that shows personal style and intention.",
    color: "text-[oklch(0.46_0.16_30)]",
    iconBg: "bg-[oklch(0.95_0.07_30)]",
    cardBg: "bg-[oklch(0.98_0.03_35)]",
    borderColor: "border-[oklch(0.9_0.06_30)]",
    decorEmoji: "🎨",
  },
  {
    icon: Sparkles,
    label: "Expressive",
    tagline: "Words You Can Peel & Stick",
    description:
      "Stickers that communicate feelings, moods, and personality — because sometimes a sticker says everything words can't. Peel it. Say it. Mean it.",
    color: "text-[oklch(0.45_0.12_80)]",
    iconBg: "bg-[oklch(0.95_0.06_80)]",
    cardBg: "bg-[oklch(0.98_0.025_82)]",
    borderColor: "border-[oklch(0.9_0.05_78)]",
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
          "linear-gradient(170deg, oklch(0.98 0.018 80) 0%, oklch(0.96 0.04 70) 40%, oklch(0.94 0.07 30 / 0.6) 75%, oklch(0.96 0.04 60 / 0.4) 100%)",
      }}
    >
      {/* Soft decorative orbs */}
      <div
        className="absolute -top-24 -left-16 w-[480px] h-[480px] rounded-full blur-3xl pointer-events-none"
        style={{ background: "oklch(0.9 0.08 60 / 0.22)" }}
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-20 -right-12 w-[400px] h-[400px] rounded-full blur-3xl pointer-events-none"
        style={{ background: "oklch(0.9 0.08 30 / 0.2)" }}
        aria-hidden="true"
      />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full blur-3xl pointer-events-none opacity-15"
        style={{ background: "oklch(0.88 0.1 55 / 0.4)" }}
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
            <div className="inline-flex items-center gap-2.5 bg-white/72 backdrop-blur-sm rounded-full px-5 py-2 text-sm font-body font-semibold text-primary mb-5 border border-white/60 shadow-sm">
              <span className="text-base leading-none">🎉</span>
              The Sticknest Way
            </div>

            {/* Title */}
            <h2 className="font-display text-4xl sm:text-5xl font-semibold text-foreground mb-5 leading-tight">
              What Makes <span className="text-gradient italic">Sticknest</span>{" "}
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
                className={`group relative rounded-3xl p-8 border ${value.cardBg} ${value.borderColor} shadow-sm hover:shadow-cozy-hover transition-shadow duration-300 overflow-hidden cursor-default`}
              >
                {/* Subtle inner glow on hover */}
                <div
                  className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{
                    background:
                      "radial-gradient(circle at 30% 20%, oklch(1 0 0 / 0.45), transparent 65%)",
                  }}
                  aria-hidden="true"
                />

                {/* Decorative large emoji */}
                <div
                  className="absolute top-4 right-5 text-5xl opacity-10 group-hover:opacity-20 transition-opacity duration-300 select-none pointer-events-none"
                  aria-hidden="true"
                >
                  {value.decorEmoji}
                </div>

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
              <span className="text-xl">🌟</span>
              <div className="h-px w-16 bg-foreground/15 rounded-full" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
