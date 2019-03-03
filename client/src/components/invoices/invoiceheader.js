import React from 'react';

import Button from 'components/Button';
import Heading from 'components/Heading';


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

const InvoiceHeader = ({project}) => {
  return (
    <div className='invoice-header'>
      <div className='invoice-header-info'>
        <Heading size="h2">{project.name}</Heading>
        <Heading size="h3">{project.contact.name}</Heading>
      </div>
    </div>
  );
}

export default InvoiceHeader;
