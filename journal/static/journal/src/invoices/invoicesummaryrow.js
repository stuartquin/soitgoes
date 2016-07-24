'use strict';
import React from 'react';

import styles from './styles.css';

const InvoiceSummaryRow = (props) => {
  return (
    <tr>
      <td>{props.name}</td>
      <td>{props.value}</td>
    </tr>
  );
};

export {InvoiceSummaryRow};
