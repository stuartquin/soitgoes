'use strict';
import React from 'react';
import {Table, TableBody} from 'material-ui/Table';

import { InvoiceItemRow } from './invoiceitemrow';


const InvoiceItems = (props) => {
  return (
    <Table className='invoice-items table'>
      <TableBody>
      {props.items.map((item) => (
        <InvoiceItemRow
          key={item.id}
          isIssued={props.isIssued}
          details={item.details}
          unitPrice={item.unitPrice}
          subTotal={item.subTotal}
          onDelete={() => {
            props.onDeleteItem(item);
          }}
        />
      ))}
    </TableBody>
    </Table>
  );
};

export {InvoiceItems};
