import React from 'react';
import moment from 'moment';
import styled from 'styled-components';
import { Flex, Box, Text } from 'rebass/styled-components';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faMinusSquare} from '@fortawesome/free-solid-svg-icons'

import {asCurrency} from 'services/currency';
import {Cell, CellMd} from 'components/Grid';
import {Row} from 'components/DataTable';
import {ActionLink} from 'components/GUI';
import {Input} from 'components/Form';

const Actions = styled(Box)`
  text-align: right;
  width: 100%;
`;

const InvoiceItem = ({
  item, project, isEditable, onAction,
}) => {
  const {
    title, subTitle, unitPrice, subTotal, itemType, subItems = []
  } = item;

  return (
    <Row justifyContent="flexEnd" flexWrap="wrap">
      <Box flexGrow="1">
        <Text fontSize={2}>{title}</Text>
        <Text variant="subTitle">{subTitle}</Text>
      </Box>
      <Box minWidth="80px" display={['none', 'initial']}>
        <Text variant="amount">{asCurrency(unitPrice, project.currency)}</Text>
      </Box>
      <Box minWidth={['80px', '120px']}>
        <Text variant="amount">{asCurrency(subTotal, project.currency)}</Text>
      </Box>
      {isEditable && (
        <Box ml={3}>
          <ActionLink onClick={() => onAction(item)}>
            <FontAwesomeIcon icon={faMinusSquare} />
          </ActionLink>
        </Box>
      )}

      {subItems.map(subItem => (
        <Flex
          key={subItem.id}
          width="100%"
          justifyContent="flexEnd"
          alignItems="center"
          py={2}
        >
          <Box xs="10" flexGrow="1">
            <Text pl={2} variant="subTitle">
              {subItem.title} - {subItem.subTitle}
            </Text>
          </Box>
          <Box minWidth={['80px', '120px']} mr={isEditable ? 5 : null}>
            <Text variant="amount" fontSize={1} color="grey_dark">
              {asCurrency(subItem.subTotal, project.currency)}
            </Text>
          </Box>
        </Flex>
      ))}
    </Row>
  );
}

export default InvoiceItem;
