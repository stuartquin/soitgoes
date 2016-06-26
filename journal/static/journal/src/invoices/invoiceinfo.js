'use strict';
import React from 'react';
import moment from 'moment';

import { InvoiceActions } from './invoiceactions';

import styles from './styles.css';

export const getUninvoicedAmount = (project) => {
  return project.get('uninvoiced_hours') * project.get('hourly_rate');
};

const InvoiceInfo = (props) => {
  const project = props.project;
  const invoice = props.invoice;

  let issued = 'Not issued yet';
  if (invoice.get('issued_at')) {
    issued = moment(invoice.get('issued_at')).format('YYYY-MM-DD HH:mm');
  }

  return (
    <div>
      <div>
        <h4>Project</h4>
        { project.get('name') }
      </div>
      <div>
        <h4>Contact</h4>
        { project.get('contact').get('name') }
      </div>
      <div>
        <h4>Created</h4>
        { moment(invoice.get('created_at')).format('YYYY-MM-DD') }
      </div>
      <div>
        <h4>Issued</h4>
        { issued }
      </div>
      <InvoiceActions
        invoice={ invoice }
        onMarkAsIssued={props.onMarkAsIssued}
      />
    </div>
  );
};

export {InvoiceInfo};
