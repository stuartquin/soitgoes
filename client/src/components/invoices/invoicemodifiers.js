'use strict';
import React from 'react';

import Button from 'components/Button';

const getModifierListItem = (invoice, modifier, isEditable, onAdd, onDelete) => {
  let actionBtn = null;
  const invoiceModifiers = invoice.modifier || [];
  if (isEditable) {
    if (invoiceModifiers.includes(modifier.id)) {
      actionBtn = (
        <Button
          className='btn-default icon-btn-right'
          onClick={() => onDelete(modifier)}
          label="Remove"
        />
      );
    } else {
      actionBtn = (
        <Button
          className='btn-default icon-btn-right'
          onClick={() => onAdd(modifier)}
          label="Add"
        />
      );
    }
  }

  return (
    <li key={modifier.id}>
      <strong>modifier.name: </strong>{modifier.percent}%
    </li>
  );
};


class InvoiceModifiers extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    const invoice = this.props.invoice;
    const project = this.props.project;
    const modifiers = this.props.modifiers;
    const isEditable = this.props.isEditable;

    return (
      <ul className='invoice-modifiers'>
        {modifiers.map(modifier =>
          getModifierListItem(invoice, modifier, isEditable,
            () => {
              this.props.onAddModifier(modifier)
            },
            () => {
              this.props.onRemoveModifier(modifier)
            },
          )
        )}
      </ul>
    );
  }
}

export default InvoiceModifiers;
