import React from 'react';
import moment from 'moment';
import styled from 'styled-components';

import {Grid, Cell} from 'components/Grid';
import {getInvoiceStatus} from 'services/invoice';
import {asCurrency} from 'services/currency';
import StatusPill from 'components/StatusPill';

const STATUS_MAP = {
  Draft: 'draft',
  Pending: 'warning',
  Overdue: 'danger',
  Paid: 'success',
};

const getIssuedDate = (invoice) => {
  return invoice.issued_at ?
    moment(invoice.issued_at).format('MMM. DD, YYYY') :
    '';
}

const Styled = styled(Grid)`
  color: #4e5767;
  padding: 12px 16px;
  cursor: pointer;

  &:hover {
    background: #bde9ff;
  }
`;

const ContactName = styled.div`
  color: #828282;
  font-size: 0.9em;
  margin-top: 4px;
`;



class InvoiceRow extends React.Component {
  render() {
    const {invoice} = this.props;
    const {project} = invoice;
    const status = getInvoiceStatus(invoice);
    return (
      <Styled>
        <Cell sm="5">
          <div>#{invoice.sequence_num} {project.name}</div>
          <ContactName>{project.contact.name}</ContactName>
        </Cell>
        <Cell sm="2">
          {getIssuedDate(invoice)}
        </Cell>
        <Cell sm="2">
          {moment(invoice.due_date).fromNow()}
        </Cell>
        <Cell sm="2">
          {asCurrency(invoice.total_due, 'GBP')}
        </Cell>
        <Cell sm="1">
          <StatusPill status={STATUS_MAP[status]}>{status}</StatusPill>
        </Cell>
      </Styled>
    );
  }
}

export default InvoiceRow;
