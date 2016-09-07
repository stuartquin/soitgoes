'use strict';
import React from 'react';

import styles from './styles.css';

class AddInvoiceItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      costPerUnit: '',
      name: ''
    };
  }

  updateField(field, value) {
    let state = {};
    state[field] = value;
    this.setState(state);
  }

  render() {
    return (
      <tr>
        <td>
          <input
            placeholder='Additional Item'
            value={this.state.name}
            className={styles.invoiceItemText}
            onChange={(e) => this.updateField('name', e.target.value)}
            type='text' />
        </td>
        <td>
          <input
            placeholder='Price'
            value={this.state.costPerUnit}
            className={styles.invoiceItemNumber}
            onChange={(e) => this.updateField('costPerUnit', e.target.value)}
            type='number' />
        </td>
        <td>
          <input
            placeholder='Qty'
            value={this.state.qty}
            className={styles.invoiceItemNumber}
            onChange={(e) => this.updateField('qty', e.target.value)}
            type='number' />
        </td>
        <td>
          <a
            onClick={() =>
              this.props.onAddItem(
                this.state.name,
                this.state.costPerUnit,
                this.state.qty
              )}
            className='btn btn-sm btn-default'
          >
            <span className='glyphicon glyphicon-plus-sign'></span>
          </a>
        </td>
      </tr>
    );
  }
}

export {AddInvoiceItem};
