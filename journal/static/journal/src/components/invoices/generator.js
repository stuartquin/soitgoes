'use strict';
import React from 'react';
import {Card, CardTitle, CardText} from 'material-ui/Card';
import DatePicker from 'material-ui/DatePicker';
import TextField from 'material-ui/TextField';

import { InvoiceItems } from './invoiceitems';

const getDefaultName = (invoice, project) => {
  return `${project.get('name')} #${invoice.get('sequence_num')}`;
};

const timeslipInvoiceItem = (timeslip, project) => {
  const subTotal = project.get('hourly_rate') * timeslip.get('hours');
  return {
    id: timeslip.get('id'),
    details: `${timeslip.get('hours')} hours on ${timeslip.get('date')}`,
    unitPrice: project.get('hourly_rate'),
    subTotal: subTotal
  }
};

const taskInvoiceItem = (task) => {
  return {
    id: task.get('id'),
    details: task.get('name'),
    unitPrice: task.get('cost'),
    subTotal: task.get('cost'),
  }
};

class Generator extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      form: {}
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
    const isIssued = false;

    const timeslipItems = this.props.timeslips.map(t =>
      timeslipInvoiceItem(t, project)
    );
    const timeslipTasks = this.props.tasks.map(taskInvoiceItem);

    return (
      <Card className='invoice-generator'>
        <CardText>
          <h3>{name}</h3>

          <h4>Tracked Time</h4>
          <InvoiceItems
            isIssued={isIssued}
            items={timeslipItems}
            onDeleteItem={(item) => {
              this.props.onDeleteInvoiceTimeslip(item.id);
            }}
          />

          <h4>Completed Tasks</h4>
          <InvoiceItems
            isIssued={isIssued}
            items={timeslipTasks}
            onDeleteItem={(item) => {
              debugger;
            }}
          />
        </CardText>
      </Card>
    );
  }
}

export {Generator}
