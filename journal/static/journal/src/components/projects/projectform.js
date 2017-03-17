'use strict';
import React from 'react';
import moment from 'moment';

import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';


class ProjectForm extends React.Component {
  constructor(props) {
    super(props);
    const project = props.project;

    this.state = {
      isEdit: !!props.isEdit,
      form: {}
    };

    if (project) {
      this.state.form = {
        name: project.get('name'),
        hourly_rate: project.get('hourly_rate'),
        contact: project.get('contact').get('id')
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

  onSave() {
    this.props.onSave({
      ...this.state.form
    });
  }

  render() {
    const contacts = this.props.contacts.toList().toJS().map(p => {
      let contact;
      if (p.name !== p.company.name) {
        contact = p.name;
      }
      return (
        <MenuItem
          key={p.id}
          value={p.id}
          primaryText={p.company.name}
          secondaryText={contact}
        />
      );
    });

    return (
      <div className='settings'>
        <TextField
          style={{width: '100%'}}
          value={this.state.form.name}
          onChange={(evt, val) => this.handleChange('name', val)}
          floatingLabelText='Name' />
        <SelectField
          style={{width: '100%'}}
          value={this.state.form.contact}
          onChange={(evt, idx, val) => this.handleChange('contact', val)}
          floatingLabelText='Contact'>
          {contacts}
        </SelectField>
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
