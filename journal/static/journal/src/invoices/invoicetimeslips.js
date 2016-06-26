'use strict';
import React from 'react';

import { InvoiceItemRow } from './invoiceitemrow';

import styles from './styles.css';

const getTimeslipDetails = (timeslip, project) => {
  return `${timeslip.get('hours')} Hours on ${timeslip.get('date')}: ${project.get('name')}`;
};

const InvoiceTimeslips = (props) => {
  const project = props.project;

  return (
    <div className={ styles.invoiceTimeslips }>
    <table>
    <tbody>
      <tr><th>Details</th><th>Unit Price (&pound;)</th><th>Subtotal (&pound;)</th></tr>

      {props.timeslips.map((timeslip) => (
        <InvoiceItemRow
          key={timeslip.get('id')}
          details={getTimeslipDetails(timeslip, project)}
          unitPrice={project.get('hourly_rate')}
          subTotal={project.get('hourly_rate') * timeslip.get('hours')}
        />
      ))}
    </tbody>
    </table>
    </div>
  );
};

export {InvoiceTimeslips};
