'use strict';
import React from 'react';

import { InvoiceSummaryRow } from './invoicesummaryrow';
import { InvoiceModifiers } from './invoicemodifiers';
import {List, ListItem} from 'material-ui/List';

const getModifierImpact = (subTotal, modifier) => {
  return (subTotal / 100 * modifier.get('percent'));
};

const InvoiceSummaryTotal = (props) => {
  return (
    <div className='invoice-summary-total'>
      <strong className='title'>{props.title}</strong>
      <span className='value'>
        {`£${props.value.toFixed(2)}`}
      </span>
    </div>
  );
};

const InvoiceSummary = (props) => {
  const invoice = props.invoice;
  const project = props.project;
  const modifiers = props.modifiers;

  const totalHours = props.timeslips.reduce((prev, current) =>
    prev + current.get('hours')
  , 0);

  const taskTotal = props.tasks.reduce((prev, current) =>
    prev + current.get('cost')
  , 0);

  const subTotal = taskTotal + (project.get('hourly_rate') * totalHours);

  const total = props.modifiers.reduce((prev, current) =>
    prev + getModifierImpact(subTotal, current)
  , subTotal);

  const timeTotal = project.get('hourly_rate') * totalHours;

  return (
    <div>
      <List>
        <ListItem
          key={0}
          className='invoice-summary-item'
          primaryText='Time'
          secondaryText={`${totalHours} Hours -  £${timeTotal}`}
          disabled={true}
        />
        <ListItem
          key={1}
          primaryText='Tasks'
          className='invoice-summary-item'
          secondaryText={`${props.tasks.count()} Tasks - £${taskTotal}`}
          disabled={true}
        />
      </List>
      <InvoiceSummaryTotal
        title='Subtotal'
        value={subTotal}
      />
      <InvoiceModifiers
        invoice={invoice}
        modifiers={props.modifiers}
        onRemoveModifier={props.onRemoveModifier}
      />
      <InvoiceSummaryTotal
        title='Total'
        value={total}
      />
    </div>
  );
};

export {InvoiceSummary};
