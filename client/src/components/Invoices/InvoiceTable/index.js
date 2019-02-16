import React from 'react';
import styled from 'styled-components';

import {Grid, Cell} from 'components/Grid';
import InvoiceTableHeader from './InvoiceTableHeader';
import InvoiceRow from './InvoiceRow';

const Styled = styled.div`
  border-radius: 8px;
  box-shadow: 0 4px 6px hsla(0, 0%, 40%, 0.74);
  min-height: 400px;
  width: 1200px;
`;

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 32px;
  width: 100%;
`;

class InvoiceTable extends React.Component {
  render() {
    const {invoices, projects} = this.props;

    return (
      <Wrapper>
        <Styled>
          <InvoiceTableHeader />
          {invoices.map(invoice => (
            <InvoiceRow
              key={invoice.id}
              invoice={invoice}
              projects={projects}
            />
          ))}
        </Styled>
      </Wrapper>
    );
  }
}

export default InvoiceTable;
