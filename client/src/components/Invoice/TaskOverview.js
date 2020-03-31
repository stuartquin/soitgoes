import React, { useState } from 'react';
import { Card, Flex, Box, Text } from 'rebass/styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinusSquare } from '@fortawesome/free-solid-svg-icons';
import { faPlusSquare } from '@fortawesome/free-solid-svg-icons';

import { asCurrency } from 'services/currency';
import { groupByTimeslip } from 'services/invoice';
import InvoiceItem from './InvoiceItem';

const TaskOverview = ({
  invoice,
  task,
  timeslips,
  onToggle,
  onMoveTimeslip,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const taskIds = invoice ? invoice.tasks : [];
  const activeTimeslips = timeslips.filter(({ id }) =>
    invoice.timeslips.includes(id)
  );
  const isActive = taskIds.includes(task.id);
  const taskTotal =
    task.billing_type === 'TIME'
      ? activeTimeslips.reduce((total, ts) => total + ts.cost, 0)
      : task.cost;

  const isEditable = !invoice.id;
  const handleDrop = event => {
    event.preventDefault();
    const timeslipId = parseInt(
      event.dataTransfer.getData('application/id'),
      10
    );
    setIsDragOver(false);
    if (!activeTimeslips.find(({ id }) => id === timeslipId)) {
      onMoveTimeslip(task, timeslipId);
    }
  };

  const handleDragOver = event => {
    const timeslipId = parseInt(
      event.dataTransfer.getData('application/id'),
      10
    );
    if (!isDragOver && !activeTimeslips.find(({ id }) => id === timeslipId)) {
      setIsDragOver(true);
    }
    event.stopPropagation();
    event.preventDefault();
  };

  return (
    <Box
      sx={{ opacity: isActive ? 1 : 0.6 }}
      mt={3}
      onDragOver={handleDragOver}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={handleDrop}
    >
      <Flex
        justifyContent="space-between"
        variant="card"
        backgroundColor="white"
        color={isDragOver ? 'primary' : 'text'}
        py={[3, 4]}
      >
        <Text variant="h2" fontWeight={2} flexGrow="1">
          {task.name}
        </Text>
        <Text variant="h2" textAlign="right">
          {asCurrency(taskTotal, 'GBP', 0)}
        </Text>
        {isEditable && (
          <Text
            variant="link"
            onClick={() => onToggle('tasks', task.id)}
            ml={3}
          >
            <FontAwesomeIcon icon={isActive ? faMinusSquare : faPlusSquare} />
          </Text>
        )}
      </Flex>
      {isActive && (
        <Box backgroundColor={isDragOver ? 'brand_lightest' : 'grey_lightest'}>
          {timeslips.map(ts => (
            <InvoiceItem
              timeslip={ts}
              currency="GBP"
              isActive={activeTimeslips.includes(ts)}
              onToggle={() => onToggle('timeslips', ts.id)}
              isEditable={isEditable}
            />
          ))}
        </Box>
      )}
    </Box>
  );
};

export default TaskOverview;
