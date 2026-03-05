import { ExternalLink, Heart } from "lucide-react";
import { SiInstagram, SiPinterest } from "react-icons/si";

const SITE_LINK_KEY = "stickerOnlineSiteLink";
const SITE_LINK_LABEL_KEY = "stickerOnlineSiteLinkLabel";
const PINTEREST_LINK_KEY = "stickerPinterestLink";
const INSTAGRAM_LINK_KEY = "stickerInstagramLink";

function getOnlineSiteLink() {
  return localStorage.getItem(SITE_LINK_KEY) ?? "";
}

function getOnlineSiteLinkLabel() {
  return localStorage.getItem(SITE_LINK_LABEL_KEY) ?? "Visit My Shop";
}

function getPinterestLink() {
  return localStorage.getItem(PINTEREST_LINK_KEY) ?? "";
}

function getInstagramLink() {
  return localStorage.getItem(INSTAGRAM_LINK_KEY) ?? "";
}

export default function Footer() {
  const year = new Date().getFullYear();
  const hostname = encodeURIComponent(
    typeof window !== "undefined" ? window.location.hostname : "",
  );

  const onlineSiteLink = getOnlineSiteLink();
  const onlineSiteLinkLabel = getOnlineSiteLinkLabel();
  const pinterestLink = getPinterestLink();
  const instagramLink = getInstagramLink();

  return (
    <footer className="bg-[oklch(0.2_0.02_20)] text-[oklch(0.88_0.015_30)] py-12">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 mb-10">
          {/* Brand */}
          <div>
            <img
              src="/assets/generated/sticknest-logo-fun-transparent.dim_400x200.png"
              alt="Sticknest"
              className="h-14 w-auto mb-3 opacity-90"
            />
            <p className="font-body text-sm text-[oklch(0.72_0.015_25)] leading-relaxed max-w-xs mt-2">
              A cozy nest for stickers you'll love. Peel them, stick them, and
              spread some joy.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-heading font-semibold text-sm uppercase tracking-wider mb-4 text-[oklch(0.82_0.03_20)]">
              Explore
            </h4>
            <ul className="space-y-2">
              {[
                { label: "All Stickers", id: "catalog" },
                { label: "Featured", id: "featured" },
                { label: "My Story", id: "about" },
              ].map((item) => (
                <li key={item.label}>
                  <button
                    type="button"
                    onClick={() => {
                      document
                        .getElementById(item.id)
                        ?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="font-body text-sm text-[oklch(0.68_0.015_25)] hover:text-[oklch(0.9_0.03_20)] transition-colors"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
              {onlineSiteLink && (
                <li>
                  <a
                    href={onlineSiteLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-body text-sm text-[oklch(0.75_0.07_15)] hover:text-[oklch(0.88_0.09_15)] transition-colors inline-flex items-center gap-1.5"
                  >
                    <ExternalLink className="w-3 h-3" />
                    {onlineSiteLinkLabel}
                  </a>
                </li>
              )}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-heading font-semibold text-sm uppercase tracking-wider mb-4 text-[oklch(0.82_0.03_20)]">
              Find Me On
            </h4>
            <div className="flex gap-3 mb-4">
              {pinterestLink ? (
                <a
                  href={pinterestLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-[oklch(0.28_0.04_350)] rounded-xl flex items-center justify-center hover:bg-[oklch(0.4_0.12_10)] transition-colors"
                  aria-label="Pinterest"
                >
                  <SiPinterest className="w-4 h-4 text-white" />
                </a>
              ) : (
                <div
                  className="w-10 h-10 bg-[oklch(0.22_0.02_20)] rounded-xl flex items-center justify-center opacity-40 cursor-not-allowed"
                  title="Pinterest link not set — add it in the admin panel"
                >
                  <SiPinterest className="w-4 h-4 text-white" />
                </div>
              )}
              {instagramLink ? (
                <a
                  href={instagramLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-[oklch(0.28_0.03_20)] rounded-xl flex items-center justify-center hover:bg-[oklch(0.42_0.1_15)] transition-colors"
                  aria-label="Instagram"
                >
                  <SiInstagram className="w-4 h-4 text-white" />
                </a>
              ) : (
                <div
                  className="w-10 h-10 bg-[oklch(0.22_0.02_20)] rounded-xl flex items-center justify-center opacity-40 cursor-not-allowed"
                  title="Instagram link not set — add it in the admin panel"
                >
                  <SiInstagram className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
            <p className="font-body text-xs text-[oklch(0.6_0.015_25)] leading-relaxed">
              Follow for new designs, sticker drops, and behind-the-scenes
              inspiration!
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-[oklch(0.3_0.02_20)] flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <p className="font-body text-xs text-[oklch(0.58_0.015_25)]">
            © {year} Sticknest. All rights reserved.
          </p>
          <p className="font-body text-xs text-[oklch(0.58_0.015_25)]">
            Built with{" "}
            <Heart className="w-3 h-3 inline text-[oklch(0.68_0.1_10)]" /> using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${hostname}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[oklch(0.75_0.07_15)] hover:text-[oklch(0.88_0.09_15)] transition-colors"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
