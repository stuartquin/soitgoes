'use strict';
import React from 'react';
import moment from 'moment';

import DatePicker from 'material-ui/DatePicker';
import TextField from 'material-ui/TextField';
import ActionDelete from 'material-ui/svg-icons/action/delete';
import IconButton from 'material-ui/IconButton';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

import { InvoiceItems } from './invoiceitems';
import { InvoiceActions } from './invoiceactions';
import { InvoiceSummary } from './invoicesummary';

const getDefaultName = (invoice, project) => {
  return `${project.get('name')} #${invoice.get('sequence_num')}`;
};

class Settings extends React.Component {
  constructor(props) {
    super(props);
    const invoice = props.invoice;
    const due_date = moment(invoice.get('due_date')).toDate();

    this.state = {
      form: {
        due_date,
        tax: null,
      }
    };
  }

  updateForm(name, val) {
    let form = this.state.form;
    form[name] = val;
    this.setState({form});
  }

  render() {
    const invoice = this.props.invoice;
    const project = this.props.project;
    const name = getDefaultName(invoice, project);

    return (
      <div className='invoice-settings'>
        <div className='invoice-settings-header'>
          <div className='invoice-settings-info'>
            <h3>{ name }</h3>
            <span className='text-muted'>
              { project.get('contact').get('name') }
            </span>
          </div>
          <IconButton
            tooltip='Delete Invoice'
            touch={true}
            tooltipPosition='bottom-right'
            className='btn-default'
            onTouchTap={this.props.onDelete}>
            <ActionDelete />
          </IconButton>
        </div>
        <div>
          <DatePicker
            onChange={(e, date) => this.updateForm('issued_at', date)}
            autoOk={true}
            floatingLabelText='Due Date'
            defaultDate={this.state.form.due_date}
            container='inline'
          />
        </div>

        <InvoiceSummary
          project={project}
          invoice={invoice}
          timeslips={this.props.timeslips}
          tasks={this.props.tasks}
          modifiers={this.props.modifiers}
          total={this.props.total}
          onRemoveModifier={this.props.onRemoveModifier}
        />
      </div>
    );
  }
}

export {Settings}
