'use strict';
import React from 'react';

import styles from './styles.css';

const ToInvoiceLabels = (props) => {
  const invoiceItemStyle = `col-md-offset-1 col-md-1 ${styles.toInvoiceLabels}`;
  return (
    <div className={ invoiceItemStyle }>
      <h4 className={ styles.toInvoiceItemProject }></h4>
      <div className={ styles.toInvoiceLabelsRow }>Due: </div>
      <div className={ styles.toInvoiceLabelsRow }>Invoiced: </div>
      <div className={ styles.toInvoiceLabelsRow }>Paid: </div>
    </div>
  );
};

export {ToInvoiceLabels};
