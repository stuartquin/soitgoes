'use strict';
import React from 'react';
import { Link } from 'react-router';
import moment from 'moment';

import ActionDelete from 'material-ui/svg-icons/action/delete';
import IconButton from 'material-ui/IconButton';
import {TableRow, TableRowColumn} from 'material-ui/Table';

import {StateChip} from './state-chip';


const InvoiceListRow = (props) => {
  const invoice = props.invoice;
  const issuedAt = invoice.get('issued_at') ? moment(invoice.get('issued_at')).format('YYYY-MM-DD') : '-';

  let totalClass = 'text-danger';
  let total = invoice.get('total_due');
  if (invoice.get('total_paid')) {
    totalClass = 'text-success';
    total = invoice.get('total_paid');
  }

  return (
    <TableRow className='invoice-list-row'>
      <TableRowColumn>
        <Link to={`/invoices/${invoice.get('id')}`}>
          #{invoice.get('sequence_num')} {props.project.get('name')}
        </Link>
      </TableRowColumn>
      <TableRowColumn className='col-number'>
        <span className={ totalClass }>&pound;{total}</span>
      </TableRowColumn>
      <TableRowColumn className='col-state'>
        <StateChip invoice={invoice} />
      </TableRowColumn>
      <TableRowColumn className='col-actions'>
        <IconButton
          tooltip='Delete Invoice'
          touch={true}
          tooltipPosition='bottom-right'
          className='btn-default'
          onTouchTap={props.onDelete}>
          <ActionDelete />
        </IconButton>
      </TableRowColumn>
    </TableRow>
  );
};

export {InvoiceListRow};
