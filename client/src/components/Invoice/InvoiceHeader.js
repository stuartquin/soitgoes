import React from 'react';
import styled from 'styled-components';
import moment from 'moment';

import Button from 'components/Button';
import Heading from 'components/Heading';
import StatusPill from 'components/StatusPill';
import {getInvoiceStatus, getInvoiceDueMessage} from 'services/invoice';

const Styled = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const STATUS_MAP = {
  DRAFT: 'draft',
  PENDING: 'warning',
  OVERDUE: 'danger',
  PAID: 'success',
};

const InvoiceHeader = ({invoice, project}) => {
  const status = STATUS_MAP[getInvoiceStatus(invoice)];

  return (
    <Styled>
      <div className='invoice-header-info'>
        <Heading size="h2">{project.name}</Heading>
        <Heading size="h3">{project.contact.name}</Heading>
      </div>

      <StatusPill size="lg" status={status}>
        {getInvoiceDueMessage(invoice)}
      </StatusPill>
    </Styled>
  );
}

export default InvoiceHeader;
