import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  ExternalLink,
  KeyRound,
  Loader2,
  Lock,
  LockOpen,
  Pencil,
  Plus,
  Share2,
  Sprout,
  Star,
  StarOff,
  Trash2,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { SiInstagram, SiPinterest } from "react-icons/si";
import { toast } from "sonner";
import type { Sticker } from "../backend.d";
import StickerFormModal from "../components/StickerFormModal";
import {
  useAllStickers,
  useDeleteSticker,
  useSeedStickers,
  useToggleFeatured,
} from "../hooks/useQueries";
import { getVideoUrl } from "../utils/stickerHelpers";

const PIN_KEY = "stickerAdminPin";
const STORAGE_KEY = "stickerAdminUnlocked";
const SITE_LINK_KEY = "stickerOnlineSiteLink";
const SITE_LINK_LABEL_KEY = "stickerOnlineSiteLinkLabel";
const PINTEREST_LINK_KEY = "stickerPinterestLink";
const INSTAGRAM_LINK_KEY = "stickerInstagramLink";

function getStoredPin(): string {
  return localStorage.getItem(PIN_KEY) ?? "1234";
}

function isUnlocked(): boolean {
  return localStorage.getItem(STORAGE_KEY) === "true";
}

export default function AdminPage() {
  const [unlocked, setUnlocked] = useState(isUnlocked);
  const [pin, setPin] = useState("");
  const [pinError, setPinError] = useState("");

  // Change PIN state
  const [currentPin, setCurrentPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [pinChangeError, setPinChangeError] = useState("");

  // Online site link state
  const [siteLink, setSiteLink] = useState(
    () => localStorage.getItem(SITE_LINK_KEY) ?? "",
  );
  const [siteLinkLabel, setSiteLinkLabel] = useState(
    () => localStorage.getItem(SITE_LINK_LABEL_KEY) ?? "Visit My Shop",
  );

  // Social media links state
  const [pinterestLink, setPinterestLink] = useState(
    () => localStorage.getItem(PINTEREST_LINK_KEY) ?? "",
  );
  const [instagramLink, setInstagramLink] = useState(
    () => localStorage.getItem(INSTAGRAM_LINK_KEY) ?? "",
  );

  const { data: stickers, isLoading: isLoadingStickers } = useAllStickers();
  const seedMutation = useSeedStickers();
  const deleteMutation = useDeleteSticker();
  const toggleFeaturedMutation = useToggleFeatured();

  const [addOpen, setAddOpen] = useState(false);
  const [editSticker, setEditSticker] = useState<Sticker | null>(null);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === getStoredPin()) {
      localStorage.setItem(STORAGE_KEY, "true");
      setUnlocked(true);
      setPinError("");
      setPin("");
    } else {
      setPinError("Incorrect PIN. Try again.");
      setPin("");
    }
  };

  const handleLock = () => {
    localStorage.removeItem(STORAGE_KEY);
    setUnlocked(false);
    setPin("");
  };

  // Auto-lock only when the tab is hidden (user navigates away or minimizes),
  // NOT on window blur — blur fires when a file picker opens, which would
  // kick the admin out before they can finish uploading an image.
  useEffect(() => {
    const onVisibilityChange = () => {
      if (document.hidden) {
        localStorage.removeItem(STORAGE_KEY);
        setUnlocked(false);
      }
    };
    const onBeforeUnload = () => {
      localStorage.removeItem(STORAGE_KEY);
    };

    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("beforeunload", onBeforeUnload);

    return () => {
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("beforeunload", onBeforeUnload);
    };
  }, []);

  const handleSeed = async () => {
    try {
      await seedMutation.mutateAsync();
      toast.success("Sample stickers seeded successfully! 🌱");
    } catch {
      toast.error("Failed to seed stickers");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id);
      toast.success("Sticker deleted");
    } catch {
      toast.error("Failed to delete sticker");
    }
  };

  const handleToggleFeatured = async (id: string) => {
    try {
      await toggleFeaturedMutation.mutateAsync(id);
      toast.success("Featured status updated ⭐");
    } catch {
      toast.error("Failed to update sticker");
    }
  };

  const handleChangePin = (e: React.FormEvent) => {
    e.preventDefault();
    setPinChangeError("");

    if (currentPin !== getStoredPin()) {
      setPinChangeError("Current PIN is incorrect.");
      return;
    }
    if (newPin.length < 4 || newPin.length > 8) {
      setPinChangeError("New PIN must be 4–8 digits.");
      return;
    }
    if (newPin !== confirmPin) {
      setPinChangeError("New PIN and confirmation do not match.");
      return;
    }

    localStorage.setItem(PIN_KEY, newPin);
    toast.success("PIN updated successfully 🔐");
    setCurrentPin("");
    setNewPin("");
    setConfirmPin("");
    setPinChangeError("");
  };

  const handleSaveSiteLink = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem(SITE_LINK_KEY, siteLink.trim());
    localStorage.setItem(
      SITE_LINK_LABEL_KEY,
      siteLinkLabel.trim() || "Visit My Shop",
    );
    toast.success("Site link saved! It will appear in the footer 🔗");
  };

  const handleSaveSocialLinks = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem(PINTEREST_LINK_KEY, pinterestLink.trim());
    localStorage.setItem(INSTAGRAM_LINK_KEY, instagramLink.trim());
    toast.success(
      "Social links saved! They are now clickable in the footer 🌐",
    );
  };

  const videoCount = stickers?.filter((s) => getVideoUrl(s) !== "").length ?? 0;

  // ── PIN entry screen ─────────────────────────────────────────────────────
  if (!unlocked) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="cozy-card p-10 text-center max-w-sm w-full"
        >
          {/* Icon */}
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-5">
            <Lock className="w-8 h-8 text-primary" />
          </div>

          <h1 className="font-display text-2xl font-semibold text-foreground mb-2">
            Admin Access
          </h1>
          <p className="font-body text-sm text-muted-foreground mb-2">
            Enter your PIN to manage your sticker collection.
          </p>
          <p className="font-body text-xs text-muted-foreground/70 mb-8 bg-muted/50 rounded-xl px-4 py-2.5 border border-border/50">
            🔒 Access this page by navigating to{" "}
            <span className="font-mono font-semibold text-foreground/60">
              /admin
            </span>{" "}
            in your browser. Not publicly linked.
          </p>

          <form onSubmit={handleUnlock} className="space-y-4">
            <div className="space-y-1.5 text-left">
              <Label
                htmlFor="admin-pin"
                className="font-body text-sm text-foreground/70"
              >
                Admin PIN
              </Label>
              <Input
                id="admin-pin"
                data-ocid="admin.input"
                type="password"
                inputMode="numeric"
                maxLength={8}
                placeholder="••••"
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value.replace(/\D/g, "").slice(0, 8));
                  setPinError("");
                }}
                className="rounded-xl font-body text-center text-lg tracking-[0.5em] border-border focus-visible:ring-primary"
                autoFocus
                autoComplete="off"
              />
            </div>

            {pinError && (
              <p
                data-ocid="admin.error_state"
                className="font-body text-sm text-destructive text-center"
              >
                {pinError}
              </p>
            )}

            <Button
              data-ocid="admin.submit_button"
              type="submit"
              disabled={pin.length < 4}
              className="rounded-2xl font-body gap-2 bg-primary text-primary-foreground w-full h-11"
            >
              <LockOpen className="w-4 h-4" />
              Unlock Admin Panel
            </Button>
          </form>

          <div className="mt-6">
            <Link
              to="/"
              data-ocid="admin.link"
              className="font-body text-sm text-muted-foreground hover:text-primary transition-colors flex items-center justify-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to collection
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  // ── Admin dashboard ───────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border shadow-xs sticky top-0 z-40">
        <div className="container mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/">
              <Button
                variant="ghost"
                size="sm"
                className="rounded-xl gap-2 font-body"
              >
                <ArrowLeft className="w-4 h-4" />
                Collection
              </Button>
            </Link>
            <div className="w-px h-5 bg-border" />
            <h1 className="font-heading font-semibold text-foreground">
              Admin Panel
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <Button
              data-ocid="admin.seed_button"
              variant="outline"
              size="sm"
              onClick={handleSeed}
              disabled={seedMutation.isPending}
              className="rounded-xl font-body gap-2 border-border"
            >
              {seedMutation.isPending ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Sprout className="w-3.5 h-3.5" />
              )}
              Seed Data
            </Button>
            <Button
              data-ocid="admin.add_button"
              size="sm"
              onClick={() => setAddOpen(true)}
              className="rounded-xl font-body gap-2 bg-primary text-primary-foreground"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Sticker
            </Button>
            <Button
              data-ocid="admin.secondary_button"
              variant="ghost"
              size="sm"
              onClick={handleLock}
              className="rounded-xl font-body gap-2 text-muted-foreground hover:text-foreground"
            >
              <Lock className="w-3.5 h-3.5" />
              Lock
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 sm:grid-cols-3 gap-4"
        >
          {[
            {
              label: "Total Stickers",
              value: stickers?.length ?? 0,
              emoji: "🎨",
            },
            {
              label: "Featured",
              value: stickers?.filter((s) => s.featured).length ?? 0,
              emoji: "⭐",
            },
            {
              label: "With Videos",
              value: videoCount,
              emoji: "🎬",
            },
          ].map((stat) => (
            <div key={stat.label} className="cozy-card p-4 text-center">
              <div className="text-2xl mb-1">{stat.emoji}</div>
              <div className="font-display text-2xl font-bold text-foreground">
                {stat.value}
              </div>
              <div className="font-body text-xs text-muted-foreground mt-0.5">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>

        {/* ── Change PIN card ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="cozy-card overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-border flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
              <KeyRound className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h2 className="font-heading font-semibold text-foreground">
                Change PIN
              </h2>
              <p className="font-body text-xs text-muted-foreground">
                Like Instagram — your password, your control, anytime you want
              </p>
            </div>
          </div>

          <div className="p-6">
            <form onSubmit={handleChangePin} className="space-y-4 max-w-sm">
              <div className="space-y-1.5">
                <Label
                  htmlFor="current-pin"
                  className="font-body text-sm font-medium"
                >
                  Current PIN
                </Label>
                <Input
                  id="current-pin"
                  data-ocid="admin.input"
                  type="password"
                  inputMode="numeric"
                  maxLength={8}
                  placeholder="Enter current PIN"
                  value={currentPin}
                  onChange={(e) => {
                    setCurrentPin(
                      e.target.value.replace(/\D/g, "").slice(0, 8),
                    );
                    setPinChangeError("");
                  }}
                  className="rounded-xl font-body"
                  autoComplete="current-password"
                />
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="new-pin"
                  className="font-body text-sm font-medium"
                >
                  New PIN{" "}
                  <span className="text-muted-foreground font-normal">
                    (4–8 digits)
                  </span>
                </Label>
                <Input
                  id="new-pin"
                  data-ocid="admin.input"
                  type="password"
                  inputMode="numeric"
                  minLength={4}
                  maxLength={8}
                  placeholder="Enter new PIN"
                  value={newPin}
                  onChange={(e) => {
                    setNewPin(e.target.value.replace(/\D/g, "").slice(0, 8));
                    setPinChangeError("");
                  }}
                  className="rounded-xl font-body"
                  autoComplete="new-password"
                />
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="confirm-pin"
                  className="font-body text-sm font-medium"
                >
                  Confirm New PIN
                </Label>
                <Input
                  id="confirm-pin"
                  data-ocid="admin.input"
                  type="password"
                  inputMode="numeric"
                  maxLength={8}
                  placeholder="Repeat new PIN"
                  value={confirmPin}
                  onChange={(e) => {
                    setConfirmPin(
                      e.target.value.replace(/\D/g, "").slice(0, 8),
                    );
                    setPinChangeError("");
                  }}
                  className="rounded-xl font-body"
                  autoComplete="new-password"
                />
              </div>

              {pinChangeError && (
                <p
                  data-ocid="admin.error_state"
                  className="font-body text-sm text-destructive"
                >
                  {pinChangeError}
                </p>
              )}

              <Button
                type="submit"
                data-ocid="admin.save_button"
                disabled={
                  currentPin.length < 4 ||
                  newPin.length < 4 ||
                  confirmPin.length < 4
                }
                className="rounded-xl font-body gap-2 bg-primary text-primary-foreground"
              >
                <KeyRound className="w-4 h-4" />
                Save New PIN
              </Button>
            </form>
          </div>
        </motion.div>

        {/* ── Online Site Link card ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="cozy-card overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-border flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
              <ExternalLink className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h2 className="font-heading font-semibold text-foreground">
                My Online Site Link
              </h2>
              <p className="font-body text-xs text-muted-foreground">
                Add a link to your shop, Pinterest, or any site — it will show
                in the footer
              </p>
            </div>
          </div>

          <div className="p-6">
            <form onSubmit={handleSaveSiteLink} className="space-y-4 max-w-sm">
              <div className="space-y-1.5">
                <Label
                  htmlFor="site-link"
                  className="font-body text-sm font-medium"
                >
                  URL
                </Label>
                <Input
                  id="site-link"
                  data-ocid="admin.site_link_input"
                  type="url"
                  placeholder="https://www.myshop.com"
                  value={siteLink}
                  onChange={(e) => setSiteLink(e.target.value)}
                  className="rounded-xl font-body"
                  autoComplete="off"
                />
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="site-link-label"
                  className="font-body text-sm font-medium"
                >
                  Button Label{" "}
                  <span className="text-muted-foreground font-normal">
                    (shown in footer)
                  </span>
                </Label>
                <Input
                  id="site-link-label"
                  data-ocid="admin.site_link_label_input"
                  type="text"
                  placeholder="Visit My Shop"
                  value={siteLinkLabel}
                  onChange={(e) => setSiteLinkLabel(e.target.value)}
                  className="rounded-xl font-body"
                  autoComplete="off"
                />
              </div>

              <Button
                type="submit"
                data-ocid="admin.site_link_save_button"
                className="rounded-xl font-body gap-2 bg-primary text-primary-foreground"
              >
                <ExternalLink className="w-4 h-4" />
                Save Link
              </Button>
            </form>
          </div>
        </motion.div>

        {/* ── Social Media Links card ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="cozy-card overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-border flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
              <Share2 className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h2 className="font-heading font-semibold text-foreground">
                Social Media Links
              </h2>
              <p className="font-body text-xs text-muted-foreground">
                Add your Pinterest and Instagram — they become clickable icons
                in the footer
              </p>
            </div>
          </div>

          <div className="p-6">
            <form
              onSubmit={handleSaveSocialLinks}
              className="space-y-4 max-w-sm"
            >
              <div className="space-y-1.5">
                <Label
                  htmlFor="pinterest-link"
                  className="font-body text-sm font-medium flex items-center gap-2"
                >
                  <SiPinterest className="w-4 h-4 text-[oklch(0.55_0.18_10)]" />
                  Pinterest URL
                </Label>
                <Input
                  id="pinterest-link"
                  data-ocid="admin.pinterest_input"
                  type="url"
                  placeholder="https://pinterest.com/yourprofile"
                  value={pinterestLink}
                  onChange={(e) => setPinterestLink(e.target.value)}
                  className="rounded-xl font-body"
                  autoComplete="off"
                />
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="instagram-link"
                  className="font-body text-sm font-medium flex items-center gap-2"
                >
                  <SiInstagram className="w-4 h-4 text-[oklch(0.6_0.15_330)]" />
                  Instagram URL
                </Label>
                <Input
                  id="instagram-link"
                  data-ocid="admin.instagram_input"
                  type="url"
                  placeholder="https://instagram.com/yourprofile"
                  value={instagramLink}
                  onChange={(e) => setInstagramLink(e.target.value)}
                  className="rounded-xl font-body"
                  autoComplete="off"
                />
              </div>

              <Button
                type="submit"
                data-ocid="admin.social_links_save_button"
                className="rounded-xl font-body gap-2 bg-primary text-primary-foreground"
              >
                <Share2 className="w-4 h-4" />
                Save Social Links
              </Button>
            </form>
          </div>
        </motion.div>

        {/* Table */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="cozy-card overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-border">
            <h2 className="font-heading font-semibold text-foreground">
              All Stickers
            </h2>
          </div>

          {isLoadingStickers ? (
            <div className="p-6 space-y-3" data-ocid="catalog.loading_state">
              {["sk1", "sk2", "sk3", "sk4", "sk5"].map((sk) => (
                <Skeleton key={sk} className="h-14 w-full rounded-xl" />
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table data-ocid="admin.table">
                <TableHeader>
                  <TableRow className="border-border">
                    <TableHead className="font-heading text-foreground/70">
                      Image
                    </TableHead>
                    <TableHead className="font-heading text-foreground/70">
                      Title
                    </TableHead>
                    <TableHead className="font-heading text-foreground/70 hidden sm:table-cell">
                      Category
                    </TableHead>
                    <TableHead className="font-heading text-foreground/70 hidden md:table-cell">
                      Video
                    </TableHead>
                    <TableHead className="font-heading text-foreground/70 hidden lg:table-cell">
                      Featured
                    </TableHead>
                    <TableHead className="font-heading text-foreground/70 text-right">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stickers?.map((sticker, index) => (
                    <TableRow
                      key={sticker.id}
                      data-ocid="admin.row"
                      className="border-border hover:bg-secondary/40 transition-colors"
                    >
                      <TableCell>
                        <img
                          src={sticker.imageUrl}
                          alt={sticker.title}
                          className="w-10 h-10 rounded-xl object-cover border border-border"
                        />
                      </TableCell>
                      <TableCell className="font-body font-medium text-foreground max-w-[180px]">
                        <span className="truncate block">{sticker.title}</span>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <Badge
                          variant="secondary"
                          className="font-body text-xs rounded-full"
                        >
                          {sticker.category}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {getVideoUrl(sticker) ? (
                          <span className="font-body text-xs text-accent-foreground bg-accent/40 px-2 py-0.5 rounded-full">
                            🎬 Yes
                          </span>
                        ) : (
                          <span className="font-body text-xs text-muted-foreground">
                            —
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <button
                          type="button"
                          onClick={() => handleToggleFeatured(sticker.id)}
                          disabled={toggleFeaturedMutation.isPending}
                          className="p-1.5 rounded-lg hover:bg-muted transition-colors"
                          aria-label={
                            sticker.featured
                              ? "Remove from featured"
                              : "Add to featured"
                          }
                        >
                          {sticker.featured ? (
                            <Star className="w-4 h-4 text-[oklch(0.72_0.15_55)] fill-[oklch(0.72_0.15_55)]" />
                          ) : (
                            <StarOff className="w-4 h-4 text-muted-foreground" />
                          )}
                        </button>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            data-ocid={`admin.edit_button.${index + 1}`}
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditSticker(sticker)}
                            className="rounded-lg h-8 w-8 p-0 hover:bg-secondary"
                          >
                            <Pencil className="w-3.5 h-3.5 text-foreground/70" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                data-ocid={`admin.delete_button.${index + 1}`}
                                variant="ghost"
                                size="sm"
                                className="rounded-lg h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
                              >
                                <Trash2 className="w-3.5 h-3.5 text-destructive/70" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="rounded-3xl font-body">
                              <AlertDialogHeader>
                                <AlertDialogTitle className="font-display">
                                  Delete Sticker?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  This will permanently remove "{sticker.title}"
                                  from your collection. This action cannot be
                                  undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel
                                  data-ocid="admin.cancel_button"
                                  className="rounded-xl font-body"
                                >
                                  Cancel
                                </AlertDialogCancel>
                                <AlertDialogAction
                                  data-ocid="admin.confirm_button"
                                  onClick={() => handleDelete(sticker.id)}
                                  className="rounded-xl font-body bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {(!stickers || stickers.length === 0) && (
                <div data-ocid="admin.empty_state" className="p-12 text-center">
                  <div className="text-4xl mb-3">🎨</div>
                  <p className="font-display text-lg font-semibold text-foreground mb-1">
                    No stickers yet
                  </p>
                  <p className="font-body text-muted-foreground text-sm">
                    Click "Add Sticker" to create your first one, or "Seed Data"
                    to load sample stickers.
                  </p>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>

      {/* Add Modal */}
      <StickerFormModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        mode="add"
      />

      {/* Edit Modal */}
      <StickerFormModal
        open={!!editSticker}
        onClose={() => setEditSticker(null)}
        sticker={editSticker}
        mode="edit"
      />
    </div>
  );
}
