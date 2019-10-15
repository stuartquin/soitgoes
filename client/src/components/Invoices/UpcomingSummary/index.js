import React from 'react';
import { Flex, Text } from 'rebass/styled-components';

import UpcomingInvoice from './UpcomingInvoice';
import {BREAKPOINTS, Grid, Cell} from 'components/Grid';
import {SettingsCard} from 'components/GUI';
import {groupByProject, getTotal} from 'services/timeslip';

const UpcomingSummary = ({timeslips}) => {
  const grouped = Object.values(groupByProject(timeslips));
  const summary = grouped.map(items => ({
    project: items[0].project,
    date: items[0].date,
    total: getTotal(items)
  })).filter(({total}) => total > 0).sort((a, b) => (
    a.total < b.total
  )).slice(0, 4);

  return (
    <SettingsCard >
      <Text variant="label" px={16} pt={12} pb={['6px', '12px']}>Upcoming</Text>

      <Flex flexDirection={['row', 'column']} sx={{ overflowX: 'auto' }}>
        {summary.map(item => (
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
