'use strict';
import React from 'react';
import moment from 'moment';

import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';

import AddSelect from '../addselect';
import CompanyForm from '../company/companyform';

class ContactForm extends React.Component {
  constructor(props) {
    super(props);
    const contact = props.contact;

    this.state = {
      isEdit: !!props.isEdit,
      showAddCompany: false,
      form: {}
    };

    if (contact) {
      this.state.form = contact.toJS();
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

  handleAddCompany() {
    this.setState({showAddCompany: true});
  }

  onSave() {
    this.props.onSave({
      ...this.state.form
    });
  }

  render() {
    const contact = this.props.contact;
    const companies = this.props.companies.toList().toJS().map(c => {
      return (
        <MenuItem
          key={c.id}
          value={c.id}
          primaryText={c.name}
        />
      );
    });

    return (
      <div>
        <div className='action-btns'>
          <RaisedButton
            className='btn-success'
            label='Save'
            labelPosition='before'
            onTouchTap={(evt) => {
              this.onSave()
            }}
          />
        </div>
        <TextField
          style={{width: '100%'}}
          value={this.state.form.name}
          onChange={(evt, val) => this.handleChange('name', val)}
          floatingLabelText='Name' />
        <TextField
          type='email'
          style={{width: '100%'}}
          value={this.state.form.email}
          onChange={(evt, val) => this.handleChange('email', val)}
          floatingLabelText='Email' />
        <AddSelect
          label='Company'
          items={companies}
          value={this.state.form.company}
          onChange={(evt, idx, val) => this.handleChange('company', val)}
          onAdd={() => this.handleAddCompany()}
        />

        <Dialog
          title='Add Company'
          open={this.state.showAddCompany}
          onRequestClose={() =>
            this.setState({showAddCompany: false})
          }>
          <CompanyForm
            onSave={(form) => {
              this.props.onAddCompany(form);
              this.setState({showAddCompany: false});
            }}
          />
        </Dialog>
      </div>
    );
  }
}

export default ContactForm;
