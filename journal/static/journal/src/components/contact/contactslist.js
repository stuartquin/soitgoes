import React from 'react';
import {Table, TableBody} from 'material-ui/Table';
import Immutable from 'immutable';

import ContactsListRow from './contactslistrow';

const ContactsList = ({ contacts }) => {
  return (
    <Table className='contacts-list table'>
      <TableBody>
      {contacts.toList().map(contact => (
        <ContactsListRow
          key={contact.get('id')}
          contact={contact}
        />
      ))}
      </TableBody>
    </Table>
  );
};

export default ContactsList;
