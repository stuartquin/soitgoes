'use strict';
import React from 'react';

import styles from './styles.css';

const AddInvoiceItem = (props) => {
  return (
    <tr>
      <td>
        <input
          placeholder='Additional Item'
          type='text' />
      </td>
      <td>
        <input
          placeholder='Price'
          type='number' />
      </td>
      <td>
        <a onClick={() => props.onAddItem('testName', 12)}>Add</a>
      </td>
    </tr>
  );
};

export {AddInvoiceItem};
