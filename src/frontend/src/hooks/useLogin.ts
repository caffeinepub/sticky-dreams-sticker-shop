import { AuthClient } from "@dfinity/auth-client";
import { useCallback } from "react";
import { getSecretParameter, storeSessionParameter } from "../utils/urlParams";
import { useInternetIdentity } from "./useInternetIdentity";

/**
 * Drop-in replacement for useInternetIdentity that overrides `login`
 * to use same-tab redirect instead of a popup window.
 *
 * Many browsers silently block popups that aren't opened on the immediate
 * user-gesture event tick, so we force `windowOpenerFeatures: ""` which
 * tells the AuthClient to open the identity provider in the **same tab**
 * via a redirect rather than a popup.
 *
 * We also persist the caffeineAdminToken to sessionStorage BEFORE redirecting,
 * so it survives the Internet Identity redirect and is available when the user
 * returns to the app.
 */
export function useLogin() {
  const context = useInternetIdentity();

  const login = useCallback(() => {
    const identityProvider =
      (process.env.II_URL as string | undefined) ?? "https://identity.ic0.app";

    // Persist the admin token before redirecting away — the URL hash will be
    // lost during the Internet Identity redirect flow.
    const adminToken = getSecretParameter("caffeineAdminToken");
    if (adminToken) {
      storeSessionParameter("caffeineAdminToken", adminToken);
    }

    AuthClient.create({
      idleOptions: {
        disableIdle: true,
        disableDefaultIdleCallback: true,
      },
    }).then((client) => {
      client.login({
        identityProvider,
        // Empty string forces same-tab redirect — no popup is opened
        windowOpenerFeatures: "",
        maxTimeToLive: BigInt(30 * 24 * 3_600_000_000_000),
        onSuccess: () => window.location.reload(),
        onError: (err) => console.error("Login error:", err),
      });
    });
  }, []);

  return { ...context, login };
}
