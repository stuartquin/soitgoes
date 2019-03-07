import React from 'react';
import moment from 'moment';
import styled from 'styled-components';

import {asCurrency} from 'services/currency';
import {Cell, CellMd} from 'components/Grid';
import {Row} from 'components/DataTable';
import {ActionLink, SubTitle} from 'components/GUI';

const Actions = styled.div`
  text-align: right;
  width: 100%;
`;

const InvoiceItem = ({
  title, subTitle, unitPrice, subTotal, project, isEditable, onRemove
}) => {
  return (
    <Row>
      <Cell xs="8" sm="6">
        <div>{title}</div>
        <SubTitle>{subTitle}</SubTitle>
      </Cell>
      <CellMd numeric sm={isEditable ? '2' : '4'}>
        {asCurrency(unitPrice, project.currency)}
      </CellMd>
      <Cell numeric xs="2">
        {asCurrency(subTotal, project.currency)}
      </Cell>
      {isEditable && (
        <Actions as={Cell} xs="2">
          <ActionLink onClick={onRemove}>Remove</ActionLink>
        </Actions>
      )}
    </Row>
  );
}

export default InvoiceItem;
