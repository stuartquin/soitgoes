import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import * as models from "api/models";
import { getClient } from "apiClient";

import Layout from "components/Layout";
import TimeSheet from "components/TimeSheet";
import Invoices from "components/Invoices";

interface Props {
  user: models.User;
}

function Main({ user }: Props) {
  const [projects, setProjects] = useState<models.Project[]>([]);
  useEffect(() => {
    const load = async () => {
      const api = getClient();
      const response = await api.listProjects({});
      setProjects((response.results || []).filter((p) => !p.archived));
    };

    load();
  }, []);

  // TODO whole app dependnent on projects/tasks existing
  return (
    <Router>
      <Layout>
        {projects.length && (
          <Switch>
            <Route path="/invoices/:projectId/:invoiceId">
              <Invoices user={user} projects={projects} />
            </Route>
            <Route path="/invoices/new">
              <Invoices user={user} projects={projects} isCreateNew />
            </Route>
            <Route path="/invoices/:projectId">
              <Invoices user={user} projects={projects} isCreateNew />
            </Route>
            <Route path="/invoices">
              <Invoices user={user} projects={projects} />
            </Route>
            <Route path="/time">
              <TimeSheet user={user} projects={projects} />
            </Route>
          </Switch>
        )}
      </Layout>
    </Router>
  );
}

export default Main;
