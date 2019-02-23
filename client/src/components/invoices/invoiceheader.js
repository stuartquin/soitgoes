'use strict';
import React from 'react';

import Button from 'components/Button';

import {StateChip} from './state-chip';


const getDefaultName = (invoice, project) => {
  return `${project.name} #${invoice.sequence_num}`;
};

const getStateAction = (invoice, onMarkAsIssued, onMarkAsPaid) => {
  if (!invoice.paid_at) {
    if (invoice.issued_at) {
      return (
        <Button
          className='btn btn-success'
          label='Set Paid'
          onClick={onMarkAsPaid}
        />
      );
    } else {
      return (
        <Button
          className='btn btn-warn'
          label='Issue'
          onClick={onMarkAsIssued}
        />
      );
    }
  }
};

const getInvoiceActions = (invoice, onDelete) => {
  return (
    <div>
      <Button onClick={onDelete} label="Delete" />
      {invoice.issued_at && (
        <Button
          onClick={() => window.open(`/api/invoices/${invoice.id}/pdf`)}
          label="Download"
        />
      )}
    </div>
  );
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
          { project.contact.name }
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

export default InvoiceHeader;
