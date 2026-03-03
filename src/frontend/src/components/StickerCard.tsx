import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ExternalLink, Star } from "lucide-react";
import { useState } from "react";
import { SiAmazon, SiPinterest } from "react-icons/si";
import type { Sticker } from "../backend.d";

const CATEGORY_COLORS: Record<string, string> = {
  "Cute Animals":
    "bg-[oklch(0.92_0.06_30)] text-[oklch(0.32_0.1_20)] border-[oklch(0.84_0.07_30)]",
  Floral:
    "bg-[oklch(0.91_0.05_310)] text-[oklch(0.32_0.1_300)] border-[oklch(0.83_0.06_310)]",
  "Fun Phrases":
    "bg-[oklch(0.93_0.08_65)] text-[oklch(0.33_0.1_55)] border-[oklch(0.85_0.09_65)]",
  Seasonal:
    "bg-[oklch(0.91_0.07_155)] text-[oklch(0.3_0.12_155)] border-[oklch(0.83_0.08_155)]",
};

interface StickerCardProps {
  sticker: Sticker;
  featured?: boolean;
}

export default function StickerCard({ sticker, featured }: StickerCardProps) {
  const [open, setOpen] = useState(false);

  const badgeClass =
    CATEGORY_COLORS[sticker.category] ??
    "bg-muted text-muted-foreground border-border";

  return (
    <>
      {/* Card — entire card is a click target for modal */}
      <div
        className="cozy-card overflow-hidden group flex flex-col h-full cursor-pointer"
        style={{
          transition:
            "transform 0.28s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.28s ease",
        }}
        onClick={() => setOpen(true)}
        onKeyDown={(e) => e.key === "Enter" && setOpen(true)}
        // biome-ignore lint/a11y/useSemanticElements: card needs to be a div for layout
        role="button"
        tabIndex={0}
        aria-label={`View details for ${sticker.title}`}
        data-ocid="product.open_modal_button"
      >
        {/* Image area */}
        <div className="relative aspect-square overflow-hidden bg-secondary">
          {featured && (
            <div className="absolute top-3 left-3 z-10">
              <span className="bg-primary text-primary-foreground text-xs font-body font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-xs">
                <Star className="w-3 h-3 fill-current" />
                Featured
              </span>
            </div>
          )}
          <img
            src={sticker.imageUrl}
            alt={sticker.title}
            className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
            loading="lazy"
          />
          {/* Bottom scrim for depth */}
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Content area */}
        <div className="p-5 flex flex-col gap-3.5 flex-1">
          {/* Category badge */}
          <span
            className={`self-start text-xs font-body font-semibold px-3 py-1 rounded-full border ${badgeClass}`}
          >
            {sticker.category}
          </span>

          {/* Title & price */}
          <div className="flex items-start justify-between gap-2 flex-1">
            <h3 className="font-heading font-semibold text-[0.9rem] leading-snug text-foreground flex-1 line-clamp-2 group-hover:text-primary transition-colors duration-200">
              {sticker.title}
            </h3>
            <span className="font-display font-bold text-primary text-base whitespace-nowrap shrink-0 tabular-nums">
              {sticker.price}
            </span>
          </div>

          {/* Buy buttons — stopPropagation so they don't open modal */}
          {(sticker.amazonLink || sticker.pinterestLink) && (
            <div
              className="flex gap-2 mt-auto pt-1"
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => e.stopPropagation()}
            >
              {sticker.amazonLink && (
                <Button
                  data-ocid="product.amazon_button"
                  size="sm"
                  asChild
                  className="flex-1 rounded-xl h-9 text-xs font-body font-semibold bg-[oklch(0.68_0.14_55)] hover:bg-[oklch(0.62_0.14_55)] text-white gap-1.5 shadow-xs"
                >
                  <a
                    href={sticker.amazonLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <SiAmazon className="w-3 h-3" />
                    Amazon
                  </a>
                </Button>
              )}
              {sticker.pinterestLink && (
                <Button
                  data-ocid="product.pinterest_button"
                  size="sm"
                  asChild
                  className="flex-1 rounded-xl h-9 text-xs font-body font-semibold bg-[oklch(0.48_0.19_20)] hover:bg-[oklch(0.42_0.19_20)] text-white gap-1.5 shadow-xs"
                >
                  <a
                    href={sticker.pinterestLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <SiPinterest className="w-3 h-3" />
                    Pinterest
                  </a>
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Product detail modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          data-ocid="product.dialog"
          className="max-w-md rounded-3xl font-body overflow-hidden p-0 gap-0"
        >
          {/* Image — taller crop */}
          <div className="relative aspect-[16/9] bg-secondary overflow-hidden">
            <img
              src={sticker.imageUrl}
              alt={sticker.title}
              className="w-full h-full object-cover"
            />
            {/* Gradient scrim over image bottom */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            {/* Price badge on image */}
            <div className="absolute bottom-4 right-4">
              <span className="font-display text-xl font-bold text-white drop-shadow-lg">
                {sticker.price}
              </span>
            </div>
            {featured && (
              <div className="absolute top-4 left-4">
                <span className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-xs">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  Featured
                </span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-6 pt-5">
            <DialogHeader className="text-left space-y-2.5 mb-5">
              <div className="flex items-start gap-3">
                <span
                  className={`shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full border ${badgeClass}`}
                >
                  {sticker.category}
                </span>
              </div>
              <DialogTitle className="font-display text-2xl font-semibold text-foreground leading-tight">
                {sticker.title}
              </DialogTitle>
              <DialogDescription className="text-foreground/65 leading-[1.65] text-sm">
                {sticker.description}
              </DialogDescription>
            </DialogHeader>

            {/* Purchase CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              {sticker.amazonLink && (
                <Button
                  data-ocid="product.amazon_button"
                  asChild
                  className="flex-1 rounded-2xl h-11 gap-2 font-body font-semibold bg-[oklch(0.68_0.14_55)] hover:bg-[oklch(0.62_0.14_55)] text-white"
                >
                  <a
                    href={sticker.amazonLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <SiAmazon className="w-4 h-4" />
                    Buy on Amazon
                    <ExternalLink className="w-3.5 h-3.5 opacity-60 ml-auto" />
                  </a>
                </Button>
              )}
              {sticker.pinterestLink && (
                <Button
                  data-ocid="product.pinterest_button"
                  asChild
                  className="flex-1 rounded-2xl h-11 gap-2 font-body font-semibold bg-[oklch(0.48_0.19_20)] hover:bg-[oklch(0.42_0.19_20)] text-white"
                >
                  <a
                    href={sticker.pinterestLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <SiPinterest className="w-4 h-4" />
                    Save on Pinterest
                    <ExternalLink className="w-3.5 h-3.5 opacity-60 ml-auto" />
                  </a>
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
