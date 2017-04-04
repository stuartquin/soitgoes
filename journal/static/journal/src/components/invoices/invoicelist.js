import React from 'react';
import moment from 'moment';
import {
  Table, TableBody, TableHeader, TableHeaderColumn, TableRow
} from 'material-ui/Table';

import { InvoiceListRow } from './invoicelistrow';


const groupByMonth = (invoices) => {
  let grouped = {};
  invoices.forEach((inv) => {
    const date = inv.get('due_date').substring(0, 7);

    if (grouped[date]) {
      grouped[date].push(inv);
    } else {
      grouped[date] = [inv];
    }
  });

  return grouped;
};

const getRows = (invoices, projects, onDelete) => {
  return invoices.map(invoice => {
    const id = invoice.get('id');
    const project = projects.get(invoice.get('project'));
    return (
      <InvoiceListRow
        key={id}
        onDelete={() => onDelete(id)}
        project={project}
        invoice={invoice} />
    );
  });
};

const InvoiceList = ({ projects, invoices, onDeleteInvoice }) => {
  const grouped = groupByMonth(invoices);
  const months = Object.keys(grouped);

  return (
    <div>
      {months.map((month, idx) => {
        return (
          <Table className='invoice-list table' key={idx}>
            <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
              <TableRow>
                <TableHeaderColumn colSpan='4' style={{paddingLeft: 0}}>
                  {moment(`${month}-01`).format('MMMM YYYY')}
                </TableHeaderColumn>
              </TableRow>
            </TableHeader>
            <TableBody>
             {getRows(grouped[month], projects, onDeleteInvoice)}
            </TableBody>
          </Table>
        )
      })}
    </div>
  );
};

export {InvoiceList};
