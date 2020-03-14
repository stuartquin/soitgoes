import React from 'react';
import moment from 'moment';
import styled from 'styled-components';
import { Flex, Box, Text } from 'rebass/styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinusSquare } from '@fortawesome/free-solid-svg-icons';
import { faPlusSquare } from '@fortawesome/free-solid-svg-icons';

import { asCurrency } from 'services/currency';
import { Cell, CellMd } from 'components/Grid';
import { Row } from 'components/DataTable';
import { ActionLink } from 'components/GUI';
import { Checkbox } from 'components/Form';

const InvoiceItem = ({
  timeslip,
  isActive,
  currency,
  isEditable,
  onToggle,
}) => {
  return (
    <Flex variant="card" sx={{ opacity: isActive ? 1 : 0.5 }} py={3}>
      <Box flexGrow="1" ml={[0, 2]}>
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
    </Flex>
  );
};

export default InvoiceItem;
