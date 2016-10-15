'use strict';
import React from 'react';

const InvoiceSummaryRow = (props) => {
  return (
    <div className='invoice-summary-row'>
      <div className='title'>
        <strong>{props.title}</strong>
        <strong className='value'>
          {`£${props.value.toFixed(2)}`}
        </strong>
      </div>
      <div className='sub-title'>
        <span className='text-muted'>{props.subTitle}</span>
      </div>
    </div>
  );
};

export {InvoiceSummaryRow};
