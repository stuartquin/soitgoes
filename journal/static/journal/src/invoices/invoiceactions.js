'use strict';
import React from 'react';

import styles from './styles.css';

const API_URL = 'http://localhost:8000/api/';

const InvoiceActions = (props) => {
  const invoice = props.invoice;
  let button;
  if (invoice.get('issued_at')) {
    const link = `${API_URL}invoices/${invoice.get('id')}/pdf`;
    button = <a target='_blank' href={link}>Download PDF</a>;
  } else {
    // button = http://localhost:8000/api/invoices/74/pdf
    button = (<button className='btn btn-default'
               onClick={props.onMarkAsIssued}>Save and Issue
             </button>);
  }

  return (
    <div>
      {button}
    </div>
  );
};

export {InvoiceActions};
