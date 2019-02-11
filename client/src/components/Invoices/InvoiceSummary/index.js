import React from 'react';
import styled from 'styled-components';

import {Grid, Cell} from 'components/Grid';
import InvoiceSummaryItem from './InvoiceSummaryItem';

const StyledInvoiceSummary = styled.div`
  background: #3C4878;
  background: linear-gradient(bottom right, #3C4878, #314CA1);
  color: white;
  min-height: 140px;
  padding-top: 24px;
  padding-bottom: 24px;

  display: flex;
  justify-content: center;
`;

const InvoiceSummary = ({total, overdue, unbilled}) => {
  return (
    <StyledInvoiceSummary>
      <Grid>
        <Cell sm="4">
          <InvoiceSummaryItem
            title="Total Issued"
            value={total}
          />
        </Cell>
        <Cell sm="4">
          <InvoiceSummaryItem
            title="Overdue"
            value={overdue}
          />
        </Cell>
        <Cell sm="4">
          <InvoiceSummaryItem
            title="Unbilled"
            value={unbilled}
          />
        </Cell>
      </Grid>
    </StyledInvoiceSummary>
  );
};

export default InvoiceSummary;
