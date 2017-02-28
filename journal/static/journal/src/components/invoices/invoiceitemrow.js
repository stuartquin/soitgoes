'use strict';
import React from 'react';

import ActionDelete from 'material-ui/svg-icons/action/delete';
import IconButton from 'material-ui/IconButton';
import {TableRow, TableRowColumn} from 'material-ui/Table';



const InvoiceItemRow = (props) => {
  let actions = null;
  if (props.isEditable) {
    actions = (
      <TableRowColumn className='col-actions'>
        <IconButton
          tooltip='Remove Item'
          touch={true}
          tooltipPosition='bottom-right'
          className='btn-default'
          onTouchTap={props.onDelete}>
          <ActionDelete />
        </IconButton>
      </TableRowColumn>
    );
  }

  return (
    <TableRow className='invoice-list-row'>
      <TableRowColumn>
        {props.details}
      </TableRowColumn>
      <TableRowColumn className='col-currency col-sm-hide col-right'>
        {props.unitPrice}
      </TableRowColumn>
      <TableRowColumn className='col-currency col-right'>
        {props.subTotal}
      </TableRowColumn>
      {actions}
    </TableRow>
  );
};

export {InvoiceItemRow};
