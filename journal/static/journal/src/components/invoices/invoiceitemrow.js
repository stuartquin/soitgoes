'use strict';
import React from 'react';
import {TableRow, TableRowColumn} from 'material-ui/Table';

const InvoiceItemRow = (props) => {
  let btn = (<div />);
  if (!props.isIssued) {
    btn = (
      <button className='btn btn-sm btn-default'
        onClick={props.onDelete}>
        <span className='glyphicon glyphicon-minus-sign'></span>
      </button>
    );
  }

  return (
    <TableRow className='invoice-list-row'>
      <TableRowColumn>
        {props.details}
      </TableRowColumn>
      <TableRowColumn className='col-currency col-sm-hide'>
        {props.unitPrice}
      </TableRowColumn>
      <TableRowColumn className='col-currency'>
        {props.subTotal}
      </TableRowColumn>
      <TableRowColumn className='col-action'>
        {btn}
      </TableRowColumn>
    </TableRow>
  );
};

export {InvoiceItemRow};
