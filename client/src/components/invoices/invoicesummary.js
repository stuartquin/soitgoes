'use strict';
import React from 'react';

import InvoiceModifiers from './invoicemodifiers';
import { asCurrency } from 'services/currency';

const getModifierImpact = (subTotal, modifier) => {
  return (subTotal / 100 * modifier.percent);
};

const InvoiceSummaryTotal = ({ currency, value, title }) => {
  return (
    <div className='invoice-summary-total'>
      <strong className='title'>{title}</strong>
      <span className='value'>{`${asCurrency(value, currency)}`}</span>
    </div>
  );
};

const InvoiceSummary = (props) => {
  const {invoice, timeslips, project, modifiers, tasks} = props;
  const {modifier = []} = invoice;

  const activeModifiers = modifiers.filter((mod) =>
    modifier.includes(mod.id)
  );
  const isEditable = !Boolean(invoice.issued_at);

  const totalHours = timeslips.reduce((prev, current) =>
    prev + current.hours
  , 0);

  const taskTotal = tasks.reduce((prev, current) =>
    prev + current.cost
  , 0);

  const subTotal = taskTotal + (project.hourly_rate * totalHours);
  const total = activeModifiers.reduce((prev, current) =>
    prev + getModifierImpact(subTotal, current)
  , subTotal);
  const timeTotal = project.hourly_rate * totalHours;

  return (
    <div>
      <ul>
        <li key={0}>
          <strong>Time: </strong>
          {`${totalHours} Hours -  ${asCurrency(timeTotal, project.currency)}`}
        </li>
        <li key={1}>
          <strong>Tasks: </strong>
          {`${tasks.length} Tasks - ${asCurrency(taskTotal, project.currency)}`}
        </li>
      </ul>

      <InvoiceSummaryTotal
        currency={project.currency}
        title='Subtotal'
        value={subTotal}
      />

      <InvoiceModifiers
        invoice={invoice}
        modifiers={modifiers}
        isEditable={isEditable}
        onAddModifier={props.onAddModifier}
        onRemoveModifier={props.onRemoveModifier}
      />

      <InvoiceSummaryTotal
        currency={project.currency}
        title='Total'
        value={total}
      />
    </div>
  );
};

export {InvoiceSummary};
