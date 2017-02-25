'use strict';
import React from 'react';

import IconButton from 'material-ui/IconButton';
import ActionDelete from 'material-ui/svg-icons/action/delete';
import RaisedButton from 'material-ui/RaisedButton';

import {StateChip} from './state-chip';


const getDefaultName = (invoice, project) => {
  return `${project.get('name')} #${invoice.get('sequence_num')}`;
};


const getInvoiceAction = (invoice, onMarkAsIssued, onMarkAsPaid) => {
  if (invoice.get('issued_at')) {
    return (
      <RaisedButton
        className='btn-success'
        label='Set Paid'
        labelPosition='before'
        onTouchTap={onMarkAsPaid}
      />
    );
  } else {
    return (
      <RaisedButton
        className='btn-warn'
        label='Issue'
        labelPosition='before'
        onTouchTap={onMarkAsIssued}
      />
    );
  }
};

const InvoiceHeader = (props) => {
  const invoice = props.invoice;
  const project = props.project;
  const name = getDefaultName(invoice, project);

  return (
    <div className='invoice-header'>
      <div className='invoice-header-info'>
        <h3>{ name }</h3>
        <span className='text-muted'>
          { project.get('contact').get('name') }
        </span>
      </div>
      <div className='invoice-header-options'>
        <StateChip invoice={invoice} />
        <div className='invoice-header-actions'>
          <IconButton
            tooltip='Delete Invoice'
            touch={true}
            tooltipPosition='bottom-center'
            className='btn-default icon-btn-right'
            onTouchTap={props.onDelete}>
            <ActionDelete />
          </IconButton>

          {getInvoiceAction(invoice, props.onMarkAsIssued, props.onMarkAsPaid)}
        </div>
      </div>
    </div>
  );
}


export {InvoiceHeader};
