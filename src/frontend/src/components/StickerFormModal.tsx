import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ImagePlus, Loader2, Upload, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import type { Sticker } from "../backend.d";
import { useAddSticker, useUpdateSticker } from "../hooks/useQueries";
import { useStorageUpload } from "../hooks/useStorageUpload";

const CATEGORIES = ["Cute Animals", "Floral", "Fun Phrases", "Seasonal"];

interface StickerFormModalProps {
  open: boolean;
  onClose: () => void;
  sticker?: Sticker | null;
  mode: "add" | "edit";
}

const defaultForm: Omit<Sticker, "id" | "createdAt"> = {
  title: "",
  description: "",
  price: "",
  category: "",
  imageUrl: "",
  amazonLink: "",
  pinterestLink: "",
  featured: false,
};

export default function StickerFormModal({
  open,
  onClose,
  sticker,
  mode,
}: StickerFormModalProps) {
  const [form, setForm] = useState(defaultForm);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addMutation = useAddSticker();
  const updateMutation = useUpdateSticker();
  const { uploadFile, uploadProgress, isUploading, uploadError, resetUpload } =
    useStorageUpload();

  const isPending =
    addMutation.isPending || updateMutation.isPending || isUploading;

  // Reset form when sticker changes
  useEffect(() => {
    if (sticker) {
      setForm({
        title: sticker.title,
        description: sticker.description,
        price: sticker.price,
        category: sticker.category,
        imageUrl: sticker.imageUrl,
        amazonLink: sticker.amazonLink,
        pinterestLink: sticker.pinterestLink,
        featured: sticker.featured,
      });
      setPreviewUrl(sticker.imageUrl || null);
    } else {
      setForm(defaultForm);
      setPreviewUrl(null);
    }
    setImageFile(null);
    resetUpload();
  }, [sticker, resetUpload]);

  // Create / revoke object URL for selected file
  useEffect(() => {
    if (!imageFile) return;
    const url = URL.createObjectURL(imageFile);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [imageFile]);

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file (PNG, JPG, GIF, WEBP, etc.)");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image must be smaller than 10 MB");
      return;
    }
    setImageFile(file);
    resetUpload();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
    // Reset input so same file can be selected again
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent<HTMLElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileSelect(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => setIsDragOver(false);

  const clearImage = () => {
    setImageFile(null);
    setPreviewUrl(null);
    setForm((prev) => ({ ...prev, imageUrl: "" }));
    resetUpload();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let finalImageUrl = form.imageUrl;

      // Upload new file if one was selected
      if (imageFile) {
        finalImageUrl = await uploadFile(imageFile);
        setForm((prev) => ({ ...prev, imageUrl: finalImageUrl }));
      }

      if (mode === "add") {
        const newSticker: Sticker = {
          ...form,
          imageUrl: finalImageUrl,
          id: crypto.randomUUID(),
          createdAt: BigInt(Date.now()),
        };
        await addMutation.mutateAsync(newSticker);
        toast.success("Sticker added! 🎉");
      } else if (sticker) {
        await updateMutation.mutateAsync({
          ...sticker,
          ...form,
          imageUrl: finalImageUrl,
        });
        toast.success("Sticker updated! ✨");
      }
      onClose();
    } catch {
      if (uploadError) {
        toast.error(`Image upload failed: ${uploadError}`);
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    }
  };

  const update = (field: keyof typeof form, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const hasImage = !!previewUrl || !!form.imageUrl;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        data-ocid="admin.dialog"
        className="max-w-lg rounded-3xl font-body max-h-[90vh] overflow-y-auto"
      >
        <DialogHeader>
          <DialogTitle className="font-display text-xl">
            {mode === "add" ? "Add New Sticker" : "Edit Sticker"}
          </DialogTitle>
          <DialogDescription>
            {mode === "add"
              ? "Fill in the details for your new sticker design."
              : "Update the sticker details below."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {/* Title */}
          <div className="space-y-1.5">
            <Label htmlFor="title" className="font-body font-medium text-sm">
              Title *
            </Label>
            <Input
              id="title"
              data-ocid="sticker_form.title_input"
              value={form.title}
              onChange={(e) => update("title", e.target.value)}
              placeholder="e.g. Fluffy Bunny Sticker"
              required
              className="rounded-xl font-body"
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label
              htmlFor="description"
              className="font-body font-medium text-sm"
            >
              Description *
            </Label>
            <Textarea
              id="description"
              data-ocid="sticker_form.description_input"
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              placeholder="Describe your sticker..."
              required
              rows={3}
              className="rounded-xl font-body resize-none"
            />
          </div>

          {/* Price + Category row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="price" className="font-body font-medium text-sm">
                Price *
              </Label>
              <Input
                id="price"
                data-ocid="sticker_form.price_input"
                value={form.price}
                onChange={(e) => update("price", e.target.value)}
                placeholder="$4.99"
                required
                className="rounded-xl font-body"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="font-body font-medium text-sm">
                Category *
              </Label>
              <Select
                value={form.category}
                onValueChange={(v) => update("category", v)}
                required
              >
                <SelectTrigger
                  data-ocid="sticker_form.category_input"
                  className="rounded-xl font-body"
                >
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent className="rounded-2xl font-body">
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat} className="rounded-xl">
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Image Upload Section */}
          <div className="space-y-2">
            <Label className="font-body font-medium text-sm">
              Sticker Image *
            </Label>

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleInputChange}
              aria-label="Upload sticker image"
            />

            {/* Preview area (shown when image is selected or exists) */}
            {hasImage ? (
              <div className="relative rounded-2xl overflow-hidden border-2 border-border bg-muted/40 group">
                <img
                  src={previewUrl ?? form.imageUrl}
                  alt="Sticker preview"
                  className="w-full h-48 object-contain p-2"
                  onError={() => {
                    if (!imageFile) setPreviewUrl(null);
                  }}
                />
                {/* Upload progress overlay */}
                {isUploading && (
                  <div className="absolute inset-0 bg-background/80 flex flex-col items-center justify-center gap-3 rounded-2xl">
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                    <span className="text-sm font-body font-medium text-foreground">
                      Uploading… {uploadProgress}%
                    </span>
                    <Progress
                      value={uploadProgress}
                      className="w-3/4 h-2 rounded-full"
                    />
                  </div>
                )}
                {/* Change / Remove controls */}
                {!isUploading && (
                  <div className="absolute inset-0 bg-foreground/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 rounded-2xl">
                    <Button
                      type="button"
                      data-ocid="sticker_form.upload_button"
                      size="sm"
                      variant="secondary"
                      onClick={() => fileInputRef.current?.click()}
                      className="rounded-xl font-body gap-1.5 text-xs"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      Change
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="destructive"
                      onClick={clearImage}
                      className="rounded-xl font-body gap-1.5 text-xs"
                    >
                      <X className="w-3.5 h-3.5" />
                      Remove
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              /* Dropzone (shown when no image) */
              <button
                type="button"
                data-ocid="sticker_form.dropzone"
                aria-label="Upload sticker image — click or drag and drop"
                onClick={() => fileInputRef.current?.click()}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className={[
                  "w-full cursor-pointer rounded-2xl border-2 border-dashed transition-all duration-200",
                  "flex flex-col items-center justify-center gap-3 py-8 px-4",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  isDragOver
                    ? "border-primary bg-primary/8 scale-[1.01]"
                    : "border-border bg-muted/30 hover:border-primary/60 hover:bg-primary/5",
                ].join(" ")}
              >
                <div className="rounded-full bg-primary/10 p-3">
                  <ImagePlus className="w-6 h-6 text-primary" />
                </div>
                <div className="text-center space-y-1">
                  <p className="font-body font-medium text-sm text-foreground">
                    {isDragOver
                      ? "Drop your image here"
                      : "Click to upload image"}
                  </p>
                  <p className="font-body text-xs text-muted-foreground">
                    PNG, JPG, GIF, WEBP — up to 10 MB
                  </p>
                </div>
                <span
                  data-ocid="sticker_form.upload_button"
                  className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-background px-3 py-1.5 text-sm font-body text-foreground pointer-events-none"
                >
                  <Upload className="w-3.5 h-3.5" />
                  Browse files
                </span>
              </button>
            )}

            {/* Upload progress bar (standalone, when uploading without preview overlay) */}
            {isUploading && !hasImage && (
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-body text-muted-foreground">
                  <span>Uploading image…</span>
                  <span>{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="h-2 rounded-full" />
              </div>
            )}

            {/* Upload error */}
            {uploadError && (
              <p
                data-ocid="sticker_form.error_state"
                className="text-xs font-body text-destructive"
              >
                ⚠ {uploadError}
              </p>
            )}

            {/* Fallback URL input */}
            <div className="space-y-1.5">
              <p className="text-xs font-body text-muted-foreground text-center">
                — or paste an image URL —
              </p>
              <Input
                id="imageUrl"
                data-ocid="sticker_form.image_url_input"
                value={imageFile ? "" : form.imageUrl}
                onChange={(e) => {
                  if (imageFile) {
                    // If file was selected, clear it when user types URL
                    setImageFile(null);
                    setPreviewUrl(e.target.value || null);
                  } else {
                    setPreviewUrl(e.target.value || null);
                  }
                  update("imageUrl", e.target.value);
                }}
                placeholder="https://example.com/sticker.png"
                disabled={!!imageFile}
                className="rounded-xl font-body text-sm"
              />
            </div>
          </div>

          {/* Amazon Link */}
          <div className="space-y-1.5">
            <Label
              htmlFor="amazonLink"
              className="font-body font-medium text-sm"
            >
              Amazon Link
            </Label>
            <Input
              id="amazonLink"
              data-ocid="sticker_form.amazon_link_input"
              value={form.amazonLink}
              onChange={(e) => update("amazonLink", e.target.value)}
              placeholder="https://amazon.com/..."
              className="rounded-xl font-body"
            />
          </div>

          {/* Pinterest Link */}
          <div className="space-y-1.5">
            <Label
              htmlFor="pinterestLink"
              className="font-body font-medium text-sm"
            >
              Pinterest Link
            </Label>
            <Input
              id="pinterestLink"
              data-ocid="sticker_form.pinterest_link_input"
              value={form.pinterestLink}
              onChange={(e) => update("pinterestLink", e.target.value)}
              placeholder="https://pinterest.com/pin/..."
              className="rounded-xl font-body"
            />
          </div>

          {/* Featured checkbox */}
          <div className="flex items-center gap-2.5 py-1">
            <Checkbox
              id="featured"
              data-ocid="sticker_form.featured_checkbox"
              checked={form.featured}
              onCheckedChange={(v) => update("featured", !!v)}
              className="rounded"
            />
            <Label
              htmlFor="featured"
              className="font-body text-sm cursor-pointer"
            >
              Mark as featured ⭐
            </Label>
          </div>

          <DialogFooter className="gap-2 pt-2">
            <Button
              type="button"
              data-ocid="admin.cancel_button"
              variant="outline"
              onClick={onClose}
              disabled={isPending}
              className="rounded-xl font-body flex-1 sm:flex-none"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              data-ocid="admin.submit_button"
              disabled={
                isPending ||
                !form.title ||
                !form.description ||
                !form.price ||
                !form.category ||
                (!form.imageUrl && !imageFile)
              }
              className="rounded-xl font-body flex-1 sm:flex-none bg-primary text-primary-foreground gap-2"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Uploading… {uploadProgress}%
                </>
              ) : addMutation.isPending || updateMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Saving...
                </>
              ) : mode === "add" ? (
                "Add Sticker"
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
