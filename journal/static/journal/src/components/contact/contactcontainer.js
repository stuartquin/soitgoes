'use strict';
import React from 'react';
import {connect} from 'react-redux';

import { Loading } from '../loading';
import ContactForm from './contactform';

import {fetchContacts, addContact} from 'modules/contact';
import {fetchCompanies, addCompany} from 'modules/company';


class Contact extends React.Component {
  componentDidMount() {
    this.props.fetchContacts();
    this.props.fetchCompanies();
  }

  render() {
    const companies = this.props.companies;
    const contact = this.props.contact;
    const isEdit = this.props.id !== 'add';
    const loading = (isEdit && (!contact || contact.isEmpty()));

    if (loading) {
      return (<Loading />);
    }

    let save = (form) => {
      if (isEdit) {
      } else {
        this.props.addContact(form);
      }
    };

    return (
      <div className='contact-container'>
        <div className='content'>
          <ContactForm
            isEdit={isEdit}
            contact={contact}
            companies={companies}
            onSave={(form) => save(form)}
            onAddCompany={this.props.addCompany}/>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, { params }) => {
  const id = parseInt(params.id, 10);

  return {
    id: params.id,
    contact: state.contacts.items.get(id),
    companies: state.companies.items
  };
};

const actions = {
  addContact,
  fetchContacts,
  fetchCompanies,
  addCompany
};

const ContactContainer = connect(mapStateToProps, actions)(Contact);
export {ContactContainer};
