'use strict';
import React from 'react';
import {connect} from 'react-redux';
import { browserHistory } from 'react-router';

import {Card, CardText} from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';

import { Loading } from '../loading';
import ContactsList from './contactslist';
import {fetchContacts} from 'modules/contact';

class Contacts extends React.Component {
  componentDidMount() {
    this.props.fetchContacts();
  }

  render() {
    const contacts = this.props.contacts;

    return (
      <div className='contacts-container'>
        <div className='content'>
          <div className='content-actions'>
            <RaisedButton
              className='btn-success'
              label='Create New'
              labelPosition='before'
              onTouchTap={(evt) => {
                browserHistory.push('/contacts/add');
              }}
            />
          </div>
          <Card>
            <CardText>
              <ContactsList
                contacts={this.props.contacts} />
            </CardText>
          </Card>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, { params }) => {
  return {
    contacts: state.contacts.items
  };
};

const actions = {
  fetchContacts
};

const ContactsContainer = connect(mapStateToProps, actions)(Contacts);
export {ContactsContainer};
