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
  const [tasks, setTasks] = useState<models.Task[]>([]);

  useEffect(() => {
    const load = async () => {
      const api = getClient();
      const response = await api.listProjects({});
      setProjects((response.results || []).filter((p) => !p.archived));

      const taskResponse = await api.listTasks({});
      const activeTasks = (taskResponse.results || []).filter(
        (task) => (task.hoursSpent || 0) > 0 || task.state === "OPEN"
      );
      setTasks(activeTasks);
    };

    load();
  }, []);

  // TODO whole app dependnent on projects/tasks existing
  return (
    <Router>
      <Layout>
        {projects.length && tasks.length && (
          <Switch>
            <Route path="/invoices/:invoiceId">
              <Invoices user={user} projects={projects} tasks={tasks} />
            </Route>
            <Route path="/invoices">
              <Invoices user={user} projects={projects} tasks={tasks} />
            </Route>
            <Route path="/time">
              <TimeSheet user={user} projects={projects} tasks={tasks} />
            </Route>
          </Switch>
        )}
      </Layout>
    </Router>
  );
}

export default Main;
