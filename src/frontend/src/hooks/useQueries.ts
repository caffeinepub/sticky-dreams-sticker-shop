import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Sticker } from "../backend.d";
import { useActor } from "./useActor";

export function useAllStickers() {
  const { actor, isFetching } = useActor();
  return useQuery<Sticker[]>({
    queryKey: ["stickers", "all"],
    queryFn: async () => {
      if (!actor) return [];
      const stickers = await actor.getAllStickers();
      return stickers;
    },
    enabled: !!actor && !isFetching,
  });
}

export function useFeaturedStickers() {
  const { actor, isFetching } = useActor();
  return useQuery<Sticker[]>({
    queryKey: ["stickers", "featured"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getFeaturedStickers();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useStickersByCategory(category: string) {
  const { actor, isFetching } = useActor();
  return useQuery<Sticker[]>({
    queryKey: ["stickers", "category", category],
    queryFn: async () => {
      if (!actor) return [];
      if (category === "All") return actor.getAllStickers();
      return actor.getStickersByCategory(category);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSeedStickers() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("No actor");
      await actor.seedStickers();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stickers"] });
    },
  });
}

export function useAddSticker() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (sticker: Sticker) => {
      if (!actor) throw new Error("No actor");
      await actor.addSticker(sticker);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stickers"] });
    },
  });
}

export function useUpdateSticker() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (sticker: Sticker) => {
      if (!actor) throw new Error("No actor");
      await actor.updateSticker(sticker);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stickers"] });
    },
  });
}

export function useDeleteSticker() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error("No actor");
      await actor.deleteSticker(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stickers"] });
    },
  });
}

export function useToggleFeatured() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error("No actor");
      await actor.toggleFeatured(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stickers"] });
    },
  });
}
