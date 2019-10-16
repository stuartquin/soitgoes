import React from 'react';
import moment from 'moment';
import styled from 'styled-components';
import { Box, Flex, Text } from 'rebass/styled-components';
import { Link } from 'react-router-dom'

import {BREAKPOINTS, Grid, Cell, CellMd} from 'components/Grid';
import {getInvoiceStatus, getInvoiceDueMessage} from 'services/invoice';
import {asCurrency} from 'services/currency';
import StatusPill from 'components/StatusPill';
import {Row} from 'components/DataTable';

const STATUS_MAP = {
  DRAFT: 'draft',
  PENDING: 'warning',
  OVERDUE: 'danger',
  PAID: 'success',
};

const getIssuedDate = (invoice) => {
  return invoice.issued_at ?
    moment(invoice.issued_at).format('YYYY-MM-DD') :
    '';
}

const StyledLink = styled(Link)`
  text-decoration: none;
`;

class InvoiceRow extends React.Component {
  render() {
    const {invoice} = this.props;
    const {project} = invoice;
    const status = getInvoiceStatus(invoice);
    return (
      <Row
        as={StyledLink}
        to={`/invoices/${project.id}/invoice/${invoice.id}`}
        sx={{ justifyContent: 'flexEnd' }}
      >
        <Box flexGrow="1" variant="ellipsis">
          <div>#{invoice.sequence_num} {project.name}</div>
          <Text variant="subTitle">{project.contact.name}</Text>
        </Box>
        <Box width="64px">
          <Text variant="amount" fontWeight={2}>
            {asCurrency(invoice.total_due, project.currency || 'GBP', 0)}
          </Text>
        </Box>
        <Flex alignItems="center" justifyContent="flex-end">
          <Box display={['none', 'initial']} ml={4}>
            {getIssuedDate(invoice)}
          </Box>
          <StatusPill
            minWidth="87px"
            status={STATUS_MAP[status]}
            fontSize={[12, 14]}
            display="inline"
            ml={4}
          >
            {getInvoiceDueMessage(invoice)}
          </StatusPill>
        </Flex>
      </Row>
    );
  }
}

export default InvoiceRow;
