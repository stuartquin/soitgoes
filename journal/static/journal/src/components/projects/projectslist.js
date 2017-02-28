import React from 'react';
import {Table, TableBody} from 'material-ui/Table';

import { ProjectListRow } from './projectslistrow';


const ProjectsList = (props) => {
  const projects = props.projects.toList();

  return (
    <Table className='projects-list table'>
      <TableBody>
      {projects.map(project => (
        <ProjectListRow
          key={project.get('id')}
          project={project}
        />
      ))}
      </TableBody>
    </Table>
  );
};

export {ProjectsList};
