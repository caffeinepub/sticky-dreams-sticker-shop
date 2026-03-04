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
import { Textarea } from "@/components/ui/textarea";
import { ImagePlus, Loader2, Upload, Video, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import type { Sticker } from "../backend.d";
import { useAddSticker, useUpdateSticker } from "../hooks/useQueries";
import { useStorageUpload } from "../hooks/useStorageUpload";
import { getVideoUrl } from "../utils/stickerHelpers";

interface StickerFormModalProps {
  open: boolean;
  onClose: () => void;
  sticker?: Sticker | null;
  mode: "add" | "edit";
}

interface FormState {
  title: string;
  description: string;
  category: string;
  imageUrl: string;
  featured: boolean;
  videoUrl: string;
}

const defaultForm: FormState = {
  title: "",
  description: "",
  category: "",
  imageUrl: "",
  featured: false,
  videoUrl: "",
};

export default function StickerFormModal({
  open,
  onClose,
  sticker,
  mode,
}: StickerFormModalProps) {
  const [form, setForm] = useState<FormState>(defaultForm);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const [videoUploadProgress, setVideoUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const addMutation = useAddSticker();
  const updateMutation = useUpdateSticker();
  const { uploadFile, uploadProgress, isUploading, uploadError, resetUpload } =
    useStorageUpload();

  const isPending =
    addMutation.isPending ||
    updateMutation.isPending ||
    isUploading ||
    isUploadingVideo;

  // Reset form when sticker changes
  useEffect(() => {
    if (sticker) {
      setForm({
        title: sticker.title,
        description: sticker.description,
        category: sticker.category,
        imageUrl: sticker.imageUrl,
        featured: sticker.featured,
        videoUrl: getVideoUrl(sticker),
      });
      setPreviewUrl(sticker.imageUrl || null);
      setVideoPreviewUrl(getVideoUrl(sticker) || null);
    } else {
      setForm(defaultForm);
      setPreviewUrl(null);
      setVideoPreviewUrl(null);
    }
    setImageFile(null);
    setVideoFile(null);
    resetUpload();
  }, [sticker, resetUpload]);

  // Create / revoke object URL for selected image file
  useEffect(() => {
    if (!imageFile) return;
    const url = URL.createObjectURL(imageFile);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [imageFile]);

  // Create / revoke object URL for selected video file
  useEffect(() => {
    if (!videoFile) return;
    const url = URL.createObjectURL(videoFile);
    setVideoPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [videoFile]);

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

  const handleVideoFileSelect = (file: File) => {
    if (!file.type.startsWith("video/")) {
      toast.error("Please select a video file (MP4, WEBM, MOV, etc.)");
      return;
    }
    if (file.size > 50 * 1024 * 1024) {
      toast.error("Video must be smaller than 50 MB");
      return;
    }
    setVideoFile(file);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
    e.target.value = "";
  };

  const handleVideoInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleVideoFileSelect(file);
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

  const clearVideo = () => {
    setVideoFile(null);
    setVideoPreviewUrl(null);
    setForm((prev) => ({ ...prev, videoUrl: "" }));
  };

  // Upload video file to get data URL
  const uploadVideoFile = async (file: File): Promise<string> => {
    setIsUploadingVideo(true);
    setVideoUploadProgress(0);
    try {
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onprogress = (e) => {
          if (e.lengthComputable) {
            setVideoUploadProgress(Math.round((e.loaded / e.total) * 90));
          }
        };
        reader.onload = () => {
          setVideoUploadProgress(100);
          resolve(reader.result as string);
        };
        reader.onerror = () => reject(new Error("Failed to read video file"));
        reader.readAsDataURL(file);
      });
      return dataUrl;
    } finally {
      setIsUploadingVideo(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let finalImageUrl = form.imageUrl;
      let finalVideoUrl = form.videoUrl;

      // Upload new image if one was selected
      if (imageFile) {
        finalImageUrl = await uploadFile(imageFile);
      }

      // Upload new video if one was selected
      if (videoFile) {
        finalVideoUrl = await uploadVideoFile(videoFile);
      }

      if (mode === "add") {
        const newSticker: Sticker = {
          title: form.title,
          description: form.description,
          category: form.category,
          imageUrl: finalImageUrl,
          featured: form.featured,
          id: crypto.randomUUID(),
          createdAt: BigInt(Date.now()),
          price: finalVideoUrl, // videoUrl stored in price field
          amazonLink: "",
          pinterestLink: "",
        };
        await addMutation.mutateAsync(newSticker);
        toast.success("Sticker added! 🎉");
      } else if (sticker) {
        await updateMutation.mutateAsync({
          ...sticker,
          title: form.title,
          description: form.description,
          category: form.category,
          imageUrl: finalImageUrl,
          featured: form.featured,
          price: finalVideoUrl, // videoUrl stored in price field
          amazonLink: "",
          pinterestLink: "",
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

  const update = <K extends keyof FormState>(field: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const hasImage = !!previewUrl || !!form.imageUrl;
  const hasVideo = !!videoPreviewUrl || !!form.videoUrl;

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
              placeholder="e.g. Laughing Emoji Sticker"
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

          {/* Category — free text input */}
          <div className="space-y-1.5">
            <Label htmlFor="category" className="font-body font-medium text-sm">
              Category *
            </Label>
            <Input
              id="category"
              data-ocid="sticker_form.category_input"
              value={form.category}
              onChange={(e) => update("category", e.target.value)}
              placeholder="e.g. Funny, Expressive, Animated…"
              required
              className="rounded-xl font-body"
            />
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

          {/* ── Video Upload Section ── */}
          <div className="space-y-2">
            <Label className="font-body font-medium text-sm flex items-center gap-2">
              <Video className="w-4 h-4 text-primary" />
              Video{" "}
              <span className="text-muted-foreground font-normal">
                (optional) — like a WhatsApp sticker
              </span>
            </Label>

            {/* Hidden video input */}
            <input
              ref={videoInputRef}
              type="file"
              accept="video/*"
              className="hidden"
              onChange={handleVideoInputChange}
              aria-label="Upload sticker video"
            />

            {/* Video preview */}
            {hasVideo ? (
              <div className="space-y-2">
                <div className="relative rounded-2xl overflow-hidden border-2 border-border bg-muted/40">
                  <video
                    src={videoPreviewUrl ?? form.videoUrl}
                    className="w-full max-h-48 object-contain"
                    muted
                    loop
                    autoPlay
                    playsInline
                    controls
                  />
                  {isUploadingVideo && (
                    <div className="absolute inset-0 bg-background/80 flex flex-col items-center justify-center gap-3 rounded-2xl">
                      <Loader2 className="w-6 h-6 animate-spin text-primary" />
                      <span className="text-sm font-body font-medium text-foreground">
                        Processing video… {videoUploadProgress}%
                      </span>
                      <Progress
                        value={videoUploadProgress}
                        className="w-3/4 h-2 rounded-full"
                      />
                    </div>
                  )}
                </div>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={clearVideo}
                  className="rounded-xl font-body gap-1.5 text-xs text-destructive border-destructive/30 hover:bg-destructive/10"
                >
                  <X className="w-3.5 h-3.5" />
                  Remove Video
                </Button>
              </div>
            ) : (
              /* Video dropzone */
              <button
                type="button"
                data-ocid="sticker_form.dropzone"
                aria-label="Upload sticker video — click to browse"
                onClick={() => videoInputRef.current?.click()}
                className="w-full cursor-pointer rounded-2xl border-2 border-dashed border-border bg-muted/20 hover:border-primary/50 hover:bg-primary/3 transition-all duration-200 flex flex-col items-center justify-center gap-3 py-6 px-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <div className="rounded-full bg-accent/30 p-3">
                  <Video className="w-6 h-6 text-accent-foreground" />
                </div>
                <div className="text-center space-y-1">
                  <p className="font-body font-medium text-sm text-foreground">
                    Click to upload video
                  </p>
                  <p className="font-body text-xs text-muted-foreground">
                    MP4, WEBM, MOV — up to 50 MB
                  </p>
                </div>
              </button>
            )}

            {/* Fallback video URL input */}
            <div className="space-y-1.5">
              <p className="text-xs font-body text-muted-foreground text-center">
                — or paste a video URL —
              </p>
              <Input
                id="videoUrl"
                data-ocid="sticker_form.input"
                value={videoFile ? "" : form.videoUrl}
                onChange={(e) => {
                  if (videoFile) {
                    setVideoFile(null);
                    setVideoPreviewUrl(e.target.value || null);
                  } else {
                    setVideoPreviewUrl(e.target.value || null);
                  }
                  update("videoUrl", e.target.value);
                }}
                placeholder="https://example.com/sticker.mp4"
                disabled={!!videoFile}
                className="rounded-xl font-body text-sm"
              />
            </div>
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
                !form.category ||
                (!form.imageUrl && !imageFile)
              }
              className="rounded-xl font-body flex-1 sm:flex-none bg-primary text-primary-foreground gap-2"
            >
              {isUploading || isUploadingVideo ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {isUploadingVideo
                    ? `Processing video… ${videoUploadProgress}%`
                    : `Uploading… ${uploadProgress}%`}
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
