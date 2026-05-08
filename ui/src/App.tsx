import { useEffect, useState } from "react";

import { User } from "api/models";

import { RouterProvider } from "@tanstack/react-router";

import * as models from "api/models";
import { getClient, removeToken } from "apiClient";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { createRouter } from "@tanstack/react-router";

import { routeTree } from "./routeTree.gen";
import Login from "components/Login";

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 2 * 60 * 60 * 1000,
    },
  },
});

const onLogout = () => {
  removeToken();
  window.location.reload();
};

export const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  context: { onLogout, queryClient, user: null, projects: [] },
});

export default function App() {
  const [projects, setProjects] = useState<models.Project[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loginRequired, setLoginRequired] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const api = getClient();

      try {
        const response = await api.listProjects({});
        setProjects(response.results || []);

        setUser(await api.retrieveUser());
      } catch (err) {
        console.error(err);
        setLoginRequired(true);
      }
      setLoading(false);
    };

    load();
  }, []);

  console.log("loginRequired", loginRequired);

  if (loading) return null;

  return loginRequired ? (
    <Login />
  ) : (
    <QueryClientProvider client={queryClient}>
      <RouterProvider
        router={router}
        context={{ user, projects, onLogout, queryClient }}
      />
    </QueryClientProvider>
  );
}
