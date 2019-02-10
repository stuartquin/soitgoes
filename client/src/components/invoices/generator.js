import React from 'react';

import { InvoiceItems } from './invoiceitems';

const timeslipInvoiceItem = (timeslip, project) => {
  const subTotal = project.hourly_rate * timeslip.hours;
  return {
    id: timeslip.id,
    details: `${timeslip.hours} hours on ${timeslip.date}`,
    unitPrice: project.hourly_rate,
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
    const {timeslips, project} = this.props;
    const isEditable = this.props.isEditable;
    const timeslipItems = Object.values(timeslips).sort((a, b) => {
      return a.date > b.date ? 1 : -1;
    }).filter(t =>
      t.hours > 0
    ).map(t =>
      timeslipInvoiceItem(t, project)
    );
    const taskItems = this.props.tasks.toList().map(taskInvoiceItem);

    let itemViews = [];

    if (timeslipItems.length) {
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
    <div className='invoice-generator'>
      {itemViews}
    </div>
    );
  }
}

export {Generator}
