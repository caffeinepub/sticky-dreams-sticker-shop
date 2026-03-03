import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { LogIn, LogOut, Menu, Sparkles, X } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { useLogin } from "../hooks/useLogin";

export default function Navbar() {
  const { login, clear, loginStatus, identity } = useLogin();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isLoggedIn = !!identity && !identity.getPrincipal().isAnonymous();
  const isLoggingIn = loginStatus === "logging-in";

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
          ? "bg-card/90 backdrop-blur-md shadow-cozy border-b border-border/50"
          : "bg-transparent"
      }`}
    >
      <nav className="container mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <img
            src="/assets/generated/sticker-shop-logo-transparent.dim_300x120.png"
            alt="Sticky Dreams"
            className="h-10 w-auto"
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
            Shop
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
            About
          </button>
          <Link
            to="/admin"
            className="px-4 py-2 rounded-xl text-sm font-body font-medium text-foreground/60 hover:text-primary hover:bg-primary/8 transition-colors"
          >
            Admin
          </Link>
        </div>

        {/* Auth Button */}
        <div className="hidden md:flex items-center gap-3">
          {isLoggedIn ? (
            <Button
              data-ocid="nav.login_button"
              variant="outline"
              size="sm"
              onClick={clear}
              className="rounded-xl border-border gap-2 font-body"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </Button>
          ) : (
            <Button
              data-ocid="nav.login_button"
              size="sm"
              onClick={login}
              disabled={isLoggingIn}
              className="rounded-xl gap-2 font-body bg-primary text-primary-foreground hover:opacity-90"
            >
              <LogIn className="w-3.5 h-3.5" />
              {isLoggingIn ? "Signing in..." : "Sign In"}
            </Button>
          )}
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
              Shop
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
              About
            </button>
            <div className="pt-2 border-t border-border/40">
              {isLoggedIn ? (
                <Button
                  data-ocid="nav.login_button"
                  variant="outline"
                  className="w-full rounded-xl gap-2 font-body"
                  onClick={() => {
                    clear();
                    setMobileOpen(false);
                  }}
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </Button>
              ) : (
                <Button
                  data-ocid="nav.login_button"
                  className="w-full rounded-xl gap-2 font-body bg-primary text-primary-foreground"
                  onClick={() => {
                    login();
                    setMobileOpen(false);
                  }}
                  disabled={isLoggingIn}
                >
                  <LogIn className="w-4 h-4" />
                  {isLoggingIn ? "Signing in..." : "Sign In"}
                </Button>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </motion.header>
  );
}
