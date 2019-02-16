import React from 'react';
import styled from 'styled-components';

import {Grid, Cell} from 'components/Grid';

const Styled = styled(Grid)`
  background: #f4f6fa;
  color: #4e5767;
  text-transform: uppercase;
  padding: 12px 16px;
  font-weight: bold;
`;

class InvoiceTableHeader extends React.Component {
  render() {
    const {invoices} = this.props;

    return (
      <Styled>
        <Cell sm="5">
          Client
        </Cell>
        <Cell sm="2">
          Issued Date
        </Cell>
        <Cell sm="2">
          Due Date
        </Cell>
        <Cell sm="2">
          Amount
        </Cell>
        <Cell sm="1" />
      </Styled>
    );
  }
}

export default InvoiceTableHeader;
