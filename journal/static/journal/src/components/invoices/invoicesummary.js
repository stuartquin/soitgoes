'use strict';
import React from 'react';

import { InvoiceSummaryRow } from './invoicesummaryrow';

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
  const totalHours = props.timeslips.reduce((prev, current) =>
    prev + current.get('hours')
  , 0);

  const itemTotal = props.invoiceItems.reduce((prev, current) =>
    prev + (current.get('cost_per_unit') * current.get('qty'))
  , 0);

  const taskTotal = props.tasks.reduce((prev, current) =>
    prev + current.get('cost')
  , 0);

  const subTotal = taskTotal + itemTotal + (
    props.project.get('hourly_rate') * totalHours
  );

  const total = props.modifiers.reduce((prev, current) =>
    prev + getModifierImpact(subTotal, current)
  , subTotal);

  return (
    <div className='panel-body'>
      <InvoiceSummaryRow
        key={0}
        title='Time'
        subTitle={`${totalHours} Hours`}
        value={props.project.get('hourly_rate') * totalHours}
      />
      <InvoiceSummaryRow
        key={1}
        title='Aditional'
        subTitle={`${props.invoiceItems.count()} Items`}
        value={itemTotal + taskTotal}
      />
      <InvoiceSummaryTotal
        title='Subtotal'
        value={subTotal}
      />
      <hr />
      {props.modifiers.map((modifier) => (
        <InvoiceSummaryRow
          key={2 + modifier.get('id')}
          title={modifier.get('name')}
          subTitle={modifier.get('percent') + '%'}
          value={getModifierImpact(subTotal, modifier)}
          onToggle={true}
        />
      ))}
      <InvoiceSummaryTotal
        title='Total'
        value={total}
      />
    </div>
  );
};

export {InvoiceSummary};
