import React from 'react';
import styled from 'styled-components';

import {Grid, Cell, CellMd} from 'components/Grid';
import {Header} from 'components/DataTable';


class InvoiceTableHeader extends React.Component {
  render() {
    const {invoices} = this.props;

    return (
      <Header>
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
      </Header>
    );
  }
}

export default InvoiceTableHeader;
