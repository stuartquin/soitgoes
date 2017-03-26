'use strict';
import React from 'react';
import {connect} from 'react-redux';
import { browserHistory } from 'react-router';

import { Loading } from '../loading';
import ContactForm from './contactform';
import {fetchContacts, addContact, updateContact} from 'modules/contact';

class Contact extends React.Component {
  componentDidMount() {
    this.props.fetchContacts();
  }

  render() {
    const contact = this.props.contact;
    const isEdit = this.props.id !== 'add';
    const loading = (isEdit && (!contact || contact.isEmpty()));

    if (loading) {
      return (<Loading />);
    }

    let save = (form) => {
      if (isEdit) {
        this.props.updateContact(this.props.id, form);
      } else {
        this.props.addContact(form).then(() =>
          browserHistory.push('/contacts')
        );
      }
    };

    return (
      <div className='contact-container'>
        <div className='content'>
          <div className='settings'>
            <ContactForm
              isEdit={isEdit}
              contact={contact}
              onSave={(form) => save(form)} />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, { params }) => {
  const id = parseInt(params.id, 10);

  return {
    id: params.id,
    contact: state.contacts.items.get(id)
  };
};

const actions = {
  addContact,
  updateContact,
  fetchContacts
};

const ContactContainer = connect(mapStateToProps, actions)(Contact);
export {ContactContainer};
