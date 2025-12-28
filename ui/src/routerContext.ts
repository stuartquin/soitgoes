import { QueryClient } from "@tanstack/react-query";
import * as models from "api/models";

export interface RouterContext {
  user: models.User;
  projects: models.Project[];
  queryClient: QueryClient;
  onLogout: () => void;
}
