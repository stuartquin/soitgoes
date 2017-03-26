import React from 'react';
import {Table, TableBody} from 'material-ui/Table';

import { InvoiceListRow } from './invoicelistrow';


const InvoiceList = ({ projects, invoices, onDeleteInvoice }) => {
  return (
    <Table className='invoice-list table'>
      <TableBody>
        {invoices.map(invoice => {
          const id = invoice.get('id');
          const project = projects.get(invoice.get('project'));
          return (
            <InvoiceListRow
              key={id}
              onDelete={() => onDeleteInvoice(id)}
              project={project}
              invoice={invoice} />
          );
        })}
      </TableBody>
    </Table>
  );
};

export {InvoiceList};
