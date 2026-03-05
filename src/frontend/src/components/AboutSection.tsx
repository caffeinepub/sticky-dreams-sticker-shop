import { Feather, Palette, Send, Smile, Sparkles } from "lucide-react";
import { motion } from "motion/react";

const values = [
  {
    icon: Smile,
    title: "Born from Joy",
    description:
      "Every design starts with a feeling — fun, funny, or full of color. If it makes me smile, it becomes a sticker.",
    color: "text-[oklch(0.52_0.14_55)]",
    bg: "bg-[oklch(0.95_0.06_70)]",
  },
  {
    icon: Palette,
    title: "Colorful & Bright",
    description:
      "Bold colors, playful shapes, and loads of personality. Life is too short for boring stickers.",
    color: "text-[oklch(0.5_0.14_30)]",
    bg: "bg-[oklch(0.94_0.06_30)]",
  },
  {
    icon: Feather,
    title: "Made with Care",
    description:
      "Every detail is considered. Every curve and color is chosen to make you feel something good.",
    color: "text-[oklch(0.48_0.12_90)]",
    bg: "bg-[oklch(0.94_0.05_90)]",
  },
  {
    icon: Send,
    title: "Stick It Everywhere",
    description:
      "Stickers are made to travel. Slap them on your journal, your laptop, your water bottle — let them go places.",
    color: "text-[oklch(0.5_0.12_60)]",
    bg: "bg-[oklch(0.95_0.05_65)]",
  },
];

export default function AboutSection() {
  return (
    <section
      id="about"
      className="py-24 gradient-section relative overflow-hidden"
    >
      {/* Decorative warm orbs */}
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl opacity-25 bg-[oklch(0.88_0.08_60)]" />
      <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full blur-3xl opacity-20 bg-[oklch(0.9_0.07_30)]" />

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
            <div className="inline-flex items-center gap-2 bg-white/65 backdrop-blur-sm rounded-full px-4 py-1.5 text-sm font-body font-medium text-primary mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              My Story
            </div>
            <h2 className="font-display text-4xl sm:text-5xl font-semibold text-foreground mb-6">
              Stickers Stuck{" "}
              <span className="italic text-gradient">with Love</span>
            </h2>
            <p className="font-body text-lg text-foreground/70 leading-relaxed max-w-2xl mx-auto">
              I create stickers full of personality — from funny expressions to
              colorful art. Each design is a tiny burst of joy I love to share
              with the world.
              <br />
              <br />
              My stickers are perfect for decorating journals, water bottles,
              laptops, planners, and everything in between. Sticknest is my cozy
              corner of the internet — a warm home for all the stickers I pour
              my heart into.
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
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="bg-white/72 backdrop-blur-sm rounded-3xl p-6 text-center border border-white/60 shadow-xs hover:shadow-cozy transition-all duration-300"
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
