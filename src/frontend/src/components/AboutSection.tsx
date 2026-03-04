import { Feather, Heart, Leaf, Palette, Send, Sparkles } from "lucide-react";
import { motion } from "motion/react";

const values = [
  {
    icon: Palette,
    title: "Born from Art",
    description:
      "Each design starts as a sketch, refined into something you'll want to stick everywhere.",
    color: "text-[oklch(0.52_0.1_10)]",
    bg: "bg-[oklch(0.94_0.04_15)]",
  },
  {
    icon: Leaf,
    title: "Inspired by Nature",
    description:
      "Botanicals, florals, and the quiet beauty of the natural world inform every collection.",
    color: "text-[oklch(0.48_0.09_145)]",
    bg: "bg-[oklch(0.92_0.04_145)]",
  },
  {
    icon: Feather,
    title: "Crafted with Intention",
    description:
      "Details matter. Every curve, color, and composition is considered before it becomes a sticker.",
    color: "text-[oklch(0.5_0.08_60)]",
    bg: "bg-[oklch(0.94_0.04_60)]",
  },
  {
    icon: Send,
    title: "Made to Be Shared",
    description:
      "Stickers are made to travel. Put them on your journal, your laptop, or give one to a friend.",
    color: "text-[oklch(0.52_0.12_350)]",
    bg: "bg-[oklch(0.94_0.04_350)]",
  },
];

export default function AboutSection() {
  return (
    <section
      id="about"
      className="py-24 gradient-section relative overflow-hidden"
    >
      {/* Decorative botanical orbs */}
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl opacity-25 bg-[oklch(0.88_0.055_145)]" />
      <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full blur-3xl opacity-20 bg-[oklch(0.9_0.04_15)]" />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm rounded-full px-4 py-1.5 text-sm font-body font-medium text-primary mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              My Story
            </div>
            <h2 className="font-display text-4xl sm:text-5xl font-semibold text-foreground mb-6">
              Designs Rooted in{" "}
              <span className="italic text-primary">Beauty</span>
            </h2>
            <p className="font-body text-lg text-foreground/70 leading-relaxed max-w-2xl mx-auto">
              I create stickers full of personality — from dreamy botanicals to
              bold expressions and uplifting phrases. Each design starts as a
              spark of inspiration and becomes a tiny piece of art I'm proud to
              share with the world.
              <br />
              <br />
              My stickers are perfect for decorating journals, water bottles,
              laptops, planners, and everything in between. This is my creative
              showcase — a little corner of the internet where I share the
              designs I pour my heart into.
            </p>
          </motion.div>

          {/* Values grid */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.12 } },
            }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {values.map((val) => (
              <motion.div
                key={val.title}
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: {
                      duration: 0.5,
                      ease: [0.22, 1, 0.36, 1] as [
                        number,
                        number,
                        number,
                        number,
                      ],
                    },
                  },
                }}
                className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 text-center border border-white/60 shadow-xs hover:shadow-cozy transition-all duration-300 hover:-translate-y-1"
              >
                <div
                  className={`w-12 h-12 ${val.bg} rounded-2xl flex items-center justify-center mx-auto mb-4`}
                >
                  <val.icon className={`w-5 h-5 ${val.color}`} />
                </div>
                <h3 className="font-heading font-semibold text-foreground mb-2">
                  {val.title}
                </h3>
                <p className="font-body text-sm text-foreground/65 leading-relaxed">
                  {val.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
