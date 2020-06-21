import React from 'react';
import styled from 'styled-components';

import { asCurrency } from 'services/currency';

const StyledInvoiceSummaryItem = styled.div`
  color: white;
`;

const Title = styled.div`
  text-transform: uppercase;
  font-weight: bold;
  color: #bde9ff;
`;

const Value = styled.div`
  font-size: 40px;
  padding-top: 16px;
  padding-bottom: 16px;
`;

const InvoiceSummaryItem = ({ title, value }) => {
  return (
    <StyledInvoiceSummaryItem>
      <Title>{title}</Title>
      <Value>{asCurrency(value, 'GBP')}</Value>
    </StyledInvoiceSummaryItem>
  );
};

export default InvoiceSummaryItem;
