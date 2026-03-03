import { Heart } from "lucide-react";
import { SiAmazon, SiInstagram, SiPinterest } from "react-icons/si";

export default function Footer() {
  const year = new Date().getFullYear();
  const hostname = encodeURIComponent(
    typeof window !== "undefined" ? window.location.hostname : "",
  );

  return (
    <footer className="bg-[oklch(0.2_0.03_30)] text-[oklch(0.88_0.02_50)] py-12">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 mb-10">
          {/* Brand */}
          <div>
            <img
              src="/assets/generated/sticker-shop-logo-transparent.dim_300x120.png"
              alt="Sticky Dreams"
              className="h-10 w-auto mb-3 opacity-90"
            />
            <p className="font-body text-sm text-[oklch(0.75_0.02_50)] leading-relaxed max-w-xs">
              Adorable handcrafted stickers that add a little joy to everyday
              life. Made with love for you 💕
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-heading font-semibold text-sm uppercase tracking-wider mb-4 text-[oklch(0.82_0.04_30)]">
              Shop
            </h4>
            <ul className="space-y-2">
              {[
                "All Stickers",
                "Cute Animals",
                "Floral",
                "Fun Phrases",
                "Seasonal",
              ].map((item) => (
                <li key={item}>
                  <button
                    type="button"
                    onClick={() => {
                      document
                        .getElementById("catalog")
                        ?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="font-body text-sm text-[oklch(0.72_0.02_50)] hover:text-[oklch(0.9_0.04_30)] transition-colors"
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-heading font-semibold text-sm uppercase tracking-wider mb-4 text-[oklch(0.82_0.04_30)]">
              Find Us On
            </h4>
            <div className="flex gap-3 mb-4">
              <button
                type="button"
                className="w-10 h-10 bg-[oklch(0.28_0.04_310)] rounded-xl flex items-center justify-center hover:bg-[oklch(0.35_0.15_310)] transition-colors"
                aria-label="Pinterest"
              >
                <SiPinterest className="w-4 h-4 text-white" />
              </button>
              <button
                type="button"
                className="w-10 h-10 bg-[oklch(0.28_0.04_55)] rounded-xl flex items-center justify-center hover:bg-[oklch(0.4_0.12_55)] transition-colors"
                aria-label="Amazon"
              >
                <SiAmazon className="w-4 h-4 text-white" />
              </button>
              <button
                type="button"
                className="w-10 h-10 bg-[oklch(0.3_0.08_10)] rounded-xl flex items-center justify-center hover:bg-[oklch(0.45_0.18_20)] transition-colors"
                aria-label="Instagram"
              >
                <SiInstagram className="w-4 h-4 text-white" />
              </button>
            </div>
            <p className="font-body text-xs text-[oklch(0.65_0.02_50)] leading-relaxed">
              Follow us for new designs, sticker drops, and behind-the-scenes
              inspiration!
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-[oklch(0.3_0.03_30)] flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <p className="font-body text-xs text-[oklch(0.6_0.02_50)]">
            © {year} Sticky Dreams. All rights reserved.
          </p>
          <p className="font-body text-xs text-[oklch(0.6_0.02_50)]">
            Built with{" "}
            <Heart className="w-3 h-3 inline text-[oklch(0.7_0.12_15)]" /> using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${hostname}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[oklch(0.78_0.08_30)] hover:text-[oklch(0.88_0.1_30)] transition-colors"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
