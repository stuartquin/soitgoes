'use strict';
import React from 'react';
import moment from 'moment';

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
      this.state.form = {
        name: contact.get('name')
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
    return (
      <div>
        <h3>Add Contact</h3>
        <TextField
          style={{width: '100%'}}
          value={this.state.form.name}
          onChange={(evt, val) => this.handleChange('name', val)}
          floatingLabelText='Name' />
      </div>
    );
  }
}

export default ContactForm;
