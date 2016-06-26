'use strict';
import React from 'react';
import moment from 'moment';

import styles from './styles.css';

const InvoiceItemRow = (props) => {
  return (
    <tr>
      <td>{props.details}</td>
      <td>{props.unitPrice}</td>
      <td>{props.subTotal}</td>
    </tr>
  );
};

export {InvoiceItemRow};
