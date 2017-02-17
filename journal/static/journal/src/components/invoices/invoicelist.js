import React from 'react';
import {Table, TableBody} from 'material-ui/Table';

import { InvoiceListRow } from './invoicelistrow';


const InvoiceList = (props) => {
  const projects = props.projects;

  return (
    <Table className='invoice-list table'>
      <TableBody>
      {props.invoices.map(invoice => (
        <InvoiceListRow
          key={invoice.get('id')}
          onDelete={() => props.onDeleteInvoice(invoice.get('id'))}
          project={projects.get(invoice.get('project'))}
          invoice={invoice} />
      ))}

      </TableBody>
    </Table>
  );
};

export {InvoiceList};
