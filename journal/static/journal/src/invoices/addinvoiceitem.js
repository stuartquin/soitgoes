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
            onChange={(e) => this.updateField('name', e.target.value)}
            type='text' />
        </td>
        <td>
          <input
            placeholder='Price'
            value={this.state.costPerUnit}
            onChange={(e) => this.updateField('costPerUnit', e.target.value)}
            type='number' />
        </td>
        <td>
          <a onClick={() =>
            this.props.onAddItem(this.state.name, this.state.costPerUnit)
          }>Add</a>
        </td>
      </tr>
    );
  }
}

export {AddInvoiceItem};
