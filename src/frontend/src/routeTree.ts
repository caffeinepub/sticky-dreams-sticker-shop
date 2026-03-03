import {
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import AdminPage from "./pages/AdminPage";
import RootLayout from "./pages/RootLayout";
import ShopPage from "./pages/ShopPage";

export const rootRoute = createRootRoute({
  component: RootLayout,
});

export const shopRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: ShopPage,
});

export const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: AdminPage,
});

export const routeTree = rootRoute.addChildren([shopRoute, adminRoute]);

export const router = createRouter({ routeTree });
