import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Sticker } from "../backend.d";
import * as store from "./useStickerStore";

export function useAllStickers() {
  return useQuery<Sticker[]>({
    queryKey: ["stickers", "all"],
    queryFn: () => store.getAllStickers(),
  });
}

export function useFeaturedStickers() {
  return useQuery<Sticker[]>({
    queryKey: ["stickers", "featured"],
    queryFn: () => store.getFeaturedStickers(),
  });
}

export function useStickersByCategory(category: string) {
  return useQuery<Sticker[]>({
    queryKey: ["stickers", "category", category],
    queryFn: () => store.getStickersByCategory(category),
  });
}

export function useSeedStickers() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      store.seedStickers();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stickers"] });
    },
  });
}

export function useAddSticker() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (sticker: Sticker) => {
      store.addSticker(sticker);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stickers"] });
    },
  });
}

export function useUpdateSticker() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (sticker: Sticker) => {
      store.updateSticker(sticker);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stickers"] });
    },
  });
}

export function useDeleteSticker() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      store.deleteSticker(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stickers"] });
    },
  });
}

export function useToggleFeatured() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      store.toggleFeatured(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stickers"] });
    },
  });
}
