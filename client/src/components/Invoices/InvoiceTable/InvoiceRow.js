import React from 'react';
import moment from 'moment';
import styled from 'styled-components';
import { Text } from 'rebass/styled-components';
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


const Total = styled.div`
  margin-left: 4px;
`;


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
      >
        <Cell xs="5" sm="6">
          <div>#{invoice.sequence_num} {project.name}</div>
          <Text display={['none', 'block']}>{project.contact.name}</Text>
        </Cell>
        <CellMd sm="2" numeric>
          {getIssuedDate(invoice)}
        </CellMd>
        <Cell xs="4" sm="2" textAlign="right">
          <StatusPill status={STATUS_MAP[status]} fontSize={[12, 14]} display="inline">
            {getInvoiceDueMessage(invoice)}
          </StatusPill>
        </Cell>
        <Cell numeric xs="3" sm="2">
          <Text textAlign="right" width="100%">
            {asCurrency(invoice.total_due, project.currency || 'GBP', 0)}
          </Text>
        </Cell>
      </Row>
    );
  }
}

export default InvoiceRow;
