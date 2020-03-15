import React from 'react';
import { Flex } from 'rebass';

import Actions from 'components/Invoice/Actions';
import StatusPill from 'components/StatusPill';
import { BREAKPOINTS } from 'components/Grid';
import { getInvoiceStatus, getInvoiceDueMessage } from 'services/invoice';

const STATUS_MAP = {
  DRAFT: 'draft',
  ISSUED: 'warning',
  OVERDUE: 'danger',
  PAID: 'success',
};

const InvoiceHeader = ({ invoice, project, onUpdateStatus }) => {
  const status = STATUS_MAP[getInvoiceStatus(invoice)];

  return (
    <Flex
      justifyContent="space-between"
      flexWrap="wrap"
      alignItems="center"
      mb={12}
    >
      <h2>
        {project.name} #{invoice.sequence_num}
      </h2>
      <Actions
        invoice={invoice}
        onUpdateStatus={onUpdateStatus}
        onDelete={() => console.log('delete')}
      />
    </Flex>
  );
};

export default InvoiceHeader;
