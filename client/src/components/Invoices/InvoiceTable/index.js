import React from 'react';
import styled from 'styled-components';

import {Grid, Cell} from 'components/Grid';
import InvoiceTableHeader from './InvoiceTableHeader';
import InvoiceRow from './InvoiceRow';

const Styled = styled.div`
  border-radius: 6px;
  box-shadow: 0 4px 6px hsla(0, 0%, 40%, 0.74);
  min-height: 400px;
`;

class InvoiceTable extends React.Component {
  render() {
    const {invoices} = this.props;

    return (
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
  }
}

export default InvoiceTable;