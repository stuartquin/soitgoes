'use strict';
import React from 'react';

import { InvoiceItemRow } from './invoiceitemrow';
import { AddInvoiceItem } from './addinvoiceitem';

import styles from './styles.css';

const getTimeslipDetails = (timeslip, project) => {
  return `${timeslip.get('hours')} Hours on ${timeslip.get('date')}: ${project.get('name')}`;
};

const InvoiceTimeslips = (props) => {
  const project = props.project;

  return (
    <table className='table table-striped'>
    <tbody>
      <tr><th>Details</th><th>Unit Price (&pound;)</th><th>Subtotal (&pound;)</th></tr>

      {props.timeslips.map((timeslip) => (
        <InvoiceItemRow
          key={timeslip.get('id')}
          details={getTimeslipDetails(timeslip, project)}
          unitPrice={project.get('hourly_rate')}
          subTotal={project.get('hourly_rate') * timeslip.get('hours')}
          onDelete={() => {
            props.onDeleteInvoiceTimeslip(timeslip);
          }}
        />
      ))}

      {props.items.map((item) => (
        <InvoiceItemRow
          key={item.get('id')}
          details={item.get('name')}
          unitPrice={item.get('cost_per_unit')}
          subTotal={item.get('cost_per_unit') * item.get('qty')}
        />
      ))}

      <AddInvoiceItem
        onAddItem={props.onAddItem}
      />
    </tbody>
    </table>
  );
};

export {InvoiceTimeslips};
