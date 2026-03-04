import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Heart, Play, Star } from "lucide-react";
import { useState } from "react";
import type { Sticker } from "../backend.d";
import { getVideoUrl } from "../utils/stickerHelpers";

interface StickerCardProps {
  sticker: Sticker;
  featured?: boolean;
}

export default function StickerCard({ sticker, featured }: StickerCardProps) {
  const [open, setOpen] = useState(false);
  const videoUrl = getVideoUrl(sticker);

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
          {/* Video indicator badge */}
          {videoUrl && (
            <div className="absolute bottom-3 right-3 z-10">
              <div className="w-8 h-8 bg-black/70 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md">
                <Play className="w-3.5 h-3.5 text-white fill-white ml-0.5" />
              </div>
            </div>
          )}
          {/* Bottom scrim for depth */}
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Content area */}
        <div className="p-5 flex flex-col gap-3 flex-1">
          {/* Title */}
          <div className="flex-1">
            <h3 className="font-heading font-semibold text-[0.9rem] leading-snug text-foreground line-clamp-2 group-hover:text-primary transition-colors duration-200">
              {sticker.title}
            </h3>
          </div>

          {/* Handmade label */}
          <div className="flex items-center gap-1.5 mt-auto pt-1">
            <Heart className="w-3.5 h-3.5 text-primary fill-primary/40" />
            <span className="font-body text-xs text-muted-foreground">
              Handmade with love
            </span>
            {videoUrl && (
              <span className="ml-auto font-body text-xs text-accent-foreground bg-accent/40 px-2 py-0.5 rounded-full">
                🎬 Video
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Product detail modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          data-ocid="product.dialog"
          className="max-w-md rounded-3xl font-body overflow-hidden p-0 gap-0"
        >
          {/* Image or Video */}
          <div className="relative aspect-[16/9] bg-secondary overflow-hidden">
            {videoUrl ? (
              <video
                src={videoUrl}
                className="w-full h-full object-cover"
                muted
                loop
                autoPlay
                playsInline
                controls
              />
            ) : (
              <>
                <img
                  src={sticker.imageUrl}
                  alt={sticker.title}
                  className="w-full h-full object-cover"
                />
                {/* Gradient scrim over image bottom */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              </>
            )}
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
            <DialogHeader className="text-left space-y-2.5 mb-4">
              <DialogTitle className="font-display text-2xl font-semibold text-foreground leading-tight">
                {sticker.title}
              </DialogTitle>
              <DialogDescription className="text-foreground/65 leading-[1.65] text-sm">
                {sticker.description}
              </DialogDescription>
            </DialogHeader>

            {/* Handmade with love note */}
            <div className="flex items-center gap-2 bg-primary/8 rounded-2xl px-4 py-3 border border-primary/15">
              <Heart className="w-4 h-4 text-primary fill-primary/50 shrink-0" />
              <p className="font-body text-sm text-foreground/75">
                This is an original handmade sticker design, crafted with love
                and care.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
