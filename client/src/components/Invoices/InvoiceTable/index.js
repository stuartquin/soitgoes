import React, { useContext } from 'react';
import styled, { ThemeContext } from 'styled-components';

import {Grid, Cell} from 'components/Grid';
import InvoiceTableHeader from './InvoiceTableHeader';
import InvoiceRow from './InvoiceRow';

const Styled = styled.div`
  border-radius: 6px;
  box-shadow: 0 4px 6px hsla(0, 0%, 40%, 0.74);
  max-width: 1200px;
  width: 100%;
`;

const InvoiceTable = ({ invoices }) => (
  <Styled>
    <InvoiceTableHeader />
    {invoices.map(invoice => (
      <InvoiceRow
        key={invoice.id}
        invoice={invoice}
      />
    ))}
  </Styled>
);

export default InvoiceTable;
