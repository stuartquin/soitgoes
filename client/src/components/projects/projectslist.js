import React from 'react';
import { Table, TableBody } from 'material-ui/Table';
import Immutable from 'immutable';

import { ProjectListRow } from './projectslistrow';

const ProjectsList = ({ projects, contacts }) => {
  return (
    <Table className="projects-list table">
      <TableBody>
        {projects.toList().map((project) => (
          <ProjectListRow
            key={project.get('id')}
            contact={contacts.get(project.get('contact'), Immutable.Map())}
            project={project}
          />
        ))}
      </TableBody>
    </Table>
  );
};

export default ProjectsList;
