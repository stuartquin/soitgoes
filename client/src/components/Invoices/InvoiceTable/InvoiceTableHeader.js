import React from 'react';
import styled from 'styled-components';

import {Grid, Cell, CellMd} from 'components/Grid';

const Styled = styled(Grid)`
  border-top-left-radius: 6px;
  border-top-right-radius: 6px;
  background: #f5f3f5;
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
        <Cell xs="7" sm="5">
          Client
        </Cell>
        <CellMd sm="2">
          Issued Date
        </CellMd>
        <CellMd sm="2">
          Due Date
        </CellMd>
        <Cell xs="5" sm="3">
          Amount
        </Cell>
      </Styled>
    );
  }
}

export default InvoiceTableHeader;
