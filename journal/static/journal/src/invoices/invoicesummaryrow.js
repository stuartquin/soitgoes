'use strict';
import React from 'react';

import styles from './styles.css';

const InvoiceSummaryRow = (props) => {
  return (
    <div className={ styles.invoiceSummaryRow }>
      <div className={ styles.invoiceSummaryTitle }>
        <h4>{props.title}</h4>
        <h6 className='text-muted'>{props.subTitle}</h6>
      </div>
      <div className={ styles.invoiceSummaryAction }>
      </div>
      <h4 className={ styles.invoiceSummaryValue }>
        {`£${props.value.toFixed(2)}`}
      </h4>
    </div>
  );
};


export {InvoiceSummaryRow};
