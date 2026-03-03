import { Heart, Leaf, Package, Sparkles } from "lucide-react";
import { motion } from "motion/react";

const values = [
  {
    icon: Heart,
    title: "Made with Love",
    description:
      "Every design is crafted with care, passion, and a whole lot of heart.",
    color: "text-[oklch(0.62_0.18_10)]",
    bg: "bg-[oklch(0.94_0.04_15)]",
  },
  {
    icon: Sparkles,
    title: "Unique Designs",
    description:
      "Original artwork you won't find anywhere else. Stand out from the crowd!",
    color: "text-[oklch(0.6_0.14_310)]",
    bg: "bg-[oklch(0.93_0.04_310)]",
  },
  {
    icon: Package,
    title: "Premium Quality",
    description:
      "Waterproof, UV-resistant, and long-lasting. Built for real life adventures.",
    color: "text-[oklch(0.55_0.12_55)]",
    bg: "bg-[oklch(0.94_0.05_60)]",
  },
  {
    icon: Leaf,
    title: "Eco-Friendly",
    description:
      "Printed on sustainable materials with eco-conscious inks. Love the planet too!",
    color: "text-[oklch(0.5_0.13_155)]",
    bg: "bg-[oklch(0.93_0.04_155)]",
  },
];

export default function AboutSection() {
  return (
    <section
      id="about"
      className="py-24 gradient-section relative overflow-hidden"
    >
      {/* Decorative */}
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl opacity-30 bg-[oklch(0.9_0.06_310)]" />
      <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full blur-3xl opacity-25 bg-[oklch(0.92_0.06_30)]" />

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
              <Heart className="w-3.5 h-3.5" />
              Our Story
            </div>
            <h2 className="font-display text-4xl sm:text-5xl font-semibold text-foreground mb-6">
              Stickers Born from{" "}
              <span className="italic text-primary">Pure Joy</span>
            </h2>
            <p className="font-body text-lg text-foreground/70 leading-relaxed max-w-2xl mx-auto">
              We create handcrafted stickers full of love and personality — from
              dreamy florals to charming critters and uplifting phrases. Each
              design starts as a spark of inspiration and becomes a tiny piece
              of art that travels with you wherever you go.
              <br />
              <br />
              Our stickers are perfect for decorating journals, water bottles,
              laptops, planners, and everything in between. We believe the
              little things make life more beautiful, and we're here to add a
              little sparkle to yours. ✨
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
