import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMobileOpen(false);
  };

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-card/92 backdrop-blur-md shadow-cozy border-b border-border/50"
          : "bg-transparent"
      }`}
    >
      <nav className="container mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 shrink-0"
          data-ocid="nav.link"
        >
          <img
            src="/assets/generated/sticknest-logo-new-transparent.dim_400x200.png"
            alt="Sticknest"
            className="h-12 w-auto"
          />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          <button
            type="button"
            data-ocid="nav.shop_link"
            onClick={() => scrollToSection("catalog")}
            className="px-4 py-2 rounded-xl text-sm font-body font-medium text-foreground/80 hover:text-primary hover:bg-primary/8 transition-colors"
          >
            Browse Stickers
          </button>
          <button
            type="button"
            data-ocid="nav.featured_link"
            onClick={() => scrollToSection("featured")}
            className="px-4 py-2 rounded-xl text-sm font-body font-medium text-foreground/80 hover:text-primary hover:bg-primary/8 transition-colors"
          >
            Featured ✨
          </button>
          <button
            type="button"
            data-ocid="nav.about_link"
            onClick={() => scrollToSection("about")}
            className="px-4 py-2 rounded-xl text-sm font-body font-medium text-foreground/80 hover:text-primary hover:bg-primary/8 transition-colors"
          >
            My Story
          </button>
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          className="md:hidden p-2 rounded-xl hover:bg-muted transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <Menu className="w-5 h-5" />
          )}
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden bg-card/95 backdrop-blur-md border-b border-border/50 px-4 pb-4"
        >
          <div className="flex flex-col gap-1 pt-2">
            <button
              type="button"
              data-ocid="nav.shop_link"
              onClick={() => scrollToSection("catalog")}
              className="text-left px-4 py-3 rounded-xl font-body font-medium text-foreground/80 hover:text-primary hover:bg-primary/8 transition-colors"
            >
              Browse Stickers
            </button>
            <button
              type="button"
              data-ocid="nav.featured_link"
              onClick={() => scrollToSection("featured")}
              className="text-left px-4 py-3 rounded-xl font-body font-medium text-foreground/80 hover:text-primary hover:bg-primary/8 transition-colors"
            >
              Featured ✨
            </button>
            <button
              type="button"
              data-ocid="nav.about_link"
              onClick={() => scrollToSection("about")}
              className="text-left px-4 py-3 rounded-xl font-body font-medium text-foreground/80 hover:text-primary hover:bg-primary/8 transition-colors"
            >
              My Story
            </button>
          </div>
        </motion.div>
      )}
    </motion.header>
  );
}
