'use strict';
import React from 'react';
import {Card, CardText} from 'material-ui/Card';

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
    subTotal: task.get('cost')
  }
};


class Generator extends React.Component {
  render() {
    const project = this.props.project;
    const isEditable = this.props.isEditable;

    const timeslipItems = this.props.timeslips.sort((a, b) => {
      return a.get('date') > b.get('date') ? 1 : -1;
    }).toList().map(t =>
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
