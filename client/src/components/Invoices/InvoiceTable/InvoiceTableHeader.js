import React from 'react';
import styled from 'styled-components';

import {Grid, Cell, CellMd} from 'components/Grid';
import {Header} from 'components/DataTable';


class InvoiceTableHeader extends React.Component {
  render() {
    const {invoices} = this.props;

    return (
      <Header>
        <Cell xs="9" sm="6">
          Client
        </Cell>
        <CellMd numeric sm="2">
          Issued
        </CellMd>
        <CellMd numeric sm="2">
          Status
        </CellMd>
        <CellMd numeric sm="2">
          Amount
        </CellMd>
      </Header>
    );
  }
}

export default InvoiceTableHeader;
