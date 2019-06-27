import React from 'react';
import moment from 'moment';
import styled from 'styled-components';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faEdit, faMinusSquare} from '@fortawesome/free-solid-svg-icons'

import {asCurrency} from 'services/currency';
import {Cell, CellMd} from 'components/Grid';
import {Row} from 'components/DataTable';
import {ActionLink, SubTitle} from 'components/GUI';
import {Input} from 'components/Form';

const Actions = styled.div`
  text-align: right;
  width: 100%;
`;

const SubItem = styled(Cell)`
  padding-left: 8px;
`;

const InvoiceItem = ({
  item, project, isEditable, onAction,
}) => {
  const {
    title, subTitle, unitPrice, subTotal, itemType, subItems = []
  } = item;
  const icon = itemType === 'task' ? faEdit : faMinusSquare;

  return (
    <Row>
      <Cell xs="9" sm="7">
        <div>{title}</div>
        <SubTitle>{subTitle}</SubTitle>
      </Cell>
      <CellMd numeric sm={isEditable ? '2' : '3'}>
        {asCurrency(unitPrice, project.currency)}
      </CellMd>
      <Cell numeric xs="2">
        <strong>{asCurrency(subTotal, project.currency)}</strong>
      </Cell>
      <Actions as={Cell} xs="1">
        {isEditable && (
          <ActionLink onClick={() => onAction(item)}>
            <FontAwesomeIcon icon={icon} />
          </ActionLink>
        )}
      </Actions>

      {subItems.map(subItem => (
        <React.Fragment key={subItem.id}>
          <SubItem xs="9">
            <SubTitle>{subItem.title} - {subItem.subTitle}</SubTitle>
          </SubItem>
          <Cell numeric xs="2">
            {asCurrency(subItem.subTotal, project.currency)}
          </Cell>
          <Actions as={Cell} xs="1">
          </Actions>
        </React.Fragment>
      ))}
    </Row>
  );
}

export default InvoiceItem;
