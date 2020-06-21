import React from 'react';
import { Link } from 'react-router-dom';

import { TableRow, TableRowColumn } from 'material-ui/Table';
import moment from 'moment';

const ProjectListRow = ({ project, contact }) => {
  return (
    <TableRow className="invoice-list-row">
      <TableRowColumn>
        <Link to={`/projects/${project.get('id')}`}>{project.get('name')}</Link>
      </TableRowColumn>
      <TableRowColumn>{contact.get('name')}</TableRowColumn>
    </TableRow>
  );
};

export { ProjectListRow };
