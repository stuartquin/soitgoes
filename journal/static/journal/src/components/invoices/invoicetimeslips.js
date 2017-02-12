'use strict';
import React from 'react';
import {Table, TableBody} from 'material-ui/Table';

import { InvoiceItemRow } from './invoiceitemrow';

const getTimeslipDetails = (timeslip, project) => {
  return `${timeslip.get('hours')} Hours on ${timeslip.get('date')}: ${project.get('name')}`;
};

const getItemDetails = (item) => {
  return `${item.get('qty')} x ${item.get('name')}`;
};

const InvoiceTimeslips = (props) => {
  const project = props.project;

  return (
    <Table className='invoice-list'>
      <TableBody>
      {props.timeslips.map((timeslip) => (
        <InvoiceItemRow
          key={timeslip.get('id')}
          isIssued={props.isIssued}
          details={getTimeslipDetails(timeslip, project)}
          unitPrice={project.get('hourly_rate')}
          subTotal={project.get('hourly_rate') * timeslip.get('hours')}
          onDelete={() => {
            props.onDeleteInvoiceTimeslip(timeslip);
          }}
        />
      ))}

      {props.tasks.map((task) => (
        <InvoiceItemRow
          key={task.get('id') * 200}
          isIssued={props.isIssued}
          details={task.get('name')}
          unitPrice={task.get('cost')}
          subTotal={task.get('cost')}
          onDelete={() => {
            props.onDeleteTask(task.get('id'));
          }}
        />
      ))}
    </TableBody>
    </Table>
  );
};

export {InvoiceTimeslips};
