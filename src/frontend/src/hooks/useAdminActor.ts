import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import type { backendInterface } from "../backend.d";
import { createActorWithConfig } from "../config";
import { getSecretParameter, getSessionParameter } from "../utils/urlParams";

const ADMIN_ACTOR_KEY = "adminActor";
const ADMIN_TOKEN_SESSION_KEY = "caffeineAdminToken";

/**
 * Creates an actor initialized with the admin token, bypassing Internet Identity.
 * Used for admin CRUD operations when PIN-based auth is used instead of II.
 */
export function useAdminActor() {
  const queryClient = useQueryClient();

  const actorQuery = useQuery<backendInterface>({
    queryKey: [ADMIN_ACTOR_KEY],
    queryFn: async () => {
      const adminToken =
        getSecretParameter(ADMIN_TOKEN_SESSION_KEY) ||
        getSessionParameter(ADMIN_TOKEN_SESSION_KEY) ||
        "";
      const actor = await createActorWithConfig();
      if (adminToken) {
        await (actor as any)._initializeAccessControlWithSecret(adminToken);
      }
      return actor;
    },
    staleTime: Number.POSITIVE_INFINITY,
    enabled: true,
  });

  useEffect(() => {
    if (actorQuery.data) {
      queryClient.invalidateQueries({
        predicate: (query) => {
          return !query.queryKey.includes(ADMIN_ACTOR_KEY);
        },
      });
    }
  }, [actorQuery.data, queryClient]);

  return {
    actor: actorQuery.data || null,
    isFetching: actorQuery.isFetching,
  };
}
