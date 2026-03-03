import { Toaster } from "@/components/ui/sonner";
import { RouterProvider } from "@tanstack/react-router";
import { InternetIdentityProvider } from "./hooks/useInternetIdentity";
import { router } from "./routeTree";

// Wrap with a second InternetIdentityProvider to configure windowOpenerFeatures: ""
// This opens Internet Identity in a new tab instead of a popup window,
// which bypasses browser popup blockers.
export default function App() {
  return (
    <InternetIdentityProvider
      createOptions={{
        loginOptions: {
          windowOpenerFeatures: "",
        },
      }}
    >
      <RouterProvider router={router} />
      <Toaster
        position="bottom-right"
        toastOptions={{
          classNames: {
            toast: "font-body rounded-2xl shadow-cozy",
          },
        }}
      />
    </InternetIdentityProvider>
  );
}
