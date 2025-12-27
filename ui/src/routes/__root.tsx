import { createRootRouteWithContext } from "@tanstack/react-router";

import Layout from "components/Layout";
import { RouterContext } from "routerContext";

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootComponent,
});

function RootComponent() {
  const { onLogout } = Route.useRouteContext();

  return <Layout onLogout={onLogout} />;
}
