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
import { useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  KeyRound,
  Loader2,
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
import { useActor } from "../hooks/useActor";
import { useLogin } from "../hooks/useLogin";
import {
  useAllStickers,
  useDeleteSticker,
  useIsAdmin,
  useSeedStickers,
  useToggleFeatured,
} from "../hooks/useQueries";

export default function AdminPage() {
  const { login, loginStatus, identity } = useLogin();
  // Identity is available both after a fresh login (loginStatus === "success")
  // and after returning from the Internet Identity redirect (loginStatus === "idle"
  // but identity is restored from localStorage). Both cases count as logged in.
  const isLoggedIn = !!identity && !identity.getPrincipal().isAnonymous();

  const { data: isAdmin, isLoading: isLoadingAdmin } = useIsAdmin();
  const { data: stickers, isLoading: isLoadingStickers } = useAllStickers();
  const seedMutation = useSeedStickers();
  const deleteMutation = useDeleteSticker();
  const toggleFeaturedMutation = useToggleFeatured();
  const { actor } = useActor();
  const queryClient = useQueryClient();

  const [addOpen, setAddOpen] = useState(false);
  const [editSticker, setEditSticker] = useState<Sticker | null>(null);

  // Admin password unlock state
  const [adminPassword, setAdminPassword] = useState("");
  const [unlockLoading, setUnlockLoading] = useState(false);
  const [unlockError, setUnlockError] = useState("");

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

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!actor || !adminPassword.trim()) return;
    setUnlockLoading(true);
    setUnlockError("");
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (actor as any)._initializeAccessControlWithSecret(adminPassword);
      await queryClient.invalidateQueries({ queryKey: ["isAdmin"] });
      await queryClient.refetchQueries({ queryKey: ["isAdmin"] });
      const updatedIsAdmin = queryClient.getQueryData<boolean>(["isAdmin"]);
      if (!updatedIsAdmin) {
        setUnlockError("Incorrect password or admin access already claimed.");
      }
    } catch {
      setUnlockError("Incorrect password or admin access already claimed.");
    } finally {
      setUnlockLoading(false);
    }
  };

  // Not logged in
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="cozy-card p-10 text-center max-w-md w-full"
        >
          <div className="text-5xl mb-4">🔒</div>
          <h1 className="font-display text-2xl font-semibold text-foreground mb-2">
            Sign In Required
          </h1>
          <p className="font-body text-muted-foreground mb-6">
            Please sign in to access the admin panel.
          </p>
          <Button
            onClick={login}
            disabled={loginStatus === "logging-in"}
            className="rounded-2xl font-body gap-2 bg-primary text-primary-foreground w-full"
          >
            {loginStatus === "logging-in" ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </Button>
          <div className="mt-4">
            <Link
              to="/"
              className="font-body text-sm text-muted-foreground hover:text-primary transition-colors flex items-center justify-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to shop
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  // Loading admin check
  if (isLoadingAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Not admin — show password unlock form
  if (!isAdmin) {
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
            Admin Access
          </h1>
          <p className="font-body text-muted-foreground mb-6">
            Enter the admin password to unlock the dashboard.
          </p>

          <form onSubmit={handleUnlock} className="space-y-4 text-left">
            <div className="space-y-1.5">
              <Label
                htmlFor="admin-password"
                className="font-body text-sm text-foreground/70"
              >
                Admin Password
              </Label>
              <Input
                id="admin-password"
                data-ocid="admin.input"
                type="password"
                placeholder="Enter admin password…"
                value={adminPassword}
                onChange={(e) => {
                  setAdminPassword(e.target.value);
                  setUnlockError("");
                }}
                className="rounded-xl font-body border-border focus-visible:ring-primary"
                autoComplete="current-password"
                disabled={unlockLoading}
              />
            </div>

            {unlockError && (
              <p
                data-ocid="admin.error_state"
                className="font-body text-sm text-destructive text-center"
              >
                {unlockError}
              </p>
            )}

            <Button
              data-ocid="admin.submit_button"
              type="submit"
              disabled={unlockLoading || !adminPassword.trim()}
              className="rounded-2xl font-body gap-2 bg-primary text-primary-foreground w-full"
            >
              {unlockLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Unlocking…
                </>
              ) : (
                <>
                  <KeyRound className="w-4 h-4" /> Unlock
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
