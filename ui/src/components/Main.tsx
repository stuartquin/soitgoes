import React, { useCallback, useEffect, useState } from "react";
import { RouterProvider } from "@tanstack/react-router";

import * as models from "api/models";
import { getClient, removeToken } from "apiClient";

import { router } from "router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 2 * 60 * 60 * 1000,
    },
  },
});

interface Props {
  user: models.User;
}

function Main({ user }: Props) {
  const [projects, setProjects] = useState<models.Project[]>([]);
  useEffect(() => {
    const load = async () => {
      const api = getClient();

      const response = await api.listProjects({});
      setProjects(response.results || []);
    };

    load();
  }, []);

  const logout = useCallback(() => {
    removeToken();
    window.location.reload();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider
        router={router}
        context={{ user, projects, onLogout: logout, queryClient }}
      />
    </QueryClientProvider>
  );
}

export default Main;
