/* eslint-disable camelcase */
import { LoaderFunctionArgs, defer } from "react-router-dom";

import { getClient } from "apiClient";
import { Project } from "api";

export const fetcher = async (): Promise<Project[]> => {
  const api = getClient();
  const response = await api.listProjects({});
  return response.results || [];
};

export const fetchProjects = async ({ request }: LoaderFunctionArgs) => {
  return defer({
    projects: fetcher,
  });
};
