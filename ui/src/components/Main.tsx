import React, { useCallback, useEffect, useState } from "react";
import { RouterProvider } from "@tanstack/react-router";

import * as models from "api/models";
import { getClient, removeToken } from "apiClient";

import { router } from "router";

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
    <RouterProvider
      router={router}
      context={{ user, projects, onLogout: logout }}
    />
  );
}

export default Main;
