import React, { useState, useEffect } from 'react';
import moment from 'moment';

import { Box, Text, Flex } from 'rebass/styled-components';

import { Divider, SettingsCard } from 'components/GUI';
import { BREAKPOINTS } from 'components/Grid';
import { fetchSummary } from 'services/projects';
import { selectWithProject } from 'services/selectors';
import SummaryRow from './SummaryRow';

const Summary = ({ projects, weekStart }) => {
  const [activeWeekSummary, setActiveWeekSummary] = useState([]);
  const [totalSummary, setTotalSummary] = useState([]);

  useEffect(() => {
    const load = async () => {
      const start = weekStart.format('YYYY-MM-DD');
      const end = moment(weekStart).add(7, 'days').format('YYYY-MM-DD');
      const response = await Promise.all([
        fetchSummary({start, end}),
        fetchSummary()
      ]);

      setActiveWeekSummary(selectWithProject(response[0].results, projects));
      setTotalSummary(selectWithProject(response[1].results, projects));
    };

    load();
  }, [weekStart]);

  const upcomingSummary = [];

  return (
    <SettingsCard>
      <Text p={3} variant="uppercase">This Week</Text>
      <Flex mb={3} flexDirection={['row', 'column']} sx={{ overflowX: 'auto' }}>
        {activeWeekSummary.filter(t => t.hours).map((item) => (
          <SummaryRow
            key={item.project.id}
            title={item.project.name}
            hours={item.hours}
            total={item.total}
          />
        ))}
      </Flex>

      <Box display={['none', 'block']} >
        <Divider mt={4} my={3}/>
        <Text p={3}  variant="uppercase">Unbilled Total</Text>
        <Flex mb={3} flexDirection={['row', 'column']} sx={{ overflowX: 'auto' }}>
          {totalSummary.filter(t => t.hours).map((item) => (
            <SummaryRow
              key={item.project.id}
              title={item.project.name}
              hours={item.hours}
              total={item.total}
            />
          ))}
        </Flex>
      </Box>
    </SettingsCard>
  );
};

export default Summary;
