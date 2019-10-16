import React from 'react';
import { Flex, Text } from 'rebass/styled-components';

import UpcomingInvoice from './UpcomingInvoice';
import {BREAKPOINTS, Grid, Cell} from 'components/Grid';
import {SettingsCard} from 'components/GUI';

const UpcomingSummary = ({ upcoming }) => {
  const items = upcoming.sort((a, b) => (
    a.total < b.total
  )).slice(0, 4);

  return (
    <SettingsCard >
      <Text variant="label" px={16} pt={12} pb={['6px', '12px']}>Upcoming</Text>

      <Flex flexDirection={['row', 'column']} sx={{ overflowX: 'auto' }}>
        {items.map(item => (
          <UpcomingInvoice
            key={item.project.id}
            summary={item}
          />
        ))}
      </Flex>
    </SettingsCard>
  );
};

export default UpcomingSummary;
