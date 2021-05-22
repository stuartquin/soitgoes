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
      setProjects(response.results || []);

      const taskResponse = await api.listTasks({});
      setTasks(taskResponse.results || []);
    };

    load();
  }, []);

  return (
    <Layout>
      {projects.length && (
        <TimeSheet user={user} projects={projects} tasks={tasks} />
      )}
    </Layout>
  );
}

export default Main;
