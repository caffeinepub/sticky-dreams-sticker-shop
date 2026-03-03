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
  KeyRound,
  Loader2,
  LogOut,
  Pencil,
  Plus,
  Sprout,
  Star,
  StarOff,
  Trash2,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { Sticker } from "../backend.d";
import StickerFormModal from "../components/StickerFormModal";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useLogin } from "../hooks/useLogin";
import {
  useAllStickers,
  useDeleteSticker,
  useIsAdmin,
  useSeedStickers,
  useToggleFeatured,
} from "../hooks/useQueries";
import { getSessionParameter, storeSessionParameter } from "../utils/urlParams";

export default function AdminPage() {
  const { login, loginStatus, identity } = useLogin();
  const { clear: logout } = useInternetIdentity();

  // Identity is available both after a fresh login (loginStatus === "success")
  // and after returning from the Internet Identity redirect (loginStatus === "idle"
  // but identity is restored from localStorage). Both cases count as logged in.
  const isLoggedIn = !!identity && !identity.getPrincipal().isAnonymous();
  const isInitializing = loginStatus === "initializing";

  const { data: isAdmin, isLoading: isLoadingAdmin } = useIsAdmin();
  const { data: stickers, isLoading: isLoadingStickers } = useAllStickers();
  const seedMutation = useSeedStickers();
  const deleteMutation = useDeleteSticker();
  const toggleFeaturedMutation = useToggleFeatured();

  const [addOpen, setAddOpen] = useState(false);
  const [editSticker, setEditSticker] = useState<Sticker | null>(null);

  // Pre-login admin token entry state
  const [adminTokenInput, setAdminTokenInput] = useState(
    getSessionParameter("caffeineAdminToken") ?? "",
  );
  const [tokenError, setTokenError] = useState("");

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

  /**
   * Step 1 (not logged in): user enters their admin token, we save it to
   * sessionStorage, then trigger the login redirect.  When Internet Identity
   * returns, useActor picks up the token from sessionStorage and registers the
   * principal as admin on first contact with the backend.
   */
  const handleTokenAndLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const token = adminTokenInput.trim();
    if (!token) {
      setTokenError("Please enter your admin token.");
      return;
    }
    storeSessionParameter("caffeineAdminToken", token);
    login();
  };

  // Still resolving the stored identity — show a spinner
  if (isInitializing) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // ── STATE A: not logged in ──────────────────────────────────────────────
  // Collect the admin token FIRST, then redirect to Internet Identity.
  // This ensures useActor receives the real token and registers the principal
  // as admin on first call — before any empty-string registration can happen.
  if (!isLoggedIn) {
    const hasSavedToken = !!getSessionParameter("caffeineAdminToken");

    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="cozy-card p-10 text-center max-w-md w-full"
        >
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <KeyRound className="w-7 h-7 text-primary" />
          </div>
          <h1 className="font-display text-2xl font-semibold text-foreground mb-2">
            Admin Sign In
          </h1>
          <p className="font-body text-muted-foreground mb-6">
            {hasSavedToken
              ? "Token saved. Click below to sign in."
              : "Enter your admin token, then sign in to continue."}
          </p>

          <form onSubmit={handleTokenAndLogin} className="space-y-4 text-left">
            <div className="space-y-1.5">
              <Label
                htmlFor="admin-token"
                className="font-body text-sm text-foreground/70"
              >
                Admin Token
              </Label>
              <Input
                id="admin-token"
                data-ocid="admin.input"
                type="password"
                placeholder="Paste your CAFFEINE_ADMIN_TOKEN…"
                value={adminTokenInput}
                onChange={(e) => {
                  setAdminTokenInput(e.target.value);
                  setTokenError("");
                }}
                className="rounded-xl font-body border-border focus-visible:ring-primary"
                autoComplete="off"
                disabled={loginStatus === "logging-in"}
              />
              <p className="font-body text-xs text-muted-foreground">
                Find this in your Caffeine project settings as{" "}
                <code className="bg-muted px-1 py-0.5 rounded text-foreground/80">
                  CAFFEINE_ADMIN_TOKEN
                </code>
                .
              </p>
            </div>

            {tokenError && (
              <p
                data-ocid="admin.error_state"
                className="font-body text-sm text-destructive text-center"
              >
                {tokenError}
              </p>
            )}

            <Button
              data-ocid="admin.submit_button"
              type="submit"
              disabled={loginStatus === "logging-in"}
              className="rounded-2xl font-body gap-2 bg-primary text-primary-foreground w-full"
            >
              {loginStatus === "logging-in" ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Signing in…
                </>
              ) : (
                <>
                  <KeyRound className="w-4 h-4" /> Save Token & Sign In
                </>
              )}
            </Button>
          </form>

          <div className="mt-5">
            <Link
              to="/"
              data-ocid="admin.link"
              className="font-body text-sm text-muted-foreground hover:text-primary transition-colors flex items-center justify-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to shop
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  // ── Loading admin check ─────────────────────────────────────────────────
  if (isLoadingAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // ── STATE D: logged in but NOT admin ───────────────────────────────────
  // This happens when the user previously signed in without a token and got
  // registered as a plain user.  They must sign out and sign in again using
  // the token form above.
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="cozy-card p-10 text-center max-w-md w-full"
        >
          <div className="text-5xl mb-4">🔒</div>
          <h1 className="font-display text-2xl font-semibold text-foreground mb-2">
            Admin Access Required
          </h1>
          <p className="font-body text-muted-foreground mb-2">
            Your account doesn&apos;t have admin privileges.
          </p>
          <p className="font-body text-sm text-muted-foreground mb-6">
            This can happen if you signed in before entering the admin token.
            Please sign out and sign in again — make sure to enter your{" "}
            <code className="bg-muted px-1 py-0.5 rounded text-foreground/80">
              CAFFEINE_ADMIN_TOKEN
            </code>{" "}
            first.
          </p>

          <Button
            data-ocid="admin.primary_button"
            onClick={logout}
            className="rounded-2xl font-body gap-2 bg-primary text-primary-foreground w-full"
          >
            <LogOut className="w-4 h-4" /> Sign Out &amp; Try Again
          </Button>

          <div className="mt-5">
            <Link
              to="/"
              data-ocid="admin.link"
              className="font-body text-sm text-muted-foreground hover:text-primary transition-colors flex items-center justify-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to shop
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

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
                Shop
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
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 py-8">
        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8"
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
              label: "Categories",
              value: new Set(stickers?.map((s) => s.category)).size ?? 0,
              emoji: "📂",
            },
            {
              label: "With Amazon",
              value: stickers?.filter((s) => s.amazonLink).length ?? 0,
              emoji: "🛒",
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
                      Price
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
                      <TableCell className="font-body font-semibold text-primary hidden md:table-cell">
                        {sticker.price}
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
                                  from your shop. This action cannot be undone.
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
                                  data-ocid="admin.submit_button"
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
                <div className="p-12 text-center">
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
