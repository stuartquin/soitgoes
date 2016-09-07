'use strict';
import React from 'react';

import styles from './styles.css';

const InvoiceItemRow = (props) => {
  let btn = (<div />);
  if (!props.isIssued) {
    btn = (
      <button className='btn btn-sm btn-default'
        onClick={props.onDelete}>
        <span className='glyphicon glyphicon-minus-sign'></span>
      </button>
    );
  }

  return (
    <tr>
      <td>{props.details}</td>
      <td>{props.unitPrice}</td>
      <td>{props.subTotal}</td>
      <td>{btn}</td>
    </tr>
  );
};

export {InvoiceItemRow};
