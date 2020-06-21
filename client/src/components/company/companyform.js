'use strict';
import React from 'react';
import moment from 'moment';

import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';

import AddSelect from '../addselect';

class CompanyForm extends React.Component {
  constructor(props) {
    super(props);
    const company = props.company;

    this.state = {
      isEdit: !!props.isEdit,
      showAddCompany: false,
      form: {},
    };

    if (company) {
      this.state.form = company.toJS();
    } else {
      this.state.form = {};
    }
  }

  handleChange(field, val) {
    let form = this.state.form;
    form[field] = val;
    this.setState({ form: form });
  }

  onSave() {
    this.props.onSave({
      ...this.state.form,
    });
  }

  render() {
    const company = this.props.company;
    const companyFields = [
      'name',
      'address1',
      'address2',
      'city',
      'post_code',
      'reg_number',
      'vat_number',
    ];

    return (
      <div>
        {companyFields.map((field, idx) => {
          const label = field
            .split('_')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
          return (
            <TextField
              key={idx}
              style={{ width: '100%' }}
              value={this.state.form[field]}
              onChange={(evt, val) => this.handleChange(field, val)}
              floatingLabelText={label}
            />
          );
        })}
        <div className="action-btns">
          <RaisedButton
            className="btn-success"
            label="Save"
            labelPosition="before"
            onTouchTap={(evt) => {
              this.onSave();
            }}
          />
        </div>
      </div>
    );
  }
}

export default CompanyForm;
