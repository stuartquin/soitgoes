import React from 'react';
import { InvoiceItemRow } from './invoiceitemrow';


const InvoiceItems = (props) => {
  return (
    <table className='invoice-items table'>
      <tbody>
      {props.items.map((item) => (
        <InvoiceItemRow
          key={item.id}
          isEditable={props.isEditable}
          details={item.details}
          unitPrice={item.unitPrice}
          subTotal={item.subTotal}
          onDelete={() => {
            props.onDeleteItem(item);
          }}
        />
      ))}
      </tbody>
    </table>
  );
};

export {InvoiceItems};
