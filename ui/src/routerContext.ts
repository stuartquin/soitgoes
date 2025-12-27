import * as models from "api/models";

export interface RouterContext {
  user: models.User;
  projects: models.Project[];
  onLogout: () => void;
}
