import React from 'react';

import { Text, Flex } from 'rebass';

import { SettingsCard } from 'components/GUI';
import { BREAKPOINTS } from 'components/Grid';
import SummaryRow from './SummaryRow';

const Summary = ({ upcomingSummary }) => (
  <SettingsCard>
    <Flex flexDirection={['row', 'column']} sx={{ overflowX: 'auto' }}>
      {upcomingSummary.map(upcoming => (
        <SummaryRow
          key={upcoming.project.id}
          title={upcoming.project.name}
          hours={upcoming.hours}
          total={upcoming.total}
        />
      ))}
    </Flex>
  </SettingsCard>
);

export default Summary;
