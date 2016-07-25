'use strict';
import React from 'react';
import moment from 'moment';

import { InvoiceActions } from './invoiceactions';
import { InvoiceSummary } from './invoicesummary';

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

  const titleClass = `card-block`;

  return (
    <div className='card'>
      <div className={ titleClass }>
        <span>Project</span>
        <span className="text-muted">
          { project.get('name') }
        </span>
      </div>
      <div className={ titleClass }>
        <span>Contact</span>
        <span className="text-muted">
        { project.get('contact').get('name') }
        </span>
      </div>
      <div className={ titleClass }>
        <span>Created</span>
        <span className="text-muted">
        { moment(invoice.get('created_at')).format('YYYY-MM-DD') }
        </span>
      </div>
      <div className={ titleClass }>
        <span>Issued</span>
        <span className="text-muted">
        { issued }
        </span>
      </div>
      <InvoiceSummary
        project={project}
        timeslipTotal={props.timeslipTotal}
        additionalTotal={props.additionalTotal}
      />
      <InvoiceActions
        invoice={ invoice }
        onMarkAsIssued={props.onMarkAsIssued}
        onDelete={props.onDelete}
      />
    </div>
  );
};

export {InvoiceInfo};
