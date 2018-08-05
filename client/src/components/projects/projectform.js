'use strict';
import React from 'react';

import TextField from 'material-ui/TextField';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import Toggle from 'material-ui/Toggle';

import AddSelect from '../addselect';
import ContactForm from 'components/contact/contactform';
import Form from 'components/form';


class ProjectForm extends Form {
  constructor(props) {
    super(props);
    const project = props.project;
    this.state.isEdit = !!props.isEdit;
    this.state.showAddContact = false;

    if (project) {
      this.setForm({
        name: project.get('name'),
        hourly_rate: project.get('hourly_rate'),
        contact: project.get('contact'),
        archived: project.get('archived'),
        currency: project.get('currency'),
      });
    }
  }

  handleAddContact(form) {
    this.props.onAddContact(form).then(() => {
      const contact = this.props.contacts.last();
      this.handleChange('contact', contact.get('id'));
    });
    this.setState({showAddContact: false});
  }

  handleShowAddContact() {
    this.setState({showAddContact: true});
  }

  onSave() {
    this.props.onSave({
      ...this.state.form
    }).then(() => this.refreshForm());
  }

  render() {
    const contacts = this.props.contacts.toList().toJS().map(p =>
      <MenuItem
        key={p.id}
        value={p.id}
        primaryText={p.name}
      />
    );

    return (
      <div className='settings'>
        <TextField
          style={{width: '100%'}}
          value={this.state.form.name}
          onChange={(evt, val) => this.handleChange('name', val)}
          floatingLabelText='Name' />
        <AddSelect
          items={contacts}
          value={this.state.form.contact}
          onChange={(evt, idx, val) => this.handleChange('contact', val)}
          onAdd={() => this.handleShowAddContact()}
        />
        <TextField
          style={{width: '100%'}}
          type='number'
          value={this.state.form.hourly_rate}
          onChange={(evt, val) => this.handleChange('hourly_rate', val)}
          floatingLabelText='Hourly Rate' />
        <TextField
          style={{width: '100%'}}
          type='text'
          value={this.state.form.currency}
          onChange={(evt, val) => this.handleChange('currency', val)}
          floatingLabelText='Currency' />
        <Toggle
          label="Archived"
          toggled={this.state.form.archived}
          onToggle={(evt, val) => this.handleChange('archived', val)}
        />
        <div className='action-btns'>
          <RaisedButton
            className='btn-success'
            label='Save'
            labelPosition='before'
            disabled={!this.state.isSaveRequired}
            onTouchTap={() => {
              this.onSave()
            }}
          />
        </div>
        <Dialog
          title='New Contact'
          open={this.state.showAddContact}
          onRequestClose={() => this.setState({ showAddContact: false })}
          autoScrollBodyContent={true}
        >
          <ContactForm
            isEdit={false}
            onSave={(form) => { this.handleAddContact(form) }}
          />
        </Dialog>
      </div>
    );
  }
}

export {ProjectForm};
