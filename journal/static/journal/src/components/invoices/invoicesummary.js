'use strict';
import React from 'react';

import styles from './styles.css';

import { InvoiceSummaryRow } from './invoicesummaryrow';

const getModifierImpact = (subTotal, modifier) => {
  return (subTotal / 100 * modifier.get('percent'));
};

const InvoiceSummaryTotal = (props) => {
  return (
    <div className={styles.invoiceSummaryTotal}>
      <h6 className={styles.invoiceSummaryTotalTitle}>{props.title}</h6>
      <h4 className={ styles.invoiceSummaryValue }>
        {`£${props.value.toFixed(2)}`}
      </h4>
    </div>
  );
};

const InvoiceSummary = (props) => {
  const totalHours = props.timeslips.reduce((prev, current) =>
    prev + current.get('hours')
  , 0);

  const itemTotal = props.invoiceItems.reduce((prev, current) =>
    prev + (current.get('cost_per_unit') * current.get('qty')),
  0);

  const subTotal = itemTotal + (props.project.get('hourly_rate') * totalHours);

  const total = props.invoice.get('modifier').reduce((prev, current) =>
    prev + getModifierImpact(subTotal, current)
  , subTotal);

  return (
    <div>
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
        value={itemTotal}
      />
      <InvoiceSummaryTotal
        title='Subtotal'
        value={subTotal}
      />
      <hr />
      {props.invoice.get('modifier').map((modifier) => (
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
