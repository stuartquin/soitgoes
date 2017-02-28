import React from 'react';
import { Link } from 'react-router';

import {TableRow, TableRowColumn} from 'material-ui/Table';
import moment from 'moment';

const ProjectListRow = (props) => {
  const project = props.project;
  const contact = project.get('contact');

  return (
    <TableRow className='invoice-list-row'>
      <TableRowColumn>
        <Link to={`/projects/${project.get('id')}`}>
          {props.project.get('name')}
        </Link>
      </TableRowColumn>
      <TableRowColumn>
        {contact.get('name')}
      </TableRowColumn>
    </TableRow>
  );
};

export {ProjectListRow};
