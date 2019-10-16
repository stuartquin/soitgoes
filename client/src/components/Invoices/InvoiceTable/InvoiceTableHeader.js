import React from 'react';
import styled from 'styled-components';
import { Box } from 'rebass/styled-components';

import {Header} from 'components/DataTable';


class InvoiceTableHeader extends React.Component {
  render() {
    const {invoices} = this.props;

    return (
      <Header>
        <Box flexGrow={2}>
          Client
        </Box>
        <Box>
          Status
        </Box>
      </Header>
    );
  }
}

export default InvoiceTableHeader;
