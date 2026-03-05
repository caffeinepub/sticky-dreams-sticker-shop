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
    <footer
      className="py-12"
      style={{ background: "oklch(0.2 0.03 50)", color: "oklch(0.88 0.02 60)" }}
    >
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 mb-10">
          {/* Brand */}
          <div>
            <img
              src="/assets/generated/sticknest-logo-new-transparent.dim_400x200.png"
              alt="Sticknest"
              className="h-14 w-auto mb-3 opacity-90"
            />
            <p
              className="font-body text-sm leading-relaxed max-w-xs mt-2"
              style={{ color: "oklch(0.68 0.02 50)" }}
            >
              A cozy nest for stickers you'll love. Peel them, stick them, and
              spread some joy.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4
              className="font-heading font-semibold text-sm uppercase tracking-wider mb-4"
              style={{ color: "oklch(0.78 0.04 55)" }}
            >
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
                    data-ocid={`footer.${item.id}_link`}
                    onClick={() => {
                      document
                        .getElementById(item.id)
                        ?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="font-body text-sm transition-colors"
                    style={{ color: "oklch(0.62 0.02 50)" }}
                    onMouseEnter={(e) => {
                      (e.target as HTMLButtonElement).style.color =
                        "oklch(0.88 0.03 55)";
                    }}
                    onMouseLeave={(e) => {
                      (e.target as HTMLButtonElement).style.color =
                        "oklch(0.62 0.02 50)";
                    }}
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
                    className="font-body text-sm transition-colors inline-flex items-center gap-1.5"
                    style={{ color: "oklch(0.72 0.1 55)" }}
                    data-ocid="footer.site_link"
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
            <h4
              className="font-heading font-semibold text-sm uppercase tracking-wider mb-4"
              style={{ color: "oklch(0.78 0.04 55)" }}
            >
              Find Me On
            </h4>
            <div className="flex gap-3 mb-4">
              {pinterestLink ? (
                <a
                  href={pinterestLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl flex items-center justify-center transition-colors"
                  style={{ background: "oklch(0.28 0.04 30)" }}
                  onMouseEnter={(e) => {
                    (e.target as HTMLAnchorElement).style.background =
                      "oklch(0.42 0.12 20)";
                  }}
                  onMouseLeave={(e) => {
                    (e.target as HTMLAnchorElement).style.background =
                      "oklch(0.28 0.04 30)";
                  }}
                  aria-label="Pinterest"
                  data-ocid="footer.pinterest_link"
                >
                  <SiPinterest className="w-4 h-4 text-white" />
                </a>
              ) : (
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center opacity-35 cursor-not-allowed"
                  style={{ background: "oklch(0.24 0.02 50)" }}
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
                  className="w-10 h-10 rounded-xl flex items-center justify-center transition-colors"
                  style={{ background: "oklch(0.28 0.04 50)" }}
                  onMouseEnter={(e) => {
                    (e.target as HTMLAnchorElement).style.background =
                      "oklch(0.42 0.1 40)";
                  }}
                  onMouseLeave={(e) => {
                    (e.target as HTMLAnchorElement).style.background =
                      "oklch(0.28 0.04 50)";
                  }}
                  aria-label="Instagram"
                  data-ocid="footer.instagram_link"
                >
                  <SiInstagram className="w-4 h-4 text-white" />
                </a>
              ) : (
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center opacity-35 cursor-not-allowed"
                  style={{ background: "oklch(0.24 0.02 50)" }}
                  title="Instagram link not set — add it in the admin panel"
                >
                  <SiInstagram className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
            <p
              className="font-body text-xs leading-relaxed"
              style={{ color: "oklch(0.56 0.015 50)" }}
            >
              Follow for new designs, sticker drops, and behind-the-scenes
              inspiration!
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left"
          style={{ borderTop: "1px solid oklch(0.3 0.02 50)" }}
        >
          <p
            className="font-body text-xs"
            style={{ color: "oklch(0.52 0.015 50)" }}
          >
            © {year} Sticknest. All rights reserved.
          </p>
          <p
            className="font-body text-xs"
            style={{ color: "oklch(0.52 0.015 50)" }}
          >
            Built with{" "}
            <Heart
              className="w-3 h-3 inline"
              style={{ color: "oklch(0.65 0.14 30)" }}
            />{" "}
            using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${hostname}`}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors"
              style={{ color: "oklch(0.7 0.1 55)" }}
              onMouseEnter={(e) => {
                (e.target as HTMLAnchorElement).style.color =
                  "oklch(0.85 0.08 60)";
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLAnchorElement).style.color =
                  "oklch(0.7 0.1 55)";
              }}
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
