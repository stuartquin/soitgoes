import { QueryClient } from "@tanstack/react-query";
import * as models from "api/models";

export interface RouterContext {
  user: models.User | null;
  projects: models.Project[];
  queryClient: QueryClient;
  onLogout: () => void;
}
