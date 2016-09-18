'use strict';
import React from 'react';

import styles from './styles.css';

const InvoiceSummaryRow = (props) => {
  return (
    <div className={ styles.invoiceSummaryRow }>
      <div className={ styles.invoiceSummaryTitle }>
        <strong>{props.title}</strong>
        <span className='text-muted'>{props.subTitle}</span>
      </div>
      <div className={ styles.invoiceSummaryAction }>
      </div>
      <strong className={ styles.invoiceSummaryValue }>
        {`£${props.value.toFixed(2)}`}
      </strong>
    </div>
  );
};


export {InvoiceSummaryRow};
