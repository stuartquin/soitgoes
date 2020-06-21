import React from 'react';
import moment from 'moment';
import styled from 'styled-components';
import { Flex, Box, Text } from 'rebass/styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinusSquare } from '@fortawesome/free-solid-svg-icons';
import { faPlusSquare } from '@fortawesome/free-solid-svg-icons';
import { faGripVertical } from '@fortawesome/free-solid-svg-icons';

import { asCurrency } from 'services/currency';
import { Cell, CellMd } from 'components/Grid';
import { ActionLink } from 'components/GUI';
import { Checkbox } from 'components/Form';

const Row = styled(Flex)``;
const Grip = styled(Box)`
  opacity: 0;
  width: 20px;
  cursor: move;
  ${Row}:hover & {
    opacity: 1;
  }
`;

const InvoiceItem = ({
  timeslip,
  isActive,
  currency,
  isEditable,
  onToggle,
}) => {
  const handleDragStart = (event) => {
    event.dataTransfer.setData('application/id', timeslip.id);
  };

  return (
    <Row
      sx={{ opacity: isActive ? 1 : 0.5 }}
      py={3}
      px={2}
      draggable={isEditable}
      onDragStart={handleDragStart}
      htmlId={timeslip.id}
    >
      <Grip>
        <FontAwesomeIcon icon={faGripVertical} />
      </Grip>
      <Box flexGrow="1">
        <Text fontSize={1}>{timeslip.date}</Text>
      </Box>
      <Box minWidth="80px" display={['none', 'initial']}>
        <Text variant="amount">
          {asCurrency(timeslip.hourly_rate, currency)} x {timeslip.hours}
        </Text>
      </Box>
      <Box minWidth={['80px', '120px']}>
        <Text variant="amount">{asCurrency(timeslip.cost, currency)}</Text>
      </Box>
      {isEditable && (
        <Text variant="link" onClick={onToggle} ml={3}>
          <FontAwesomeIcon icon={isActive ? faMinusSquare : faPlusSquare} />
        </Text>
      )}
    </Row>
  );
};

export default InvoiceItem;
