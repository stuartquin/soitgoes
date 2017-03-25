'use strict';
import React from 'react';
import moment from 'moment';

import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

class ContactForm extends React.Component {
  constructor(props) {
    super(props);
    const contact = props.contact;

    this.state = {
      isEdit: !!props.isEdit,
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

  onSave() {
    this.props.onSave({
      ...this.state.form
    });
  }

  render() {
    const contact = this.props.contact;
    const invoiceFields = [
      'address1', 'address2', 'city', 'post_code', 'vat_number'
    ];

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

        <h4>Invoices</h4>
        {invoiceFields.map((field, idx) => {
          const label = field.split('_').map((word) =>
            word.charAt(0).toUpperCase() + word.slice(1)
          ).join(' ');
          return (
            <TextField
              key={idx}
              style={{width: '100%'}}
              value={this.state.form[field]}
              onChange={(evt, val) => this.handleChange(field, val)}
              floatingLabelText={label} />
          )
        })}
      </div>
    );
  }
}

export default ContactForm;
