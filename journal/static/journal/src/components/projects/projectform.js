'use strict';
import React from 'react';
import moment from 'moment';
import { browserHistory } from 'react-router';

import TextField from 'material-ui/TextField';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';

import {Confirm} from '../confirm';
import AddSelect from '../addselect';


class ProjectForm extends React.Component {
  constructor(props) {
    super(props);
    const project = props.project;

    this.state = {
      isEdit: !!props.isEdit,
      showAddContact: false,
      form: {}
    };

    if (project) {
      this.state.form = {
        name: project.get('name'),
        hourly_rate: project.get('hourly_rate'),
        contact: project.get('contact')
      };
    } else {
      this.state.form = {
      };
    };
  }

  handleChange(field, val) {
    let form = this.state.form;
    form[field] = val;
    this.setState({form: form});
  }

  handleAddContact() {
    browserHistory.push('/contacts/add');
  }

  onSave() {
    this.props.onSave({
      ...this.state.form
    });
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
          onAdd={() => this.handleAddContact()}
        />
        <TextField
          style={{width: '100%'}}
          type='number'
          value={this.state.form.hourly_rate}
          onChange={(evt, val) => this.handleChange('hourly_rate', val)}
          floatingLabelText='Hourly Rate' />
        <RaisedButton
          className='btn-success'
          label='Save'
          labelPosition='before'
          onTouchTap={(evt) => {
            this.onSave()
          }}
        />
      </div>
    );
  }
}

export {ProjectForm};
