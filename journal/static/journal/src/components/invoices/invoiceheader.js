'use strict';
import React from 'react';

import IconButton from 'material-ui/IconButton';
import ActionDelete from 'material-ui/svg-icons/action/delete';
import FileDownload from 'material-ui/svg-icons/file/file-download';
import RaisedButton from 'material-ui/RaisedButton';

import {StateChip} from './state-chip';


const getDefaultName = (invoice, project) => {
  return `${project.get('name')} #${invoice.get('sequence_num')}`;
};

const getStateAction = (invoice, onMarkAsIssued, onMarkAsPaid) => {
  if (!invoice.get('paid_at')) {
    if (invoice.get('issued_at')) {
      return (
        <RaisedButton
          className='btn btn-success'
          label='Set Paid'
          labelPosition='before'
          onTouchTap={onMarkAsPaid}
        />
      );
    } else {
      return (
        <RaisedButton
          className='btn btn-warn'
          label='Issue'
          labelPosition='before'
          onTouchTap={onMarkAsIssued}
        />
      );
    }
  }
};

const getInvoiceActions = (invoice, onDelete) => {
  let actions = [(
    <IconButton
      key={0}
      touch={true}
      tooltipPosition='bottom-center'
      className='btn-default icon-btn-right'
      onTouchTap={onDelete}>
      <ActionDelete />
    </IconButton>
  )];

  if (invoice.get('issued_at')) {
    actions = [(
      <IconButton
        key={1}
        touch={true}
        tooltipPosition='bottom-center'
        className='btn-default icon-btn-right'
        onTouchTap={() => {
          window.open(`/api/invoices/${invoice.get('id')}/pdf`);
        }}>
        <FileDownload />
      </IconButton>
    )].concat(actions);
  }

  return (
    <div className='invoice-header-actions'>
      {actions}
    </div>
  );
};

const InvoiceHeader = (props) => {
  const invoice = props.invoice;
  const project = props.project;
  const contact = props.contact;
  const name = getDefaultName(invoice, project);

  return (
    <div className='invoice-header'>
      <div className='invoice-header-info'>
        <h3>{ name }</h3>
        <span className='text-muted'>
          { contact.get('name') }
        </span>
      </div>
      <div className='invoice-header-options'>
        {getInvoiceActions(invoice, props.onDelete)}
        <div className='invoice-header-actions'>
          <StateChip invoice={invoice} />
          {getStateAction(invoice, props.onMarkAsIssued, props.onMarkAsPaid)}
        </div>
      </div>
    </div>
  );
}


export {InvoiceHeader};
