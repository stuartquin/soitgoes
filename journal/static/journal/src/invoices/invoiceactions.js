'use strict';
import React from 'react';
import moment from 'moment';

import styles from './styles.css';
import { ConfirmButton } from '../components/confirmbutton';


const InvoiceActions = (props) => {
  const invoice = props.invoice;
  const invoiceInfoPaid = `alert alert-success ${styles.invoiceInfoPaid}`;
  const className = `${styles.invoiceActions} card-block`;

  let button;
  if (invoice.get('issued_at')) {
    if (invoice.get('paid_at')) {
      button = (
        <p className={ invoiceInfoPaid }>
          <strong>PAID</strong>
          <span>
            { moment(invoice.get('paid_at')).format('YYYY-MM-DD') }
          </span>
        </p>
      );
    } else {
      button = (<button className='btn btn-success btn-block'
                  onClick={props.onMarkAsPaid}>Mark as Paid
                </button>);
    }
  } else {
    button = (<button className='btn btn-success btn-block'
                onClick={props.onMarkAsIssued}>Save and Issue
              </button>);
  }

  return (
    <div className={className}>
      {button}
      <ConfirmButton
        className='btn btn-danger btn-block'
        onConfirmClick={props.onDelete}
        confirmText='Confirm Delete!'
        text='Delete' />
    </div>
  );
};

export {InvoiceActions};
