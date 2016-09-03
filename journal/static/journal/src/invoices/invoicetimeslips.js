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

  let addRow = (<tr />);
  if (!props.isIssued) {
    addRow = (<AddInvoiceItem
      onAddItem={props.onAddItem}
    />);
  }

  return (
    <table className='table table-striped'>
    <tbody>
      <tr>
        <th>Details</th><th>Unit Price (&pound;)</th><th>Subtotal (&pound;)</th><th></th>
      </tr>

      {props.timeslips.map((timeslip) => (
        <InvoiceItemRow
          key={timeslip.get('id')}
          isIssued={props.isIssued}
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
          isIssued={props.isIssued}
          details={item.get('name')}
          unitPrice={item.get('cost_per_unit')}
          subTotal={item.get('cost_per_unit') * item.get('qty')}
          onDelete={() => {
            props.onDeleteInvoiceItem(item.get('id'));
          }}
        />
      ))}

      {addRow}

    </tbody>
    </table>
  );
};

export {InvoiceTimeslips};
