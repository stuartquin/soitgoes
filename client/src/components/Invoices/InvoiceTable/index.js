import React, { useContext } from 'react';
import styled, { ThemeContext } from 'styled-components';

import { BREAKPOINTS, Grid, Cell } from 'components/Grid';
import RouterPagination from 'components/RouterPagination';
import InvoiceTableHeader from './InvoiceTableHeader';
import InvoiceRow from './InvoiceRow';

const Styled = styled.div`
  border-radius: 6px;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  flex-grow: 1;
  background: white;
  min-height: 400px;

  @media (max-width: ${BREAKPOINTS.sm}) {
    border-top-left-radius: 0;
    border-bottom-right-radius: 6px;
  }
`;

const InvoiceTable = ({ invoices, page, total }) => (
  <Styled>
    <InvoiceTableHeader />
    {invoices.map(invoice => (
      <InvoiceRow key={invoice.id} invoice={invoice} />
    ))}
    <RouterPagination path="/invoices" total={total} page={page} />
  </Styled>
);

export default InvoiceTable;
