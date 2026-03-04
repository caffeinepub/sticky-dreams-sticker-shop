import { Button } from "@/components/ui/button";
import { Leaf, Sparkles, Star } from "lucide-react";
import { motion } from "motion/react";

export default function HeroSection() {
  const scrollToCatalog = () => {
    document.getElementById("catalog")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-[92vh] flex items-center overflow-hidden pt-16">
      {/* Full-bleed background photo */}
      <div className="absolute inset-0">
        <img
          src="/assets/generated/hero-banner-reunya.dim_1200x500.jpg"
          alt="Revnya botanical sticker collection"
          className="w-full h-full object-cover object-center"
          loading="eager"
        />
        {/* Directional overlay: opaque left → transparent right */}
        <div className="absolute inset-0 gradient-hero" />
        {/* Subtle vignette bottom edge */}
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-background/60 to-transparent" />
      </div>

      {/* Floating botanical decorative elements */}
      <motion.div
        animate={{ y: [-10, 10, -10], rotate: [12, 16, 12] }}
        transition={{
          duration: 4.5,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
        className="absolute top-28 right-[12%] hidden lg:block z-10"
      >
        <div className="w-16 h-16 bg-rose-50/80 backdrop-blur-sm rounded-full shadow-cozy-hover flex items-center justify-center border border-rose-200/60">
          <svg
            viewBox="0 0 40 40"
            className="w-8 h-8"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M20 8 C20 8 28 14 28 22 C28 28 24 34 20 34 C16 34 12 28 12 22 C12 14 20 8 20 8Z"
              fill="oklch(0.85 0.07 15)"
              opacity="0.7"
            />
            <path
              d="M20 12 C20 12 14 18 14 24 C14 28 17 32 20 34 C23 32 26 28 26 24 C26 18 20 12 20 12Z"
              fill="oklch(0.72 0.08 10)"
              opacity="0.5"
            />
            <line
              x1="20"
              y1="8"
              x2="20"
              y2="36"
              stroke="oklch(0.6 0.06 145)"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </motion.div>
      <motion.div
        animate={{ y: [8, -10, 8], rotate: [-6, -2, -6] }}
        transition={{
          duration: 3.8,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
          delay: 0.7,
        }}
        className="absolute bottom-36 right-[6%] hidden lg:block z-10"
      >
        <div className="w-14 h-14 bg-sage/30 backdrop-blur-sm rounded-full shadow-cozy flex items-center justify-center border border-sage/50">
          <svg
            viewBox="0 0 36 36"
            className="w-7 h-7"
            fill="none"
            aria-hidden="true"
          >
            <ellipse
              cx="18"
              cy="18"
              rx="10"
              ry="14"
              fill="oklch(0.75 0.09 145)"
              opacity="0.65"
              transform="rotate(-20, 18, 18)"
            />
            <line
              x1="18"
              y1="4"
              x2="18"
              y2="32"
              stroke="oklch(0.55 0.1 140)"
              strokeWidth="1.5"
              strokeLinecap="round"
              transform="rotate(-20, 18, 18)"
            />
          </svg>
        </div>
      </motion.div>
      <motion.div
        animate={{ y: [-6, 8, -6], rotate: [8, 4, 8] }}
        transition={{
          duration: 5.2,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
          delay: 1.4,
        }}
        className="absolute top-44 right-[28%] hidden xl:block z-10"
      >
        <div className="w-12 h-12 bg-blush/60 backdrop-blur-sm rounded-full shadow-xs flex items-center justify-center border border-rose-100/70">
          <svg
            viewBox="0 0 32 32"
            className="w-6 h-6"
            fill="none"
            aria-hidden="true"
          >
            <circle
              cx="16"
              cy="16"
              r="5"
              fill="oklch(0.72 0.1 10)"
              opacity="0.8"
            />
            <ellipse
              cx="16"
              cy="8"
              rx="3"
              ry="5"
              fill="oklch(0.88 0.06 15)"
              opacity="0.7"
              transform="rotate(0, 16, 16)"
            />
            <ellipse
              cx="16"
              cy="8"
              rx="3"
              ry="5"
              fill="oklch(0.88 0.06 15)"
              opacity="0.7"
              transform="rotate(45, 16, 16)"
            />
            <ellipse
              cx="16"
              cy="8"
              rx="3"
              ry="5"
              fill="oklch(0.88 0.06 15)"
              opacity="0.7"
              transform="rotate(90, 16, 16)"
            />
            <ellipse
              cx="16"
              cy="8"
              rx="3"
              ry="5"
              fill="oklch(0.88 0.06 15)"
              opacity="0.7"
              transform="rotate(135, 16, 16)"
            />
            <ellipse
              cx="16"
              cy="8"
              rx="3"
              ry="5"
              fill="oklch(0.88 0.06 15)"
              opacity="0.7"
              transform="rotate(180, 16, 16)"
            />
            <ellipse
              cx="16"
              cy="8"
              rx="3"
              ry="5"
              fill="oklch(0.88 0.06 15)"
              opacity="0.7"
              transform="rotate(225, 16, 16)"
            />
            <ellipse
              cx="16"
              cy="8"
              rx="3"
              ry="5"
              fill="oklch(0.88 0.06 15)"
              opacity="0.7"
              transform="rotate(270, 16, 16)"
            />
            <ellipse
              cx="16"
              cy="8"
              rx="3"
              ry="5"
              fill="oklch(0.88 0.06 15)"
              opacity="0.7"
              transform="rotate(315, 16, 16)"
            />
          </svg>
        </div>
      </motion.div>

      {/* Hero content — left-aligned on a subtle frosted pane */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 py-24 lg:py-32">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-xl"
        >
          {/* Eyebrow badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="inline-flex items-center gap-2 bg-white/75 backdrop-blur-md rounded-full px-4 py-1.5 text-sm font-body font-semibold text-primary mb-7 shadow-cozy border border-white/60"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Original designs by Revnya
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.75,
              delay: 0.18,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="font-display text-5xl sm:text-6xl lg:text-[4.25rem] font-semibold leading-[1.07] tracking-tight mb-6 text-foreground"
          >
            <span className="text-gradient italic">Revnya</span>
            <br />
            Stickers for the{" "}
            <span className="not-italic inline-block origin-center hover:animate-float">
              artful soul
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.7,
              delay: 0.32,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="font-body text-lg text-foreground/72 mb-10 max-w-[26rem] leading-[1.7]"
          >
            Every sticker tells a story. Botanical, expressive, and quietly
            beautiful — peel one off and let it speak for you.
          </motion.p>

          {/* CTA row */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.7,
              delay: 0.44,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="flex flex-wrap gap-3 mb-14"
          >
            <Button
              data-ocid="hero.primary_button"
              size="lg"
              onClick={scrollToCatalog}
              className="rounded-2xl font-body font-semibold text-base px-9 h-14 bg-primary text-primary-foreground shadow-cozy hover:shadow-cozy-hover hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 gap-2.5"
            >
              <Leaf className="w-4 h-4 opacity-80" />
              Explore the Collection
            </Button>
            <Button
              data-ocid="hero.secondary_button"
              variant="outline"
              size="lg"
              onClick={() =>
                document
                  .getElementById("featured")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="rounded-2xl font-body font-medium text-base px-8 h-14 bg-white/60 backdrop-blur-md border-white/70 text-foreground hover:bg-white/85 transition-all duration-200 gap-2.5 shadow-xs"
            >
              <Star className="w-4 h-4 text-primary" />
              See Featured
            </Button>
          </motion.div>

          {/* Botanical stat chips */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.58 }}
            className="flex flex-wrap gap-2.5"
          >
            {[
              { icon: "🌿", label: "Botanical" },
              { icon: "🎨", label: "Artistic" },
              { icon: "✦", label: "Expressive" },
            ].map((chip) => (
              <div
                key={chip.label}
                className="flex items-center gap-2 bg-white/65 backdrop-blur-md rounded-full px-4 py-2 border border-white/60 shadow-xs"
              >
                <span className="text-base leading-none font-body">
                  {chip.icon}
                </span>
                <span className="font-body text-sm font-bold text-foreground">
                  {chip.label}
                </span>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Wave transition */}
      <div className="absolute bottom-0 left-0 right-0 z-10">
        <svg
          viewBox="0 0 1440 72"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full block"
          aria-hidden="true"
          role="presentation"
          preserveAspectRatio="none"
        >
          <path
            d="M0 72L48 64C96 56 192 40 288 36C384 32 480 40 576 44C672 48 768 48 864 42C960 36 1056 22 1152 16C1248 10 1344 12 1392 13L1440 14V72H0Z"
            fill="oklch(0.97 0.015 15)"
          />
        </svg>
      </div>
    </section>
  );
}
