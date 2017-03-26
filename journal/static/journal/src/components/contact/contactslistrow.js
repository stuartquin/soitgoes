import React from 'react';
import { Link } from 'react-router';

import {TableRow, TableRowColumn} from 'material-ui/Table';

const ContactsListRow = ({ contact }) => {
  return (
    <TableRow className='invoice-list-row'>
      <TableRowColumn>
        <Link to={`/contacts/${contact.get('id')}`}>
          {contact.get('name')}
        </Link>
      </TableRowColumn>
      <TableRowColumn>
        {contact.get('email')}
      </TableRowColumn>
    </TableRow>
  );
};

export default ContactsListRow;
