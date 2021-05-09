import React, { useState, useEffect } from 'react';

import { User, Project } from 'api/models';
import { getClient } from 'apiClient';

interface Props {
  user: User,
    projects: Project[],

};

function TimeSheet({user, projects}: Props) {
  return (
    <div>
    {projects.map((project) => (
      <div className="p-6 max-w-sm mx-auto bg-white shadow-md flex items-center space-x-4">
        {project.name}
      </div>
    ))}
    </div>
  );

}

export default TimeSheet;
