'use strict';
import React from 'react';
import moment from 'moment';

import DatePicker from 'material-ui/DatePicker';

import { InvoiceSummary } from './invoicesummary';


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

    return (
      <div className='settings'>
        <div>
          <DatePicker
            textFieldStyle={{width: '100%'}}
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
