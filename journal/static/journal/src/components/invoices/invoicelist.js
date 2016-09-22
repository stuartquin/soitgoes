import React from 'react';

import { InvoiceListRow } from './invoicelistrow';

const InvoiceList = (props) => {
  return (
    <table className='table'>
      <thead>
        <tr>
          <th>Invoice</th>
          <th>Issued</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
      {props.invoices.map(invoice => (
        <InvoiceListRow
          key={invoice.id}
          invoice={invoice} />
      ))}
      </tbody>
    </table>
  );
};

export {InvoiceList};
