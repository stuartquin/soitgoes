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
      <td>
        <button
          onClick={props.onDelete}>Delete
        </button>
      </td>
    </tr>
  );
};

export {InvoiceItemRow};
