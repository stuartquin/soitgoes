import React from 'react';
import { Card, Flex, Box, Text } from 'rebass/styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinusSquare } from '@fortawesome/free-solid-svg-icons';
import { faPlusSquare } from '@fortawesome/free-solid-svg-icons';

import { asCurrency } from 'services/currency';
import { groupByTimeslip } from 'services/invoice';
import InvoiceItem from './InvoiceItem';

const TaskOverview = ({ invoice, task, timeslips, onToggle }) => {
  const taskIds = invoice ? invoice.tasks : [];
  const timeslipIds = invoice ? invoice.timeslips : [];
  const isActive = taskIds.includes(task.id);
  const taskTotal =
    task.billing_type === 'TIME'
      ? timeslips
          .filter(({ id }) => timeslipIds.includes(id))
          .reduce((total, ts) => total + ts.cost, 0)
      : task.cost;

  return (
    <Box sx={{ opacity: isActive ? 1 : 0.6 }}>
      <Card backgroundColor="white" py={[3, 4]}>
        <Flex justifyContent="space-between">
          <Text variant="h2" fontWeight={2} flexGrow="1">
            {task.name}
          </Text>
          <Text variant="h2" textAlign="right">
            {asCurrency(taskTotal, 'GBP', 0)}
          </Text>
          <Text
            variant="link"
            onClick={() => onToggle('tasks', task.id)}
            ml={3}
          >
            <FontAwesomeIcon icon={isActive ? faMinusSquare : faPlusSquare} />
          </Text>
        </Flex>
      </Card>
      {isActive && (
        <Box>
          {timeslips.map(ts => (
            <InvoiceItem
              timeslip={ts}
              currency="GBP"
              isActive={timeslipIds.includes(ts.id)}
              onToggle={() => onToggle('timeslips', ts.id)}
              isEditable
            />
          ))}
        </Box>
      )}
    </Box>
  );
};

export default TaskOverview;
