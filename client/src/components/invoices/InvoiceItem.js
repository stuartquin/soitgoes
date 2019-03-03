import React from 'react';
import moment from 'moment';
import styled from 'styled-components';

import {asCurrency} from 'services/currency';
import {Cell, CellMd} from 'components/Grid';
import {Row} from 'components/DataTable';
import {SubTitle} from 'components/GUI';


const InvoiceItem = ({
  title, subTitle, unitPrice, subTotal, project
}) => {

  return (
    <Row>
      <Cell xs="7" sm="5">
        <div>{title}</div>
        <SubTitle>{subTitle}</SubTitle>
      </Cell>
      <CellMd sm="2">
        {asCurrency(unitPrice, project.currency)}
      </CellMd>
      <Cell sm="2">
        {asCurrency(subTotal, project.currency)}
      </Cell>
      <Cell sm="3">
        Remove
      </Cell>
    </Row>
  );
}

export default InvoiceItem;
