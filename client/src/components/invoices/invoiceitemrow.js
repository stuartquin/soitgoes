import React from 'react';
import Button from 'components/Button';

const InvoiceItemRow = (props) => {
  let actions = null;
  if (props.isEditable) {
    actions = (
      <td className='col-actions'>
        <Button
          className='btn-default'
          onClick={props.onDelete}
          label="Delete"
        />
      </td>
    );
  }

  return (
    <tr className='invoice-list-row'>
      <td>
        {props.details}
      </td>
      <td className='col-currency col-sm-hide col-right'>
        {props.unitPrice}
      </td>
      <td className='col-currency col-right'>
        {props.subTotal}
      </td>
      {actions}
    </tr>
  );
};

export {InvoiceItemRow};
