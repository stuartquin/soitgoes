'use strict';
import React from 'react';

import styles from './styles.css';

const InvoiceActions = (props) => {
  return (
    <div>
      <button onClick={props.onMarkAsIssued}>Mark as Issued</button>
    </div>
  );
};

export {InvoiceActions};
