'use strict';
import React from 'react';
import {Card, CardTitle, CardText} from 'material-ui/Card';
import DatePicker from 'material-ui/DatePicker';
import TextField from 'material-ui/TextField';

import { InvoiceItems } from './invoiceitems';

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

const getItemList = (title, items, onDelete) => {

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
    const isIssued = false;
    const isEditable = !Boolean(invoice.get('issued_at'));

    const timeslipItems = this.props.timeslips.toList().map(t =>
      timeslipInvoiceItem(t, project)
    );
    const taskItems = this.props.tasks.toList().map(taskInvoiceItem);

    let itemViews = [];

    if (timeslipItems.count()) {
      itemViews.push((
        <div key={0}>
          <h4>Tracked Time</h4>
          <InvoiceItems
            isEditable={isEditable}
            items={timeslipItems}
            onDeleteItem={(item) => {
              this.props.onDeleteInvoiceTimeslip(item.id);
            }}
          />
        </div>
      ));
    }

    if (isEditable || taskItems.count()) {
      itemViews.push((
        <div key={1}>
          <h4>Completed Tasks</h4>
          <InvoiceItems
            isEditable={isEditable}
            items={taskItems}
            onDeleteItem={(item) => {
              this.props.onDeleteInvoiceTask(item.id);
            }}
          />
        </div>
      ));
    }

    return (
      <Card className='invoice-generator'>
        <CardText>
          {itemViews}
        </CardText>
      </Card>
    );
  }
}

export {Generator}
