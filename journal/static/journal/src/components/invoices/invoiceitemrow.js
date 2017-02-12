'use strict';
import React from 'react';

import ActionDelete from 'material-ui/svg-icons/action/delete';
import IconButton from 'material-ui/IconButton';
import {TableRow, TableRowColumn} from 'material-ui/Table';



const InvoiceItemRow = (props) => {
  let btn = (<div />);
  if (!props.isIssued) {
    btn = (
      <IconButton
        tooltip='Remove Item'
        touch={true}
        tooltipPosition='bottom-right'
        className='btn-default'
        onTouchTap={props.onDelete}>
        <ActionDelete />
      </IconButton>
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
