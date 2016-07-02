'use strict';
import React from 'react';

import styles from './styles.css';

const InvoiceActions = (props) => {
  const invoice = props.invoice;
  let buttonText = 'Save and Issue';
  if (invoice.get('issued_at')) {
    buttonText = 'Update and Re-issue';
  }

  return (
    <div>
      <button
        className='btn btn-default'
        onClick={props.onMarkAsIssued}>{ buttonText }</button>
    </div>
  );
};

export {InvoiceActions};
