// price field is repurposed as videoUrl storage
export function getVideoUrl(sticker: { price: string }): string {
  const v = sticker.price ?? "";
  return v.startsWith("data:") || v.startsWith("http") ? v : "";
}
