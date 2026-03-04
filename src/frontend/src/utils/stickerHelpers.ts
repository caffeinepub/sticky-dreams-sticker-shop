// price field is repurposed as videoUrl storage
export function getVideoUrl(sticker: { price: string }): string {
  return sticker.price ?? "";
}

export function setVideoUrl(videoUrl: string): string {
  return videoUrl;
}
