'use strict';
import React from 'react';

import styles from './styles.css';

const ToInvoiceLabels = (props) => {
  const invoiceItemStyle = `col-md-3 ${styles.toInvoiceLabels}`;
  return (
    <div className={ invoiceItemStyle }>
      <h4 className={ styles.toInvoiceItemProject }></h4>
      <div className={ styles.toInvoiceLabelsRow }>Amount Due: </div>
      <div className={ styles.toInvoiceLabelsRow }>Total Paid: </div>
    </div>
  );
};

export {ToInvoiceLabels};
