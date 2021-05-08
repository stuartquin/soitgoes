import React, { useState, useEffect } from 'react';

import { User, Project } from 'api/models';
import { getClient } from 'apiClient';

interface Props {
  user: User
};


function Main({user}: Props) {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    const load = async () => {
      const api = getClient();
      const response = await api.listProjects({});
      setProjects(response.results || []);
    }

    load();
  }, []);


  return (
    <div className="Main">
      {projects.map((project) => (
        <div>{project.name}</div>
      ))}
    </div>
  );
}

export default Main;
