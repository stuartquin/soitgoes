import React, { useState, useEffect } from "react";
import { parse } from "date-fns";

import { User, Project } from "api/models";
import { getClient } from "apiClient";

import TimeSheet from "components/TimeSheet";

interface Props {
  user: User;
}

function Main({ user }: Props) {
  const [projects, setProjects] = useState<Project[]>([]);
  const startDate = parse("2021-05-01", "yyyy-MM-dd", new Date());

  useEffect(() => {
    const load = async () => {
      const api = getClient();
      const response = await api.listProjects({});
      setProjects(response.results || []);
    };

    load();
  }, []);

  return (
    <div className="Main">
      {projects.length && (
        <TimeSheet
          user={user}
          projects={projects.filter((p) => !p.archived)}
          start={startDate}
        />
      )}
    </div>
  );
}

export default Main;
