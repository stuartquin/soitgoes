import React, { useState, useEffect } from "react";

import * as models from "api/models";
import { getClient } from "apiClient";

import Layout from "components/Layout";
import TimeSheet from "components/TimeSheet";

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

  return (
    <Layout>
      {projects.length && tasks.length && (
        <TimeSheet user={user} projects={projects} tasks={tasks} />
      )}
    </Layout>
  );
}

export default Main;
