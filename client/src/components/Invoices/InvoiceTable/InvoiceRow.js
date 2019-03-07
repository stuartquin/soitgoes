import React from 'react';
import moment from 'moment';
import styled from 'styled-components';
import { Link } from 'react-router-dom'

import {BREAKPOINTS, Grid, Cell, CellMd} from 'components/Grid';
import {getInvoiceStatus} from 'services/invoice';
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
    moment(invoice.issued_at).format('MMM. DD, YYYY') :
    '';
}

const ContactName = styled.div`
  color: #828282;
  font-size: 0.9em;
  margin-top: 4px;
`;

const Total = styled.div`
  margin-right: 4px;
`;

const StatusCell = styled(Cell)`
  display: flex;
  align-items: center;
  justify-content: flex-end;

  @media(max-width: ${BREAKPOINTS.sm}) {
    min-width: auto;
  }
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
        to={`/project/${project.id}/invoice/${invoice.id}`}
      >
        <Cell xs="7" sm="5">
          <div>#{invoice.sequence_num} {project.name}</div>
          <ContactName>{project.contact.name}</ContactName>
        </Cell>
        <CellMd sm="2">
          {getIssuedDate(invoice)}
        </CellMd>
        <CellMd sm="2">
          {moment(invoice.due_date).fromNow()}
        </CellMd>
        <StatusCell numeric xs="5" sm="3">
          <Total>
            {asCurrency(invoice.total_due, project.currency || 'GBP')}
          </Total>
          <StatusPill status={STATUS_MAP[status]}>{status}</StatusPill>
        </StatusCell>
      </Row>
    );
  }
}

export default InvoiceRow;
