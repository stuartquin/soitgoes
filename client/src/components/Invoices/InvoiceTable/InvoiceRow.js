import React from 'react';
import moment from 'moment';
import styled from 'styled-components';
import { Box, Flex, Text } from 'rebass/styled-components';
import { Link } from 'react-router-dom';

import { BREAKPOINTS, Grid, Cell, CellMd } from 'components/Grid';
import { getInvoiceStatus, getInvoiceDueMessage } from 'services/invoice';
import { asCurrency } from 'services/currency';
import StatusPill from 'components/StatusPill';
import { Row } from 'components/DataTable';

const STATUS_MAP = {
  DRAFT: 'draft',
  PENDING: 'warning',
  OVERDUE: 'danger',
  PAID: 'success',
};

const getStatusColor = (status) => `${STATUS_MAP[status]}_dark`;

const StyledLink = styled(Link)`
  text-decoration: none;
`;

class InvoiceRow extends React.Component {
  render() {
    const { invoice } = this.props;
    const { project } = invoice;
    const status = getInvoiceStatus(invoice);
    const issuedAt = invoice.issued_at ? moment(invoice.issued_at) : '';

    return (
      <Row
        as={StyledLink}
        to={`/invoices/${project.id}/invoice/${invoice.id}`}
        sx={{ justifyContent: 'flexEnd', alignItems: 'flexStart' }}
      >
        <Box flexGrow="1" variant="ellipsis">
          <div>
            #{invoice.sequence_num} {project.name}
          </div>
          <Text variant="subTitle">{project.contact.name}</Text>
        </Box>

        <Box
          textAlign="right"
          ml={[4, 5]}
          minWidth="70px"
          display={['none', 'initial']}
        >
          <Text fontSize={2}>{issuedAt.format('YYYY-MM-DD')}</Text>
          <Text fontSize={[11, 13]} mt={1} color="text_light">
            {issuedAt.fromNow()}
          </Text>
        </Box>

        <Box textAlign="right" ml={[4, 5]} minWidth="70px">
          <Text variant="amount" fontSize={2}>
            {asCurrency(invoice.total_due, project.currency || 'GBP', 0)}
          </Text>
          <Text fontSize={[11, 13]} mt={1} color="text_light">
            {asCurrency(invoice.subtotal_due, project.currency || 'GBP', 0)}
          </Text>
        </Box>

        <Box minWidth="87px" fontSize={[0, 1]} ml={[4, 5]} textAlign="right">
          <Text
            variant="amount"
            fontSize={2}
            color={`${STATUS_MAP[status]}_darkest`}
          >
            {getInvoiceDueMessage(invoice)}
          </Text>
          <Text fontSize={[11, 13]} mt={1} color={`${STATUS_MAP[status]}_dark`}>
            {status}
          </Text>
        </Box>
      </Row>
    );
  }
}

export default InvoiceRow;
