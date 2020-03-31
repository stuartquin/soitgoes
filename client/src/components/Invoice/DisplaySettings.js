import React, { useState } from 'react';
import { Card, Text, Flex } from 'rebass/styled-components';

import { Checkbox, Input, Select } from 'components/Form';
import { Button } from 'components/GUI';

const DisplaySettings = ({ isEditable, displaySettings, onChange }) => {
  const handleChange = ({ target }) => {
    const value = target.type === 'checkbox' ? target.checked : target.value;
    onChange({
      ...displaySettings,
      [target.name]: value,
    });
  };

  return (
    <Flex justifyContent="flex-end">
      <Flex alignItems="center" mr={3}>
        <Text variant="label" sx={{ whiteSpace: 'nowrap' }} mr={2}>
          Group By
        </Text>
        <Select
          name="group_by"
          value={displaySettings.group_by || ''}
          onChange={handleChange}
          disabled={!isEditable}
        >
          <option value="timeslips">Time</option>
          <option value="tasks">Task</option>
        </Select>
      </Flex>
      <Flex alignItems="center">
        <Text variant="label" sx={{ whiteSpace: 'nowrap' }} mr={1}>
          Show Hours
        </Text>
        <Checkbox
          name="show_hours"
          type="checkbox"
          checked={displaySettings.show_hours}
          onChange={handleChange}
          disabled={!isEditable}
        />
      </Flex>
    </Flex>
  );
};

export default DisplaySettings;
